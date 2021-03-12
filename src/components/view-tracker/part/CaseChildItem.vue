<template>
  <div @click="selectCaseChild({
             _case,
             _child,
             isShape: false
           })"
       @mouseover="showCaseChildOptions(true)"
       @mouseleave="showCaseChildOptions(false)"
       class="csb-cases-item-child"
       :class="{'rgb-base-20': caseChildActiveAndSelected(_child)}">
    <div style="display: flex;">
      <img :src="getCaseShapeChildImg(_child)"
           class="csb-cases-item-child-img"
           alt="">
      <span :ref="caseChildRef(_child, cKey)"
            class="csb-cases-item-child-text text-ellipsis">{{_child.title}}</span>
    </div>
    <div v-if="isShowCaseChildOptions || (contextMenu.state && contextMenu.cKey === cKey &&
      (contextMenu.body) && contextMenu.body.subject === '_caseChild')"
         @click="openCaseOptionsMenu(167, 'caseChildOptionsRef_' + cKey,
              caseChildRef(_child, cKey), _child, '_caseChild','up', true, false, cKey)"
         :ref="'caseChildOptionsRef_' + cKey"
         class="csb-cases-item-options-box">
      <img src="@/assets/img/common/options.svg"
           class="csb-cases-item-options"
           alt="">
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import CaseMixin from "@/components/mixins/CaseMixin";

export default {
  name: "CaseChildItem",
  mixins: [CaseMixin],
  props: {
    _case: Object,
    _child: Object,
    cKey: Number,
    contextMenu: Object
  },
  data: () => ({
    isShowCaseChildOptions: false,
  }),
  methods: {
    ...mapActions(['selectCaseChild']),
    getCaseShapeChildImg(_child) {
      return require('@/assets/img/case-tracker/case-sidebar/' + _child.shapeType + '.svg')
    },
    caseChildActiveAndSelected(_child) { /* Если выбран элемент кейса (и кейс при этом активен) */
      return this._case.isSelected && _child.isSelected;
    },
    caseChildRef(_child, i) {
      return 'caseChildNameInputRef_' + i;
    },
    showCaseChildOptions(_state) {
      this.isShowCaseChildOptions = _state;
    },
  }
}
</script>