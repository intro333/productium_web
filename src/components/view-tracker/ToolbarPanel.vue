<template>
  <div class="toolbar-panel">
    <div class="tp-block tp-left">
      <div class="tp-icon-box">
        <img src="@/assets/img/case-tracker/toolbar_panel/logo.svg"
             class="tp-icon-img"
             alt="">
      </div>
      <div @click="openContextMenu('HeaderMenu', 210, 50, 40)"
           class="tp-icon-box"
           :class="{active: (contextMenu.state && contextMenu.type === 'HeaderMenu')}">
        <img src="@/assets/img/case-tracker/toolbar_panel/menu.svg"
             class="tp-icon-item tp-icon-img"
             alt="">
      </div>
    </div>
    <div class="tp-block tp-right">
      <div class="tp-right-first">
        <div class="tp-icon-box tp-icon-box-2 active">
          <img src="@/assets/img/case-tracker/toolbar_panel/control.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div class="tp-icon-box tp-icon-box-2">
          <img src="@/assets/img/case-tracker/toolbar_panel/text.svg"
               class="tp-icon-item tp-icon-img"
               alt="">
        </div>
        <div class="tp-icon-box tp-icon-box-2">
          <img src="@/assets/img/case-tracker/toolbar_panel/rectangle.svg"
               class="tp-icon-item tp-icon-img tp-icon-img-rect"
               alt="">
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
        <div class="tp-icon-box tp-icon-box-2">
          <p class="tp-icon-item tp-text">color</p>
          <img src="@/assets/img/common/selectArrow.svg"
               class="tp-icon-item select-arrow"
               alt="">
        </div>
        <div class="tp-icon-box tp-icon-box-4 active">
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

export default {
  name: "ToolbarPanel",
  computed: {
    contextMenu() {
      return this.getContextMenuBase();
    }
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
    ...mapGetters(['getContextMenuBase']),
    openContextMenu(type, width, top, left) {
      this.setContextMenuBase(new ContextMenuBaseModel()
          .set(true,
              type,
              width,
              top,
              left)
      );
    },
  }
}
</script>