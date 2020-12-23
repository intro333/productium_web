<template>
  <div :key="i"
       @click="clickItem"
       class="cm-list-item cm-list-shape">
    <img v-if="isActive"
         src="@/assets/img/case-tracker/toolbar_panel/shapes/selected.svg"
         class="cm-list-shape-selected"
         alt="">
    <div v-if="!isActive"
         class="cm-list-shape-selected"> </div>
    <img :src="getImageIcon()"
         class="cm-list-shape-icon"
         :class="{'cm-list-shape-arrow': (this.item.type === 'arrow' || this.item.type === 'line'),
            disabled: item.isDisabled}"
         alt="">
    <span class="cm-list-shape-text"
          :class="{disabled: item.isDisabled}">{{item.title}}</span>
  </div>
</template>

<script>
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";

export default {
  name: "ShapeMenuItem",
  props: {
    i: Number,
    item: Object,
    isActive: Boolean,
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
    getImageIcon() {
      return require('@/assets/img/case-tracker/toolbar_panel/shapes/' + this.item.type + '.svg')
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