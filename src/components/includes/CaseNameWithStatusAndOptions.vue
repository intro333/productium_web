<template>
  <div class="case-info">
    <div class="case-info-case-status"
         :class="{[selectedCase.caseStatus]: true}"></div>
    <div v-if="!selectedCase.isEdited"
         ref="caseNameInputRef"
         v-on:dblclick="changeCaseNameEditable(selectedCase,  'caseNameInputRef',true)"
         class="case-info-case-title-box">
      <span class="case-info-case-title text-ellipsis"
            :class="{'case-info-case-title-black': isBlack}"
      >{{selectedCase.title}}</span>
    </div>
    <input v-if="selectedCase.isEdited"
           ref="caseNameInputRef"
           @input="changeCaseNameText($event, selectedCase)"
           @blur="changeCaseNameEditable(selectedCase,  'caseNameInputRef', false)"
           @keyup.enter="changeCaseNameEditable(selectedCase, 'caseNameInputRef',false)"
           :value="selectedCase.title"
           class="case-info-case-title case-info-case-input text-ellipsis"
           :class="{'case-info-case-title-black': isBlack}">
    <img v-if="!selectedCase.isEdited"
         @click="openCaseOptionsMenu(167, 'caseNameOptionsRef', 'caseNameInputRef',
               selectedCase, 'down', false)"
         ref="caseNameOptionsRef"
         :src="arrowImg()"
         class="case-info-case-arrow select-arrow"
         :style="{opacity: isBlack ? 1 : .7}"
         alt="">
  </div>
</template>

<script>
import CaseMixin from "@/components/mixins/CaseMixin";

export default {
  name: "CaseNameWithStatusAndOptions",
  props: ['selectedCase', 'isBlack'],
  mixins: [CaseMixin],
  data: () => ({
    
  }),
  methods: {
    arrowImg() {
      const img = this.isBlack ? 'selectArrowGrey' : 'selectArrow';
      return require('@/assets/img/common/' + img + '.svg');
    }
  }
}
</script>
