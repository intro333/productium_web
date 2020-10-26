<template>
  <div class="pc-input-area p-comments-padding">
    <div class="pc-input-area-left">
      <div class="pc-input-area-icon"
           :style="{'background-color': currentUserInfo.color}"
      >{{currentUserInfo.shortUserName}}</div>
      <textarea v-model="text"
                rows="4"
                class="pc-input-area-text p-textarea-custom scroll-textarea"
                :class="{'pc-input-area-text-empty': textIsEmpty()}"
                placeholder="Напишите комментарий..."></textarea>
    </div>
    <div class="pc-input-area-right">
      <span class="pc-input-area-descr">Нажмите ENTER, чтобы отправить комментарий</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentInputArea",
  props: {
    currentUserInfo: Object
  },
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