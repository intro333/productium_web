<template>
  <div class="share-modal">
    <div v-if="shareUsers.length"
         class="add-user-box share-modal-padding">
      <p class="add-user-title">{{ $t('share.title') }}</p>
<!--      <input class="add-user-item add-user-input"-->
<!--             :placeholder="$t('share.placeholder1')">-->
<!--      <div class="add-user-item add-user-button">{{ $t('share.toInvite') }}</div>-->
    </div>
    <div class="user-list share-modal-padding wout-top">
      <div v-for="(user, i) in shareUsers"
           :key="i"
           :ref="'roleRef_' + i"
           class="ul-item">
        <div class="ul-item-left">
          <div class="p-flex-center ul-item-left-icon"
               :style="{'background-color': user.color}">{{user.shortName}}</div>
          <span class="ul-item-left-text">{{user.fullName}}</span>
        </div>
        <div class="ul-item-right">
          <span :ref="'roleNameRef_' + i"
                class="ul-item-right-text">{{$t('userRole.editor')}}</span>
          <img src="@/assets/img/case-tracker/toolbar_panel/share/selectArrow.svg"
               class="ul-item-right-arrow select-arrow"
               alt="">
        </div>
<!--        <div @click="openRolesSelect(i, user)"-->
<!--             class="ul-item-right">-->
<!--          <span :ref="'roleNameRef_' + i"-->
<!--                class="ul-item-right-text">{{$t('userRole.' + user.role)}}</span>-->
<!--          <img src="@/assets/img/case-tracker/toolbar_panel/share/selectArrow.svg"-->
<!--               class="ul-item-right-arrow select-arrow"-->
<!--               alt="">-->
<!--        </div>-->
      </div>
      <div v-if="!shareUsers.length"
           style="padding-top: 16px;">
        <div style="display: flex; align-items: center;">
          <span class="ul-item-left-text"
                style="margin-right: 5px;">{{ $t('share.copyLinkDescription') }}</span>
          <div class="share-modal-footer share-modal-footer-2">
            <div @click="copyShareLink"
                 class="text-link-box">
              <!--            <img src="@/assets/img/common/linkIcon.svg"-->
              <!--                 class="text-link-icon"-->
              <!--                 alt="">-->
              <a class="text-link">{{ $t('share.copyLink') }}</a>
            </div>
          </div>
        </div>
        <span class="ul-item-left-text"
              style="margin-right: 5px;">{{ $t('share.copyLinkDescription2') }}.</span>
      </div>
    </div>
    <div class="share-modal-divider"> </div>
    <div class="share-modal-footer">
      <div @click="copyShareLink"
           class="text-link-box">
        <img src="@/assets/img/common/linkIcon.svg"
             class="text-link-icon"
             alt="">
        <a class="text-link">{{ $t('share.copyLink') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions, mapGetters} from "vuex";
// import {userRoleToTitle} from "@/functions/conversation";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

export default {
  name: "ShareModal",
  props: ['contextMenu'],
  data: () => ({
    // shareUsers: [
    //   {
    //     name: 'Dmitriy',
    //     shortName: 'DD',
    //     role: 'editor',
    //     color: '#7c4a4a',
    //   },
    //   {
    //     name: 'Alex Gour',
    //     shortName: 'AG',
    //     role: 'guest',
    //     color: '#F30C0C',
    //   },
    //   {
    //     name: 'Dmitriy M',
    //     shortName: 'DM',
    //     role: 'manager',
    //     color: '#466a96',
    //   },
    // ]
  }),
  computed: {
    cm() {
      return this.contextMenu();
    },
    shareUsers() {
      return this.getShareUsers();
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'setSimpleNotifyInside']),
    ...mapGetters(['getShareUsers', 'getSelectedProject']),
    openRolesSelect(i, user) {
      if (this.$refs['roleNameRef_' + i]) {
        const _ref = this.$refs['roleNameRef_' + i];
        if (_ref && _ref[0] && _ref[0].getBoundingClientRect()) {
          const modalPosition = getModalPositionFunc(_ref[0]);
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
                        isItemOfMenu: true,
                        title: this.$t('userRole.guest'),
                        isActive: user.role === 'guest',
                        action: () => {
                          this.selectUserRole(user, 'guest');
                        }
                      },
                      {
                        isItemOfMenu: true,
                        title: this.$t('userRole.editor'),
                        isActive: user.role === 'editor',
                        action: () => {
                          this.selectUserRole(user, 'editor');
                        }
                      },
                      {
                        isItemOfMenu: true,
                        title: this.$t('userRole.manager'),
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
    // getUserRole(role) {
    //   return userRoleToTitle(role);
    // },
    copyShareLink() {
      let shareLink = window.location.host;
      shareLink += '/case-tracker?shareProjectId=' + this.getSelectedProject().id;
      this.$clipboard(shareLink);
      this.setSimpleNotifyInside(
          new SimpleNotifyInsideModel()
              .set(true,
              273,
                  this.$t('share.linkCopied'))
      )
    },
  },
}
</script>
