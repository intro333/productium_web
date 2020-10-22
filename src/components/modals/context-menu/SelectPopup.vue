<template>
  <div class="cm-list">
    <SelectPopupItem v-for="(item, i) in cm.body.selectOptions"
                     :key="i"
                     :item="item"
                     :isActive="item.isActive"
                     :dontShowIsActive="item.dontShowIsActive" />
  </div>
</template>

<script>
import SelectPopupItem from "@/components/includes/SelectPopupItem";

export default {
  name: "SelectPopup",
  props: ['contextMenu'],
  components: {
    SelectPopupItem
  },
  computed: {
    cm() {
      return this.contextMenu();
    }
  }
}
</script>