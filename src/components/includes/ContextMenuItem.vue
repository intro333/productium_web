<template>
  <div v-if="item.isItemOfMenu"
       :key="i"
       @mouseenter="hoverMenuItem"
       @click="clickItem"
       class="cm-list-item">
    <span class="cm-list-item-text">{{item.title}}</span>
    <img v-if="item.subMenu && item.subMenu.length"
         src="@/assets/img/common/context-menu-arrow.svg"
         class="cm-list-item-arrow"
         alt="">
  </div>
  <div v-else class="cm-divider"> </div>
</template>

<script>
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";

export default {
  name: "ContextMenuItem",
  props: {
    i: Number,
    item: Object,
    setSubMenu: Function
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
    hoverMenuItem() {
      if (this.setSubMenu) {
        if (this.item.subMenu && this.item.subMenu.length) {
          this.setSubMenu(this.item.subMenu);
        } else {
          this.setSubMenu(null);
        }
      }
    },
    clickItem() {
      if (this.item.action) {
        this.setContextMenuBase(
            new ContextMenuBaseModel()
        );
        this.item.action();
      }
    }
  }
}
</script>