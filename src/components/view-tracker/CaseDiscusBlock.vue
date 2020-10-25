<template>
  <div class="case-discus">
    <div class="case-discus-header">
      <div class="cd-left">
        <template v-if="selectedCase">
          <div class="cd-left-case-status"
               :class="{[selectedCase.status]: true}"></div>
          <div v-if="!selectedCase.isEdited"
               ref="caseNameInputRef"
               v-on:dblclick="changeCaseNameEditable(selectedCase,  'caseNameInputRef',true)"
               class="cd-left-case-title-box">
            <span class="cd-left-case-title text-ellipsis">{{selectedCase.title}}</span>
          </div>
          <input v-if="selectedCase.isEdited"
                 ref="caseNameInputRef"
                 @input="changeCaseNameText($event, selectedCase)"
                 @blur="changeCaseNameEditable(selectedCase,  'caseNameInputRef', false)"
                 @keyup.enter="changeCaseNameEditable(selectedCase, 'caseNameInputRef',false)"
                 :value="selectedCase.title"
                 class="cd-left-case-title cd-left-case-input text-ellipsis">
          <img @click="openCaseOptionsMenu(167, 'caseNameOptionsRef', selectedCase)"
               ref="caseNameOptionsRef"
               src="@/assets/img/common/selectArrow.svg"
               class="cd-left-case-arrow select-arrow"
               alt="">
        </template>
      </div>
      <div class="cd-right">

      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import CaseMixin from "@/components/mixins/CaseMixin";

export default {
  name: "CaseDiscusBlock",
  mixins: [CaseMixin],
  data: () => ({

  }),
  computed: {
    selectedCase() {
      const foundCase = this.getCaseList()
          .find(_c => _c.isSelected);
      if (foundCase) {
        return foundCase;
      } else {
        return null;
      }
    }
  },
  methods: {
    ...mapGetters(['getCaseList']),

  }
}
</script>