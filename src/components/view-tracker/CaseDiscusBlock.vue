<template>
  <div class="case-discus">
    <div class="case-discus-header">
      <div class="cd-h-left">
        <template v-if="selectedCase">
          <div class="cd-h-left-case-status"
               :class="{[selectedCase.status]: true}"></div>
          <div v-if="!selectedCase.isEdited"
               ref="caseNameInputRef"
               v-on:dblclick="changeCaseNameEditable(selectedCase,  'caseNameInputRef',true)"
               class="cd-h-left-case-title-box">
            <span class="cd-h-left-case-title text-ellipsis">{{selectedCase.title}}</span>
          </div>
          <input v-if="selectedCase.isEdited"
                 ref="caseNameInputRef"
                 @input="changeCaseNameText($event, selectedCase)"
                 @blur="changeCaseNameEditable(selectedCase,  'caseNameInputRef', false)"
                 @keyup.enter="changeCaseNameEditable(selectedCase, 'caseNameInputRef',false)"
                 :value="selectedCase.title"
                 class="cd-h-left-case-title cd-h-left-case-input text-ellipsis">
          <img v-if="!selectedCase.isEdited"
               @click="openCaseOptionsMenu(167, 'caseNameOptionsRef', 'caseNameInputRef',
               selectedCase, 'down', false)"
               ref="caseNameOptionsRef"
               src="@/assets/img/common/selectArrow.svg"
               class="cd-h-left-case-arrow select-arrow"
               alt="">
        </template>
      </div>
      <div class="cd-h-right">
        <div v-for="(_item, i) in discusBlockButtons"
             :key="i"
             @click="selectDiscusBlockActivity(_item.discusBlockActivityState)"
             class="p-text-box">
          <span class="cd-h-right-item"
                :class="{active: isActiveDiscusBlockActivityState(_item.discusBlockActivityState)}"
          >{{_item.title}}</span>
        </div>
      </div>
    </div>
    <div class="case-discus-body">
      <div class="cd-b-edit-area">
        <textarea ref="caseDiscusTextareaRef"
                  @click="changeCaseDiscusTextareaEdited(true)"
                  @keyup.esc="changeCaseDiscusTextareaEdited(false)"
                  @blur="changeCaseDiscusTextareaEdited(false)"
                  @input="changeCaseDiscusTextareaText"
                  :value="selectedCase[discusBlockActivityState]"
                  class="cd-b-edit-area-text p-textarea-custom"
                  :readonly="!selectedCase.isDiscusEdited"
                  :class="{'ea-readonly': !selectedCase.isDiscusEdited}"
                  placeholder="Опишите задачу..."></textarea>
      </div>
      <div class="cd-b-comments">
        <div class="cd-b-comments-box">
          <span class="cd-b-comments-text">14<span class="cd-b-comments-text-link"
          >+3</span></span>
          <span class="cd-b-comments-text cd-b-comments-text-clicable">comments</span>
        </div>
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
    discusBlockActivityState: 'discus',
    discusBlockButtons: [
      {
        title: 'обсуждение',
        discusBlockActivityState: 'discus'
      },
      {
        title: 'решение',
        discusBlockActivityState: 'resolut'
      },
    ]
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
    isActiveDiscusBlockActivityState(_state) {
      return this.selectedCase.discusBlockActivityState === _state;
    },
    selectDiscusBlockActivity(_state) {
      this.selectedCase.discusBlockActivityState = _state;
      this.discusBlockActivityState = _state;
    },
    changeCaseDiscusTextareaEdited(_state) {
      this.selectedCase.isDiscusEdited = _state;
    },
    changeCaseDiscusTextareaText($event) {
      const text = $event.target.value;
      this.selectedCase[this.discusBlockActivityState] = text;
    },
  }
}
</script>