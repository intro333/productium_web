<template>
  <div class="case-discus">
    <div class="case-discus-header">
      <div class="cd-left">
        <template v-if="selectedCase">
          <div class="cd-left-case-status"
               :class="{[selectedCase.status]: true}"></div>
          <div v-if="!selectedCase.isEdited"
               ref="caseNameInputRef"
               v-on:dblclick="changeCaseNameEditable(true)"
               class="cd-left-case-title-box">
            <span class="cd-left-case-title text-ellipsis">{{selectedCase.title}}</span>
          </div>
          <input v-if="selectedCase.isEdited"
                 ref="caseNameInputRef"
                 @input="changeCaseNameText($event)"
                 @blur="changeCaseNameEditable(false)"
                 @keyup.enter="changeCaseNameEditable(false)"
                 :value="selectedCase.title"
                 class="cd-left-case-title cd-left-case-input text-ellipsis">
          <img src="@/assets/img/common/selectArrow.svg"
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

export default {
  name: "CaseDiscusBlock",
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
    changeCaseNameEditable(state) {
      this.selectedCase.isEdited = state;
      this.caseRefFocusHandler(state);
    },
    caseRefFocusHandler(state) {
      setTimeout(() => {
        const _ref = this.$refs['caseNameInputRef'];
        if (state && _ref) {
          _ref.focus();
        }
        if (!state && this.selectedCase.title === '') {
          this.selectedCase.title = 'Case ' + this.selectedCase.id
        }
      }, 20)
    },
    changeCaseNameText($event) {
      const name = $event.target.value;
      if (name.length <= 200) {
        this.selectedCase.title = name;
      }
    },
  }
}
</script>