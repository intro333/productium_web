<template>
  <div class="case-tracker">
    <ToolbarPanel />
    <div class="case-tracker-body scroll-y-container">
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
import {mapGetters} from "vuex";
import Tooltip from "@/components/modals/Tooltip";

export default {
  name: "CaseTracker",
  components: {
    Tooltip,
    ToolbarPanel,
    SlideSidebar,
    WorkArea,
    CaseSidebar,
    CaseDiscusBlock,
    ContextMenuBase
  },
  methods: {
    ...mapGetters(['getContextMenuBase', 'getTooltip']),
  },
}
</script>