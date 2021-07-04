<template>
  <div class="work-area"
       id="workAreaId"
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
           class="wa-empty">
        <div class="wa-empty-info-box"
             :class="{'wa-empty-is-dropped': fileIsDragOver}">
          <div class="wa-empty-info-input-box">
            <p class="wa-empty-info rgb-black-50">{{ $t('slide.drop1') }} <span class="wa-empty-info-link"
            >{{ $t('slide.drop2') }}</span></p>
            <p class="wa-empty-info-more rgb-black-50">jpg, jpeg, png, svg</p>
            <input ref="inputFileRef"
                   accept="image/png,image/jpeg,image/jpg,image/svg"
                   @change="uploadImageToCanvasBg"
                   type="file"
                   class="wa-empty-info-input">
          </div>
          <div class="wa-empty-info-soon">
            <div class="wa-empty-info-soon__item wa-empty-info-soon1"><span>soon</span></div>
            <span class="wa-empty-info-soon__item wa-empty-info-soon2">{{ $t('slide.import') }}:</span>
            <img src="@/assets/img/soon/cib_adobe-xd.svg"
                 alt=""
                 class="wa-empty-info-soon__item wa-empty-info-soon3">
            <img src="@/assets/img/soon/ph_sketch-logo-thin.svg"
                 alt=""
                 class="wa-empty-info-soon__item wa-empty-info-soon3">
            <img src="@/assets/img/soon/ph_figma-logo-thin.svg"
                 alt=""
                 class="wa-empty-info-soon__item wa-empty-info-soon3">
          </div>
        </div>
      </div>
      <div v-if="activeSlide.img"
           id="canvasBox"
           ref="canvasBoxRef"
           class="wa-canvas-box">
        <p></p> <!-- Почему-то без этого глючит -->
        <canvas id="canvas"
                class="vw-canvas"
                :width="canvasInfo.canvasWidth"
                :height="canvasInfo.canvasHeight"
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
    // For resize
    rTime: 0,
    timeout: false,
    delta: 50,
    EListenerSpaceDown: null,
    EListenerSpaceDownIsStart: false,
    EListenerSpaceUp: null,
  }),
  mounted() {
    setTimeout(() => {
      window.addEventListener('resize', this.browserResize);
      const EListenerSpaceDown = this.EListenerSpaceDown = (event) => {
        if (!this.EListenerSpaceDownIsStart && event.code === 'Space' && this.selectedCase) {
          this.setActiveTool('hiddenHandTool');
          this.EListenerSpaceDownIsStart = true;
        }
      };
      document.addEventListener('keydown', EListenerSpaceDown, true);
      const EListenerSpaceUp = this.EListenerSpaceUp = (event) => {
        if (event.code === 'Space' && this.selectedCase) {
          this.setActiveTool('moveTool');
          this.EListenerSpaceDownIsStart = false;
        } else if (event.code === 'Delete') {
          if (this.activeSlide && this.activeSlide.canvas) {
            const canvas = this.activeSlide.canvas;
            if (canvas.getActiveObject()) {
              const activeObj =  canvas.getActiveObject();
              this.removeCaseChild(activeObj);
            }
            canvas.renderAll();
          }
        }
      };
      document.addEventListener('keyup', EListenerSpaceUp, true);
    }, 50);
    this.selectSlideUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'SELECT_SLIDE') {
        if (mutation.payload) {
          const _slide = mutation.payload;
          if (_slide && _slide.img) {
            this.setCanvasWithClear(_slide);
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
      } else if (mutation.type === 'SELECT_CASE') {
        const _case = mutation.payload.case;
        const activeSlide = this.activeSlide;
        if (activeSlide && activeSlide.canvas && _case) {
          if (mutation.payload.reloadWithSlide) {
            // TODO Не помню зачем это делал, но без него работает и не мерцает
            // this.setCanvasWithClear(activeSlide);
          }
          setTimeout(() => {
            this.clearCaseChildrenFromCanvas(activeSlide);
            if (_case.children && _case.children.length) {
              setTimeout(() => {
                this.setCaseChildrenOnCanvas(activeSlide, _case);
              }, 50);
            }
            this.setIsLoading(false);
          }, 150);
          if (this.activeTool === 'markerTool') {
            this.setActiveTool('moveTool');
          }
        } else {
          this.setIsLoading(false);
        }
      } else if (mutation.type === 'SELECT_CASE_CHILD') {
        if (this.activeSlide && this.activeSlide.canvas) {
          const payload = mutation.payload;
          const canvas = this.activeSlide.canvas;
          canvas.discardActiveObject();
          // let stroke = '';
          if (payload.isShape) {
            const _child = payload._child;
            canvas.setActiveObject(_child);
            // stroke = _child.stroke;
          } else {
            canvas.forEachObject(function(object) {
              if (object.id === payload._child.id) {
                canvas.setActiveObject(object);
                // stroke = object.stroke;
              }
            });
          }
          // this.setActiveColor(stroke);
          setTimeout(() => {
            canvas.renderAll();
          }, 30);
        }
      } else if (mutation.type === 'CLEAR_CASE_CHILDREN') {
        if (this.activeSlide && this.activeSlide.canvas) {
          const canvas = this.activeSlide.canvas;
          canvas.discardActiveObject();
          canvas.renderAll();
          // this.setActiveColor('auto');
        }
      } else if (mutation.type === 'REMOVE_CASE_CHILD') {
        if (this.activeSlide && this.activeSlide.canvas) {
          const canvas = this.activeSlide.canvas;
          canvas.forEachObject(function(object) {
            if (object.id === mutation.payload.caseChildId) {
              canvas.remove(object);
            }
          });
          canvas.renderAll();
        }
      } else if (mutation.type === 'SET_ACTIVE_COLOR') {
        const activeColor = mutation.payload;
        if ((activeColor !== 'auto') && this.activeSlide && this.activeSlide.canvas) {
          const canvas = this.activeSlide.canvas;
          const shape = canvas.getActiveObject();
          this.panningHandler(this.activeSlide);
          if (shape) {
            const stroke = `#${activeColor.replace(/#/g, '')}`;
            this.changeCaseElemFields({
              id: shape.id,
              stroke: stroke
            }).then(() => {
              setTimeout(() => {
                shape.set('stroke', stroke);
                canvas.renderAll();
              }, 50);
            });
          }
        }
      } else if (mutation.type === 'CHANGE_SLIDE_ZOOM') {
        if (this.activeSlide && this.activeSlide.canvas) {
          const zoom = mutation.payload;
          if (zoom.updateCanvas) {
            this.setCanvasWithClear(this.activeSlide);
            setTimeout(() => {
              this.clearCaseChildrenFromCanvas(this.activeSlide);
              if (this.selectedCase.children && this.selectedCase.children.length) {
                setTimeout(() => {
                  this.setCaseChildrenOnCanvas(this.activeSlide, this.selectedCase);
                }, 50);
              }
            }, 150);
            // const canvas = this.activeSlide.canvas;
            // let delta = new fabric.Point(this.activeSlide.lastClientX, this.activeSlide.lastClientY);
            // this.activeSlide.canvas.relativePan(delta);
            // canvas.zoomToPoint({ x: zoom.offsetX, y: zoom.offsetY }, zoom.z);
          }
        }
      } else if (mutation.type === 'SET_ACTIVE_TOOL') {
        if (this.activeSlide && this.activeSlide.canvas) {
          this.panningHandler(this.activeSlide);
          this.activeSlide.canvas.renderAll();
        }
      }
    });
    setTimeout(() => {
      const droppedZoneRef = this.$refs['droppedZoneRef'];
      if (droppedZoneRef) {
        droppedZoneRef.addEventListener('drop', function(e) {
          console.log('droppedZoneRef', e);
        });
      }
    }, 1000);
  },
  beforeDestroy() {
    if (this.selectSlideUnsubscribe) {
      this.selectSlideUnsubscribe();
    }
    window.removeEventListener('drop', this.uploadImageToCanvasBg);
    window.removeEventListener('resize', this.browserResize);
    document.removeEventListener('keydown', this.EListenerSpaceDown, true);
    this.EListenerSpaceDown = null;
    document.removeEventListener('keyup', this.EListenerSpaceUp, true);
    this.EListenerSpaceUp = null;
  },
  computed: {

  },
  methods: {
    ...mapActions(['setSlideImg', 'setIsLoading', 'removeCaseChild']),
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
        this.setSlideImg(file);
      }
    },
    browserResize() {
      this.rTime = new Date();
      if (!this.timeout) {
        this.timeout = true;
        setTimeout(() => {
          this.resizeEnd();
        }, this.delta);
      }
    },
    resizeEnd() {
      if (new Date() - this.rTime < this.delta) {
        setTimeout(() => {
          this.resizeEnd();
        }, this.delta);
      } else {
        this.timeout = false;
        const canvasBoxRef = this.$refs.canvasBoxRef;
        if (canvasBoxRef) {
          const activeSlide = this.activeSlide;
          if (activeSlide && activeSlide.canvas) {
            this.setCanvasInfo({
              canvasWidth: canvasBoxRef.clientWidth,
              canvasHeight: canvasBoxRef.clientHeight,
            });
            setTimeout(() => {
              this.setCanvasWithClear(activeSlide);
              setTimeout(() => {
                this.setCaseChildrenOnCanvas(activeSlide, this.selectedCase);
              }, 200);
            }, 20);
          }
        }
      }
    },
  }
}
</script>
<!--
https://kovart.github.io/dashed-border-generator/
https://stenvdb.be/articles/building-a-vuejs-drag-and-drop-file-component
-->
