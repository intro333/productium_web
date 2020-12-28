<script>
export default {
  name: "CommonMixin",
  data() {
    return {
      EventListenerEnterEsc: null,
      EventListenerCtrl: null,
    }
  },
  methods: {
    keyUpEnterEscEvent(enter, esc) {
      const EventListenerEnterEsc = this.EventListenerEnterEsc = (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          enter();
        } else if (event.code === 'Escape') {
          esc();
        }
      };
      document.addEventListener('keyup', EventListenerEnterEsc, true);
    },
    keyUpEnterEscEventRemove() {
      document.removeEventListener('keyup', this.EventListenerEnterEsc, true);
      this.EventListenerEnterEsc = null;
    },
    keyUpCtrlEvent(ctrl) {
      const EventListenerCtrl = this.EventListenerCtrl = (event) => {
        if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
          ctrl();
        }
      };
      document.addEventListener('keyup', EventListenerCtrl, true);
    },
    keyUpCtrlEventRemove() {
      document.removeEventListener('keyup', this.EventListenerCtrl, true);
      this.EventListenerCtrl = null;
    },
    goToInit() {
      this.$router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1');
    }
  },
}
</script>