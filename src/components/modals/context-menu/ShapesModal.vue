<template>
  <div class="cm-list">
    <ShapeMenuItem v-for="(item, i) in list"
                   :key="i"
                   :isActive="activeShape.type === item.type"
                   :item="item" />
  </div>
</template>

<script>
import ShapeMenuItem from "@/components/includes/ShapeMenuItem";

export default {
  name: "ShapesModal",
  props: ['contextMenu'],
  components: {
    ShapeMenuItem
  },
  computed: {
    cm() {
      return this.contextMenu();
    },
    body() {
      return this.cm.body ? this.cm.body : null;
    },
    list() {
      return (this.body && this.body.list) ? this.body.list : [];
    },
    activeTool() {
      return (this.body && this.body.activeTool) ? this.body.activeTool : null;
    },
    activeShape() {
      return {
        type: this.activeTool ? this.activeTool.replace(/Tool/g, '') : null
      }
    }
  },
}
</script>