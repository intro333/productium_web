<template>
  <div class="p-scale">
    <div class="p-scale-input-box">
      <input class="p-scale-input"
             value="100%"> <!-- TODO Использовать the-mask, чтобы добавить знак % вконце числа -->
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

export default {
  name: "ScaleModal",
  props: ['contextMenu'],
  data: () => ({

  }),
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
            this.changeSlideZoom({
              offsetX: 0,
              offsetY: 0,
              z: 1,
              updateCanvas: true
            });
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
    zoomIn(step) {
      if (this.activeSlide && this.activeSlide.zoom) {
        const zoom = this.activeSlide.zoom;
        if (zoom.z <= zoomConst.maxZoomIn) {
          this.changeSlideZoom({
            offsetX: zoom.offsetX,
            offsetY: zoom.offsetY,
            z: zoom.z + step,
            updateCanvas: true
          });
        }
      }
    },
    zoomOut(step) {
      if (this.activeSlide && this.activeSlide.zoom) {
        const zoom = this.activeSlide.zoom;
        if (zoom.z >= zoomConst.minZoomOut) {
          this.changeSlideZoom({
            offsetX: zoom.offsetX,
            offsetY: zoom.offsetY,
            z: zoom.z - step,
            updateCanvas: true
          });
        }
      }
    },
  },
}
</script>