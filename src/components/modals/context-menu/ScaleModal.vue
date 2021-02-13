<template>
  <div class="p-scale">
    <div class="p-scale-input-box">
      <the-mask id="scaleInputId"
                :mask="['###%', '##%', '#%']"
                class="p-scale-input"
                :value="scalePercent"
                @input="changeScalePercent($event)" />
    </div>
    <div class="cm-list cm-list-2">
      <ContextMenuItem v-for="(item, i) in scaleList()"
                       :key="i"
                       :item="item" />
    </div>
  </div>
</template>

<script>
import ContextMenuItem from "@/components/includes/ContextMenuItem";
import {mapActions, mapGetters} from "vuex";
import {zoomConst} from "@/data/consts";
// import CommonMixin from "@/components/mixins/CommonMixin";

export default {
  name: "ScaleModal",
  // mixins: [CommonMixin],
  props: ['contextMenu'],
  data: () => ({
    scalePercent: 100,
    doActionBeforeDestroy: true,
    EListenerEnterScalePercent: null
  }),
  mounted() {
    this.scalePercent = (this.activeSlideZoom && this.activeSlideZoom.z) ?
        Math.round(this.activeSlideZoom.z * 100) : 100;
    setTimeout(() => {
      const scaleInputId = document.getElementById('scaleInputId');
      if (scaleInputId) {
        const EListenerEnterScalePercent = this.EListenerEnterScalePercent = (event) => {
          if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            this.enterScalePercent();
          }
        };
        scaleInputId.addEventListener('keyup', EListenerEnterScalePercent, true);
      }
    }, 50);
  },
  beforeDestroy() {
    if (this.doActionBeforeDestroy) {
      this.enterScalePercent();
    }
    const scaleInputId = document.getElementById('scaleInputId');
    if (scaleInputId) {
      scaleInputId.removeEventListener('keyup', this.EListenerEnterScalePercent, true);
      this.EListenerEnterScalePercent = null;
    }
  },
  components: {
    ContextMenuItem
  },
  computed: {
    cm() {
      return this.contextMenu();
    },
    activeSlide() {
      return this.getActiveSlide();
    },
    activeSlideZoom() {
      return (this.activeSlide && this.activeSlide.zoom) ? this.activeSlide.zoom : null;
    },
  },
  methods: {
    ...mapActions(['changeSlideZoom']),
    ...mapGetters(['getActiveSlide']),
    scaleList() {
      return [
        {
          isItemOfMenu: false,
        },
        {
          isItemOfMenu: true,
          title: 'Увеличить',
          action: () => {
            this.zoomIn(0.1);
          }
        },
        {
          isItemOfMenu: true,
          title: 'Уменьшить',
          action: () => {
            this.zoomOut(0.1);
          }
        },
        {
          isItemOfMenu: true,
          title: 'Показать весь рабочий стол',
          action: () => {
            if (this.activeSlide && this.activeSlide.canvas) {
              this.activeSlide.lastClientX = 0;
              this.activeSlide.lastClientY = 0;
              this.changeSlideZoom({
                offsetX: 0,
                offsetY: 0,
                z: 1,
                updateCanvas: true
              });
            }
            this.doActionBeforeDestroy = false;
          }
        },
        {
          isItemOfMenu: true,
          title: 'Увеличить на 50%',
          action: () => {
            this.zoomIn(0.5);
          }
        },
        {
          isItemOfMenu: true,
          title: 'Уменьшить на 50%',
          action: () => {
            this.zoomOut(0.5);
          }
        },
      ]
    },
    zoomIn(step) { /* Увеличить */
      this.doActionBeforeDestroy = false;
      if (this.activeSlide && this.activeSlide.zoom) {
        const zoom = this.activeSlide.zoom;
        const newZoom = zoom.z + step;
        if (newZoom <= zoomConst.maxZoomIn) {
          this.changeSlideZoom({
            offsetX: zoom.offsetX,
            offsetY: zoom.offsetY,
            z: newZoom,
            updateCanvas: true
          });
        }
      }
    },
    zoomOut(step) { /* Уменьшить */
      this.doActionBeforeDestroy = false;
      if (this.activeSlide && this.activeSlide.zoom) {
        const zoom = this.activeSlide.zoom;
        const newZoom = zoom.z - step;
        if (newZoom >= zoomConst.minZoomOut) {
          this.changeSlideZoom({
            offsetX: zoom.offsetX,
            offsetY: zoom.offsetY,
            z: newZoom,
            updateCanvas: true
          });
        }
      }
    },
    changeScalePercent($event) {
      this.scalePercent = $event;
    },
    enterScalePercent() {
      if (this.scalePercent === '' ||
          this.scalePercent === '0' || parseInt(this.scalePercent) === (this.activeSlide.zoom.z * 100)) {
        return false;
      }
      const z = parseInt(this.scalePercent) / 100;
      if (this.activeSlideZoom) {
        const zoom = this.activeSlideZoom;
        if ((z <= zoomConst.maxZoomIn) && (z >= zoomConst.minZoomOut)) {
          this.changeSlideZoom({
            offsetX: zoom.offsetX,
            offsetY: zoom.offsetY,
            z,
            updateCanvas: true
          });
        } else {
          const zz = zoom.z * 100;
          this.scalePercent = Math.round(zz);
        }
      }
    },
  },
}
</script>