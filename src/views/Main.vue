<template>
  <div class="app-content">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Main",
  components: {

  },
  computed: {

  },
  created() {

  },
  methods: {
    ...mapActions([]),
    ...mapGetters([]),
  },
}
</script>

<style lang="scss">
  .app-content {
    //background-color: #fff;
  }
</style>