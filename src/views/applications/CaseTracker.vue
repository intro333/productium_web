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
           class="tp-icon-box tp-icon-box-2-2"
           :class="{active: (contextMenu.state && contextMenu.type === 'ScaleModal')}">
        <p class="tp-icon-item tp-text">{{zoomPercent}}%</p>
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

export default {
  name: "CaseTracker",
  mixins: [ModalsMixin, ProjectMixin],
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
  },
  data: () => ({
    isScrolling: false
  }),
  created() {
    if (this.$device.mobile || this.$device.ipad) {
      this.setIsNotAvailableForMobile(true);
      // return false;
    } else {
      this.setIsLoading(true);
      this.fetchInitData();
      const query = router.currentRoute.query;
      if (query && query.commentId) {
        this.openCommentsModalByCommentId(parseInt(query.commentId));
      }
    }
  },
  mounted() {
    window.addEventListener('wheel', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.handleScroll);
  },
  computed: {
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
      'setContextMenuBase', 'setCentralModal']),
    ...mapGetters(['getContextMenuBase', 'getCentralModal', 'getTooltip', 'getIsLoading', 'getNotAvailableForMobile']),
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
  },
}
</script>