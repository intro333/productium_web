<template>
  <div class="wa2-tools">
    <div @mouseenter="showTooltip($event, 'controlRef', $t('slide.moveTool'), false, true)"
         @mouseleave="hideToolTip"
         @click="selectActiveTool('moveTool')"
         ref="controlRef"
         class="wa2-tools__item"
         :class="{active: activeTool === 'moveTool' || activeTool === 'hiddenHandTool'}">
      <img src="@/assets/img/case-tracker/toolbar_panel/control.svg"
           class="wa2-tools__item-icon"
           alt="">
    </div>
    <div @mouseenter="showTooltip($event, 'markerRef', $t('slide.markerTool'), false, true)"
         @mouseleave="hideToolTip"
         @click="selectActiveTool('markerTool')"
         ref="markerRef"
         class="wa2-tools__item"
         :class="{active: activeTool === 'markerTool'}">
      <img src="@/assets/img/case-tracker/toolbar_panel/marker.svg"
           class="wa2-tools__item-icon"
           alt="">
    </div>
    <div ref="shapeRef"
         class="wa2-tools__item wa2-tools__item2"
         :class="{hovered: (contextMenu.state && contextMenu.type === 'ShapesModal'),
                active: activeTool === 'shapeTool'}">
      <div @mouseenter="showTooltip($event, 'shapeRef', shapeActiveToolTitle(), false, true)"
           @mouseleave="hideToolTip"
           @click="selectActiveTool('shapeTool')"
           class="wa2-tools__item-inside">
        <img :src="shapeSvg()"
             class="wa2-tools__item-icon"
             alt="">
      </div>
      <img @click="openContextMenu('ShapesModal', 165, 'shapeRef', false, shapesModalBody(), 'left')"
           @mouseenter="showTooltip($event, 'shapeRef', $t('slide.shapeTool'), false, true)"
           @mouseleave="hideToolTip"
           src="@/assets/img/common/selectArrowRight.svg"
           class="wa2-tools__item-arrow select-arrow select-arrow-right"
           alt="">
    </div>
    <div @click="openContextMenu('ColorModal', 233, 'colorRef', false, null, 'left')"
         @mouseenter="showTooltip($event, 'colorRef', $t('slide.colorTool'), false, true)"
         @mouseleave="hideToolTip"
         ref="colorRef"
         class="wa2-tools__item wa2-tools__item2"
         :class="{hovered: (contextMenu.state && contextMenu.type === 'ColorModal')}">
      <p class="wa2-tools__item-text">color</p>
      <img src="@/assets/img/common/selectArrowRight.svg"
           class="wa2-tools__item-arrow wa2-tools__item-arrow2 select-arrow select-arrow-right"
           alt="">
    </div>
    <div @mouseenter="showTooltip($event, 'superToolRef', $t('slide.superTool'), false, true)"
         @mouseleave="hideToolTip"
         @click="selectActiveTool('superTool')"
         ref="superToolRef"
         class="wa2-tools__item"
         :class="{active: activeTool === 'superTool'}">
      <img src="@/assets/img/case-tracker/toolbar_panel/marker.svg"
           class="wa2-tools__item-icon wa2-tools__item-icon-super-tool"
           :class="{active: activeTool === 'superTool', 'not-active': activeTool !== 'superTool'}"
           alt="">
    </div>
    <div @mouseenter="showTooltip($event, 'handToolRef', $t('slide.handTool'), false, true)"
         @mouseleave="hideToolTip"
         @click="selectActiveTool('handTool')"
         ref="handToolRef"
         class="wa2-tools__item"
         :class="{active: activeTool === 'handTool'}">
      <img src="@/assets/img/case-tracker/toolbar_panel/handTool.svg"
           class="wa2-tools__item-icon wa2-tools__item-icon1618"
           alt="">
    </div>
  </div>
</template>

<script>
import ModalsMixin from "@/components/mixins/ModalsMixin";
import SlideMixin from "@/components/mixins/SlideMixin";
import {mapActions, mapGetters} from "vuex";
import {getHorizModalPositionFunc, getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";

export default {
  name: "WorkAreaTools",
  mixins: [ModalsMixin, SlideMixin],
  computed: {
    contextMenu() {
      return this.getContextMenuBase();
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
    ...mapGetters(['getContextMenuBase']),
    openContextMenu(type, width, _refStr, isRight = null, _body = null, trianglePosition = 'up') {
      if (this.$refs[_refStr] && this.$refs[_refStr].getBoundingClientRect()) {
        let modalPosition = getModalPositionFunc(this.$refs[_refStr], isRight, width);
        if (trianglePosition === 'left') {
          modalPosition = getHorizModalPositionFunc(this.$refs[_refStr], isRight, width);
        }

        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                type,
                width,
                modalPosition.top,
                modalPosition.left,
                trianglePosition,
                _body)
            .more({
              isRight
            })
        );
      }
    },
    selectActiveTool(tool) {
      const _slide = this.activeSlide;
      if (_slide) {
        if (tool === 'superTool') {
          this.setActiveShapeTool('rectangleTool');
        }
        if (_slide.img && (this.selectedCase || (tool === 'handTool')
            || (tool === 'superTool'))) { /* Если нет изображения и кейса, то рисовать нельзя */
          this.setActiveTool(tool);
          setTimeout(() => {
            if (_slide.canvas) {
              this.panningHandler(_slide);
            }
          }, 50);
        }
      }
    },
    shapeActiveToolTitle() {
      switch (this.activeShapeTool) {
        case 'rectangleTool':
          return this.$t('slide.shapeRectangle');
        case 'ellipseTool':
          return this.$t('slide.shapeEllipse');
        default:
          return this.$t('slide.shapeRectangle');
      }
    },
    shapeSvg() {
      return require('@/assets/img/case-tracker/toolbar_panel/shapes/' + this.activeShapeTool
          .replace(/Tool/g, '') + '.svg');
    },
  }
}
</script>