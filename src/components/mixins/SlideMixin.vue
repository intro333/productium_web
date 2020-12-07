<script>
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import {mapActions, mapGetters} from "vuex";
import {fabric} from "fabric";
import CanvasMixin from "@/components/mixins/CanvasMixin";
import {ShapeModel} from "@/models/case-tracker/ShapeModel";

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
    drawStarted: false,
    drawX: 0,
    drawY: 0,
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
    activeSlideList() {
      return this.getActiveSlideList();
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
    drawMode() {
      return this.activeTool === 'shapeTool' || this.activeTool === 'superTool';
    },
    canvasInfo() {
      return this.getCanvasInfo();
    },
    selectedCase() {
      return this.getSelectedCase();
    },
  },
  methods: {
    ...mapActions(['setActiveTool', 'setActiveShapeTool', 'setCanvasInfo', 'setActiveSlide', 'changeCasesParamsByOffset',
      'changeCaseElemBYLineCoords']),
    ...mapGetters(['getSlides', 'getActiveSlide',  'getActiveSlideList', 'getActiveTool', 'getActiveShapeTool', 'getCanvasInfo',
      'getSelectedCase', 'getCases']),
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
            if (_this.dragMode) {
              _this.panState = STATE_PANNING;
              slide.panLeftMouseDownPoint = e.e.clientX;
              slide.panTopMouseDownPoint = e.e.clientY;
            } else if (_this.drawMode) {
              const mouse = slide.canvas.getPointer(e.e);
              _this.drawStarted = true;
              this.drawX = mouse.x;
              this.drawY = mouse.y;
              // TODO Посмотреть какая activeShapeTool и добавить фигуру динамически
              // TODO id должен формироваться на серваке, поэтому добавить через store(что делать с задержкой потом продумать)
              // TODO Добавляться фигура должна в mouse:move. Если будет просто клик, нет смысла добавлять.
              // TODO Нужно сделать дефолтные фигуры, где по-умолчанию будет fill, stroke, strokeWidth и прочее (для всех разное)
              const shape = _this.createShapeObjByCaseChild(new ShapeModel(
                  100,
                  'Rectangle 100',
                  'rectangle',
                  {
                    width: 0,
                    height: 0,
                    left: this.drawX,
                    top: this.drawY,
                    fill: 'transparent',
                    stroke: '#00a6ed',
                    strokeWidth: 2,
                  }));
              slide.canvas.add(shape);
              slide.canvas.renderAll();
              slide.canvas.setActiveObject(shape);
            }
          });
          slide.canvas.on('mouse:up', function(e) {
            if (_this.dragMode) {
              _this.panState = STATE_IDLE;
              const clX = slide.panLeftMouseUpPoint = e.e.clientX;
              const clY = slide.panTopMouseUpPoint = e.e.clientY;
              slide.isLeftDirection = slide.panLeftMouseDownPoint > clX; /* Мышку потянули влево или вправо */
              slide.isTopDirection = slide.panTopMouseDownPoint > clY; /* Мышку потянули вверх или вниз */
              const offsetLeft = slide.isLeftDirection ? slide.panLeftMouseDownPoint - clX : clX - slide.panLeftMouseDownPoint;
              const offsetTop = slide.isTopDirection ? slide.panTopMouseDownPoint - clY : clY - slide.panTopMouseDownPoint;
              slide.imgLeft = slide.isLeftDirection ? (slide.imgLeft - offsetLeft) : (slide.imgLeft + offsetLeft);
              slide.imgTop = slide.isTopDirection ? (slide.imgTop - offsetTop) : (slide.imgTop + offsetTop);
              if (_this.activeSlideList) {
                _this.changeCasesParamsByOffset({
                  offsetLeft,
                  offsetTop,
                  isLeftDirection: slide.isLeftDirection,
                  isTopDirection: slide.isTopDirection,
                  activeSlideList: _this.activeSlideList
                });
              }
              // slide.canvas.forEachObject(function(obj) {
              //   // if (obj.type !== 'image' && obj.lineCoords) {
              //   //   const tl = obj.lineCoords.tl;
              //   //   // obj.left = tl.x;
              //   //   // obj.lineCoords = null;
              //   //   // obj.oCoords = null;
              //   //   // obj.aCoords = null;
              //   //   obj.set({left: 500});
              //   //   obj.setCoords();
              //   //   console.log(3, obj);
              //   // }
              // });
              _this.lastClientX = 0;
              _this.lastClientY = 0;
            } else if (_this.activeTool === 'moveTool') {
              const activeObject = slide.canvas.getActiveObjects();
              if (activeObject && activeObject.length > 1) {
                slide.canvas.discardActiveObject();
              }
              const setObjCoords = (obj) => {
                if (obj.lineCoords) {
                  const tl = obj.lineCoords.tl;
                  _this.changeCaseElemBYLineCoords({
                    id: obj.id,
                    left: tl.x,
                    top: tl.y,
                  });
                }
              };
              if (e.target) {
                const obj = e.target;
                const objType = obj.type;
                if (objType !== 'image') {
                  if (objType === 'activeSelection' && obj._objects) { /* Несколько сгруппированных объектов */
                    // TODO Пока что выше отключил выделение в группу, т.к. некорректно задаёт lineCoords для объектов
                    // obj._objects.forEach(_o => {
                    //   setObjCoords(_o);
                    // });
                  } else { /* Один объект */
                    setObjCoords(obj);
                  }
                }
              }
            } else if (_this.drawMode) {
              if(_this.drawStarted) {
                _this.drawStarted = false;
              }
              const shape = slide.canvas.getActiveObject();
              slide.canvas.add(shape);
              // TODO push shape в case children
              slide.canvas.renderAll();
              setTimeout(() => {
                _this.setActiveTool('moveTool');
                setTimeout(() => {
                  _this.panningHandler(slide);
                }, 50);
              }, 50);
            }
          });
          slide.canvas.on('mouse:move', function(e) {
            if (_this.dragMode) {
              if ((_this.panState === STATE_PANNING) && e && e.e) {
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
            } else if (_this.drawMode) {
              if(!_this.drawStarted) {
                return false;
              }
              const mouse = slide.canvas.getPointer(e.e);
              const w = Math.abs(mouse.x - this.drawX),
                  h = Math.abs(mouse.y - this.drawY);
              if (!w || !h) {
                return false;
              }
              const shape = slide.canvas.getActiveObject();
              shape.set('width', w).set('height', h);
              slide.canvas.renderAll();
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
    setCanvasWithClear(_slide, timeout=50) {
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
          const obj = objects[i];
          slide.canvas.remove(obj);
        }
      }
      setTimeout(() => {
        slide.canvas.renderAll();
      }, 10);
    },
    setCaseChildrenOnCanvas(slide, _case) {
      setTimeout(() => {
        if (slide.canvas) {
          if (_case) {
            _case.children.forEach(_child => {
              const shape = this.createShapeObjByCaseChild(_child);
              if (slide.canvas && shape) {
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
            object.evented = false;
            object.selectable = false;
          }
        });
      } else if (this.drawMode) {
        slide.canvas.selection = true;
        slide.canvas.discardActiveObject();
        slide.canvas.forEachObject(function(object) {
          object.hoverCursor = 'crosshair';
          if (object.type !== 'image') {
            object.evented = false;
            object.selectable = false;
          }
        });
      } else {
        slide.canvas.selection = true;
        slide.canvas.forEachObject(function(object) {
          object.hoverCursor = 'default';
          if (object.type !== 'image') {
            object.evented = true;
            object.selectable = true;
          }
        });
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
        case 'superTool':
          return 'crosshair';
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