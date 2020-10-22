<template>
  <div class="p-scale">
    <div class="p-scale-input-box">
      <input class="p-scale-input"
             value="100%"> <!-- TODO Использовать the-mask, чтобы добавить знак % вконце числа -->
    </div>
    <div class="cm-list cm-list-2">
      <ContextMenuItem v-for="(item, i) in scaleList"
                       :key="i"
                       :item="item" />
    </div>
  </div>
</template>

<script>
import ContextMenuItem from "@/components/includes/ContextMenuItem";

export default {
  name: "ScaleModal",
  props: ['contextMenu'],
  data: () => ({
    scaleList: [
      {
        isItemOfMenu: false,
      },
      {
        isItemOfMenu: true,
        title: 'Увеличить',
        action: () => {
          console.log('ACTION Увеличить')
        }
      },
      {
        isItemOfMenu: true,
        title: 'Уменьшить',
        action: () => {
          console.log('ACTION Уменьшить')
        }
      },
      {
        isItemOfMenu: true,
        title: 'Показать весь рабочий стол',
        action: () => {
          console.log('ACTION Показать весь рабочий стол')
        }
      },
      {
        isItemOfMenu: true,
        title: 'Увеличить на 50%',
        action: () => {
          console.log('ACTION Увеличить на 50%')
        }
      },
      {
        isItemOfMenu: true,
        title: 'Уменьшить на 50%',
        action: () => {
          console.log('ACTION Уменьшить на 50%')
        }
      },
    ],
  }),
  components: {
    ContextMenuItem
  },
  computed: {
    cm() {
      return this.contextMenu();
    }
  },
}
</script>