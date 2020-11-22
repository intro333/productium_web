<template>
  <div class="slide-sidebar">
    <SlideItem v-for="(_slide, i) in slides"
               :slide="_slide"
               :key="i"
               :cKey="i"
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
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {slidesOfProjectFilter} from "@/functions/case-tracker/projectsF";
import SlideItem from "@/components/view-tracker/part/SlideItem";

export default {
  name: "SlideSidebar",
  components: {
    SlideItem
  },
  data: () => ({
    projectId: 0,
  }),
  created() {
    const query = this.$route.query;
    if (query) {
      if (query.projectId) { this.projectId = query.projectId }
      // if (query.slideId) {  }
    }
  },
  computed: {
    slides() {
      const query = this.$route.query;
      if (query && query.projectId) {
        return slidesOfProjectFilter(this.getSlides(),
            parseInt(query.projectId));
      }
      return [];
    }
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'pushSlide']),
    ...mapGetters(['getSlides']),
    addSlide() {
      this.pushSlide();
    },
  },
}
</script>