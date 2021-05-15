
<script>
export default {
  name: "LocaleMixin",
  methods: {
    changeLocale(locale) {
      this.$root.$i18n.locale = locale;
    }
  }
}
</script>