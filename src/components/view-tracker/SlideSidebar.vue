<template>
  <div class="slide-sidebar-container">
    <div class="slide-sidebar">
      <SlideItem v-for="(_slide, i) in slides"
                 :slide="_slide"
                 :key="i"
                 :cKey="i"
                 :slidesLength="slidesLength"
                 :cases="cases"
      />
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
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import SlideItem from "@/components/view-tracker/part/SlideItem";
import SlideMixin from "@/components/mixins/SlideMixin";

export default {
  name: "SlideSidebar",
  mixins: [SlideMixin],
  components: {
    SlideItem
  },
  computed: {
    slidesLength() {
      return this.slides.length;
    },
    cases() {
      return this.getCases()
          .filter(_c => _c.caseStatus !== 'archived');
      // TODO Можно к кейсам добавить projectId, чтобы не фильтровать все кейсы всех проектов (здесь и в других местах так же)
    },
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'pushSlide']),
    ...mapGetters(['getCases']),
    addSlide() {
      this.pushSlide();
    },
  },
}
</script>