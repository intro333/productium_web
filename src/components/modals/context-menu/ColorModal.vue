<template>
  <div class="p-color-picker">
    <div v-for="(item, i) in colorList()"
         :key="i"
         @click="selectColor(item.color)"
         class="p-color-picker-item">
      <div class="cp-first"
           :class="[isColorAuto(item) ? 'cp-text' : ('cp-color ' + 'cp-color-' + item.color)]"
           :style="{'background-color': !isColorAuto(item) ? `#${item.color}` : ''}"
      >{{isColorAuto(item) ? 'auto' : ''}}</div>
      <div class="cp-second"
           :class="{'cp-second-selected': selectedColor === item.color}"></div>
    </div>
  </div>
</template>

<script>
import {pickerColors} from "@/data/consts";
import {mapActions, mapGetters} from "vuex";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";

export default {
  name: "ColorModal",
  data: () => ({

  }),
  computed: {
    selectedColor() {
      return this.getActiveColor();
    },
  },
  methods: {
    ...mapActions(['setActiveColor', 'setContextMenuBase']),
    ...mapGetters(['getActiveColor']),
    isColorAuto(item) {
      return item.color === 'auto';
    },
    selectColor(color) {
      this.setActiveColor(color);
      this.setContextMenuBase(
          new ContextMenuBaseModel()
      );
    },
    colorList() {
      const array = [];
      array.push({color: 'auto'});
      Object.keys(pickerColors).forEach(_k => {
        array.push({color: pickerColors[_k]});
      });
      return array;
    },
  },
}
</script>