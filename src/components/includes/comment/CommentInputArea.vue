<template>
  <div ref="pcInputAreaRef"
       class="pc-input-area p-comments-padding">
    <div class="pc-input-area-left">
      <div class="pc-input-area-user"
           :style="{'background-color': user.color}"
      >{{user.shortName}}</div>
      <div class="pc-input-area-block">
        <div class="pc-input-area-text-box scroll-hidden"
             :class="{'pc-input-area-text-box-edited': !textIsEmpty()}">
        <textarea :ref="'commentInputAreaRef_' + cKey"
                  @keyup.enter="sendMessage()"
                  @input="enteringMessage"
                  :value="text"
                  class="pc-input-area-text p-textarea-custom"
                  :class="{'pc-input-area-text-empty': textIsEmpty()}"
                  :style="{height: `${textAreaHeight}px`}"
                  :placeholder="!userLink ? 'Напишите комментарий...' : ''"></textarea>
          <textarea v-if="userLink"
                    class="pc-input-area-user-link p-textarea-custom"
                    readonly
                    :style="{'width': `${(userLink.length+1) * 7}px`}"
                    :value="userLink + ', '"></textarea>
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
                    :cKey="i"
                    :key="i"
                    :removeImageFunc="() => removeImage(i)"
                    :img="_img"
      />
    </div>
    <div class="pc-input-area-right">
      <span class="pc-input-area-descr">Нажмите ENTER, чтобы отправить комментарий</span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ModalsMixin from "@/components/mixins/ModalsMixin";
import CommentImage from "@/components/includes/comment/CommentImage";
import {calcTextareaHeight} from "@/functions/calculations";
// import {formUserLink} from '@/functions/conversation';

export default {
  name: "CommentInputArea",
  components: {
    CommentImage
  },
  props: {
    cKey: Number,
    comment: Object,
    userLink: String,
    checkPCommentsBlockHeightFunc: Function
  },
  mixins: [ModalsMixin],
  data: () => ({
    textAreaHeight: 31,
    text: '',
    textSpaces: '',
    linkLength: 0,
    images: [] /* { src: '', orientation: '' } */
  }),
  computed: {
    imagesIsCanUpload() {
      return this.images.length < 2; // TODO Для MVP можно загрузить не больше 2х изображений
    },
    user() {
      return this.getCurrentUser();
    },
    // fullText() {
    //   return formUserLink(this.userLinkText) + this.text;
    // },
    // formUserLinkL() {
    //   return formUserLink(this.userLinkText);
    // },
  },
  mounted() {
    this.inputFocus(true);
    if (this.isUserLink()) {
      this.linkLength = this.userLink.length+2;
      for (let i = 0; i < this.linkLength; i++) {
        this.textSpaces += ' ';
      }
      this.text = this.textSpaces;
    }
  },
  methods: {
    ...mapGetters(['getCurrentUser']),
    textIsEmpty() {
      return this.text === '';
    },
    isUserLink() {
      return this.userLink && this.userLink !== '';
    },
    uploadImageToMessage($event) {
      const _this = this;
      const files = $event.target.files;
      if (files && files[0]) {
        var _URL = window.URL || window.webkitURL;
        const img = new Image();
        var objectUrl = _URL.createObjectURL(files[0]);
        img.onload = function () {
          _URL.revokeObjectURL(objectUrl);
          img.orientation = _this.getOrientation(this.width, this.height);
          _this.images.push({
            src: objectUrl,
            orientation: _this.getOrientation(this.width, this.height)
          });
        };
        img.src = objectUrl;
        this.checkPCommentsBlockHeight();
        this.inputFocus();
      }
    },
    removeImage(i) {
      this.images.splice(i, 1);
      this.checkPCommentsBlockHeight();
    },
    getOrientation(width, height) {
      return (width > height) ? 'landscape' : 'portrait';
    },
    sendMessage() {
      
    },
    enteringMessage($event) {
      const textValue = $event.target.value;
      if (this.isUserLink()) {
        if (this.textIsEmpty()) {
          this.text = this.textSpaces + textValue;
        } else {
          if ((textValue.length) >= this.linkLength) {
            this.text = textValue;
          } else {
            this.text = '';
            this.text = this.textSpaces;
          }
        }
      } else {
        this.text = textValue;
      }
      this.checkPCommentsBlockHeight();
      this.textAreaHeight = calcTextareaHeight(this.text);
    },
    checkPCommentsBlockHeight() {
      setTimeout(() => {
        if (this.checkPCommentsBlockHeightFunc) {
          this.checkPCommentsBlockHeightFunc(this.$refs['pcInputAreaRef']);
        }
      }, 10)
    },
    inputFocus(isReply=false) {
      if (this.cKey || (this.cKey === 0)) {
        setTimeout(() => {
          const commentInputAreaRef = this.$refs['commentInputAreaRef_' + this.cKey];
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
  },
  watch: {
    userLink: function(newVal, oldVal) {
      this.textSpaces = '';
      this.linkLength = newVal.length+2;
      this.text = this.text.substr(oldVal.length+2);
      setTimeout(() => {
        for (let i = 0; i < this.linkLength; i++) {
          this.textSpaces += ' ';
        }
        this.text = this.textSpaces + this.text;
      }, 10);
    },
  }
}
</script>