<template>
  <div class="p-color-picker">
    <div v-for="(item, i) in colorList"
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
export default {
  name: "ColorModal",
  data: () => ({
    selectedColor: 'auto',
    colorList: [
      {
        color: 'auto',
      },
      {
        color: '000000',
      },
      {
        color: 'FFFFFF',
      },
      {
        color: 'F30C0C',
      },
      {
        color: 'EDE40D',
      },
      {
        color: '14E01C',
      },
      {
        color: '0D31ED',
      },
      {
        color: 'F40CEB',
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