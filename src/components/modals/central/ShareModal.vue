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
           :ref="'roleRef_' + i"
           class="ul-item">
        <div class="ul-item-left">
          <div class="p-flex-center ul-item-left-icon"
               :style="{'background-color': `#${user.color}`}">{{user.shortUserName}}</div>
          <span class="ul-item-left-text">{{user.name}}</span>
        </div>
        <div @click="openRolesSelect(i, user)"
             class="ul-item-right">
          <span :ref="'roleNameRef_' + i"
                class="ul-item-right-text">{{getUserRole(user.role)}}</span>
          <img src="@/assets/img/case-tracker/toolbar_panel/share/selectArrow.svg"
               class="ul-item-right-arrow select-arrow"
               alt="">
        </div>
      </div>
    </div>
    <div class="share-modal-divider"> </div>
    <div class="share-modal-footer">
      <div @click="copyShareLink"
           class="text-link-box">
        <img src="@/assets/img/common/linkIcon.svg"
             class="text-link-icon"
             alt="">
        <a class="text-link">Копировать ссылку</a>
      </div>
    </div>
  </div>
</template>

<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";
import {userRoleToTitle} from "@/functions/convertation";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

export default {
  name: "ShareModal",
  props: ['contextMenu'],
  data: () => ({
    shareUsers: [
      {
        name: 'Dmitriy',
        shortUserName: 'DD',
        role: 'editor',
        color: '7c4a4a',
      },
      {
        name: 'Alex Gour',
        shortUserName: 'AG',
        role: 'guest',
        color: 'F30C0C',
      },
      {
        name: 'Dmitriy M',
        shortUserName: 'DM',
        role: 'manager',
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
    ...mapActions(['setContextMenuBase', 'setSimpleNotifyInside']),
    openRolesSelect(i, user) {
      if (this.$refs['roleNameRef_' + i]) {
        const _ref = this.$refs['roleNameRef_' + i];
        if (_ref && _ref[0] && _ref[0].getBoundingClientRect()) {
          const modalPosition = getModalPositionFunc(_ref[0]);
          console.log(1, modalPosition);
          this.setContextMenuBase(new ContextMenuBaseModel()
              .set(true,
                  'SelectPopup',
                  134,
                  modalPosition.top,
                  modalPosition.left,
                  null,
                  {
                    selectOptions: [
                      {
                        title: userRoleToTitle('guest'),
                        isActive: user.role === 'guest',
                        action: () => {
                          this.selectUserRole(user, 'guest');
                        }
                      },
                      {
                        title: userRoleToTitle('editor'),
                        isActive: user.role === 'editor',
                        action: () => {
                          this.selectUserRole(user, 'editor');
                        }
                      },
                      {
                        title: userRoleToTitle('manager'),
                        isActive: user.role === 'manager',
                        action: () => {
                          this.selectUserRole(user, 'manager');
                        }
                      },
                    ]
                  }).more({
                // position: 'absolute',
                zIndex: 8
              })
          );
        }
      }
    },
    selectUserRole(user, role) {
      user.role = role;
      this.setContextMenuBase(new ContextMenuBaseModel());
    },
    getUserRole(role) {
      return userRoleToTitle(role);
    },
    copyShareLink() {
      this.setSimpleNotifyInside(
          new SimpleNotifyInsideModel()
              .set(true,
              273,
              'Ссылка успешно скопирована')
      )
    },
  },
}
</script>