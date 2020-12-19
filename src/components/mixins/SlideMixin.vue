<script>
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import {mapActions, mapGetters} from "vuex";
import {fabric} from "fabric";
import CanvasMixin from "@/components/mixins/CanvasMixin";
import {ShapeModel} from "@/models/case-tracker/ShapeModel";
import {zoomConst} from "@/data/consts";
// import {getObjectOffsetByZoom, getOffsetByZoom} from "@/functions/calculations";
// import {getOffsetByZoom} from "@/functions/calculations";
// import {pickerColors} from "@/data/consts";

const STATE_IDLE = 'idle';
const STATE_PANNING = 'panning';

export default {
  name: "SlideMixin",
  mixins: [CanvasMixin],
  data: () => ({
    slides: [],
    canvasWidth: 0,
    canvasHeight: 0,
    lastClientX: 0,
    lastClientY: 0,
    panState: STATE_IDLE,
    drawStarted: 'stop',
    drawX: 0,
    drawY: 0,
    newShapeObj: null,
    objIsScaling: false,
    zoomOffsetX: 0,
    zoomOffsetY: 0,
    zoomZ: 0,
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
    moveMode() {
      return this.activeTool === 'moveTool';
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
    activeColor() {
      return this.getActiveColor();
    },
  },
  methods: {
    ...mapActions(['setActiveTool', 'setActiveShapeTool', 'setCanvasInfo', 'setActiveSlide', 'changeCasesParamsByOffset',
      'changeCaseElemFields', 'addShapeToCase', 'pushCase', 'selectCaseChild', 'setActiveColor', 'openCase',
      'clearCaseChildren', 'changeSlideZoom']),
    ...mapGetters(['getSlides', 'getActiveSlide',  'getActiveSlideList', 'getActiveTool', 'getActiveShapeTool', 'getCanvasInfo',
      'getSelectedCase', 'getCases', 'getActiveColor']),
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
          if (slide.zoom && slide.zoom.z) {
            // slide.canvas.zoomToPoint({x: slide.zoom.offsetX, y: slide.zoom.offsetY}, slide.zoom.z);
            slide.canvas.zoomToPoint({x: slide.canvasWidth / 2, y: slide.canvasHeight / 2}, slide.zoom.z);
            let delta = new fabric.Point(slide.lastClientX, slide.lastClientY);
            slide.canvas.relativePan(delta);
          }
          /* CANVAS HANDLERS */
          slide.canvas.on('mouse:down', function(e) { /* MOUSE DOWN */
            const obj = e.target;
            const mouse = slide.canvas.getPointer(e.e);
            _this.drawX = mouse.x;
            _this.drawY = mouse.y;
            if (_this.dragMode) {
              _this.panState = STATE_PANNING;
              slide.panLeftMouseDownPoint = e.e.clientX;
              slide.panTopMouseDownPoint = e.e.clientY;
            } else if (_this.drawMode) {
              _this.drawStarted = 'firstStart';
            } else if (_this.moveMode) {
              if (obj && obj.type !== 'image') {
                if (!_this.selectedCase.isOpen) { /* Если выделили фигуру и кейс закрыт, то нужно развернуть */
                  _this.openCase();
                }
                _this.selectCaseChild({
                  _case: _this.selectedCase,
                  _child: obj,
                  isShape: true
                });
              } else {
                _this.clearCaseChildren(_this.selectedCase);
              }
              // _this.setActiveColor('auto');
            }
          }); /* MOUSE DOWN END */
          slide.canvas.on('mouse:up', function(e) { /* MOUSE UP */
            if (_this.dragMode) {
              _this.panState = STATE_IDLE;
              const clX = slide.panLeftMouseUpPoint = e.e.clientX;
              const clY = slide.panTopMouseUpPoint = e.e.clientY;
              // const z = slide.zoom.z;
              slide.isLeftDirection = slide.panLeftMouseDownPoint > clX; /* Мышку потянули влево или вправо */
              slide.isTopDirection = slide.panTopMouseDownPoint > clY; /* Мышку потянули вверх или вниз */
              const offsetLeft = slide.isLeftDirection ? slide.panLeftMouseDownPoint - clX : clX - slide.panLeftMouseDownPoint;
              const offsetTop = slide.isTopDirection ? slide.panTopMouseDownPoint - clY : clY - slide.panTopMouseDownPoint;
              // console.log(1, offsetLeft);
              // const imgOldLeft = getObjectOffsetByZoom(z, slide.imgLeft);
              // console.log(2, imgOldLeft);
              // const imgOldTop = getObjectOffsetByZoom(z, slide.imgTop);
              // slide.imgLeft = slide.isLeftDirection ? getOffsetByZoom(z, imgOldLeft - offsetLeft) : getOffsetByZoom(z, imgOldLeft + offsetLeft);
              // console.log(3, slide.imgLeft);
              // slide.imgTop = slide.isTopDirection ? getOffsetByZoom(z, imgOldTop - offsetTop) : getOffsetByZoom(z, imgOldTop + offsetTop);
              // if (_this.activeSlideList) {
              //   _this.changeCasesParamsByOffset({
              //     offsetLeft,
              //     offsetTop,
              //     isLeftDirection: slide.isLeftDirection,
              //     isTopDirection: slide.isTopDirection,
              //     activeSlideList: _this.activeSlideList,
              //     z
              //   });
              // }

              slide.lastClientX = slide.isLeftDirection ? (slide.lastClientX - offsetLeft) : (slide.lastClientX + offsetLeft);
              slide.lastClientY = slide.isTopDirection ? (slide.lastClientY - offsetTop) : (slide.lastClientY + offsetTop);

              _this.lastClientX = 0;
              _this.lastClientY = 0;
            } else if (_this.moveMode) {
              const activeObject = slide.canvas.getActiveObject();
              const activeObjects = slide.canvas.getActiveObjects();
              if (activeObjects) {
                if (activeObjects.length > 1) {
                  slide.canvas.discardActiveObject();
                } else if (activeObjects.length === 1) {
                  if (!_this.selectedCase.isOpen) { /* Если выделили фигуру и кейс закрыт, то нужно развернуть */
                    _this.openCase();
                  }
                  _this.selectCaseChild({
                    _case: _this.selectedCase,
                    _child: activeObject,
                    isShape: true
                  });
                }
              }
              const setObjFields = (obj, objType) => {
                if (obj.lineCoords) {
                  // const tl = obj.lineCoords.tl;
                  let fields = {
                    id: obj.id,
                    left: obj.left /* tl.x */,
                    top: obj.top /* tl.y */,
                    originX: activeObject.originX,
                    originY: activeObject.originY,
                  };
                  if (_this.objIsScaling) {
                    _this.objIsScaling = false;
                    if (objType === 'rect') {
                      fields = Object.assign(fields, {
                        width: activeObject.width,
                        height: activeObject.height,
                      });
                    } else if (objType === 'ellipse') {
                      fields = Object.assign(fields, {
                        rx: activeObject.rx,
                        ry: activeObject.ry,
                        radius: activeObject.radius,
                        angle: activeObject.angle,
                      });
                    }
                  }
                  _this.changeCaseElemFields(fields);
                }
              };
              if (e.target) {
                const obj = e.target;
                const objType = obj.type;
                if (objType !== 'image') {
                  if (objType === 'activeSelection' && obj._objects) { /* Несколько сгруппированных объектов */
                    // TODO Пока что выше отключил выделение в группу, т.к. некорректно задаёт lineCoords для объектов
                    // obj._objects.forEach(_o => {
                    //   setObjFields(_o, objType);
                    // });
                  } else { /* Один объект */
                    setObjFields(obj, objType);
                  }
                }
              }
            } else if (_this.drawMode) {
              const oldActiveTool = _this.activeTool;
              if(_this.drawStarted !== 'stop') {
                _this.drawStarted = 'stop';
              }
              const shapeType = _this.activeShapeTool.replace(/Tool/g, '');
              const shape = slide.canvas.getActiveObject();
              if (shape) {
                if (shapeType === 'rectangle') {
                  _this.newShapeObj.params.width = shape.width;
                  _this.newShapeObj.params.height = shape.height;
                  _this.newShapeObj.params.stroke = `#${shape.stroke.replace(/#/g, '')}`;
                } else if (shapeType === 'ellipse') {
                  _this.newShapeObj.params.radius = shape.radius;
                  _this.newShapeObj.params.originX = shape.originX;
                  _this.newShapeObj.params.originY = shape.originY;
                  _this.newShapeObj.params.rx = shape.rx;
                  _this.newShapeObj.params.ry = shape.ry;
                  _this.newShapeObj.params.angle = shape.angle;
                  _this.newShapeObj.params.stroke = `#${shape.stroke.replace(/#/g, '')}`;
                }
                _this.setActiveTool('moveTool');
                _this.panningHandler(slide);
                slide.canvas.renderAll();
                setTimeout(() => {
                  if (oldActiveTool === 'superTool') {
                    /* Если супертул, то создаём новый кейс и рисуем прямоугольник */
                    _this.pushCase().then(_newCase => {
                      _this.newShapeObj.id = _newCase.id;
                      _this.addShapeToCase(_this.newShapeObj).then((shapeObj) => {
                        shape.set({ id: shapeObj.id});
                        slide.canvas.add(shape);
                        slide.canvas.renderAll();
                        slide.canvas.setActiveObject(shape);
                      });
                    });
                  } else {
                    _this.addShapeToCase(_this.newShapeObj).then((shapeObj) => {
                      shape.set({ id: shapeObj.id});
                      slide.canvas.renderAll();
                    });
                  }
                }, 30);
              }
            }

          }); /* MOUSE UP END */
          slide.canvas.on('mouse:move', function(e) { /* MOUSE MOVE */
            if (_this.dragMode) {
              if ((_this.panState === STATE_PANNING) && e && e.e) {
                const eClientX = e.e.clientX;
                const eClientY = e.e.clientY;
                let deltaX = 0;
                let deltaY = 0;
                if (_this.lastClientX) {
                  deltaX = eClientX - _this.lastClientX;
                }
                if (_this.lastClientY) {
                  deltaY = eClientY - _this.lastClientY;
                }
                _this.lastClientX = eClientX;
                _this.lastClientY = eClientY;
                let delta = new fabric.Point(deltaX, deltaY);
                slide.canvas.relativePan(delta);
              }
            } else if (_this.drawMode) {
              if(_this.drawStarted === 'stop') {
                return false;
              }
              const shapeType = _this.activeShapeTool.replace(/Tool/g, '');
              if (_this.drawStarted === 'firstStart') {
                let params = {
                  stroke: _this.activeColor,
                  left: _this.drawX,
                  top: _this.drawY,
                };
                // if (shapeType === 'rectangle') {
                //   params = {
                //
                //   };
                // } else if (shapeType === 'ellipse') {
                //   params = {
                //
                //   };
                // }
                const newShapeObj = _this.newShapeObj = new ShapeModel(
                    0,
                    null,
                    shapeType,
                    params);
                const shape = _this.createShapeObjByCaseChild(newShapeObj);
                slide.canvas.add(shape);
                slide.canvas.renderAll();
                slide.canvas.setActiveObject(shape);
                // _this.setActiveColor(shape.stroke);
                _this.drawStarted = 'start';
              } else if (_this.drawStarted === 'start') {
                const shape = slide.canvas.getActiveObject();
                const mouse = slide.canvas.getPointer(e.e);
                const w = Math.abs(mouse.x - _this.drawX),
                    h = Math.abs(mouse.y - _this.drawY);
                if (!w || !h) {
                  return false;
                }
                if (shapeType === 'rectangle') {
                  shape.set('width', w).set('height', h);
                } else if (shapeType === 'ellipse') {
                  let rx = Math.abs(w) / 2;
                  let ry = Math.abs(h) / 2;
                  if (rx > shape.strokeWidth) {
                    rx -= shape.strokeWidth / 2
                  }
                  if (ry > shape.strokeWidth) {
                    ry -= shape.strokeWidth / 2
                  }
                  shape.set({ rx: rx, ry: ry});
                }
                if (_this.drawX > mouse.x) {
                  shape.set({originX: 'right'});
                } else {
                  shape.set({originX: 'left'});
                }
                if (_this.drawY > mouse.y){
                  shape.set({originY: 'bottom'});
                } else {
                  shape.set({originY: 'top'});
                }
                slide.canvas.renderAll();
              }
            }
          }); /* MOUSE MOVE END */
          slide.canvas.on('mouse:wheel', function(opt) { /* MOUSE WHEEL */
            if (opt.e.ctrlKey) {
              let delta = opt.e.deltaY;
              let zoom = slide.canvas.getZoom();
              zoom *= 0.999 ** delta;
              if (zoom > zoomConst.maxZoomIn) zoom = zoomConst.maxZoomIn;
              if (zoom < zoomConst.minZoomOut) zoom = zoomConst.minZoomOut;
              const offsetX = opt.e.offsetX, offsetY = opt.e.offsetY;
              _this.zoomOffsetX = offsetX;
              _this.zoomOffsetY = offsetY;
              _this.zoomZ = zoom;
              slide.canvas.zoomToPoint({ x: slide.canvasWidth / 2, y: slide.canvasHeight / 2 }, zoom);
              // slide.canvas.zoomToPoint({ x: offsetX, y: offsetY }, zoom);
              // slide.lastClientX = offsetX;
              // slide.lastClientY = offsetY;
              _this.changeSlideZoom({
                offsetX: offsetX,
                offsetY: offsetY,
                z: zoom,
                updateCanvas: false
              });
            }
            opt.e.preventDefault();
            opt.e.stopPropagation();
          }); /* MOUSE WHEEL END */
          // slide.canvas.on('mouse:over', function(e) {
          //   const obj = e.target;
          //   if (obj && obj.type !== 'image') {
          //
          //   }
          //   slide.canvas.renderAll();
          // });
          slide.canvas.on('object:scaling', function(e) {
            _this.objIsScaling = true;
            const shape = e.target;
            const objType = shape.type;
            // const mouse = slide.canvas.getPointer(e.e);
            const scaleXIsChanged = shape.scaleX !== 1;
            const scaleYIsChanged = shape.scaleY !== 1;
            let w, h;
            // if (shape.scaleX > 1) { /* Расширяем объект */
            //   w = shape.width + Math.abs(mouse.x - _this.drawX);
            // } else if (shape.scaleY > 1) {
            //   h = Math.abs(mouse.y - _this.drawY);
            // } else { /* Сужаем объект */
              w = Math.abs(shape.width * shape.scaleX);
              h = Math.abs(shape.height * shape.scaleY);
            // }
            if (objType === 'rect') {
              if (w) { shape.set({width: w}) }
              if (h) { shape.set({height: h}) }
            } else if (objType === 'ellipse') {
              if (scaleXIsChanged) {
                let rx = Math.abs(w) / 2;
                if (rx > shape.strokeWidth) {
                  rx -= shape.strokeWidth / 2
                }
                shape.set({ rx: rx});
              }
              if (scaleYIsChanged) {
                let ry = Math.abs(h) / 2;
                if (ry > shape.strokeWidth) {
                  ry -= shape.strokeWidth / 2
                }
                shape.set({ry: ry});
              }
            }
            // if (_this.drawX > mouse.x) {
            //   shape.set({originX: 'right'});
            // } else {
            //   shape.set({originX: 'left'});
            // }
            // if (_this.drawY > mouse.y){
            //   shape.set({originY: 'bottom'});
            // } else {
            //   shape.set({originY: 'top'});
            // }
            shape.set({scaleX: 1});
            shape.set({scaleY: 1});
            slide.canvas.renderAll();
          });
          /* IMAGE HANDLER */
          if (slide && slide.img) {
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
              this.panningHandler(slide);
              slide.canvas.renderAll();
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
                if (_child.isSelected) {
                  slide.canvas.setActiveObject(shape);
                }
              }
            });
          }
          this.panningHandler(slide);
          slide.canvas.renderAll();
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
            type: 'ellipse',
            action: () => {
              this.selectActiveToolWithShape('ellipseTool');
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
<!-- https://stackoverflow.com/questions/9417603/fabric-js-free-draw-a-rectangle -->
<!-- DRAW ELLIPS https://stackoverflow.com/questions/34100866/how-to-free-draw-ellipse-using-fabricjs -->