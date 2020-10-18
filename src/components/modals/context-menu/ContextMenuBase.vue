<template>
  <div class="p-context-menu">
    <div class="p-context-menu-background"
         @click="close"></div>
    <div class="p-context-menu-content"
         :class="{'p-triangle': cm.triangle, 'p-triangle-up': (cm.triangle === 'up'), 'p-triangle-down': (cm.triangle === 'down')}"
         :style="{'width': `${cm.width}px`, top: `${cm.top}px`, left: `${cm.left}px` }">
      <HeaderMenu v-if="cm.type === 'HeaderMenu'"
                  :contextMenu="contextMenu" />
      <ShapesModal v-if="cm.type === 'ShapesModal'"
                  :contextMenu="contextMenu" />
      <ColorModal v-if="cm.type === 'ColorModal'"
                  :contextMenu="contextMenu" />
      <ProjectNameModal v-if="cm.type === 'ProjectNameModal'"
                  :contextMenu="contextMenu" />
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import HeaderMenu from "@/components/modals/context-menu/HeaderMenu";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import ShapesModal from "@/components/modals/context-menu/ShapesModal";
import ColorModal from "@/components/modals/context-menu/ColorModal";
import ProjectNameModal from "@/components/modals/context-menu/ProjectNameModal";

export default {
  name: "ContextMenuBase",
  props: ['contextMenu'],
  components: {
    HeaderMenu,
    ShapesModal,
    ColorModal,
    ProjectNameModal,
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
    ...mapActions(['setContextMenuBase']),
    close() {
      this.setContextMenuBase(
          new ContextMenuBaseModel()
      );
    },
  },
}
</script>