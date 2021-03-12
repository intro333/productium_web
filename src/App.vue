<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth; /* Поведение прокрутки для любого элемента на странице (smooth - плавно) */
}
html,
body {
  height: 100%;
  line-height: 1.15 !important;
  input {
    font-family: Inter, sans-serif;
    //letter-spacing: .6px;
  }
  input[type=file], /* FF, IE7+, chrome (except button) */
  input[type=file]::-webkit-file-upload-button { /* chromes and blink button */
    cursor: pointer;
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
