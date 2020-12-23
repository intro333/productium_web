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
            <span v-if="userLink.isUserLink"
                  @click="userLink.action()"
                  class="pc-comment-item-body-message-user-link text-ellipsis">{{userLink.name}}</span>
            <span>{{comment.message}}</span>
          </div>
        </div>
        <div v-if="comment.images.length"
             class="pc-preview pc-preview-for-preview scroll-x-container">
          <CommentImage v-for="(_img, i) in comment.images"
                        :parentKey="i"
                        :key="i"
                        :img="_img"
                        :imgForPreview="true"
          />
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
                       :contextMenu="contextMenu"
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
      <div @click="openCommentOptionsMenu(150, 'commentOptionsRef_' + cKey,
              commentRef(comment, cKey), comment, '_comment', 'up', false, false, cKey)"
           :ref="'commentOptionsRef_' + cKey"
           class="pc-comment-item-body-img-box">
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
import CommentImage from "@/components/includes/comment/CommentImage";
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

export default {
  name: "CommentItem",
  props: {
    comment: Object,
    cKey: Number,
    selectedCommentId: Number,
    isChild: Boolean,
    parent: Object,
    focusInputAreaOfParentFunc: Function,
    contextMenu: Object
  },
  components: {
    CommentItem: this,
    CommentInputArea,
    CommentImage
  },
  data: () => ({
    isReply: false,
    commentToInput: null,
    isSelectableComment: false,
    isShowCommentOptions: false,
  }),
  computed: {
    userLink() {
      if (this.comment.userLink) {
        const ul = this.comment.userLink;
        return {
          isUserLink: true,
          name: ul.replyUser.fullName + ', ',
          action: () => {
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
    ...mapActions(['setContextMenuBase', 'removeCaseComment', 'setSimpleNotifyInside']),
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
    openCommentOptionsMenu(width,
                           _refOptionsStr,
                           _refCommentStr,
                           _comment,
                           _obj,
                           triangle,
                           isRight,
                           isMultiple=false,
                           i=0) {
      let _ref = this.$refs[_refOptionsStr];
      if (isMultiple) {
        _ref = _ref[0] ? _ref[0] : null;
      }
      if (_ref && _ref.getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref, isRight, width);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                'SelectPopup',
                width,
                modalPosition.top,
                modalPosition.left,
                triangle,
                {
                  selectOptions: [
                    {
                      isItemOfMenu: true,
                      title: 'Удалить',
                      action: () => {
                        this.removeCaseComment(_comment);
                      },
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Скопировать',
                      action: () => {
                        let url = window.location.host;
                        url += this.$route.fullPath;
                        url += '&commentId=' + _comment.id;
                        this.$clipboard(url);
                        this.copyLinkToClipboard();
                      },
                    },
                  ],
                  subject: _obj
                },
                i)
            .more({
              isRight,
              zIndex: 8
            })
        );
      }
    },
    commentRef(_comment, i) {
      return 'commentRef_' + i;
    },
    showCommentOptions(_state) {
      this.isShowCommentOptions = _state;
    },
    copyLinkToClipboard() {
      this.setSimpleNotifyInside(
          new SimpleNotifyInsideModel()
              .set(true,
                  260,
                  'Ссылка скопирована в буфер обмена')
      )
    },
  },
}
</script>