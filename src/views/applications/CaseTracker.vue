<template>
  <div class="case-tracker">
    <ToolbarPanel />
    <div class="case-tracker-body">
      <SlideSidebar />
      <div class="center-content">
        <WorkArea />
        <CaseDiscusBlock />
      </div>
      <CaseSidebar />
    </div>
    <!-- MODALS -->
    <ContextMenuBase v-if="getContextMenuBase().state"
                     :contextMenu="getContextMenuBase" />
    <CentralModal v-if="getCentralModal().state"
                     :contextMenu="getCentralModal" />
    <Tooltip v-if="getTooltip().state"
                     :tooltip="getTooltip" />
  </div>
</template>

<script>
import ToolbarPanel from "@/components/view-tracker/ToolbarPanel";
import SlideSidebar from "@/components/view-tracker/SlideSidebar";
import WorkArea from "@/components/view-tracker/WorkArea";
import CaseSidebar from "@/components/view-tracker/CaseSidebar";
import CaseDiscusBlock from "@/components/view-tracker/CaseDiscusBlock";
import ContextMenuBase from "@/components/modals/context-menu/ContextMenuBase";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/modals/Tooltip";
import CentralModal from "@/components/modals/central/CentralModal";
import router from "@/router";

export default {
  name: "CaseTracker",
  components: {
    Tooltip,
    ToolbarPanel,
    SlideSidebar,
    WorkArea,
    CaseSidebar,
    CaseDiscusBlock,
    ContextMenuBase,
    CentralModal,
  },
  created() {
    this.fetchInitData();
    // this.fetchProjects();
    // this.fetchSlides();
    // this.fetchSlideLists();
    // this.fetchCases();
    // this.fetchCaseComments();
    const query = router.currentRoute.query;
    if (query && query.commentId) {
      this.openCommentsModalByCommentId(parseInt(query.commentId));
    }
  },
  methods: {
    ...mapActions(['fetchProjects', 'fetchSlides', 'fetchSlideLists', 'fetchCases', 'fetchCaseComments',
      'openCommentsModalByCommentId', 'fetchInitData']),
    ...mapGetters(['getContextMenuBase', 'getCentralModal', 'getTooltip']),
  },
}
</script>