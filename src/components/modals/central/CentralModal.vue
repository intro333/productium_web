<template>
  <div class="p-modal">
    <div class="p-modal-background"
         @click="close"></div>
    <div class="p-modal-central"
         :style="{'width': `${cm.width}px`}">
      <div class="mc-header"
           :class="{'short-left': cm.type === 'CommentsModal'}">
        <div v-if="cm.type === 'ShareModal'"
             class="share-first">
          <span class="share-first-pre">Поделиться</span>
          <span class="share-first-name">CaseMaker</span>
        </div>
        <CaseNameWithStatusAndOptions v-if="selectedCase && cm.type === 'CommentsModal'"
                                      :selectedCase="selectedCase"
                                      :isBlack="true" />
        <div @click="close"
             class="mc-header-close">
          <img src="@/assets/img/common/closeIcon.svg"
               class="mc-header-close-icon"
               alt="">
        </div>
      </div>
      <ShareModal v-if="cm.type === 'ShareModal'"
                   :contextMenu="contextMenu" />
      <CommentsModal v-if="cm.type === 'CommentsModal'"
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
import CaseNameWithStatusAndOptions from "@/components/includes/CaseNameWithStatusAndOptions";
import CommentsModal from "@/components/modals/central/CommentsModal";

export default {
  name: "CentralModal",
  props: ['contextMenu'],
  components: {
    ShareModal,
    CommentsModal,
    SimpleNotifyInside,
    CaseNameWithStatusAndOptions,
  },
  computed: {
    cm() {
      return this.contextMenu();
    },
    selectedCase() {
      const query = this.$route.query;
      if (query && query.caseId) {
        const foundCase = this.getCases()
            .find(_c => _c.id === parseInt(query.caseId));
        if (foundCase) {
          return foundCase;
        }
      }
      return null;
    }
  },
  methods: {
    ...mapActions(['setCentralModal']),
    ...mapGetters(['getSimpleNotifyInside', 'getCases']),
    close() {
      this.setCentralModal(
          new CentralModalModel()
      );
    },
  },
}
</script>