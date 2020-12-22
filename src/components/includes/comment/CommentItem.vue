<template>
  <div :ref="'commentItemBoxRef_' + cKey"
       class="pc-comment-item-box">
    <div class="pc-comment-item"
         :class="{'pc-comment-item-main': !isChild && cKey === 0}">
      <div class="pc-comment-item-user"
           :style="{'background-color': comment.user.color}"
      >{{comment.user.shortName}}</div>
      <div class="pc-comment-item-body">
        <div class="pc-comment-item-message-box"
             :class="{'rgb-base-10': isSelectableComment}">
          <span class="pc-comment-item-body-name">{{comment.user.fullName}}</span>
          <div class="pc-comment-item-body-message">
            {{'commentItemBoxRef_' + cKey}}
            <span v-if="userLink.isUserLink"
                  @click="userLink.action()"
                  class="pc-comment-item-body-message-user-link text-ellipsis">{{userLink.name}}</span>
            <span>{{comment.message}}</span>
          </div>
        </div>
        <div class="pc-comment-item-body-bottom">
          <span class="pc-comment-item-body-date">{{getDateTime()}}</span>
          <span @click="reply"
                class="pc-comment-item-body-reply">ответить</span>
        </div>
        <div v-if="comment.children && comment.children.length"
             class="pc-comment-item-children">
          <CommentItem v-for="_child in comment.children"
                       :selectedCommentId="selectedCommentId"
                       :comment="_child"
                       :parent="comment"
                       :focusInputAreaOfParentFunc="focusInputAreaOfParent"
                       :isChild="true"
                       :key="_child.id" :cKey="_child.id" />
        </div>
        <div v-if="isReply"
             class="pc-comment-item-reply">
          <CommentInputArea :parentKey="cKey"
                            :comment="commentToInput"
                            :replyUser="commentToInput.user"
                            :escTextareaFunc="escTextarea"
                            ref="commentInputAreaRef" />
        </div>
      </div>
      <div class="pc-comment-item-body-img-box">
        <img src="@/assets/img/common/selectArrowGrey.svg"
             class="pc-comment-item-body-img"
             alt="">
      </div>
    </div>
  </div>
</template>

<script>
import {getNearestWeekdayWithTime} from "@/functions/date";
import CommentInputArea from "@/components/includes/comment/CommentInputArea";

export default {
  name: "CommentItem",
  props: {
    comment: Object,
    cKey: Number,
    selectedCommentId: Number,
    isChild: Boolean,
    parent: Object,
    focusInputAreaOfParentFunc: Function
  },
  components: {
    CommentItem: this,
    CommentInputArea
  },
  data: () => ({
    isReply: false,
    commentToInput: null,
    isSelectableComment: false
  }),
  computed: {
    userLink() {
      if (this.comment.userLink) {
        const ul = this.comment.userLink;
        return {
          isUserLink: true,
          name: ul.replyUser.fullName + ', ',
          action: () => {
            console.log(1, this.$parent.$refs)
            console.log(2, this.$refs)
            console.log(3, ul.replyCommentId)
          }
        };
      }
      return {
        isUserLink: false,
        name: '',
        action: () => {}
      };
    }
  },
  mounted() {
    if (this.cKey === this.selectedCommentId) {
      this.isSelectableComment = true;
      setTimeout(() => {
        this.isSelectableComment = false;
      }, 1500)
      const commentItemBoxRef = this.$refs['commentItemBoxRef_' + this.cKey];
      if (commentItemBoxRef) {
        setTimeout(() => {
          commentItemBoxRef.scrollIntoView({
            block: 'start',
            inline: 'nearest'
          });
        }, 300);
      }
    }
  },
  methods: {
    getDateTime() {
      return getNearestWeekdayWithTime(this.comment.updatedAt)
    },
    focusInputAreaOfParent(child) {
      this.focusInputArea(child);
    },
    focusInputArea(comment) {
      this.commentToInput = comment;
      setTimeout(() => {
        this.isReply = true;
        let ciaRefs = null;
        if (this.$refs.commentInputAreaRef && (ciaRefs = this.$refs.commentInputAreaRef.$refs)) {
          const commentInputAreaRef = ciaRefs['commentInputAreaRef_' + this.cKey];
          if (commentInputAreaRef) {
            commentInputAreaRef.focus();
            // commentInputAreaRef.value = formreplyUser(comment.user.fullName, commentInputAreaRef.value);
            // commentInputAreaRef.value = `${comment.user.fullName}, `
          }
        }
      }, 10);
    },
    escTextarea() {
      this.isReply = false;
    },
    reply() {
      const commentItemBoxRef = this.$refs['commentItemBoxRef_' + this.cKey];
      if (commentItemBoxRef) {
        setTimeout(() => {
          commentItemBoxRef.scrollIntoView({
            block: 'end',
            inline: 'nearest'
          });
          if (this.parent && this.$parent &&
              this.$parent.$refs && this.focusInputAreaOfParentFunc) {
            this.focusInputAreaOfParentFunc(this.comment); /* Для парента это будет дочерний объект */
          } else {
            this.focusInputArea(this.comment); /* А здесь текущий объект */
          }
        }, 20);
      }
    },
  },
}
</script>