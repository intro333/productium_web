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
  </div>
</template>

<script>
import ToolbarPanel from "@/components/view-tracker/ToolbarPanel";
import SlideSidebar from "@/components/view-tracker/SlideSidebar";
import WorkArea from "@/components/view-tracker/WorkArea";
import CaseSidebar from "@/components/view-tracker/CaseSidebar";
import CaseDiscusBlock from "@/components/view-tracker/CaseDiscusBlock";

export default {
  name: "CaseTracker",
  components: {
    ToolbarPanel,
    SlideSidebar,
    WorkArea,
    CaseSidebar,
    CaseDiscusBlock,
  }
}
</script>