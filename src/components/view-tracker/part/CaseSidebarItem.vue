<template>
  <div class="csb-cases-item-container">
    <div @mouseover="showCaseOptions(true)"
         @mouseleave="showCaseOptions(false)"
         class="csb-cases-item"
         :class="{'rgb-base-20': caseActiveAndSelected, 'rgb-base-10': _case.isSelected && this.caseChildIsSelected}">
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
        <div @click="selectCaseL({ _case })"
             class="csb-cases-item-text-box">
          <div class="case-status-main csb-cases-item-status"
               :class="{commented: _case.haveNewComments, [_case.caseStatus]: true}">
            <div class="case-status-inside"></div>
          </div>
          <span v-if="!_case.isEdited"
                :ref="caseRef(_case, cKey)"
                v-on:dblclick="changeCaseNameEditable(_case, caseRef(_case, cKey), true, false, cKey)"
                class="csb-cases-item-text text-ellipsis"
                style="width: 100%;">{{_case.title}}</span>
          <input v-if="_case.isEdited"
                 :ref="caseRef(_case, cKey)"
                 @input="changeCaseNameText($event, _case)"
                 @blur="changeCaseNameEditable(_case, caseRef(_case, cKey), false, false, cKey)"
                 @keyup.enter="changeCaseNameEditable(_case,  caseRef(_case, cKey), false, false, cKey)"
                 :value="_case.title"
                 class="csb-cases-item-text csb-cases-item-input text-ellipsis">
        </div>
      </div>
      <div v-if="isShowCaseOptions || (contextMenu.state && contextMenu.cKey === cKey &&
      (contextMenu.body) && contextMenu.body.subject === '_case')"
           @click="openCaseOptionsMenu(167, 'caseOptionsRef_' + cKey,
              caseRef(_case, cKey), _case, '_case', 'up', true, false, cKey)"
           :ref="'caseOptionsRef_' + cKey"
           class="csb-cases-item-options-box">
        <img src="@/assets/img/common/options.svg"
             class="csb-cases-item-options"
             alt="">
      </div>
    </div>
    <div v-if="_case.children.length && _case.isOpen"
         @click="selectCaseL({_case, isSelectedChild: true})"
         class="csb-cases-item-children"
         :class="{'rgb-base-10': _case.isSelected}">
      <CaseChildItem v-for="(_child, k) in _case.children"
                     :contextMenu="contextMenu"
                     :_case="_case"
                     :_child="_child"
                     :key="k"
                     :cKey="k" />
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import CaseMixin from "@/components/mixins/CaseMixin";
import CaseChildItem from "@/components/view-tracker/part/CaseChildItem";

export default {
  name: "CaseSidebarItem",
  mixins: [CaseMixin],
  components: {
    CaseChildItem
  },
  props: {
    cKey: Number,
    _case: Object,
    contextMenu: Object
  },
  data: () => ({
    isShowCaseOptions: false,
  }),
  computed: {
    // isCaseChildren() {
    //   return this._case.children && this._case.children.length;
    // },
    caseChildIsSelected() {
      return this._case.children && this._case.children
          .filter(_ch => _ch.isSelected).length;
    },
    caseActiveAndSelected() { /* Если выбран кейс и его элементы не активны */
      return this._case.isSelected && !this.caseChildIsSelected;
    },
  },
  methods: {
    ...mapActions(['selectCase', 'setIsLoading']),
    caseRef(_case, i) {
      return 'caseNameInputRef_' + i;
    },
    showOrHideCaseChildren(_case) {
      _case.isOpen = !_case.isOpen;
    },
    showCaseOptions(_state) {
      this.isShowCaseOptions = _state;
    },
    selectCaseL(payload) {
      this.selectCase(payload);
      // this.setIsLoading(true);
    },
  },
}
</script>