<template>
  <div class="case-tracker">
    <!-- OLD STYLE   -->
<!--    <ToolbarPanel />-->
<!--    <div class="case-tracker-body">-->
<!--      <SlideSidebar />-->
<!--      <div class="center-content">-->
<!--        <WorkArea />-->
<!--        <CaseDiscusBlock />-->
<!--      </div>-->
<!--      <CaseSidebar />-->
<!--    </div>-->

    <!-- NEW STYLE   -->
    <WorkArea />
    <div class="case-tracker-body">
      <ToolbarPanel />
      <div class="center-content">
        <SlideSidebar />
        <CaseSidebar />
        <CaseDiscusBlock />
      </div>
    </div>

    <!-- MODALS -->
    <ContextMenuBase v-if="getContextMenuBase().state"
                     :contextMenu="getContextMenuBase" />
    <CentralModal v-if="getCentralModal().state"
                     :contextMenu="getCentralModal" />
    <Tooltip v-if="getTooltip().state"
                     :tooltip="getTooltip" />
    <Loading v-if="getIsLoading()" />
    <NotAvailableForMobile v-if="getNotAvailableForMobile()" />
  </div>
</template>

<script>
import WorkArea from "@/components/view-tracker/WorkArea";
import SlideSidebar from "@/components/view-tracker/SlideSidebar";
import ToolbarPanel from "@/components/view-tracker/ToolbarPanel";
import CaseSidebar from "@/components/view-tracker/CaseSidebar";
import CaseDiscusBlock from "@/components/view-tracker/CaseDiscusBlock";
import ContextMenuBase from "@/components/modals/context-menu/ContextMenuBase";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/modals/Tooltip";
import CentralModal from "@/components/modals/central/CentralModal";
import router from "@/router";
import Loading from "@/components/common/Loading";
import NotAvailableForMobile from "@/components/modals/NotAvailableForMobile";

export default {
  name: "CaseTracker",
  components: {
    WorkArea,
    SlideSidebar,
    ToolbarPanel,
    CaseSidebar,
    CaseDiscusBlock,
    ContextMenuBase,
    CentralModal,
    Loading,
    Tooltip,
    NotAvailableForMobile,
  },
  data: () => ({
    isScrolling: false
  }),
  created() {
    if (this.$device.mobile || this.$device.ipad) {
      this.setIsNotAvailableForMobile(true);
      // return false;
    } else {
      this.setIsLoading(true);
      this.fetchInitData();
      const query = router.currentRoute.query;
      if (query && query.commentId) {
        this.openCommentsModalByCommentId(parseInt(query.commentId));
      }
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
      'openCommentsModalByCommentId', 'fetchInitData', 'setIsLoading', 'setIsNotAvailableForMobile']),
    ...mapGetters(['getContextMenuBase', 'getCentralModal', 'getTooltip', 'getIsLoading', 'getNotAvailableForMobile']),
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