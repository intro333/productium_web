<template>
  <div class="p-modal"
       :style="{position: cm.position, 'z-index': cm.zIndex}">
    <div class="p-modal-background"
         :style="{'z-index': cm.zIndex+1}"
         @click="close"></div>
    <div class="p-modal-context-menu"
         :class="{'p-triangle': cm.triangle, 'p-triangle-up': (cm.triangle === 'up'),
            'p-triangle-down': (cm.triangle === 'down'), 'p-triangle-right' : cm.isRight}"
         :style="{'width': `${cm.width}px`, top: `${topCalc}px`, left: `${cm.left}px`, 'z-index': cm.zIndex+2}">
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
      <ScaleModal v-if="cm.type === 'ScaleModal'"
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
import ScaleModal from "@/components/modals/context-menu/ScaleModal";

export default {
  name: "ContextMenuBase",
  props: ['contextMenu'],
  components: {
    HeaderMenu,
    ShapesModal,
    ColorModal,
    ProjectNameModal,
    SelectPopup,
    ScaleModal,
  },
  computed: {
    cm() {
      return this.contextMenu();
    },
    topCalc() {
      return (this.cm.triangle === 'down') ? (this.cm.top - this.cm.width - 20) : this.cm.top;
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