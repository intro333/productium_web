<template>
  <div class="p-context-menu">
    <div class="p-context-menu-background"
         @click="close"></div>
    <div class="p-context-menu-content"
         :style="{'width': `${cm.width}px`, 'top': `${cm.top}px`, left: `${cm.left}px` }">
      <HeaderMenu v-if="cm.type === 'HeaderMenu'"
                  :body="cm.body" />
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
      console.log(1)
      this.setContextMenuBase(
          new ContextMenuBaseModel()
      );
    },
  },
}
</script>