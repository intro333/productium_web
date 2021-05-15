<template>
  <div class="cm-list">
    <ContextMenuItem v-for="(item, i) in mainMenuList()"
                     :key="i"
                     :item="item"
                     :setSubMenu="setSubMenu" />

    <!-- SUB LIST -->
    <div v-if="subMenu"
         class="p-modal-context-menu"
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
import {mapActions, mapGetters} from "vuex";

export default {
  name: "HeaderMenu",
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
    activeSlide() {
      return this.getActiveSlide();
    },
    projects() {
      return this.getProjects();
    },
    myProjects() {
      return this.projects.filter(_project => _project.activityStatus === 'active')
          .map(_project => {
            return {
              isItemOfMenu: true,
              title: _project.name,
              action: () => {

              }
            };
      });
    },
  },
  methods: {
    ...mapActions(['pushSlide', 'pushCase', 'setSlideImg']),
    ...mapGetters(['getActiveSlide', 'getProjects']),
    setSubMenu(subMenu) {
      this.subMenu = subMenu;
    },
    mainMenuList() {
      return [
        {
          isItemOfMenu: true,
          title: this.$t('nav.file'),
          subMenu: [
            {
              isItemOfMenu: true,
              title: this.$t('nav.createNewProject'),
              action: () => {
                console.log('ACTION Создать новый проект');
              }
            },
            {
              isItemOfMenu: true,
              title: this.$t('nav.createSlide'),
              action: () => {
                this.pushSlide();
              }
            },
            {
              isItemOfMenu: true,
              isDisable: !this.activeSlide.img,
              title: this.$t('nav.createCase'),
              action: () => {
                /* Задачу можно создать только если изображение добавлено */
                if (this.activeSlide.img) {
                  this.pushCase();
                }
              }
            },
            {
              isItemOfMenu: false,
            },
            {
              isItemOfMenu: true,
              isFileInput: true,
              isDisable: !!this.activeSlide.img,
              title: this.$t('nav.addImage'),
              action: () => {},
              fileAction: ($event) => {
                /* Нельзя добавить более одного изображения */
                if (!this.activeSlide.img) {
                  const files = $event.target.files;
                  if (files && files[0]) {
                    const file = files[0];
                    this.setSlideImg(file);
                  }
                }
              },
            },
          ]
        },
        {
          isItemOfMenu: true,
          title: this.$t('nav.edit'),
          subMenu: [
            {
              isItemOfMenu: true,
              title: this.$t('nav.remove'),
              action: () => {
                console.log('ACTION В архив')
              }
            }
          ]
        },
        {
          isItemOfMenu: true,
          title: this.$t('nav.save'),
          action: () => {
            console.log('ACTION Сохранить')
          }
        },
        {
          isItemOfMenu: false,
        },
        {
          isItemOfMenu: true,
          title: this.$t('nav.myProjects'),
          subMenu: this.myProjects
        },
        // {
        //   isItemOfMenu: true,
        //   title: 'Помощь и настройки',
        //   subMenu: [
        //     {
        //       isItemOfMenu: true,
        //       title: 'Часто задаваемые вопросы',
        //       action: () => {
        //         console.log('ACTION Часто задаваемые вопросы')
        //       }
        //     },
        //     {
        //       isItemOfMenu: true,
        //       title: 'Обратная связь',
        //       action: () => {
        //         console.log('ACTION Обратная связь')
        //       }
        //     },
        //     {
        //       isItemOfMenu: false,
        //     },
        //     {
        //       isItemOfMenu: true,
        //       title: 'Пользовательское соглашение',
        //       action: () => {
        //         console.log('ACTION Пользовательское соглашение')
        //       }
        //     },
        //     {
        //       isItemOfMenu: true,
        //       title: 'Выйти из профиля',
        //       action: () => {
        //         console.log('ACTION Выйти из профиля')
        //       }
        //     },
        //   ]
        // },
      ];
    },
  },
}
</script>