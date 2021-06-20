<template>
  <div @mouseover="showSlideOptions(true)"
       @mouseleave="showSlideOptions(false)"
       class="sl-b-box">
    <span class="sl-b-num">{{cKey+1}}</span>
    <div @click="selectSlide(slide)"
         class="sl-b-slide"
         :class="['sl-b-slide-' + slideState, slide.isSelected && 'sl-b-slide-active']">
      <div class="sl-b-slide-bg"
           :class="['sl-b-slide-bg-' + slideState]">
        <img v-if="!slide.img"
             src="@/assets/img/case-tracker/slide-sidebar/noImage.svg"
             class="sl-b-slide-bg-no-img"
             alt="">
        <img v-if="slide.img"
             :src="slide.imgBase64"
             class="sl-b-slide-bg-img"
             alt="">
      </div>
      <div v-if="isNotify"
           class="notify-circle sl-b-slide-notify"
           :class="{'of-selected': slide.isSelected}"></div>
    </div>
    <div v-if="isShowSlideOptions || (contextMenu.state && contextMenu.cKey === cKey &&
      (contextMenu.body) && contextMenu.body.subject === 'slide')"
         @click="openOptionsMenu(134, 'optionsRef')"
         class="sl-b-options-box">
      <img src="@/assets/img/common/options.svg"
           :ref="'optionsRef'"
           class="sl-b-options"
           alt="">
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";

export default {
  name: "SlideItem",
  props: {
    slide: Object,
    cKey: Number,
    slidesLength: Number,
    cases: Array
  },
  data: () => ({
    isShowSlideOptions: false,
  }),
  computed: {
    contextMenu() {
      return this.getContextMenuBase();
    },
    casesComments() {
      return this.getCasesComments().filter(_c =>
          _c.slideId === this.slide.id);
    },
    isNotify() {
      const result = this.casesComments.find(_c => _c.notifyInfo.status === 'notRead');
      return !!result;
    },
    slideCases() {
      return this.cases.filter(_c => _c.slideId === this.slide.id);
    },
    slideIsWork() {
      return this.slideCases.filter(_c =>
          _c.caseStatus === 'in-work')
          .length;
    },
    slideState() {
      if (this.slideCases.length) {
        return this.slideIsWork ? 'in-work' : 'done';
      } else {
        return 'empty';
      }
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'removeSlide', 'selectSlide']),
    ...mapGetters(['getCasesComments', 'getContextMenuBase']),
    openOptionsMenu(width, _refStr) {
      const _ref = this.$refs[_refStr];
      if (_ref && _ref.getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref);
        this.setContextMenuBase(new ContextMenuBaseModel()
            .set(true,
                'SelectPopup',
                width,
                modalPosition.top,
                modalPosition.left,
                'up',
                {
                  selectOptions: [
                    {
                      isItemOfMenu: true,
                      title: this.$t('common.delete'),
                      dontShowIsActive: true,
                      action: () => {
                        this.removeSlide({
                          slide: this.slide,
                          slidesLength: this.slidesLength
                        });
                      },
                    },
                    // {
                    //   isItemOfMenu: true,
                    //   title: 'Дублировать',
                    //   dontShowIsActive: true,
                    //   action: () => {
                    //
                    //   }
                    // }
                  ],
                  subject: 'slide'
                },
                this.cKey)
        );
      }
    },
    showSlideOptions(_state) {
      this.isShowSlideOptions = _state;
    }
  }
}
</script>
