<template>
  <div class="csb-cases-item-container">
    <div @mouseover="showCaseOptions(true)"
         @mouseleave="showCaseOptions(false)"
         class="csb-cases-item"
         :class="{'rgb-base-20': caseActiveAndSelected}">
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
        <div @click="selectCase({ _case })"
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
      <div v-if="isShowCaseOptions || (contextMenu.state && contextMenu.cKey === cKey)"
           @click="openCaseOptionsMenu(167, 'caseOptionsRef_' + cKey,
              caseRef(_case, cKey), _case, 'up', true, false, cKey)"
           :ref="'caseOptionsRef_' + cKey"
           class="csb-cases-item-options-box">
        <img src="@/assets/img/common/options.svg"
             class="csb-cases-item-options"
             alt="">
      </div>
    </div>
    <div v-if="_case.children.length && _case.isOpen"
         @click="selectCase({_case, isSelectedChild: true})"
         class="csb-cases-item-children"
         :class="{'rgb-base-10': caseActiveAndSelected}">
      <div v-for="(_child, k) in _case.children"
           @click="selectCaseChild({
             _case,
             _child
           })"
           :key="k"
           class="csb-cases-item-child"
           :class="{'rgb-base-20': caseChildActiveAndSelected(_child)}">
        <img :src="getCaseShapeChildImg(_child)"
             class="csb-cases-item-child-img"
             alt="">
        <span class="csb-cases-item-child-text text-ellipsis">{{_child.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import CaseMixin from "@/components/mixins/CaseMixin";

export default {
  name: "CaseSidebarItem",
  mixins: [CaseMixin],
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
    ...mapActions(['selectCase', 'selectCaseChild']),
    caseRef(_case, i) {
      return 'caseNameInputRef_' + i;
    },
    showOrHideCaseChildren(_case) {
      _case.isOpen = !_case.isOpen;
    },
    showCaseOptions(_state) {
      this.isShowCaseOptions = _state;
    },
    getCaseShapeChildImg(_child) {
      return require('@/assets/img/case-tracker/case-sidebar/' + _child.shapeType + '.svg')
    },
    caseChildActiveAndSelected(_child) { /* Если выбран элемент кейса (и кейс при этом активен) */
      return this._case.isSelected && _child.isSelected;
    },
  },
}
</script>