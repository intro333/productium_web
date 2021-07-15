<template>
  <div class="case-tracker">
    <WorkArea />
    <!-- TOOLBAR PANEL -->
    <div class="t-pan-logo-menu">
      <img @click="goToProjects()"
           ref="logoRef"
           src="@/assets/img/case-tracker/toolbar_panel/logo.svg"
           class="t-pan-logo-menu-img__logo"
           alt="">
      <div @click="openContextMenu('HeaderMenu', 210, 'menuRef')"
           ref="menuRef"
           class="tp-icon-box"
           :class="{active: (contextMenu.state && contextMenu.type === 'HeaderMenu')}">
        <img src="@/assets/img/case-tracker/toolbar_panel/menu.svg"
             class="tp-icon-item tp-icon-img"
             alt="">
      </div>
    </div>
    <div class="t-pan-proj-name">
      <input v-if="project.nameIsEdited"
             ref="projectNameInputRef"
             @input="changeProjectNameText"
             @blur="changeProjectNameEditable(false)"
             @keyup.enter="changeProjectNameEditable(false)"
             :value="project.name"
             class="tp-text tp-text-input text-ellipsis">
      <div v-if="!project.nameIsEdited"
           @click="changeProjectNameEditable(true)"
           class="tp-icon-item-box tp-icon-item-box-2">
        <span class="tp-text tp-text-input-readonly text-ellipsis">{{project.name}}</span>
      </div>
      <img v-if="!project.nameIsEdited"
           @click="openContextMenu('ProjectNameModal', 134, 'projectNameArrowRef', false, projectNameModalBody(), 8)"
           ref="projectNameArrowRef"
           src="@/assets/img/common/selectArrow.svg"
           class="tp-icon-item select-arrow"
           alt="">
      <div v-if="project.nameIsEdited"
           class="tp-icon-item select-arrow"></div>
    </div>

    <div @mouseenter="showTooltip($event, 'panCloudRef', $t('message.errorNoSyncing'), false, false, 5)"
         @mouseleave="hideToolTip"
         ref="panCloudRef"
         class="t-pan-cloud">
      <img src="@/assets/img/common/cloud.svg"
           class="t-pan-cloud-icon"
           alt="">
    </div>

    <div class="t-pan-right">
      <div class="t-pan-user">
        <div class="p-flex-center tp-icon-user-i t-pan-user__item"
             style="background-color: #EC368D;">D</div>
        <div class="p-flex-center tp-icon-user-i t-pan-user__item"
             style="background-color: #F30C0C;">4</div>
      </div>
      <div @click="openShareModal"
           class="t-pan-share">
        <img src="@/assets/img/common/share2.svg"
             class="t-pan-share-icon"
             alt="">
        <span class="t-pan-share-text">Share</span>
      </div>
      <div @click="openContextMenu('ScaleModal', 208, 'scaleRef', true, null, 20)"
           ref="scaleRef"
           class="t-pan-share-box"
           :class="{active: (contextMenu.state && contextMenu.type === 'ScaleModal')}">
        <p class="tp-icon-item tp-text tp-text-cursor-default">{{zoomPercent}}%</p>
        <img src="@/assets/img/common/selectArrow.svg"
             class="tp-icon-item select-arrow"
             style="padding-right: 0;"
             alt="">
      </div>
    </div>
    <!-- COMPONENTS -->
    <SlideSidebar />
    <CaseSidebar />
    <CaseDiscusBlock />
    <WorkAreaTools />

    <!-- MODALS -->
    <ContextMenuBase v-if="contextMenu.state"
                     :contextMenu="getContextMenuBase" />
    <CentralModal v-if="getCentralModal().state"
                     :contextMenu="getCentralModal" />
    <Tooltip v-if="getTooltip().state"
                     :tooltip="getTooltip" />
    <Loading v-if="getIsLoading()" />
    <NotAvailableForMobile v-if="getNotAvailableForMobile()" />

    <!-- video -->
    <VideoLearning v-if="isShowVideoLearning"
                   :close="close" />
  </div>
</template>

<script>
import WorkArea from "@/components/view-tracker/WorkArea";
import SlideSidebar from "@/components/view-tracker/SlideSidebar";
import CaseSidebar from "@/components/view-tracker/CaseSidebar";
import CaseDiscusBlock from "@/components/view-tracker/CaseDiscusBlock";
import ContextMenuBase from "@/components/modals/context-menu/ContextMenuBase";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/modals/Tooltip";
import CentralModal from "@/components/modals/central/CentralModal";
import router from "@/router";
import Loading from "@/components/common/Loading";
import NotAvailableForMobile from "@/components/modals/NotAvailableForMobile";
import WorkAreaTools from "@/components/view-tracker/WorkAreaTools";
import ModalsMixin from "@/components/mixins/ModalsMixin";
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import ProjectMixin from "@/components/mixins/ProjectMixin";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import VideoLearning from "@/components/common/VideoLearning";
import LocaleMixin from "@/components/mixins/LocaleMixin";
import VueJwtDecode from 'vue-jwt-decode';
import {CurrentUserModel} from "@/models/CurrentUserModel";
import {shortFullName} from "@/functions/conversation";

export default {
  name: "CaseTracker",
  mixins: [ModalsMixin, ProjectMixin, LocaleMixin],
  components: {
    WorkArea,
    SlideSidebar,
    CaseSidebar,
    CaseDiscusBlock,
    WorkAreaTools,
    ContextMenuBase,
    CentralModal,
    Loading,
    Tooltip,
    NotAvailableForMobile,
    VideoLearning,
  },
  data: () => ({
    isScrolling: false,
    isShowVideoLearning: false,
  }),
  created() {
    /* Auth check */
    const token = localStorage.getItem('access_token');
    if (!token) {
      const fk = this.$faker();
      const fullName = `${fk.name.firstName()} ${fk.name.lastName()}`;
      const password = fk.internet.password();
      this.login({fullName, password});
    } else {
      const decodeToken = VueJwtDecode.decode(token);
      this.setCurrentUser(
          new CurrentUserModel(
              decodeToken.sub,
              decodeToken.username,
              shortFullName(decodeToken.username),
              '#7c4a4a'
          )
      );
    }

    if (this.$device.mobile || this.$device.ipad) {
      this.setIsNotAvailableForMobile(true);
      // return false;
    } else {
      this.setIsLoading(true);
      if (this.isAuthorized) {
        this.fetchInitData().then(() => {
          setTimeout(() => {
            this.fetchProjectsL();
          }, 300);
        });
      }
      const query = router.currentRoute.query;
      if (query && query.commentId) {
        this.openCommentsModalByCommentId(parseInt(query.commentId));
      }
    }
    const langCode = localStorage.getItem('lang_code');
    if (langCode) {
      this.changeLocale(langCode);
    }
    if (this.$route.query.lang) {
      this.changeLocale(this.$route.query.lang);
    }
    // this.fetchIpAddressAndSetOsInfo().then(info => {
    //   if (info.userIp && (info.userIp !== '')) {
    //     this.fetchAdditionalIpInfo(info.userIp).then(additionalInfo => {
    //       if (additionalInfo && additionalInfo.location && additionalInfo.location.country) {
    //         const location = additionalInfo.location;
    //         const country = location.country;
    //         const langByCountry = (country.code === 'RU') ? 'ru' : 'en';
    //         if (!this.$route.query.lang) {
    //           this.changeLocale(langByCountry);
    //         }
    //         if (!langCode && !this.$route.query.lang) { /* query.lang служебный случай */
    //           localStorage.setItem('lang_code', langByCountry);
    //         }
    //       }
    //     });
    //   }
    // });
  },
  mounted() {
    window.addEventListener('wheel', this.handleScroll);
    const vl = localStorage.getItem('video_learning');
    if (!vl) {
      setTimeout(() => {
        this.isShowVideoLearning = true;
        localStorage.setItem('video_learning', 'was_watched');
      }, 1500);
    }
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.handleScroll);
  },
  computed: {
    isAuthorized() {
      return this.geIsAuthorized();
    },
    activeSlide() {
      return this.getActiveSlide();
    },
    contextMenu() {
      return this.getContextMenuBase();
    },
    zoomPercent() {
      if (this.activeSlide && this.activeSlide.zoom) {
        return Math.round(this.activeSlide.zoom.z * 100);
      }
      return 100;
    }
  },
  methods: {
    ...mapActions(['fetchProjects', 'fetchSlides', 'fetchSlideLists', 'fetchCases', 'fetchCaseComments',
      'openCommentsModalByCommentId', 'fetchInitData', 'setIsLoading', 'setIsNotAvailableForMobile',
      'setContextMenuBase', 'setCentralModal', 'fetchIpAddressAndSetOsInfo', 'fetchAdditionalIpInfo',
      'login', 'setCurrentUser']),
    ...mapGetters(['getContextMenuBase', 'getCentralModal', 'getTooltip', 'getIsLoading', 'getNotAvailableForMobile',
      'getActiveSlide', 'geIsAuthorized']),
    handleScroll(e) {
      const self = this;
      window.clearTimeout( this.isScrolling );
      self.isScrolling = setTimeout(function() {
        if (document.body.className.indexOf('modal-open') === -1) { /* Если body разлочен */
          if (e.ctrlKey) {
            e.preventDefault();
          }
        }
      }, 66);
    },
    goToProjects() {
      // this.$router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1'); // TODO Редиректить к списку проектов
    },
    openShareModal() {
      this.setCentralModal(
          new CentralModalModel()
              .set(true,
                  'ShareModal',
                  500,)
      );
    },
    openContextMenu(type, width, _refStr, isRight = null, _body = null, topPlus) {
      if (this.$refs[_refStr] && this.$refs[_refStr].getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(this.$refs[_refStr], isRight, width, topPlus);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                type,
                width,
                modalPosition.top,
                modalPosition.left,
                'up',
                _body)
            .more({
              isRight
            })
        );
      }
    },
    close() {
      this.isShowVideoLearning = false;
    },
  },
}
</script>
