<script>
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";

export default {
  name: "CaseMixin",
  methods: {
    ...mapActions(['setContextMenuBase']),
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
                      isActive: _case.status === 'in-work',
                      action: () => {
                        _case.status = 'in-work'
                      },
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Готово',
                      isActive: _case.status === 'done',
                      action: () => {
                        _case.status = 'done'
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

                      }
                    },
                  ]
                })
            .more({
              isRight
            })
        );
      }
    },
  }
}
</script>