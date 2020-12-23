<template>
  <div class="case-sidebar">
    <div class="csb-header csb-container">
      <div class="csb-header-tabs scroll-x-container">
        <div @click="selectTab('cases')"
             class="csb-header-tabs-item"
             :class="{'rgb-black-30': !isTabSelected('cases')}">
          <span>Кейсы </span>
          <span>
            <span>{{numOfInWorkCases}}</span>
            <span class="rgb-black-30">/{{numOfDoneCases}}</span>
          </span>
        </div>
<!--        <span @click="selectTab('notes')"-->
<!--              class="csb-header-tabs-item"-->
<!--              :class="{'rgb-black-30': !isTabSelected('notes')}">Заметки</span>-->
<!--        <span @click="selectTab('wiki')"-->
<!--              class="csb-header-tabs-item"-->
<!--              :class="{'rgb-black-30': !isTabSelected('wiki')}">Вики</span>-->
      </div>
      <div @click="selectTab('notify')"
           class="csb-header-img-box">
        <img src="@/assets/img/common/notifyIcon.svg"
             class="csb-header-img"
             :class="{'not-selected': !isTabSelected('notify')}"
             alt="">
        <div v-if="isNotReadNotifications"
             class="notify-circle csb-header-img-notify"></div>
      </div>
    </div>
    <div v-if="selectedTab === 'cases'"
         class="csb-cases">
      <div class="csb-cases-filter csb-container">
        <div @click="openCasesFilter(176, 'casesFilterRef')"
             ref="casesFilterRef"
             class="csb-cases-filter-box">
          <span class="csb-cases-filter-text rgb-black-30">{{caseFilters[caseFilterSelected].title}} </span>
          <img src="@/assets/img/common/selectArrowGrey.svg"
               class="csb-cases-filter-arrow"
               alt="">
        </div>
      </div>
      <div class="csb-cases-list">
        <CaseSidebarItem v-for="(_case, i) in casesFiltered"
                         :key="i"
                         :cKey="i"
                         :_case="_case"
                         :contextMenu="getContextMenuBase()" />
      </div>
    </div>
    <div class="csb-notify">
      <Notifications v-if="selectedTab === 'notify'"
                     :notifications="notifications" />
    </div>
    <!-- TODO helpIcon.svg   -->
  </div>
</template>

<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapGetters} from "vuex";
import ModalsMixin from "@/components/mixins/ModalsMixin";
import Notifications from "@/components/common/Notifications";
import CaseMixin from "@/components/mixins/CaseMixin";
import CaseSidebarItem from "@/components/view-tracker/part/CaseSidebarItem";
import {sortCasesComments} from "@/functions/conversation";

export default {
  name: "CaseSidebar",
  mixins: [ModalsMixin, CaseMixin],
  components: {
    Notifications,
    CaseSidebarItem
  },
  data: () => ({
    selectedTab: 'cases', // cases | notes | wiki | notify
    caseFilterSelected: 0,
  }),
  computed: {
    caseFilters() {
      return [
        {
          status: 'all',
          title: 'все',
          action: () => {
            this.caseFilterSelected = 0;
          }
        },
        {
          status: 'done',
          title: 'готовые',
          action: () => {
            this.caseFilterSelected = 1;
          }
        },
        {
          status: 'in-work',
          title: 'в работе',
          action: () => {
            this.caseFilterSelected = 2;
          }
        },
      ];
    },
    casesFiltered() {
      const result = [];
      const selectedFilter = this.caseFilters[this.caseFilterSelected];
      this.cases.forEach(_case => {
        if (selectedFilter.status === 'all') {
          result.push(_case);
        } else {
          if (_case.caseStatus === selectedFilter.status) {
            result.push(_case);
          }
        }
      });
      return result;
    },
    notifications() {
      const query = this.$route.query;
      if (query && query.projectId) {
        const filteredComments = Object.assign([],
            this.getCasesComments()
                .filter(_c =>
                    (_c.projectId === parseInt(query.projectId)) &&
                    (_c.notifyInfo.status !== 'archived') &&
                    _c.notifyInfo.status !== 'fromCurrentUser'));
        return  filteredComments
            .reverse()
            .sort(sortCasesComments);
      } else {
        return [];
      }
    },
    isNotReadNotifications() {
      return this.notifications
          .filter(_n => _n.notifyInfo.status === 'notRead').length
    },
    numOfInWorkCases() {
      return this.cases.filter(_c => _c.caseStatus === 'in-work').length;
    },
    numOfDoneCases() {
      return this.cases.filter(_c => _c.caseStatus === 'done').length;
    },
  },
  methods: {
    ...mapGetters(['getCasesComments', 'getContextMenuBase']),
    selectTab(tabName) {
      this.selectedTab = tabName;
    },
    isTabSelected(tabName) {
      return tabName === this.selectedTab;
    },
    openCasesFilter(width, _refStr) {
      const _ref = this.$refs[_refStr];
      if (_ref && _ref.getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref, true, width);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                'SelectPopup',
                width,
                modalPosition.top,
                modalPosition.left,
                null,
                {
                  selectOptions: this.caseFilters.map(_f => {
                    let title = 'Показывать ' + ((_f.status === 'all') ? _f.title : `"${_f.title}"`);
                    return {
                      isItemOfMenu: true,
                      title,
                      dontShowIsActive: true,
                      action: _f.action,
                    };
                  }),
                })
        );
      }
    },
  },
}
</script>