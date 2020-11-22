<template>
  <div class="p-notifications">
    <div class="p-notifications-item-box scroll-y-container">
      <div v-for="(_notify, i) in notifications"
           :key="i"
           @click="goToSlideAndCase(_notify)"
           class="p-notifications-item"
           :class="{'rgb-base-10' : _notify.status === 'notRead'}">
        <div class="nf-header">
          <div class="nf-header-user-icon"
               :style="{'background-color': _notify.user.color}">{{_notify.user.shortName}}</div>
          <div class="nf-header-user-name">{{_notify.user.fullName}}</div>
        </div>
        <p class="nf-short-info nf-date-time rgb-black-50">{{getNotifyDateTime(_notify.updated_at)}}</p>
        <p class="nf-short-info nf-slide-name rgb-black-50">слайд {{_notify.slideOrder+1}}</p>
        <textarea class="nf-comment p-textarea-custom tc-disabled"
                  readonly disabled
                  cols="181"
                  rows="2"
                  :value="_notify.comment"></textarea>
      </div>
    </div>
    <div class="p-notifications-more-box">
      <p class="p-notifications-more rgb-black-50">загрузить еще</p>
    </div>
  </div>
</template>

<script>
import {getDefaultDateFormat} from "@/functions/date";

export default {
  name: "Notifications",
  props: {
    notifications: Array
  },
  data: () => ({

  }),
  methods: {
    getNotifyDateTime(dateTime) {
      return getDefaultDateFormat(dateTime);
    },
    goToSlideAndCase(_notify) {
      _notify.status = 'read';
    },
  },
}
</script>