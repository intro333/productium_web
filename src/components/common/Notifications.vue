<template>
  <div class="p-notifications">
    <div class="p-notifications-item-box scroll-y-container">
      <CommentNotify v-for="(_notify, i) in notifications"
                     :key="i"
                     :notify="_notify"
      />
    </div>
    <div class="p-notifications-more-box">
      <p class="p-notifications-more rgb-black-50">загрузить еще</p>
    </div>
  </div>
</template>

<script>
import CommentNotify from "@/components/common/CommentNotify";

export default {
  name: "Notifications",
  props: {
    notifications: Array
  },
  components: {
    CommentNotify
  },
}
</script>