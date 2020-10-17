<template>
  <div class="p-context-menu">
    <div class="p-context-menu-background"
         @click="close"></div>
    <div class="p-context-menu-content"
         :class="{'p-triangle': cm.triangle, 'p-triangle-up': (cm.triangle === 'up'), 'p-triangle-down': (cm.triangle === 'down')}"
         :style="{'width': `${cm.width}px`, top: `${cm.top}px`, left: `${cm.left}px` }">
      <HeaderMenu v-if="cm.type === 'HeaderMenu'"
                  :contextMenu="contextMenu" />
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import HeaderMenu from "@/components/modals/context-menu/HeaderMenu";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";

export default {
  name: "ContextMenuBase",
  props: ['contextMenu'],
  components: {
    HeaderMenu
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