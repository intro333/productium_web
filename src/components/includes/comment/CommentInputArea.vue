<template>
  <div ref="pcInputAreaRef"
       class="pc-input-area p-comments-padding">
    <div class="pc-input-area-left">
      <div class="pc-input-area-user"
           :style="{'background-color': user.color}"
      >{{user.shortName}}</div>
      <div class="pc-input-area-block">
        <div class="pc-input-area-text-box"
             :class="{'pc-input-area-text-box-edited': (!textIsEmpty || isUserLink),
              'pc-input-area-text-box-edited-with-link': isUserLink}">
          <input v-if="isUserLink"
                 @click="goToUserProfile()"
                 class="pc-input-area-user-link text-ellipsis"
                 :value="userLink + ', '"
                 readonly
          >
          <textarea :ref="'commentInputAreaRef_' + parentKey"
                    @keyup.enter="sendMessage"
                    @keyup.esc="escTextareaFunc()"
                    @input="enteringMessage"
                    class="pc-input-area-text p-textarea-custom scroll-textarea"
                    :class="{'pc-input-area-text-empty': textIsEmpty,
                      'pc-input-area-text-with-link': isUserLink}"
                    :placeholder="!userLink ? 'Напишите комментарий...' : ''"></textarea>
        </div>
        <div v-if="imagesIsCanUpload"
             class="pc-input-area-add-img-box">
          <img @mouseenter="showTooltip($event, 'addImageIcon','Изображение к комментарию')"
               @mouseleave="hideToolTip"
               ref="addImageIcon"
               src="@/assets/img/common/media/addImageIcon.svg"
               class="pc-input-area-add-img"
               alt="">
          <input ref="inputFileRef"
                 accept="image/png,image/jpeg,image/jpg,image/svg"
                 @change="uploadImageToMessage"
                 type="file"
                 class="pc-input-area-add-img-input">
        </div>
      </div>
    </div>
    <div v-if="images.length"
         class="pc-preview scroll-x-container">
      <CommentImage v-for="(_img, i) in images"
                    :parentKey="i"
                    :key="i"
                    :removeImageFunc="() => removeImage(i)"
                    :imgForPreview="false"
                    :img="_img"
      />
    </div>
    <div class="pc-input-area-right">
      <span class="pc-input-area-descr">Нажмите ENTER, чтобы отправить комментарий</span>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ModalsMixin from "@/components/mixins/ModalsMixin";
import CommentImage from "@/components/includes/comment/CommentImage";
import {getRandomInt, imageSize} from "@/functions/calculations";

export default {
  name: "CommentInputArea",
  components: {
    CommentImage
  },
  props: {
    parentKey: Number,
    comment: Object,
    replyUser: Object,
    checkPCommentsBlockHeightFunc: Function,
    escTextareaFunc: Function,
  },
  mixins: [ModalsMixin],
  data: () => ({
    textIsEmpty: true,
    images: [] /* { src: '', orientation: '' } */
  }),
  computed: {
    imagesIsCanUpload() {
      return this.images.length < 2; // TODO Для MVP можно загрузить не больше 2х изображений
    },
    user() {
      return this.getCurrentUser();
    },
    userLink() { /* Если отвечаем на конкретное сообщение юзера, а не на родительское */
      return (this.replyUser && (this.comment && this.comment.parent)) ? this.replyUser.fullName : null;
    },
    commentInputAreaRef() {
      return this.$refs['commentInputAreaRef_' + this.parentKey];
    },
    isUserLink() {
      return this.userLink && this.userLink !== '';
    },
  },
  mounted() {
    this.inputFocus(true);
    // console.log(1, this.parentKey);
  },
  methods: {
    ...mapActions(['addCaseComment']),
    ...mapGetters(['getCurrentUser']),
    uploadImageToMessage($event) {
      const _this = this;
      const files = $event.target.files;
      if (files && files[0]) {
        const img = files[0];
        imageSize(img).then(_imgRes => {
          _this.images.push({
            id: getRandomInt(10, 1000),
            src: null,
            imgBase64: _imgRes.src,
            orientation: _this.getOrientation(_imgRes.width, _imgRes.height)
          });
        });
        this.checkPCommentsBlockHeight();
        this.inputFocus();
      }
      setTimeout(() => {
        const commentItemBoxRef = this.$parent.$refs['commentItemBoxRef_' + this.parentKey];
        if (commentItemBoxRef) {
          commentItemBoxRef.scrollIntoView({
            block: 'end',
            inline: 'nearest'
          });
        }
      }, 20)
    },
    removeImage(i) {
      this.images.splice(i, 1);
      this.checkPCommentsBlockHeight();
    },
    getOrientation(width, height) {
      return (width > height) ? 'landscape' : 'portrait';
    },
    sendMessage(e) {
      const _val = e.target.value;
      if (e.shiftKey) return; /* Если нажали Shift+Enter, не отправляем сообщение, а только переносим строку */
      if (_val === '' && !this.images.length) return;
      if (_val !== '' || this.images.length) {
        this.addCaseComment({
          parentKey: this.parentKey,
          replyUser: this.replyUser,
          isUserLink: this.isUserLink,
          comment: this.comment,
          commentMessage: _val.replace(/^\s+|\s+$/g, ''),
          images: this.images
        }).then(() => {
          this.images = [];
          setTimeout(() => {
            if (!this.parentKey) {
              const _ref = this.$parent.$refs['pCommentsListRef'];
              if (_ref) {
                _ref.scrollTop = _ref.scrollHeight;
              }
            } else {
              const commentItemBoxRef = this.$parent.$refs['commentItemBoxRef_' + this.parentKey];
              if (commentItemBoxRef) {
                commentItemBoxRef.scrollIntoView({
                  block: 'end',
                  inline: 'nearest'
                });
              }
            }
          }, 20);
        });
        if (this.parentKey) { /* Current user message */
          this.escTextareaFunc();
        } else { /* Reply message */
          this.commentInputAreaRef.value = '';
          this.textIsEmpty = true;
        }
      }
    },
    enteringMessage($event) {
      const _val = $event.target.value;
      const breakLines = (_val.match(/\n/g)||[]).length;
      const totalChars =(_val).length; /* Символы, включая переносы строк */
      if ((breakLines === 1 && totalChars === 1) || ((breakLines === 0 && totalChars === 0))) {
        this.commentInputAreaRef.value = '';
        this.textIsEmpty = true;
      } else {
        this.textIsEmpty = false;
        this.commentInputAreaRef.value = _val;
        this.checkPCommentsBlockHeight();
      }
    },
    checkPCommentsBlockHeight() {
      setTimeout(() => {
        if (this.checkPCommentsBlockHeightFunc) {
          this.checkPCommentsBlockHeightFunc(this.$refs['pcInputAreaRef']);
        }
      }, 10)
    },
    inputFocus(isReply=false) {
      if (this.parentKey || (this.parentKey === 0)) {
        setTimeout(() => {
          const commentInputAreaRef = this.commentInputAreaRef;
          if (commentInputAreaRef) {
            commentInputAreaRef.focus();
            if (isReply && this.comment) {
              // commentInputAreaRef.value = `${this.comment.user.fullName}, `
              // this.userLink = `${this.comment.user.fullName}, `
            }
          }
        }, 20);
      }
    },
    goToUserProfile() {
      // this.escTextareaFunc();
    },
  },
  watch: {

  }
}
</script>