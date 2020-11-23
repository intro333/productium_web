<template>
  <div class="sl-b-box">
    <span class="sl-b-num">{{cKey+1}}</span>
    <div @click="selectSlide(slide)"
         class="sl-b-slide"
         :class="['sl-b-slide-' + slide.slideState, slide.isSelected && 'sl-b-slide-active']">
      <div class="sl-b-slide-bg"
           :class="['sl-b-slide-bg-' + slide.slideState]">
        <img src="@/assets/img/case-tracker/slide-sidebar/noImage.svg"
             class="sl-b-slide-bg-img"
             alt="">
      </div>
      <div v-if="slide.isNotify"
           class="notify-circle sl-b-slide-notify"
           :class="{'of-selected': slide.isSelected}"></div>
    </div>
    <img @click="openOptionsMenu(134, 'optionsRef')"
         :ref="'optionsRef'"
         src="@/assets/img/common/options.svg"
         class="sl-b-options"
         alt="">
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {getModalPositionFunc} from "@/functions/calculations";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";

export default {
  name: "SlideItem",
  props: {
    slide: Object,
    cKey: Number,
    slidesLength: Number
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'removeSlide', 'selectSlide']),
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
                      title: 'Удалить',
                      dontShowIsActive: true,
                      action: () => {
                        this.removeSlide({
                          slide: this.slide,
                          slidesLength: this.slidesLength
                        });
                      },
                    },
                    {
                      isItemOfMenu: true,
                      title: 'Дублировать',
                      dontShowIsActive: true,
                      action: () => {

                      }
                    }
                  ]
                })
        );
      }
    },
  }
}
</script>
