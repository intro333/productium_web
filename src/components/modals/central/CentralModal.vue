<template>
  <div class="p-modal">
    <div class="p-modal-background"
         @click="close"></div>
    <div class="p-modal-central"
         :style="{'width': `${cm.width}px`}">
      <div class="mc-header">
        <div v-if="cm.type === 'ShareModal'"
             class="share-first">
          <span class="share-first-pre">Поделиться</span>
          <span class="share-first-name">CaseMaker</span>
        </div>
        <div @click="close"
             class="mc-header-close">
          <img src="@/assets/img/common/closeIcon.svg"
               class="mc-header-close-icon"
               alt="">
        </div>
      </div>
      <ShareModal v-if="cm.type === 'ShareModal'"
                   :contextMenu="contextMenu" />
      <SimpleNotifyInside v-if="getSimpleNotifyInside().state"
                          :notify="getSimpleNotifyInside" />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import ShareModal from "@/components/modals/central/ShareModal";
import SimpleNotifyInside from "@/components/modals/notify/SimpleNotifyInside";

export default {
  name: "CentralModal",
  props: ['contextMenu'],
  components: {
    ShareModal,
    SimpleNotifyInside,
  },
  data: () => ({

  }),
  mounted() {

  },
  destroyed() {

  },
  computed: {
    cm() {
      return this.contextMenu();
    }
  },
  methods: {
    ...mapActions(['setCentralModal']),
    ...mapGetters(['getSimpleNotifyInside']),
    close() {
      this.setCentralModal(
          new CentralModalModel()
      );
    },
  },
}
</script>