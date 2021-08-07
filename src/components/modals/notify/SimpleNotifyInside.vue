<template>
  <div class="p-simple-notify">
    <div class="p-simple-notify-background"></div>
    <div @click="close"
         class="p-simple-notify-content"
         :style="{'width': `${nf.width}px`}">
      <p>{{nf.message}}</p>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

export default {
  name: "SimpleNotifyInside",
  props: ['notify'],
  data: () => ({
    timeoutId: null
  }),
  computed: {
    nf() {
      return this.notify();
    }
  },
  mounted() {
    this.timeoutId = setTimeout(() => {
      this.close();
    }, this.nf.closeTimeout);
  },
  methods: {
    ...mapActions(['setSimpleNotifyInside']),
    close() {
      clearTimeout(this.timeoutId);
      this.setSimpleNotifyInside(
          new SimpleNotifyInsideModel()
      )
    }
  }
}
</script>
