<template>
  <div class="share-modal">
    <div class="add-user-box share-modal-padding">
      <input class="add-user-item add-user-input"
             placeholder="Введите почту или @Имя пользователя">
      <div class="add-user-item add-user-button">Пригласить</div>
    </div>
    <div class="user-list share-modal-padding wout-top">
      <div v-for="(user, i) in shareUsers"
           :key="i"
           class="ul-item">
        <div class="ul-item-left">
          <div class="p-flex-center ul-item-left-icon"
               :style="{'background-color': `#${user.color}`}">{{user.shortUserName}}</div>
          <span class="ul-item-left-text">{{user.name}}</span>
        </div>
        <div @click="openRolesSelect"
             class="ul-item-right">
          <span class="ul-item-right-text">{{user.role}}</span>
          <img src="@/assets/img/case-tracker/toolbar_panel/share/selectArrow.svg"
               class="ul-item-right-arrow select-arrow"
               alt="">
        </div>
      </div>
    </div>
    <div class="share-modal-divider"> </div>
    <div class="share-modal-footer">
      <div class="text-link-box">
        <img src="@/assets/img/common/linkIcon.svg"
             class="text-link-icon"
             alt="">
        <a class="text-link">Копировать ссылку</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShareModal",
  props: ['contextMenu'],
  data: () => ({
    shareUsers: [
      {
        name: 'Dmitriy',
        shortUserName: 'DD',
        role: 'редактор',
        color: '7c4a4a',
      },
      {
        name: 'Alex Gour',
        shortUserName: 'AG',
        role: 'наблюдатель',
        color: 'F30C0C',
      },
      {
        name: 'Dmitriy M',
        shortUserName: 'DM',
        role: 'управляющий',
        color: '466a96',
      },
    ]
  }),
  computed: {
    cm() {
      return this.contextMenu();
    }
  },
  methods: {
    openRolesSelect() {

    }
  },
}
</script>