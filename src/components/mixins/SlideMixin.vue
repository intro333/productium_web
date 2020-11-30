<script>
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import {mapGetters} from "vuex";
import {fabric} from "fabric";
// import router from "@/router";

export default {
  name: "SlideMixin",
  data: () => ({
    slides: [],
    canvas: null,
    canvasWidth: 0,
    canvasHeight: 0,
    isSlideImage: false,
  }),
  created() {
    this.selectSlideUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'SELECT_SLIDE') {
        if (mutation.payload) {
          const _slide = mutation.payload.slide;
          if (_slide && _slide.img) {
            this.setCanvas(_slide);
          } else {
            const canvasContainer = document.getElementsByClassName('canvas-container');
            if (canvasContainer && canvasContainer.length) {
              this.canvas = null;
              canvasContainer.forEach(_c => {
                _c.remove();
              });
            }
          }
        }
      } else if (mutation.type === 'SET_SLIDE_IMG') {
        if (mutation.payload) {
          setTimeout(() => {
            this.setCanvas(this.activeSlide);
          }, 100);
        }
      } else if (mutation.type === 'REMOVE_SLIDE') {
        if (mutation.payload) {
          this.fetchSlidesL();
        }
      } else if (mutation.type === 'SET_SLIDES') {
        this.fetchSlidesL();
      }
    });
  },
  computed: {
    activeSlide() {
      return this.getActiveSlide();
    }
  },
  methods: {
    ...mapGetters(['getSlides', 'getActiveSlide']),
    fetchSlidesL() {
      const query = this.$route.query;
      if (query && query.projectId) {
        this.slides = slidesOfProjectFilterWithSelect(
            this.getSlides(),
            parseInt(query.projectId),
            parseInt(query.slideId)
        );
      } else {
        this.slides = [];
      }
    },
    setCanvas(slide) {
      console.log('slide', slide)
      const _this = this;
      if (this.$refs.workAreaRef) {
        const workAreaRef = this.$refs.workAreaRef;
        this.canvasWidth = workAreaRef.clientWidth;
        this.canvasHeight = workAreaRef.clientHeight;
        console.log(1, this.canvasWidth);
        setTimeout(() => {
          this.canvas = new fabric.Canvas('canvas');
          if (slide && slide.img) {
            this.isSlideImage = true;
            const slideImg = new Image();
            slideImg.onload = function () {
              let imgLeft = 0;
              let imgTop = 0;
              if (this.canvasWidth) {
                if (slideImg.width) {
                  imgLeft = (this.canvasWidth / 2) - (slideImg.width / 2);
                  console.log(1, this.canvasWidth / 2)
                  console.log(2, slideImg.width / 2)
                  console.log(3, imgLeft)
                }
              }
              if (this.canvasHeight) {
                if (slideImg.height) {
                  imgTop = (this.canvasHeight / 2) - (slideImg.height / 2);
                }
              }
              let _img = new fabric.Image(slideImg, {
                width: slideImg.width,
                height: slideImg.height,
                left: imgLeft,
                top: imgTop,
                uniScaleTransform: true,
                hasControls: false,
                hasRotatingPoint: false,
              });
              // _img.hasControls = false;
              // _img.hasBorders = false;
              _this.canvas.add(_img);
            };
            slideImg.src = slide.imgBase64; // TODO Здесь должна быть ссылка на файл
          }
        }, 20);
      }
    },
  },
  watch: {
    $route () {
      this.fetchSlidesL();
    }
  }
}
</script>