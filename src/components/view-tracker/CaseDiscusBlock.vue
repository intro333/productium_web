<template>
  <div class="case-discus-container">
    <div class="case-discus">
      <div class="case-discus-header">
        <CaseNameWithStatusAndOptions />
        <div class="cd-h-right">
          <div v-for="(_item, i) in discusBlockButtons"
               :key="i"
               @click="selectDiscusBlockActivity(_item.discusBlockActivityState)"
               class="p-text-box">
          <span v-if="selectedCase"
                class="cd-h-right-item"
                :class="{active: isActiveDiscusBlockActivityState(_item.discusBlockActivityState)}"
          >{{_item.title}}</span>
          </div>
        </div>
      </div>
      <div class="case-discus-body">
        <div class="cd-b-edit-area">
        <textarea v-if="selectedCase"
                  ref="caseDiscusTextareaRef"
                  @click="changeCaseDiscusTextareaEdited($event, true)"
                  @keyup.enter="changeCaseDiscusTextareaEdited($event, false)"
                  @keyup.esc="changeCaseDiscusTextareaEdited($event, false)"
                  @blur="changeCaseDiscusTextareaEdited($event, false)"
                  @input="changeCaseDiscusTextareaText"
                  :value="selectedCase[selectedCase.discusBlockActivityState]"
                  class="cd-b-edit-area-text p-textarea-custom scroll-textarea"
                  :readonly="!selectedCase.isDiscusEdited"
                  :class="{'ea-readonly': !selectedCase.isDiscusEdited,
                           'ea-edited': selectedCase.isDiscusEdited,
                  }"
                  :placeholder="`Опишите ${(selectedCase.discusBlockActivityState === 'discus') ? 'задачу' : 'решение'}...`"></textarea>
        </div>
        <div class="cd-b-comments">
          <div v-if="selectedCase"
               @click="openCommentModal()"
               class="cd-b-comments-box">
          <span class="cd-b-comments-text">{{readCasesComments.length}}<span v-if="notReadCasesComments.length"
                                                                             class="cd-b-comments-text-link"
          >+{{notReadCasesComments.length}}</span>
          </span>
            <span class="cd-b-comments-text">comments</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import CaseMixin from "@/components/mixins/CaseMixin";
import CaseNameWithStatusAndOptions from "@/components/includes/CaseNameWithStatusAndOptions";
import {CentralModalModel} from "@/models/modals/CentralModalModel";

export default {
  name: "CaseDiscusBlock",
  components: {CaseNameWithStatusAndOptions},
  mixins: [CaseMixin],
  data: () => ({
    discusBlockButtons: [
      {
        title: 'обсуждение',
        discusBlockActivityState: 'discus'
      },
      {
        title: 'решение',
        discusBlockActivityState: 'resolut'
      },
    ],
  }),
  computed: {
    casesComments() {
      return this.getCasesComments().filter(_c =>
          _c.caseId === this.selectedCase.id);
    },
    readCasesComments() {
      return this.casesComments.filter(_c => _c.notifyInfo.status === 'read' ||
          _c.notifyInfo.status === 'fromCurrentUser');
    },
    notReadCasesComments() {
      return this.casesComments.filter(_c => _c.notifyInfo.status === 'notRead');
    },
  },
  methods: {
    ...mapActions(['setCentralModal']),
    ...mapGetters(['getCasesComments']),
    isActiveDiscusBlockActivityState(_state) {
      return this.selectedCase.discusBlockActivityState === _state;
    },
    selectDiscusBlockActivity(_state) {
      this.selectedCase.discusBlockActivityState = _state;
      this.preText = this.selectedCase[this.selectedCase.discusBlockActivityState];
    },
    changeCaseDiscusTextareaEdited($event, _state) {
      if ($event) {
        const eType = $event.type;
        if (eType === 'keyup') { /* Нажали на клавишу */
          const eCode = $event.code;
          if (eCode === 'Enter' || eCode === 'NumpadEnter') {
            if (!$event.shiftKey) {
              this.selectedCase.isDiscusEdited = _state;
              this.saveDiscuseText(true);
            }
          } else if (eCode === 'Escape') {
            this.selectedCase.isDiscusEdited = _state;
          }
        } else if (eType === 'blur' && this.selectedCase.isDiscusEdited) { /* Ушли из поля (щёлкнув мышкой вне поля) */
          this.selectedCase.isDiscusEdited = _state;
          this.saveDiscuseText();
        } else if (eType === 'click') {
          this.selectedCase.isDiscusEdited = _state;
        }
      }
    },
    changeCaseDiscusTextareaText($event) {
      this.preText = $event.target.value;
    },
    saveDiscuseText(isEnter=false) {
      if (isEnter) { /* Удалить перенос строки */
        this.preText = this.preText.substring(0, this.preText.lastIndexOf("\n"));
      }
      const textarea = this.$refs.caseDiscusTextareaRef;
      if (textarea) { /* Проскроллить textarea вверх */
        textarea.scrollTop = 0;
      }
      this.selectedCase[this.selectedCase.discusBlockActivityState] = this.preText;
    },
    openCommentModal() {
      this.setCentralModal(
          new CentralModalModel()
              .set(true,
                  'CommentsModal',
                  400));
    }
  }
}
</script>