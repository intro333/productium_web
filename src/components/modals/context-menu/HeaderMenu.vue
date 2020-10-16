<template>
  <div class="cm-list">
    <div class="cm-list-item">
      <span class="cm-list-item-text">Файл</span>
      <img src="@/assets/img/common/context-menu-arrow.svg"
           class="cm-list-item-arrow"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderMenu",
  props: ['body'],
}
</script>