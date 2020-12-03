<script>
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import {mapGetters} from "vuex";
import {fabric} from "fabric";
// import router from "@/router";

const STATE_IDLE = 'idle';
const STATE_PANNING = 'panning';

export default {
  name: "SlideMixin",
  data: () => ({
    slides: [],
    isSlideImage: false,
    canvasWidth: 0,
    canvasHeight: 0,
  }),
  created() {
    this.slideUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'REMOVE_SLIDE') {
        if (mutation.payload) {
          this.fetchSlidesL();
        }
      } else if (mutation.type === 'SET_SLIDES') {
        this.fetchSlidesL();
      } else if (mutation.type === 'CHANGE_SLIDES_CANVAS_SIZE') {
        if (mutation.payload) {
          const _slide = mutation.payload;
          this.clearCanvas(_slide);
          setTimeout(() => {
            this.createCanvas(_slide);
            this.setCanvas(_slide);
          }, 50);
        }
      }
    });
  },
  beforeDestroy() {
    if (this.slideUnsubscribe) {
      this.slideUnsubscribe();
    }
  },
  computed: {
    activeSlide() {
      return this.getActiveSlide();
    },
    activeTool() {
      return this.getActiveTool();
    },
    dragMode() {
      return this.activeTool === 'handTool';
    },
    canvas() {
      return this.getCanvasArea();
    }
  },
  methods: {
    ...mapGetters(['getSlides', 'getActiveSlide', 'getActiveTool', 'getCanvasArea']),
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
    clearCanvas(_slide) {
      const canvasContainer = document.getElementsByClassName('canvas-container');
      if (canvasContainer && canvasContainer.length) {
        canvasContainer.forEach(_c => {
          _c.remove();
        });
      }
      _slide.canvas = null;
      const canvasDiv = document.getElementById('canvas');
      if (canvasDiv) {
        canvasDiv.remove();
      }
    },
    createCanvas(_slide) {
      const canvasBox = document.getElementById('canvasBox');
      const canvasDiv = document.getElementById('canvas');
      if (canvasBox && !canvasDiv) {
        const newCanvas = document.createElement("canvas");
        newCanvas.className = 'vw-canvas';
        newCanvas.id = 'canvas';
        newCanvas.width = _slide.canvasWidth;
        newCanvas.height = _slide.canvasHeight;
        canvasBox.appendChild(newCanvas);
      }
    },
    setCanvas(slide) {
      const _this = this;
      if (this.$refs.workAreaRef) {
        const workAreaRef = this.$refs.workAreaRef;
        slide.canvasWidth = workAreaRef.clientWidth;
        slide.canvasHeight = workAreaRef.clientHeight;
        let lastClientX;
        let lastClientY;
        let panState = STATE_IDLE;
        setTimeout(() => {
          slide.canvas = new fabric.Canvas('canvas', {
            preserveObjectStacking: true // Не менять позицию объектов при нажатии на них (чтобы картинка не уходила на первый план)
          });
          /* CANVAS HANDLERS */
          slide.canvas.on('mouse:down', function(e) {
            if (e.target) {
              const obj = e.target;
              const objType = obj.type;
              if (objType === 'image') {
                //
              }
            }
            if (_this.dragMode) {
              panState = STATE_PANNING;
              lastClientX = e.e.clientX;
              lastClientY = e.e.clientY;
            }
          });
          slide.canvas.on('mouse:up', function() {
            if (_this.dragMode) {
              panState = STATE_IDLE;
            }
          });
          slide.canvas.on('mouse:move', function(e) {
            if (_this.dragMode && (panState === STATE_PANNING) && e && e.e) {
              let deltaX = 0;
              let deltaY = 0;
              if (lastClientX) {
                deltaX = e.e.clientX - lastClientX;
              }
              if (lastClientY) {
                deltaY = e.e.clientY - lastClientY;
              }
              lastClientX = e.e.clientX;
              lastClientY = e.e.clientY;

              let delta = new fabric.Point(deltaX, deltaY);
              slide.canvas.relativePan(delta);
            }
          });
          /* IMAGE HANDLER */
          if (slide && slide.img) {
            this.isSlideImage = true;
            const slideImg = new Image();
            slideImg.onload = function () {
              let imgLeft = 0;
              let imgTop = 0;
              if (slide.canvasWidth) {
                if (slideImg.width) {
                  imgLeft = (slide.canvasWidth / 2) - (slideImg.width / 2);
                }
              }
              if (slide.canvasHeight) {
                if (slideImg.height) {
                  imgTop = (slide.canvasHeight / 2) - (slideImg.height / 2);
                }
              }
              let _img = new fabric.Image(slideImg, {
                width: slideImg.width,
                height: slideImg.height,
                left: imgLeft,
                top: imgTop,
                uniScaleTransform: true,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                hasRotatingPoint: false,
                hoverCursor: 'default',
                selectable: false
              });
              if (slide.canvas) {
                slide.canvas.add(_img);
              }
            };
            slideImg.src = slide.imgBase64; // TODO Здесь должна быть ссылка на файл
          }
          setTimeout(() => {
            // TODO rect Mock
            const rect1 = new fabric.Rect({
              width: 100,
              height: 100,
              top: 300,
              left: 200,
              fill: 'transparent',
              stroke: 'red',
              strokeWidth: 3,
              opacity: 1,
              uniScaleTransform: true,
              hasRotatingPoint: false,
              hoverCursor: 'default'
              // hasControls: false,
            });
            if (slide.canvas) {
              slide.canvas.add(rect1);
              slide.canvas.renderAll();
              this.panningHandler(slide);
            }
          }, 20);
        }, 20);
      }
    },
    panningHandler(slide) {
      if (this.dragMode) {
        slide.canvas.selection = false;
        slide.canvas.discardActiveObject();
        slide.canvas.defaultCursor = 'pointer';
        slide.canvas.forEachObject(function(object) {
          object.hoverCursor = 'pointer';
          if (object.type !== 'image') {
            object.prevEvented = object.evented;
            object.prevSelectable = object.selectable;
            object.evented = false;
            object.selectable = false;
          }
        });
      } else {
        slide.canvas.forEachObject(function(object) {
          object.hoverCursor = 'default';
          if (object.type !== 'image') {
            object.evented = (object.prevEvented !== undefined) ? object.prevEvented : object.evented;
            object.selectable = (object.prevSelectable !== undefined) ? object.prevSelectable : object.selectable;
          }
        });
        slide.canvas.defaultCursor = 'default';
        slide.canvas.selection = true;
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