<template>
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
                  @click="changeCaseDiscusTextareaEdited(true)"
                  @keyup.esc="changeCaseDiscusTextareaEdited(false)"
                  @blur="changeCaseDiscusTextareaEdited(false)"
                  @input="changeCaseDiscusTextareaText"
                  :value="selectedCase[selectedCase.discusBlockActivityState]"
                  class="cd-b-edit-area-text p-textarea-custom scroll-textarea"
                  :readonly="!selectedCase.isDiscusEdited"
                  :class="{'ea-readonly': !selectedCase.isDiscusEdited}"
                  :placeholder="`Опишите ${(selectedCase.discusBlockActivityState === 'discus') ? 'задачу' : 'решение'}...`"></textarea>
      </div>
      <div class="cd-b-comments">
        <div v-if="selectedCase"
             class="cd-b-comments-box">
          <span class="cd-b-comments-text">{{readCasesComments.length}}<span class="cd-b-comments-text-link"
          >+{{notReadCasesComments.length}}</span></span>
          <span @click="openCommentModal()"
                class="cd-b-comments-text cd-b-comments-text-clickable">comments</span>
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
    ]
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
    },
    changeCaseDiscusTextareaEdited(_state) {
      this.selectedCase.isDiscusEdited = _state;
    },
    changeCaseDiscusTextareaText($event) {
      const text = $event.target.value;
      this.selectedCase[this.discusBlockActivityState] = text;
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