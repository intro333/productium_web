<template>
  <div class="case-sidebar">
    <div class="csb-header csb-container">
      <div class="csb-header-tabs scroll-x-container">
        <div @click="selectTab('cases')"
             class="csb-header-tabs-item"
             :class="{'rgb-black-30': !isTabSelected('cases')}">
          <span>Кейсы </span>
          <span>
            <span>32</span>
            <span class="rgb-black-30">/12</span>
          </span>
        </div>
        <span @click="selectTab('notes')"
              class="csb-header-tabs-item"
              :class="{'rgb-black-30': !isTabSelected('notes')}">Заметки</span>
        <span @click="selectTab('wiki')"
              class="csb-header-tabs-item"
              :class="{'rgb-black-30': !isTabSelected('wiki')}">Вики</span>
      </div>
      <div class="csb-header-img-box">
        <img @click="selectTab('notify')"
             src="@/assets/img/common/notifyIcon.svg"
             class="csb-header-img"
             :class="{'not-selected': !isTabSelected('notify')}"
             alt="">
        <div class="notify-circle csb-header-img-notify"></div>
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
        <div v-for="(_case, i) in caseListFiltered"
             class="csb-cases-item-container"
             :key="i">
          <div class="csb-cases-item"
               :class="{'rgb-base-20': _case.isSelected}">
            <div class="csb-cases-item-left">
              <div v-if="_case.children.length"
                   @click="showOrHideCaseChildren(_case)"
                   class="csb-cases-item-triangle">
                <img src="@/assets/img/common/triangle.svg"
                     class="triangle-rotate"
                     :class="{'triangle-rotate-open': _case.isOpen}"
                     alt="">
              </div>
              <div v-if="!_case.children.length"
                   class="csb-cases-item-triangle"></div>
              <div @click="selectCase(_case)"
                   class="csb-cases-item-text-box">
                <div class="case-status-main csb-cases-item-status"
                     :class="{commented: _case.haveNewComments, [_case.status]: true}">
                  <div class="case-status-inside"></div>
                </div>
                <span v-if="!_case.isEdited"
                      :ref="'caseNameInputRef_' + i"
                      v-on:dblclick="caseDoubleClick($event, _case, i)"
                      class="csb-cases-item-text text-ellipsis">{{_case.title}}</span>
                <input v-if="_case.isEdited"
                       :ref="'caseNameInputRef_' + i"
                       @input="changeCaseNameText($event, _case)"
                       @blur="changeCaseNameEditable(_case, i, false)"
                       @keyup.enter="changeCaseNameEditable(_case,  i, false)"
                       :value="_case.title"
                       class="csb-cases-item-text csb-cases-item-input text-ellipsis">
              </div>
            </div>
            <div @click="openCaseOptionsMenu(167, 'caseOptionsRef_' + i, _case, i)"
                 :ref="'caseOptionsRef_' + i"
                 class="csb-cases-item-options-box">
              <img src="@/assets/img/common/options.svg"
                   class="csb-cases-item-options"
                   alt="">
            </div>
          </div>
          <div v-if="_case.children.length && _case.isOpen"
               class="csb-cases-item-children"
               :class="{'rgb-base-10': _case.isSelected}">
            <div v-for="(_child, k) in _case.children"
                 :key="k"
                 class="csb-cases-item-child">
              <img :src="getCaseShapeChildImg(_child)"
                   class="csb-cases-item-child-img"
                   alt="">
              <span class="csb-cases-item-child-text text-ellipsis">{{_child.title}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";
import ModalsMixin from "@/components/mixins/ModalsMixin";

export default {
  name: "CaseSidebar",
  mixins: [ModalsMixin],
  data: () => ({
    selectedTab: 'cases', // cases | notes | wiki | notify
    caseList: [
      {
        id: 1,
        title: 'Задача 1',
        status: 'in-work',
        isSelected: false,
        isEdited: false,
        isOpen: false,
        haveNewComments: false,
        children: []
      },
      {
        id: 2,
        title: 'Баг с выпадающим списком, когда на него нажимаешь.',
        status: 'done',
        isSelected: true,
        isEdited: false,
        isOpen: false,
        haveNewComments: true,
        children: [
          {
            id: 1,
            title: 'Rectangle 1',
            shapeType: 'rectangle'
          },
          {
            id: 2,
            title: 'Rectangle 2',
            shapeType: 'rectangle'
          },
          {
            id: 3,
            title: 'Circle 1',
            shapeType: 'circle'
          },
        ]
      },
    ],
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
    caseListFiltered() {
      const result = [];
      const selectedFilter = this.caseFilters[this.caseFilterSelected];
      this.caseList.forEach(_case => {
        if (selectedFilter.status === 'all') {
          result.push(_case);
        } else {
          if (_case.status === selectedFilter.status) {
            result.push(_case);
          }
        }
      });
      return result;
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase']),
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
    changeCaseNameText($event, _case) {
      const name = $event.target.value;
      if (name.length <= 200) {
        _case.title = name;
      }
    },
    changeCaseNameEditable(_case, i, state) {
      _case.isEdited = state;
      this.caseRefFocusHandler(_case, i, state);
    },
    caseDoubleClick($event, _case, i) {
      this.changeCaseNameEditable(_case, i, true);
      // this.hideToolTip();
    },
    caseRefFocusHandler(_case, i, state) {
      setTimeout(() => {
        const _ref = this.$refs['caseNameInputRef_' + i];
        if (state && _ref && _ref[0]) {
          const inputRef = _ref[0];
          inputRef.focus();
        }
        if (!state && _case.title === '') {
          _case.title = 'Case ' + (i + 1)
        }
      }, 20)
    },
    selectCase(_case) {
      this.caseList.forEach(_c => {
        _c.isSelected = _c.id === _case.id;
      });
    },
    openCaseOptionsMenu(width, _refStr, _case, i) {
      const _ref = this.$refs[_refStr];
      if (_ref && _ref[0] && _ref[0].getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref[0], true, width);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                'SelectPopup',
                width,
                modalPosition.top,
                modalPosition.left,
                'up',
                {
                  selectOptions: [
                    {
                      isItemOfMenu: true,
                      title: 'В работе',
                      isActive: _case.status === 'in-work',
                      action: () => {
                        _case.status = 'in-work'
                      },
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Готово',
                      isActive: _case.status === 'done',
                      action: () => {
                        _case.status = 'done'
                      }
                    },
                    {
                      isItemOfMenu: false,
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Переименовать',
                      action: () => {
                        this.changeCaseNameEditable(_case, i, true);
                      }
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Удалить',
                      action: () => {

                      }
                    },
                  ]
                })
            .more({
              isRight: true
            })
        );
      }
    },
    showOrHideCaseChildren(_case) {
      _case.isOpen = !_case.isOpen;
    },
    getCaseShapeChildImg(_child) {
      return require('@/assets/img/case-tracker/case-sidebar/' + _child.shapeType + '.svg')
    }
  }
}
</script>