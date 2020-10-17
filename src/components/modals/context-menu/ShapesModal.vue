<template>
  <div class="cm-list">
    <ShapeMenuItem v-for="(item, i) in shapeList"
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
    activeShape() {
      return {
        type: 'rectangle'
      }
    }
  },
  data: () => ({
    shapeList: [
      {
        title: 'Прямоугольник',
        type: 'rectangle',
        action: () => {
          console.log('ACTION Прямоугольник')
        }
      },
      {
        title: 'Эллипс',
        type: 'circle',
        action: () => {
          console.log('ACTION Эллипс')
        }
      },
      {
        title: 'Стрелка',
        type: 'arrow',
        action: () => {
          console.log('ACTION Стрелка')
        }
      },
      {
        title: 'Линия',
        type: 'line',
        action: () => {
          console.log('ACTION Линия')
        }
      },
    ]
  }),
}
</script>