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
  computed: {
    cm() {
      return this.contextMenu();
    }
  },
  data: () => ({
    subMenu: null,
    list: [
      {
        isItemOfMenu: true,
        title: 'Переименовать',
        action: () => {
          console.log('ACTION Переименовать')
        }
      },
      {
        isItemOfMenu: true,
        title: 'Удалить',
        action: () => {
          console.log('ACTION Удалить')
        }
      },
      {
        isItemOfMenu: true,
        title: 'Дублировать',
        action: () => {
          console.log('ACTION Дублировать')
        }
      },
    ],
  }),
  methods: {
    setSubMenu(subMenu) {
      this.subMenu = subMenu;
    }
  },
}
</script>
