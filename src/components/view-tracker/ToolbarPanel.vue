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
             ref="controlRef"
             class="tp-icon-box tp-icon-box-2">
          <img src="@/assets/img/case-tracker/toolbar_panel/control.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div @mouseenter="showTooltip($event, 'textRef','Текст')"
             @mouseleave="hideToolTip"
             ref="textRef"
             class="tp-icon-box tp-icon-box-2">
          <img src="@/assets/img/case-tracker/toolbar_panel/text.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div @click="openContextMenu('ShapesModal', 165, 'shapeRef')"
             @mouseenter="showTooltip($event, 'shapeRef','Прямоугольник')"
             @mouseleave="hideToolTip"
             ref="shapeRef"
             class="tp-icon-box tp-icon-box-2"
             :class="{hovered: (contextMenu.state && contextMenu.type === 'ShapesModal')}">
          <img src="@/assets/img/case-tracker/toolbar_panel/rectangle.svg"
               class="tp-icon-item tp-icon-img tp-icon-img-rect"
               alt="">
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
        <div @click="openContextMenu('ColorModal', 260, 'colorRef')"
             @mouseenter="showTooltip($event, 'colorRef','Цвет')"
             @mouseleave="hideToolTip"
             ref="colorRef"
             class="tp-icon-box tp-icon-box-2">
          <p class="tp-icon-item tp-text">color</p>
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
        <div @mouseenter="showTooltip($event, 'superToolRef','СуперТул')"
             @mouseleave="hideToolTip"
             ref="superToolRef"
             class="tp-icon-box tp-icon-box-4 active">
          <img src="@/assets/img/case-tracker/toolbar_panel/superTool.svg"
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
        <div class="tp-icon-box tp-icon-box-2">
          <img src="@/assets/img/common/share.svg"
               class="tp-icon-item tp-icon-img-first"
               alt="">
          <p class="tp-icon-item tp-text">Пригласить</p>
        </div>
        <div class="tp-icon-box tp-icon-box-2">
          <p class="tp-icon-item tp-text">100%</p>
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
      </div>
    </div>
    <div class="tp-icon-box tp-icon-box-center-a">
      <p class="tp-text text-ellipsis"
         style="max-width: 150px;">Project name</p>
      <img src="@/assets/img/common/selectArrow.svg"
           class="tp-icon-item select-arrow"
           alt="">
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import ModalsMixin from "@/components/mixins/ModalsMixin";
import {getModalPositionFunc} from "@/functions/calculations";

export default {
  name: "ToolbarPanel",
  mixins: [ModalsMixin],
  data: () => ({

  }),
  computed: {
    contextMenu() {
      return this.getContextMenuBase();
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
    ...mapGetters(['getContextMenuBase']),
    openContextMenu(type, width, _refStr) {
      if (this.isItemMenuHovered && (this.$refs[_refStr] &&
          this.$refs[_refStr].getBoundingClientRect())) {
        const modalPosition = getModalPositionFunc(this.$refs[_refStr]);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                type,
                width,
                modalPosition.top,
                modalPosition.left,
                'up')
        );
      }
    },
  }
}
</script>