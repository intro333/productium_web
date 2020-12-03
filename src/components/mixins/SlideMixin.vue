<script>
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import {mapActions, mapGetters} from "vuex";
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
            this.createCanvas();
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
    activeShapeTool() {
      return this.getActiveShapeTool();
    },
    dragMode() {
      return this.activeTool === 'handTool';
    },
    canvasInfo() {
      return this.getCanvasInfo();
    }
  },
  methods: {
    ...mapActions(['setActiveTool', 'setActiveShapeTool', 'setCanvasInfo']),
    ...mapGetters(['getSlides', 'getActiveSlide', 'getActiveTool', 'getActiveShapeTool', 'getCanvasInfo']),
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
    createCanvas() {
      const canvasBox = document.getElementById('canvasBox');
      const canvasDiv = document.getElementById('canvas');
      if (canvasBox && !canvasDiv) {
        const newCanvas = document.createElement("canvas");
        newCanvas.className = 'vw-canvas';
        newCanvas.id = 'canvas';
        newCanvas.width = this.canvasInfo.canvasWidth;
        newCanvas.height = this.canvasInfo.canvasHeight;
        canvasBox.appendChild(newCanvas);
      }
    },
    setCanvas(slide, _case=null) {
      const _this = this;
      if (this.$refs.workAreaRef) {
        const workAreaRef = this.$refs.workAreaRef;
        slide.canvasWidth = workAreaRef.clientWidth;
        slide.canvasHeight = workAreaRef.clientHeight;
        this.setCanvasInfo({
          canvasWidth: workAreaRef.clientWidth,
          canvasHeight: workAreaRef.clientHeight,
        });
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
            slideImg.src = (typeof slide.img === 'string') ? slide.imgBase64 : slide.imgUrl; // TODO Здесь должна быть ссылка на файл
          }
          setTimeout(() => {
            if (_case) {
              _case.children.forEach(_child => {
                const shape = this.createShapeObjByCaseChild(_child);
                if (shape) {
                  slide.canvas.add(shape);
                }
              });
            }
            if (slide.canvas) {
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
        slide.canvas.selection = true;
      }
      slide.canvas.defaultCursor = this.canvasDefaultCursor();
    },
    canvasDefaultCursor() {
      switch (this.activeTool) {
        case 'moveTool':
          return 'default';
        case 'handTool':
          return 'pointer';
        case 'shapeTool':
          return 'crosshair';
        case 'textTool':
          return 'crosshair'; // TODO Какой курсор у текста?
        default:
          return 'default';
      }
    },
    shapesModalBody() {
      return {
        list: [
          {
            title: 'Прямоугольник',
            type: 'rectangle',
            action: () => {
              this.selectActiveToolWithShape('rectangleTool');
            }
          },
          {
            title: 'Эллипс',
            type: 'circle',
            action: () => {
              this.selectActiveToolWithShape('circleTool');
            }
          },
          {
            title: 'Стрелка',
            type: 'arrow',
            action: () => {
              console.log('ACTION Стрелка')
            }
          },
          {
            title: 'Линия',
            type: 'line',
            action: () => {
              console.log('ACTION Линия')
            }
          },
        ],
        activeTool: this.activeShapeTool
      };
    },
    selectActiveToolWithShape(shapeTool) {
      this.setActiveTool('shapeTool');
      this.setActiveShapeTool(shapeTool);
      setTimeout(() => {
        if (this.activeSlide && this.activeSlide.canvas) {
          this.panningHandler(this.activeSlide);
        }
      }, 50);
    },
    createShapeObjByCaseChild(_child) {
      if (_child.shapeType === 'rectangle') {
        return new fabric.Rect(Object.assign({}, {
          opacity: 1,
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default'
        }, _child.params));
      } else if (_child.shapeType === 'circle') {
        console.log(2, _child.params)
        return new fabric.Circle(Object.assign({}, {
          opacity: 1,
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default'
        }, _child.params));
      }
    }
  },
  watch: {
    $route () {
      this.fetchSlidesL();
    }
  }
}
</script>