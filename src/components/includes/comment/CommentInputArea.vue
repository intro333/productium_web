<template>
  <div class="pc-input-area p-comments-padding">
    <div class="pc-input-area-left">
      <div class="pc-input-area-user"
           :style="{'background-color': currentUserInfo.color}"
      >{{currentUserInfo.shortUserName}}</div>
      <div class="pc-input-area-text-box"
           :class="{'pc-input-area-text-box-edited': !textIsEmpty()}">
        <textarea v-model="text"
                  @keyup.enter="sendMessage()"
                  rows="4"
                  class="pc-input-area-text p-textarea-custom scroll-textarea"
                  :class="{'pc-input-area-text-empty': textIsEmpty()}"
                  placeholder="Напишите комментарий..."></textarea>
        <div class="pc-input-area-add-img-box">
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
    <div class="pc-preview scroll-x-container">
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

export default {
  name: "CommentInputArea",
  props: {
    currentUserInfo: Object
  },
  mixins: [ModalsMixin],
  data: () => ({
    text: '',
    images: [] /* { src: '', orientation: '' } */
  }),
  methods: {
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
      }
    },
    removeImage(i) {
      this.images.splice(i, 1);
    },
    getOrientation(width, height) {
      return (width > height) ? 'landscape' : 'portrait';
    },
    sendMessage() {
      
    }
  }
}
</script>