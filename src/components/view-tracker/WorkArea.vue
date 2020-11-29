<template>
  <div class="work-area">
    <div v-if="!isSlideImage"
         @dragover="dragover"
         @dragleave="dragleave"
         @drop="drop"
         ref="droppedZoneRef"
         class="wa-empty"
         :class="{'wa-empty-is-dropped': fileIsDragOver}">
      <div class="wa-empty-info-box">
        <p class="wa-empty-info rgb-black-50">перетащите файл сюда, или <span class="wa-empty-info-link"
        >выберите файл</span></p>
        <p class="wa-empty-info-more rgb-black-50">jpg, jpeg, png, svg</p>
        <input ref="inputFileRef"
               accept="image/png,image/jpeg,image/jpg,image/svg"
               @change="uploadImageToCanvasBg"
               type="file"
               class="wa-empty-info-input">
      </div>
    </div>
    <div v-if="isSlideImage">
      <p>CANVAS</p>
      <p>{{filename}}</p>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "WorkArea",
  data: () => ({
    isSlideImage: false,
    fileIsDragOver: false,
    filename: '',
    canvas: null,
  }),
  mounted() {
    // const self = this;
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.selection = false;
    setTimeout(() => {
      const _ref = this.$refs['droppedZoneRef'];
      _ref.addEventListener('drop', function(e) {
        console.log('droppedZoneRef', e);
      });
    }, 200)
  },
  methods: {
    ...mapActions(['setSlideImg']),
    uploadImageToCanvasBg($event) {
      const files = $event.target.files;
      this.setFile(files);
    },
    dragover($event) {
      $event.preventDefault();
      this.fileIsDragOver = true;
    },
    dragleave($event) {
      $event.preventDefault();
      this.fileIsDragOver = false;
    },
    drop($event) {
      $event.preventDefault();
      this.fileIsDragOver = false;
      // const inputRef = this.$refs['inputFileRef']
      const files = $event.dataTransfer.files;
      this.setFile(files);
    },
    setFile(files) {
      if (files && files[0]) {
        const file = files[0];
        this.isSlideImage = true;
        this.filename = file.name;
        this.setSlideImg(file);
      }
    }
  }
}
</script>
<!--
https://kovart.github.io/dashed-border-generator/
https://stenvdb.be/articles/building-a-vuejs-drag-and-drop-file-component
-->