<script>
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import {mapActions, mapGetters} from "vuex";
import {fabric} from "fabric";
import CanvasMixin from "@/components/mixins/CanvasMixin";
// import router from "@/router";

const STATE_IDLE = 'idle';
const STATE_PANNING = 'panning';

export default {
  name: "SlideMixin",
  mixins: [CanvasMixin],
  data: () => ({
    slides: [],
    isSlideImage: false,
    canvasWidth: 0,
    canvasHeight: 0,
    lastClientX: 0,
    lastClientY: 0,
    panState: STATE_IDLE,
    // panLeftMouseDownPoint: 0,
    // panTopMouseDownPoint: 0,
    // panLeftMouseUpPoint: 0,
    // panTopMouseUpPoint: 0,
    // isLeftDirection: null,
    // isTopDirection: null,
  }),
  created() {
    this.slideUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'REMOVE_SLIDE') {
        if (mutation.payload) {
          this.fetchSlidesL();
        }
      } else if (mutation.type === 'SET_SLIDES') {
        this.fetchSlidesL();
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
    ...mapActions(['setActiveTool', 'setActiveShapeTool', 'setCanvasInfo', 'setActiveSlide']),
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
      if (_slide.canvas) {
        _slide.canvas = null;
      }
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
    setCanvas(slide) {
      const _this = this;
      if (this.$refs.workAreaRef) {
        const workAreaRef = this.$refs.workAreaRef;
        slide.canvasWidth = workAreaRef.clientWidth;
        slide.canvasHeight = workAreaRef.clientHeight;
        this.setCanvasInfo({
          canvasWidth: workAreaRef.clientWidth,
          canvasHeight: workAreaRef.clientHeight,
        });
        setTimeout(() => {
          slide.canvas = new fabric.Canvas('canvas', {
            preserveObjectStacking: true // Не менять позицию объектов при нажатии на них (чтобы картинка не уходила на первый план)
          });
          /* CANVAS HANDLERS */
          slide.canvas.on('mouse:down', function(e) {
            // slide.panLeftMouseDownPoint = 0;
            // slide.panTopMouseDownPoint = 0;
            // slide.panLeftMouseUpPoint = 0;
            // slide.panTopMouseUpPoint = 0;
            if (e.target) {
              const obj = e.target;
              const objType = obj.type;
              if (objType === 'image') {
                //
              }
            }
            if (_this.dragMode) {
              _this.panState = STATE_PANNING;
              slide.panLeftMouseDownPoint = e.e.clientX;
              slide.panTopMouseDownPoint = e.e.clientY;
            }
          });
          slide.canvas.on('mouse:up', function(e) {
            if (_this.dragMode) {
              _this.panState = STATE_IDLE;
              const clX = slide.panLeftMouseUpPoint = e.e.clientX;
              const clY = slide.panTopMouseUpPoint = e.e.clientY;
              slide.isLeftDirection = slide.panLeftMouseDownPoint > clX; /* Мышку потянули влево или вправо */
              slide.isTopDirection = slide.panTopMouseDownPoint > clY; /* Мышку потянули вверх или вниз */
              slide.imgLeft = slide.isLeftDirection ? (slide.imgLeft - (slide.panLeftMouseDownPoint - clX)) :
                  (slide.imgLeft + (clX - slide.panLeftMouseDownPoint));
              slide.imgTop = slide.isTopDirection ? (slide.imgTop - (slide.panTopMouseDownPoint - clY)) :
                  (slide.imgTop + (clY - slide.panTopMouseDownPoint));
              console.log("------------------------");
              _this.lastClientX = 0;
              _this.lastClientY = 0;
            }
          });
          slide.canvas.on('mouse:move', function(e) {
            if (_this.dragMode && (_this.panState === STATE_PANNING) && e && e.e) {
              let deltaX = 0;
              let deltaY = 0;
              if (_this.lastClientX) {
                deltaX = e.e.clientX - _this.lastClientX;
              }
              if (_this.lastClientY) {
                deltaY = e.e.clientY - _this.lastClientY;
              }
              _this.lastClientX = e.e.clientX;
              _this.lastClientY = e.e.clientY;

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
                  imgLeft = slide.imgLeft ? slide.imgLeft : ((slide.canvasWidth / 2) - (slideImg.width / 2));
                }
              }
              if (slide.canvasHeight) {
                if (slideImg.height) {
                  imgTop = slide.imgTop ? slide.imgTop : (slide.canvasHeight / 2) - (slideImg.height / 2);
                }
              }
              slide.imgLeft = imgLeft;
              slide.imgTop = imgTop;
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
              slide.imgObj = _img;
              if (slide.canvas) {
                slide.canvas.add(_img);
              }
            };
            /* TODO Такой формат только для прототипа. Для MVP скорее всего будет только imgUrl. Т.е. дропаем файл и он сразу добавляется на сервак
            *  Правда тогда обработка будет в промисе (в store -> action) */
            slideImg.src = slide.imgUrl ? slide.imgUrl : slide.imgBase64;
          }
          setTimeout(() => {
            if (slide.canvas) {
              slide.canvas.renderAll();
              this.panningHandler(slide);
            }
          }, 20);
        }, 20);
      }
    },
    setCanvasWithClear(_slide, timeout=100) {
      this.clearCanvas(_slide);
      setTimeout(() => {
        this.createCanvas();
        this.setCanvas(_slide);
      }, timeout);
    },
    clearCaseChildrenFromCanvas(slide) {
      const objects = slide.canvas.getObjects();
      for (let i in objects) {
        if (objects[i].type !== 'image') {
          slide.canvas.remove(objects[i]);
        }
      }
    },
    setCaseChildrenOnCanvas(slide, _case) {
      setTimeout(() => {
        if (slide.canvas) {
          if (_case) {
            _case.children.forEach(_child => {
              const shape = this.createShapeObjByCaseChild(_child);
              if (slide.canvas && shape) {
                console.log('isTopDirection', slide.isTopDirection);
                console.log('left', shape.left);
                console.log('top', shape.top);
                console.log('panLeftMouseDownPoint', slide.panLeftMouseDownPoint);
                console.log('panLeftMouseUpPoint', slide.panLeftMouseUpPoint);
                if (slide.isLeftDirection !== null) {
                  shape.left = slide.isLeftDirection ? (shape.left - (slide.panLeftMouseDownPoint - slide.panLeftMouseUpPoint)) :
                      (shape.left + (slide.panLeftMouseUpPoint - slide.panLeftMouseDownPoint));
                }
                // if (slide.isTopDirection !== null) {
                //   shape.top = slide.isTopDirection ? (shape.top - (slide.panTopMouseDownPoint - slide.panTopMouseUpPoint)) :
                //       (shape.top + (slide.panTopMouseUpPoint - slide.panTopMouseDownPoint));
                // }
                console.log(9, shape);
                slide.canvas.add(shape);
              }
            });
          }
          slide.canvas.renderAll();
          this.panningHandler(slide);
        }
      }, 20);
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

  },
  watch: {
    $route () {
      this.fetchSlidesL();
    }
  }
}
</script>