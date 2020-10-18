<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  line-height: 1.15 !important;
  input {
    font-family: Inter, sans-serif;
    //letter-spacing: .6px;
  }
  &.modal-open {
    overflow: hidden;
    &-mobile {
      position: fixed;
    }
  }
}
#app {
  font-family: Inter, sans-serif;
}
</style>
