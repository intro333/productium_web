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
    showTooltip($event, _refStr, title) {
      this.isItemMenuHovered = true;
      const timeout = this.tp.state ? 0 : 1000;
      this.showTooltipTimeout = setTimeout(() => {
        if (this.isItemMenuHovered && (this.$refs[_refStr] &&
            this.$refs[_refStr].getBoundingClientRect())) {
          const modalPosition = getModalPositionFunc(this.$refs[_refStr]);
          this.setTooltip(new TooltipModel()
              .set(true,
                  modalPosition.top,
                  modalPosition.left,
                  title)
          );
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