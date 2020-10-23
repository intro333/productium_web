<template>
  <div class="slide-sidebar">
    <div v-for="(_slide, i) in slides"
         :key="i"
         class="sl-b-box">
      <span class="sl-b-num">{{i+1}}</span>
      <div @click="selectSlide(_slide)"
           class="sl-b-slide"
           :class="['sl-b-slide-' + _slide.status, _slide.isSelected && 'sl-b-slide-active']">
        <div class="sl-b-slide-bg"
             :class="['sl-b-slide-bg-' + _slide.status]">
          <img src="@/assets/img/case-tracker/slide-sidebar/noImage.svg"
               class="sl-b-slide-bg-img"
               alt="">
        </div>
        <div v-if="_slide.isNotify"
             class="notify-circle sl-b-slide-notify"
             :class="{'of-selected': _slide.isSelected}"></div>
      </div>
      <img @click="openOptionsMenu(134, 'optionsRef', i)"
           :ref="'optionsRef_' + i"
           src="@/assets/img/common/options.svg"
           class="sl-b-options"
           alt="">
    </div>
    <div class="sl-b-add">
      <div @click="addSlide"
           class="sl-b-add-content">
        <div class="sl-b-add-content-button">
          <img src="@/assets/img/case-tracker/slide-sidebar/plus.svg"
               class="sl-b-add-content-button-img"
               alt="">
        </div>
        <span class="sl-b-add-content-text">Добавить слайд</span>
      </div>
    </div>
  </div>
</template>

<script>
import {getModalPositionFunc, getRandomInt} from "@/functions/calculations";
import {copyStructureDefaultState} from "@/functions/convertation";
import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {mapActions} from "vuex";

export default {
  name: "SlideSidebar",
  data: () => ({
    initSlide: {
      id: 1,
      status: 'in-work',
      isSelected: false,
      isNotify: false
    },
    slides: [
      {
        id: 1,
        status: 'in-work',
        isSelected: false,
        isNotify: false
      },
      {
        id: 2,
        status: 'done',
        isSelected: false,
        isNotify: false
      },
      {
        id: 4,
        status: 'in-work',
        isSelected: true,
        isNotify: true
      },
      {
        id: 5,
        status: 'in-work',
        isSelected: false,
        isNotify: true
      },
    ]
  }),
  methods: {
    ...mapActions(['setContextMenuBase']),
    selectSlide(slide) {
      this.slides.forEach(_sl => {
        _sl.isSelected = _sl.id === slide.id;
      });
    },
    addSlide() {
      const newSlide = copyStructureDefaultState(this.initSlide);
      newSlide.id = getRandomInt(10, 1000);
      this.slides.push(newSlide);
      setTimeout(() => {
        this.selectSlide(newSlide);
      }, 20)
    },
    openOptionsMenu(width, _refStr, i) {
      const _ref = this.$refs['optionsRef_' + i];
      if (_ref && _ref[0] && _ref[0].getBoundingClientRect()) {
        const modalPosition = getModalPositionFunc(_ref[0]);
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