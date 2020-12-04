<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "CaseMixin",
  data: () => ({
    cases: [],
  }),
  created() {
    this.removeCaseUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'REMOVE_CASE') {
        if (mutation.payload) {
          this.fetchCasesL();
        }
      } else if (mutation.type === 'SET_CASES') {
        this.fetchCasesL();
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
      return this.getSelectedCase();
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'removeCase']),
    ...mapGetters(['getCases', 'getSelectedCase']),
    fetchCasesL() {
      const query = this.$route.query;
      if (query && query.slideListId) {
        this.cases = this.getCases()
            .filter(_c => {
              if (_c.caseStatus !== 'archived' && _c.slideListId === parseInt(query.slideListId)) {
                _c.isSelected = _c.id === parseInt(query.caseId);
                return _c;
              }
            });
      } else {
        this.cases = [];
      }
    },
    changeCaseNameEditable(_case, refStr, state, isMultiple=false, i=0) {
      _case.isEdited = state;
      this.caseRefFocusHandler(_case, refStr, state, isMultiple, i);
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
                        _case,
                        triangle,
                        isRight,
                        isMultiple=false,
                        i=0) {
      let _ref = this.$refs[_refOptionsStr];
      if (isMultiple) {
        _ref = _ref[0] ? _ref[0] : null;
      }
      if (_ref && _ref.getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref, isRight, width);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                'SelectPopup',
                width,
                modalPosition.top,
                modalPosition.left,
                triangle,
                {
                  selectOptions: [
                    {
                      isItemOfMenu: true,
                      title: 'В работе',
                      isActive: _case.caseStatus === 'in-work',
                      action: () => {
                        _case.caseStatus = 'in-work'
                      },
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Готово',
                      isActive: _case.caseStatus === 'done',
                      action: () => {
                        _case.caseStatus = 'done'
                      }
                    },
                    {
                      isItemOfMenu: false,
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Переименовать',
                      action: () => {
                        this.changeCaseNameEditable(_case,  _refCaseStr, true, isMultiple, i);
                      }
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Удалить',
                      action: () => {
                        this.removeCase(_case);
                      }
                    },
                  ]
                })
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