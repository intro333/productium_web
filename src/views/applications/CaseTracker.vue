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
    <Loading v-if="getIsLoading()" />
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
import Loading from "@/components/common/Loading";

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
    Loading,
  },
  data: () => ({
    isScrolling: false
  }),
  created() {
    this.setIsLoading(true);
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
  mounted() {
    window.addEventListener('wheel', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.handleScroll);
  },
  methods: {
    ...mapActions(['fetchProjects', 'fetchSlides', 'fetchSlideLists', 'fetchCases', 'fetchCaseComments',
      'openCommentsModalByCommentId', 'fetchInitData', 'setIsLoading']),
    ...mapGetters(['getContextMenuBase', 'getCentralModal', 'getTooltip', 'getIsLoading']),
    handleScroll(e) {
      const self = this;
      window.clearTimeout( this.isScrolling );
      self.isScrolling = setTimeout(function() {
        if (document.body.className.indexOf('modal-open') === -1) { /* Если body разлочен */
          if (e.ctrlKey) {
            e.preventDefault();
          }
        }
      }, 66);
    }
  },
}
</script>