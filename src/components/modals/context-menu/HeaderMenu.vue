<template>
  <div class="cm-list">
    <ContextMenuItem v-for="(item, i) in mainMenuList"
                     :key="i"
                     :item="item"
                     :setSubMenu="setSubMenu" />

    <!-- SUB LIST -->
    <div v-if="subMenu"
         class="p-context-menu-content"
         :style="{'width': `225px`, top: '5px', left: `${cm.width + 3}px` }">
      <div class="cm-list">
          <ContextMenuItem v-for="(sItem, i) in subMenu"
                           :key="i"
                           :item="sItem" />
      </div>
    </div>
  </div>
</template>

<script>
import ContextMenuItem from "@/components/includes/ContextMenuItem";

export default {
  name: "HeaderMenu",
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
    mainMenuList: [
      {
        isItemOfMenu: true,
        title: 'Файл',
        subMenu: [
          {
            isItemOfMenu: true,
            title: 'Создать новый проект',
            action: () => {
              console.log('ACTION Создать новый проект')
            }
          },
          {
            isItemOfMenu: true,
            title: 'Создать слайд',
            action: () => {
              console.log('ACTION Создать слайд')
            }
          },
          {
            isItemOfMenu: true,
            title: 'Создать задачу',
            action: () => {
              console.log('ACTION Создать задачу')
            }
          },
          {
            isItemOfMenu: false,
          },
          {
            isItemOfMenu: true,
            title: 'Добавить изображение',
            action: () => {
              console.log('ACTION Добавить изображение')
            }
          },
        ]
      },
      {
        isItemOfMenu: true,
        title: 'Редактировать',
        subMenu: [
          {
            isItemOfMenu: true,
            title: 'В архив',
            action: () => {
              console.log('ACTION В архив')
            }
          }
        ]
      },
      {
        isItemOfMenu: true,
        title: 'Сохранить',
        action: () => {
          console.log('ACTION Сохранить')
        }
      },
      {
        isItemOfMenu: false,
      },
      {
        isItemOfMenu: true,
        title: 'Помощь и настройки',
        subMenu: [
          {
            isItemOfMenu: true,
            title: 'Часто задаваемые вопросы',
            action: () => {
              console.log('ACTION Часто задаваемые вопросы')
            }
          },
          {
            isItemOfMenu: true,
            title: 'Обратная связь',
            action: () => {
              console.log('ACTION Обратная связь')
            }
          },
          {
            isItemOfMenu: false,
          },
          {
            isItemOfMenu: true,
            title: 'Пользовательское соглашение',
            action: () => {
              console.log('ACTION Пользовательское соглашение')
            }
          },
          {
            isItemOfMenu: true,
            title: 'Выйти из профиля',
            action: () => {
              console.log('ACTION Выйти из профиля')
            }
          },
        ]
      },
    ],
    subMenu: null,
  }),
  methods: {
    setSubMenu(subMenu) {
      this.subMenu = subMenu;
    }
  },
}
</script>