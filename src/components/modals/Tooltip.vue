<template>
  <div class="p-tooltip p-triangle"
       :class="['p-triangle-' + tp.trianglePosition]"
       :style="{top: `${tp.top}px`, left: `${tp.left}px` }">
    <p class="p-tooltip-text">{{tp.title}}</p>
  </div>
</template>

<script>
// import {TooltipModel} from "@/models/modals/TooltipModel";
import {mapActions} from "vuex";

export default {
  name: "Tooltip",
  props: ['tooltip'],
  data: () => ({
    top: 0,
    left: 0,
  }),
  computed: {
    tp() {
      return this.tooltip();
    }
  },
  mounted() {
    // const refObj = this.tp.ref;
    // const bClient = refObj.getBoundingClientRect();
    // this.top = bClient.top + refObj.clientHeight + 8;
    // this.left = bClient.left - 10;
    // this.setTooltip(new TooltipModel())
  },
  beforeDestroy() {
    // this.top = 0;
    // this.left = 0;
  },
  methods: {
    ...mapActions(['setTooltip']),
  }
}
</script>