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
  computed: {
    nf() {
      return this.notify();
    }
  },
  mounted() {
    console.log(1)
  },
  methods: {
    ...mapActions(['setSimpleNotifyInside']),
    close() {
      this.setSimpleNotifyInside(
          new SimpleNotifyInsideModel()
      )
    }
  }
}
</script>
