<template>
  <div @click="goToSlideAndCaseL()"
       class="p-notifications-item"
       :class="{'rgb-base-10' : notify.notifyInfo.status === 'notRead'}">
    <div class="nf-header">
      <div class="nf-header-user-icon"
           :style="{'background-color': notify.user.color}">{{notify.user.shortName}}</div>
      <div class="nf-header-user-name">{{notify.user.fullName}}</div>
    </div>
    <p class="nf-short-info nf-date-time rgb-black-50">{{getNotifyDateTime(notify.updatedAt)}}</p>
    <p class="nf-short-info nf-slide-name rgb-black-50">слайд {{slideOrder+1}}</p>
    <textarea class="nf-comment p-textarea-custom tc-disabled"
              readonly disabled
              cols="181"
              rows="2"
              :value="notify.message.substr(0, 50)"></textarea>
  </div>
</template>

<script>
import {getDefaultDateFormat} from "@/functions/date";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "CommentNotify",
  props: {
    notify: Object
  },
  computed: {
    slideOrder() {
      const foundSlide = this.getSlides().find(_s => _s.id === this.notify.slideId);
      if (foundSlide) {
        return foundSlide.order;
      }
      return 0;
    },
  },
  methods: {
    ...mapActions(['goToSlideAndCase']),
    ...mapGetters(['getSlides']),
    getNotifyDateTime(dateTime) {
      return getDefaultDateFormat(dateTime);
    },
    goToSlideAndCaseL() {
      this.notify.notifyInfo.status = 'read';
      this.goToSlideAndCase(this.notify);
    },
  },
}
</script>