<template>
  <div :ref="'commentItemBoxRef_' + cKey"
       class="pc-comment-item-box">
    <div class="pc-comment-item"
         :class="{'pc-comment-item-main': !isChild && cKey === 0}">
      <div class="pc-comment-item-user"
           :style="{'background-color': comment.user.color}"
      >{{comment.user.shortName}}</div>
      <div class="pc-comment-item-body">
        <span class="pc-comment-item-body-name">{{comment.user.fullName}}</span>
        <span class="pc-comment-item-body-message">{{comment.message}}</span>
        <div class="pc-comment-item-body-bottom">
          <span class="pc-comment-item-body-date">{{getDateTime()}}</span>
          <span @click="reply"
                class="pc-comment-item-body-reply">ответить</span>
        </div>
        <div v-if="comment.children && comment.children.length"
             class="pc-comment-item-children">
          <CommentItem v-for="_child in comment.children"
                       :comment="_child"
                       :parent="comment"
                       :focusInputAreaOfParentFunc="focusInputAreaOfParent"
                       :isChild="true"
                       :key="_child.id" :cKey="_child.id" />
        </div>
        <div v-if="isReply"
             class="pc-comment-item-reply">
          <CommentInputArea :cKey="cKey"
                            :comment="commentToInput"
                            :userLink="commentToInput.user.fullName"
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
// import {formUserLink} from "@/functions/conversation";

export default {
  name: "CommentItem",
  props: {
    comment: Object,
    cKey: Number,
    isChild: Boolean,
    parent: Object,
    focusInputAreaOfParentFunc: Function
  },
  data: () => ({
    isReply: false,
    commentToInput: null
  }),
  components: {
    CommentItem: this,
    CommentInputArea
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
            // commentInputAreaRef.value = formUserLink(comment.user.fullName, commentInputAreaRef.value);
            // commentInputAreaRef.value = `${comment.user.fullName}, `
          }
        }
      }, 10);
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