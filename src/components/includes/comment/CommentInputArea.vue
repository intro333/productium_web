<template>
  <div class="pc-input-area p-comments-padding">
    <div class="pc-input-area-left">
      <div class="pc-input-area-user"
           :style="{'background-color': currentUserInfo.color}"
      >{{currentUserInfo.shortUserName}}</div>
      <div class="pc-input-area-text-box"
           :class="{'pc-input-area-text-box-edited': !textIsEmpty()}">
        <textarea v-model="text"
                  rows="4"
                  class="pc-input-area-text p-textarea-custom scroll-textarea"
                  :class="{'pc-input-area-text-empty': textIsEmpty()}"
                  placeholder="Напишите комментарий..."></textarea>
        <img @mouseenter="showTooltip($event, 'addImageIcon','Изображение к комментарию')"
             @mouseleave="hideToolTip"
             ref="addImageIcon"
             src="@/assets/img/common/media/addImageIcon.svg"
             class="pc-input-area-add-img"
             alt="">
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
    text: ''
  }),
  methods: {
    textIsEmpty() {
      return this.text === '';
    }
  }
}
</script>