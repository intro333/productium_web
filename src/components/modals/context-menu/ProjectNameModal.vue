<template>
  <div class="cm-list">
    <ContextMenuItem v-for="(item, i) in list"
                     :key="i"
                     :item="item"
                     :setSubMenu="setSubMenu" />
  </div>
</template>

<script>
import ContextMenuItem from "@/components/includes/ContextMenuItem";

export default {
  name: "ProjectNameModal",
  props: ['contextMenu'],
  components: {
    ContextMenuItem
  },
  data: () => ({
    subMenu: null,
  }),
  computed: {
    cm() {
      return this.contextMenu();
    },
    list() {
      return (this.cm.body && this.cm.body.list) ? this.cm.body.list : [];
    },
  },
  methods: {
    setSubMenu(subMenu) {
      this.subMenu = subMenu;
    },
  },
}
</script>
