<template>
  <div class="pc-preview-item"
       :class="['pc-preview-item-' + img.orientation]"> <!-- portrait | landscape -->
    <img :src="img.src ? img.src : img.imgBase64" alt=""
         class="pc-preview-item-img"
         :class="'pc-preview-item-img-' + img.orientation">
    <div v-if="removeImageFunc"
         @click="removeImage()"
         class="p-btn-preview pc-preview-item-close">
      <img src="@/assets/img/common/buttons/closeWhite.svg"
           alt=""
           class="p-btn-preview-icon">
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentImage",
  props: {
    img: Object,
    removeImageFunc: Function,
    cKey: Number,
    imgForPreview: Boolean
  },
  methods: {
    removeImage() {
      if (this.removeImageFunc) {
        this.removeImageFunc(this.cKey);
      }
    },
  },
}
</script>
