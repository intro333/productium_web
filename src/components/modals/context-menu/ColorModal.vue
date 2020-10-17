<template>
  <div class="p-color-picker">
    <div v-for="(item, i) in colorList"
         :key="i"
         @click="selectColor(item.color)"
         class="p-color-picker-item">
      <div class="cp-first"
           :class="[isColorAuto(item) ? 'cp-text' : ('cp-color ' + 'cp-color-' + item.color)]"
      >{{isColorAuto(item) ? 'auto' : ''}}</div>
      <div class="cp-second"
           :class="{'cp-second-selected': selectedColor === item.color}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorModal",
  data: () => ({
    selectedColor: 'auto',
    colorList: [
      {
        color: 'auto',
      },
      {
        color: 'black',
      },
      {
        color: 'white',
      },
    ],
  }),
  methods: {
    isColorAuto(item) {
      return item.color === 'auto';
    },
    selectColor(color) {
      this.selectedColor = color;
    },
  },
}
</script>