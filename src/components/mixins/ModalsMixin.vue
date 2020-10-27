<script>
import {TooltipModel} from "@/models/modals/TooltipModel";
import {mapActions, mapGetters} from "vuex";
import {getModalPositionFunc} from "@/functions/calculations";

export default {
  name: "ModalsMixin",
  data: () => ({
    isItemMenuHovered: false,
    showTooltipTimeout: null,
  }),
  computed: {
    tp() {
      return this.getTooltip();
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'setTooltip']),
    ...mapGetters(['getContextMenuBase', 'getTooltip']),
    showTooltip($event, _refStr, title, isRefOfItem = false) {

      this.isItemMenuHovered = true;
      const timeout = this.tp.state ? 0 : 1000;
      this.showTooltipTimeout = setTimeout(() => {
        if (this.$refs[_refStr]) {
          let _ref = null;
          if (isRefOfItem && this.$refs[_refStr][0]) {
            _ref = this.$refs[_refStr][0];
          } else {
            _ref = this.$refs[_refStr];
          }
          if (this.isItemMenuHovered && _ref.getBoundingClientRect()) {
            const modalPosition = getModalPositionFunc(_ref);
            this.setTooltip(new TooltipModel()
                .set(true,
                    modalPosition.top,
                    modalPosition.left,
                    title)
            );
          }
        }
      }, timeout)
    },
    hideToolTip() {
      this.isItemMenuHovered = false;
      clearTimeout(this.showTooltipTimeout);
      setTimeout(() => {
        if (!this.isItemMenuHovered) {
          this.setTooltip(new TooltipModel());
        }
      }, 200)
    },
  }
}
</script>