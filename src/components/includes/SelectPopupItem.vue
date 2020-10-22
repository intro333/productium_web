<template>
  <div :key="i"
       @click="clickItem"
       class="cm-list-item cm-list-shape"
       style="height: 23px;">
    <img v-if="isActive"
         src="@/assets/img/case-tracker/toolbar_panel/shapes/selected.svg"
         class="cm-list-shape-selected"
         alt="">
    <div v-if="!dontShowIsActive && !isActive"
         class="cm-list-shape-selected"> </div>
    <span class="cm-list-shape-text">{{item.title}}</span>
  </div>
</template>

<script>
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";

export default {
  name: "SelectPopupItem",
  props: {
    i: Number,
    item: Object,
    isActive: Boolean,
    dontShowIsActive: Boolean,
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
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