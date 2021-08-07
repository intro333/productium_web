<template>
  <div class="p-modal">
    <div class="p-modal-background"
         @click="close"></div>
    <div class="p-modal-central"
         :style="{'width': `${nf.width}px`}">
      <div class="mc-header">
        <div class="share-first">
          <span class="share-first-name">{{nf.headerMessage}}</span>
        </div>
        <div @click="close"
             class="mc-header-close">
          <img src="@/assets/img/common/closeIcon.svg"
               class="mc-header-close-icon"
               alt="">
        </div>
      </div>
      <div class="share-modal">
        <div class="add-user-box share-modal-padding">
          <p class="add-user-title-2">
            <span>{{nf.bodyMessage[0]}}</span>
            <b>{{nf.bodyMessage[1]}}</b>
          </p>
        </div>
      </div>
    </div>
  </div>
<!--  <div class="p-simple-notify">-->
<!--    <div class="p-simple-notify-background"></div>-->
<!--    <div @click="close"-->
<!--         class="p-simple-notify-content"-->
<!--         :style="{'width': `${nf.width}px`}">-->
<!--      <p>{{nf.message}}</p>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
import {mapActions} from "vuex";
import {SimpleNotifyModel} from "@/models/modals/SimpleNotifyModel";

export default {
  name: "SimpleNotify",
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
    ...mapActions(['setSimpleNotify']),
    close() {
      clearTimeout(this.timeoutId);
      this.setSimpleNotify(
          new SimpleNotifyModel()
      )
    }
  }
}
</script>
