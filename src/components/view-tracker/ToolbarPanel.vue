<template>
  <div class="toolbar-panel">
    <div class="tp-block tp-left">
      <div @mouseenter="showTooltip($event, 'logoRef','Перейти к проектам')"
           @mouseleave="hideToolTip"
           ref="logoRef"
           class="tp-icon-box">
        <img src="@/assets/img/case-tracker/toolbar_panel/logo.svg"
             class="tp-icon-img"
             alt="">
      </div>
      <div @click="openContextMenu('HeaderMenu', 210, 'menuRef')"
           @mouseenter="showTooltip($event, 'menuRef','Меню')"
           @mouseleave="hideToolTip"
           ref="menuRef"
           class="tp-icon-box"
           :class="{active: (contextMenu.state && contextMenu.type === 'HeaderMenu')}">
        <img src="@/assets/img/case-tracker/toolbar_panel/menu.svg"
             class="tp-icon-item tp-icon-img"
             alt="">
      </div>
    </div>
    <div class="tp-block tp-right">
      <div class="tp-right-first">
        <div @mouseenter="showTooltip($event, 'controlRef','Перемещать')"
             @mouseleave="hideToolTip"
             @click="selectActiveTool('moveTool')"
             ref="controlRef"
             class="tp-icon-box tp-icon-box-2"
             :class="{active: activeTool === 'moveTool'}">
          <img src="@/assets/img/case-tracker/toolbar_panel/control.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div @mouseenter="showTooltip($event, 'textRef','Текст')"
             @mouseleave="hideToolTip"
             ref="textRef"
             class="tp-icon-box tp-icon-box-2"
             :class="{active: activeTool === 'textTool'}">
          <img src="@/assets/img/case-tracker/toolbar_panel/text.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div ref="shapeRef"
             class="tp-icon-box tp-icon-box-5"
             :class="{hovered: (contextMenu.state && contextMenu.type === 'ShapesModal'),
                active: activeTool === 'shapeTool'}">
          <div @mouseenter="showTooltip($event, 'shapeRef', shapeActiveToolTitle())"
               @mouseleave="hideToolTip"
               @click="selectActiveTool('shapeTool')"
               class="tp-icon-item-box">
            <img :src="shapeSvg()"
                 class="tp-icon-item tp-icon-img tp-icon-img-rect"
                 alt="">
          </div>
          <img @click="openContextMenu('ShapesModal', 165, 'shapeRef', false, shapesModalBody())"
               @mouseenter="showTooltip($event, 'shapeRef','Инструменты')"
               @mouseleave="hideToolTip"
               src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
        <div @click="openContextMenu('ColorModal', 260, 'colorRef')"
             @mouseenter="showTooltip($event, 'colorRef','Цвет')"
             @mouseleave="hideToolTip"
             ref="colorRef"
             class="tp-icon-box tp-icon-box-2-2"
             :class="{hovered: (contextMenu.state && contextMenu.type === 'ColorModal')}">
          <p class="tp-icon-item tp-text">color</p>
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
        <div @mouseenter="showTooltip($event, 'superToolRef','СуперТул')"
             @mouseleave="hideToolTip"
             @click="selectActiveTool('superTool')"
             ref="superToolRef"
             class="tp-icon-box tp-icon-box-4"
             :class="{active: activeTool === 'superTool'}">
          <img src="@/assets/img/case-tracker/toolbar_panel/superTool.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div @mouseenter="showTooltip($event, 'handToolRef','Hand Tool')"
             @mouseleave="hideToolTip"
             @click="selectActiveTool('handTool')"
             ref="handToolRef"
             class="tp-icon-box tp-icon-box-4"
             :class="{active: activeTool === 'handTool'}">
          <img src="@/assets/img/case-tracker/toolbar_panel/handTool.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
      </div>
      <div class="tp-right-second">
        <div class="tp-icon-box tp-icon-box-3">
          <div class="p-flex-center tp-icon-user-i"
               style="background-color: #7c4a4a;">DD</div>
        </div>
        <div class="tp-icon-box tp-icon-box-3">
          <div class="p-flex-center tp-icon-user-i"
               style="background-color: #F30C0C;">AG</div>
        </div>
        <div class="tp-icon-box tp-icon-box-3">
          <div class="p-flex-center tp-icon-user-i"
               style="background-color: #466a96;">DM</div>
        </div>
        <div @click="openShareModal"
             class="tp-icon-box tp-icon-box-2">
          <img src="@/assets/img/common/share.svg"
               class="tp-icon-item tp-icon-img-first"
               alt="">
          <p class="tp-icon-item tp-text">Пригласить</p>
        </div>
        <div @click="openContextMenu('ScaleModal', 208, 'scaleRef', true)"
             ref="scaleRef"
             class="tp-icon-box tp-icon-box-2-2">
          <p class="tp-icon-item tp-text">{{zoomPercent}}%</p>
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
      </div>
    </div>
    <div class="tp-icon-box tp-icon-box-2-2 tp-icon-box-center-a no-hover"
         :class="{hovered: (contextMenu.state && contextMenu.type === 'ProjectNameModal')}">
      <input v-if="project.nameIsEdited"
             ref="projectNameInputRef"
             @input="changeProjectNameText"
             @blur="changeProjectNameEditable(false)"
             @keyup.enter="changeProjectNameEditable(false)"
             :value="project.name"
             class="tp-text tp-text-input text-ellipsis">
      <div v-if="!project.nameIsEdited"
           @click="changeProjectNameEditable(true)"
           class="tp-icon-item-box tp-icon-item-box-2">
        <span class="tp-text tp-text-input-readonly text-ellipsis">{{project.name}}</span>
      </div>
      <img v-if="!project.nameIsEdited"
           @click="openContextMenu('ProjectNameModal', 134, 'projectNameArrowRef', false, projectNameModalBody())"
           ref="projectNameArrowRef"
           src="@/assets/img/common/selectArrow.svg"
           class="tp-icon-item select-arrow"
           alt="">
      <div v-if="project.nameIsEdited"
           class="tp-icon-item select-arrow"></div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import ModalsMixin from "@/components/mixins/ModalsMixin";
import {getModalPositionFunc} from "@/functions/calculations";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import ProjectMixin from "@/components/mixins/ProjectMixin";
import SlideMixin from "@/components/mixins/SlideMixin";

export default {
  name: "ToolbarPanel",
  mixins: [ModalsMixin, ProjectMixin, SlideMixin],
  computed: {
    contextMenu() {
      return this.getContextMenuBase();
    },
    zoomPercent() {
      if (this.activeSlide && this.activeSlide.zoom) {
        return Math.ceil(this.activeSlide.zoom.z * 100);
      }
      return 100;
    }
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'setCentralModal']),
    ...mapGetters(['getContextMenuBase']),
    openContextMenu(type, width, _refStr, isRight = null, _body = null) {
      if (this.$refs[_refStr] && this.$refs[_refStr].getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(this.$refs[_refStr], isRight, width);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                type,
                width,
                modalPosition.top,
                modalPosition.left,
                'up',
                _body)
            .more({
              isRight
            })
        );
      }
    },
    changeProjectNameText($event) {
      const name = $event.target.value;
      if (name.length <= 40) {
        this.project.name = name;
      }
    },
    openShareModal() {
      this.setCentralModal(
          new CentralModalModel()
              .set(true,
              'ShareModal',
              500,)
      );
    },
    selectActiveTool(tool) {
      if (tool === 'superTool') {
        this.setActiveShapeTool('rectangleTool');
      }
      this.setActiveTool(tool);
      setTimeout(() => {
        if (this.activeSlide && this.activeSlide.canvas) {
          this.panningHandler(this.activeSlide);
        }
      }, 50);
    },
    shapeActiveToolTitle() {
      switch (this.activeShapeTool) {
        case 'rectangleTool':
          return 'Прямоугольник';
        case 'ellipseTool':
          return 'Эллипс';
        default:
          return 'Прямоугольник';
      }
    },
    shapeSvg() {
      return require('@/assets/img/case-tracker/toolbar_panel/shapes/' + this.activeShapeTool
          .replace(/Tool/g, '') + '.svg');
    },
  }
}
</script>