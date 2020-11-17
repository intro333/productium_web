<template>
  <div ref="pcInputAreaRef"
       class="pc-input-area p-comments-padding">
    <div class="pc-input-area-left">
      <div class="pc-input-area-user"
           :style="{'background-color': user.color}"
      >{{user.shortName}}</div>
      <div class="pc-input-area-text-box"
           :class="{'pc-input-area-text-box-edited': !textIsEmpty()}">
        <textarea :ref="'commentInputAreaRef_' + cKey"
                  @keyup.enter="sendMessage()"
                  @input="enteringMessage"
                  :value="text"
                  rows="4"
                  class="pc-input-area-text p-textarea-custom scroll-textarea"
                  :class="{'pc-input-area-text-empty': textIsEmpty()}"
                  placeholder="Напишите комментарий..."></textarea>
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
      <CommentImage :img="_img" />
      <div v-for="(_img, i) in images"
           :key="i"
           class="pc-preview-item"
           :class="['pc-preview-item-' + _img.orientation]"> <!-- portrait | landscape -->
        <img :src="_img.src" alt="">
        <div @click="removeImage(i)"
             class="p-btn-preview pc-preview-item-close">
          <img src="@/assets/img/common/buttons/closeWhite.svg"
               alt=""
               class="p-btn-preview-icon">
        </div>
      </div>
    </div>
    <div class="pc-input-area-right">
      <span class="pc-input-area-descr">Нажмите ENTER, чтобы отправить комментарий</span>
    </div>
  </div>
</template>

<script>
import ModalsMixin from "@/components/mixins/ModalsMixin";
import {mapGetters} from "vuex";
import CommentImage from "@/components/includes/comment/CommentImage";

export default {
  name: "CommentInputArea",
  components: {
    CommentImage
  },
  props: {
    cKey: Number,
    comment: Object,
    checkPCommentsBlockHeightFunc: Function
  },
  mixins: [ModalsMixin],
  data: () => ({
    text: '',
    images: [] /* { src: '', orientation: '' } */
  }),
  computed: {
    imagesIsCanUpload() {
      return this.images.length < 2; // TODO Для MVP можно загрузить не больше 2х изображений
    },
    user() {
      return this.getCurrentUser();
    },
  },
  mounted() {
    if (this.cKey) {
      setTimeout(() => {
        const commentInputAreaRef = this.$refs['commentInputAreaRef_' + this.cKey];
        if (commentInputAreaRef) {
          commentInputAreaRef.focus();
          if (this.comment) {
            commentInputAreaRef.value = `${this.comment.user.fullName}, `
          }
        }
      }, 20);
    }
  },
  methods: {
    ...mapGetters(['getCurrentUser']),
    textIsEmpty() {
      return this.text === '';
    },
    uploadImageToMessage($event) {
      const _this = this;
      const files = $event.target.files;
      if (files && files[0]) {
        var _URL = window.URL || window.webkitURL;
        const img = new Image();
        var objectUrl = _URL.createObjectURL(files[0]);
        img.onload = function () {
          console.log(this.width + " " + this.height);
          _URL.revokeObjectURL(objectUrl);
          img.orientation = _this.getOrientation(this.width, this.height);
          _this.images.push({
            src: objectUrl,
            orientation: _this.getOrientation(this.width, this.height)
          });
        };
        img.src = objectUrl;
        this.checkPCommentsBlockHeight();
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
      this.text = $event.target.value;
      this.checkPCommentsBlockHeight()
    },
    checkPCommentsBlockHeight() {
      setTimeout(() => {
        if (this.checkPCommentsBlockHeightFunc) {
          this.checkPCommentsBlockHeightFunc(this.$refs['pcInputAreaRef']);
        }
      }, 10)
    },
  }
}
</script>