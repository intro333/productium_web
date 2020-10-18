<template>
  <div class="p-modal"
       :style="{position: cm.position, 'z-index': cm.zIndex}">
    <div class="p-modal-background"
         :style="{'z-index': cm.zIndex+1}"
         @click="close"></div>
    <div class="p-modal-context-menu"
         :class="{'p-triangle': cm.triangle, 'p-triangle-up': (cm.triangle === 'up'), 'p-triangle-down': (cm.triangle === 'down')}"
         :style="{'width': `${cm.width}px`, top: `${cm.top}px`, left: `${cm.left}px`, 'z-index': cm.zIndex+2}">
      <HeaderMenu v-if="cm.type === 'HeaderMenu'"
                  :contextMenu="contextMenu" />
      <ShapesModal v-if="cm.type === 'ShapesModal'"
                  :contextMenu="contextMenu" />
      <ColorModal v-if="cm.type === 'ColorModal'"
                  :contextMenu="contextMenu" />
      <ProjectNameModal v-if="cm.type === 'ProjectNameModal'"
                  :contextMenu="contextMenu" />
      <SelectPopup v-if="cm.type === 'SelectPopup'"
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
import SelectPopup from "@/components/modals/context-menu/SelectPopup";

export default {
  name: "ContextMenuBase",
  props: ['contextMenu'],
  components: {
    HeaderMenu,
    ShapesModal,
    ColorModal,
    ProjectNameModal,
    SelectPopup,
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