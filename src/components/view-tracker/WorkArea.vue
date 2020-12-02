<template>
  <div class="work-area"
       ref="workAreaRef">
    <div v-if="!activeSlide">
      <p>Нет слайда</p>
    </div>
    <template v-if="activeSlide">
      <div v-if="!activeSlide.img"
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
      <div v-if="activeSlide.img"
           id="canvasBox"
           class="wa-canvas-box">
        <p></p> <!-- Почему-то без этого глючит -->
        <canvas id="canvas"
                class="vw-canvas"
                :width="canvasWidth"
                :height="canvasHeight"
        ></canvas>
      </div>
    </template>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import SlideMixin from "@/components/mixins/SlideMixin";

export default {
  name: "WorkArea",
  mixins: [SlideMixin],
  data: () => ({
    fileIsDragOver: false,
    filename: '',
  }),
  created() {

  },
  mounted() {
    this.selectSlideUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'SELECT_SLIDE') {
        if (mutation.payload) {
          const _slide = mutation.payload.slide;
          if (_slide && _slide.img) {
            this.clearCanvas(_slide);
            setTimeout(() => {
              this.createCanvas();
              this.setCanvas(_slide);
            }, 100);
          } else {
            this.clearCanvas(_slide);
          }
        }
      } else if (mutation.type === 'SET_SLIDE_IMG') {
        if (mutation.payload) {
          setTimeout(() => {
            this.setCanvas(this.activeSlide);
          }, 100);
        }
      }
    });
    setTimeout(() => {
      const _ref = this.$refs['droppedZoneRef'];
      if (_ref) {
        _ref.addEventListener('drop', function(e) {
          console.log('droppedZoneRef', e);
        });
      }
    }, 1000);
  },
  beforeDestroy() {
    if (this.selectSlideUnsubscribe) {
      this.selectSlideUnsubscribe();
    }
  },
  computed: {

  },
  methods: {
    ...mapActions(['setSlideImg']),
    ...mapGetters([]),
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
    },
  }
}
</script>
<!--
https://kovart.github.io/dashed-border-generator/
https://stenvdb.be/articles/building-a-vuejs-drag-and-drop-file-component
-->