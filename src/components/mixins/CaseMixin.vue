<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "CaseMixin",
  data: () => ({
    cases: [],
    preText: '',
    changeCaseNameEditableState: false,
  }),
  created() {
    this.removeCaseUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'REMOVE_CASE') {
        if (mutation.payload) {
          this.fetchCasesL();
        }
      } else if (mutation.type === 'SET_CASES' || mutation.type === 'PUSH_CASE_FROM_SOCKET' || mutation.type === 'SET_ALL_CASES_STATE') {
        this.fetchCasesL();
      } else if (mutation.type === 'SELECT_CASE') {
        const _case = mutation.payload.case;
        if (_case) {
          this.preText = _case[_case.discusBlockActivityState];
        }
      }
    });
  },
  beforeDestroy() {
    if (this.removeCaseUnsubscribe) {
      this.removeCaseUnsubscribe();
    }
  },
  computed: {
    selectedCase() {
      return  this.getSelectedCase();
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'removeCase', 'removeCaseChild', 'changeCaseStatus', 'caseRename']),
    ...mapGetters(['getCases', 'getSelectedCase']),
    fetchCasesL() {
      const query = this.$route.query;
      if (query && query.slideListId) {
        this.cases = this.getCases()
            .filter(_c => {
              if (_c.caseStatus !== 'archived' && _c.slideListId === query.slideListId) {
                _c.isSelected = _c.id === query.caseId;
                return _c;
              }
            });
      } else {
        this.cases = [];
      }
    },
    changeCaseNameEditable(_case, refStr, state, isMultiple=false, i=0) {
      if (this.changeCaseNameEditableState !== state) {
        this.changeCaseNameEditableState = _case.isEdited = state;
        this.caseRefFocusHandler(_case, refStr, state, isMultiple, i);
        if (!state) {
          this.caseRename();
        }
      }
    },
    caseRefFocusHandler(_case, refStr, state, isMultiple=false, i=0) {
      setTimeout(() => {
        let _ref = this.$refs[refStr];
        if (isMultiple) {
          _ref = _ref[0] ? _ref[0] : null;
        }
        setTimeout(() => {
          if (state && _ref) {
            _ref.focus();
            _ref.select();
          }
          if (!state && _case.title === '') {
            _case.title = 'Case ' + (i+1)
          }
        }, 20)
      }, 20)
    },
    changeCaseNameText($event, _case) {
      const name = $event.target.value;
      if (name.length <= 200) {
        _case.title = name;
      }
    },
    openCaseOptionsMenu(width,
                        _refOptionsStr,
                        _refCaseStr,
                        _caseOrCaseChild,
                        _obj,
                        triangle,
                        isRight,
                        isMultiple=false,
                        i=0) {
      let _ref = this.$refs[_refOptionsStr];
      if (isMultiple) {
        _ref = _ref[0] ? _ref[0] : null;
      }
      if (_ref && _ref.getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref, isRight, width, 8);
        const selectOptions = {
          _case: [
            {
              isItemOfMenu: true,
              title: this.$t('case.statusInWork'),
              isActive: _caseOrCaseChild.caseStatus === 'in-work',
              action: () => {
                this.changeCaseStatus({
                  _case: _caseOrCaseChild,
                  status: 'in-work'
                });
                // _caseOrCaseChild.caseStatus = 'in-work'
              },
            },
            {
              isItemOfMenu: true,
              title: this.$t('case.statusDone'),
              isActive: _caseOrCaseChild.caseStatus === 'done',
              action: () => {
                this.changeCaseStatus({
                  _case: _caseOrCaseChild,
                  status: 'done'
                });
                // _caseOrCaseChild.caseStatus = 'done'
              }
            },
            {
              isItemOfMenu: false,
            },
            {
              isItemOfMenu: true,
              title: this.$t('common.rename'),
              action: () => {
                this.changeCaseNameEditable(_caseOrCaseChild,  _refCaseStr, true, isMultiple, i);
              }
            },
            {
              isItemOfMenu: true,
              title: this.$t('common.delete'),
              action: () => {
                this.removeCase(_caseOrCaseChild);
              }
            },
          ],
          _caseChild: [
            {
              isItemOfMenu: true,
              title: this.$t('common.delete'),
              action: () => {
                this.removeCaseChild({
                  caseChild: _caseOrCaseChild,
                  removeOnlyOnCanvas: false
                });
              }
            },
          ]
        }
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                'SelectPopup',
                width,
                modalPosition.top,
                modalPosition.left,
                triangle,
                {
                  selectOptions: selectOptions[_obj],
                  subject: _obj
                },
                i)
            .more({
              isRight,
              zIndex: 8
            })
        );
      }
    },
  },
  watch: {
    $route() {
      this.fetchCasesL();
    }
  }
}
</script>
