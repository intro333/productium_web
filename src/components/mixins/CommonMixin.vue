<script>
export default {
  name: "CommonMixin",
  data() {
    return {
      EventListenerObj: null
    }
  },
  methods: {
    keyUpEnterEscEvent(enter, esc) {
      const EventListenerObj = this.EventListenerObj = (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          enter();
        } else if (event.code === 'Escape') {
          esc();
        }
      }
      document.addEventListener('keyup', EventListenerObj, true);
    },
    keyUpEnterEscEventRemove() {
      document.removeEventListener('keyup', this.EventListenerObj, true);
      this.EventListenerObj = null;
    }
  },
}
</script>