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
            console.log(1, canvasContainer)
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
        setTimeout(() => {
          this.canvas = new fabric.Canvas('canvas');
          if (slide && slide.img) {
            this.isSlideImage = true;
            const pugImg = new Image();
            pugImg.onload = function () {
              console.log(11, pugImg.width);
              const pug = new fabric.Image(pugImg, {
                width: 300,
                height: 300,
                left: 50,
                top: 70,
                scaleX: 1,
                scaleY: 1
              });
              _this.canvas.add(pug);
            };
            pugImg.src = slide.imgBase64; // TODO Здесь должна быть ссылка на файл
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