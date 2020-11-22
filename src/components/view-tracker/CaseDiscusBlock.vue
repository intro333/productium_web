<template>
  <div class="case-discus">
    <div class="case-discus-header">
      <CaseNameWithStatusAndOptions :selectedCase="selectedCase" />
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
                  class="cd-b-edit-area-text p-textarea-custom scroll-textarea"
                  :readonly="!selectedCase.isDiscusEdited"
                  :class="{'ea-readonly': !selectedCase.isDiscusEdited}"
                  placeholder="Опишите задачу..."></textarea>
      </div>
      <div class="cd-b-comments">
        <div class="cd-b-comments-box">
          <span class="cd-b-comments-text">14<span class="cd-b-comments-text-link"
          >+3</span></span>
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
    ...mapActions(['setCentralModal']),
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
    openCommentModal() {
      this.setCentralModal(
          new CentralModalModel()
              .set(true,
                  'CommentsModal',
                  400,
                  {
                    comments: [
                      {
                        id: 100,
                        message: 'Привет. Здесь надо поменять скругление и может вообще убрать stroke.',
                        user: {
                          fullName: 'Dmitry Kolunov',
                          shortName: 'DK',
                          color: '#FF2727',
                        },
                        updatedAt: '2020-10-27 18:24:45',
                        children: [
                          {
                            id: 101,
                            message: 'И тебе привет. я думаю можно сделать как здесь тогда https://ru.wikipedia.org/wiki/Google_%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA',
                            user: {
                              fullName: 'Genom 89',
                              shortName: '',
                              color: '#b2b2b2',
                            },
                            updatedAt: '2020-10-28 17:36:49',
                          }
                        ]
                      },
                      {
                        id: 102,
                        message: 'Привет. Здесь надо поменять скругление и может вообще убрать stroke.',
                        user: {
                          fullName: 'Dmitry Kolunov',
                          shortName: 'DK',
                          color: '#FF2727',
                        },
                        updatedAt: '2020-10-29 00:36:14',
                        images: [
                          {
                            id: 15,
                            src: '',
                            orientation: 'portrait'
                          }
                        ],
                        children: [
                          {
                            id: 103,
                            message: 'Привет. Здесь надо поменять.',
                            user: {
                              fullName: 'Dmitry Kolunov',
                              shortName: 'DK',
                              color: '#FF2727',
                            },
                            updatedAt: '2020-10-29 01:36:15',
                            children: []
                          },
                          {
                            id: 104,
                            message: 'Привет. Здесь надо .',
                            user: {
                              fullName: 'Genom 89',
                              shortName: 'DK',
                              color: '#b2b2b2',
                            },
                            updatedAt: '2020-10-29 01:37:15',
                            children: []
                          },
                        ]
                      }
                    ]
                  })
      );
    }
  }
}
</script>