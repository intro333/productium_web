<template>
  <div class="slide-sidebar">
    <SlideItem v-for="(_slide, i) in slides"
               :slide="_slide"
               :key="i"
               :cKey="i"
               :slidesLength="slidesLength"
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
import {slidesOfProjectFilterWithSelect} from "@/functions/case-tracker/projectsF";
import SlideItem from "@/components/view-tracker/part/SlideItem";

export default {
  name: "SlideSidebar",
  components: {
    SlideItem
  },
  data: () => ({
    slides: [],
  }),
  created() {
    this.fetchSlidesL();
    this.removeSlideUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'REMOVE_SLIDE') {
        if (mutation.payload) {
          this.fetchSlidesL();
        }
      }
    });
  },
  beforeDestroy() {
    if (this.removeSlideUnsubscribe) {
      this.removeSlideUnsubscribe();
    }
  },
  computed: {
    slidesLength() {
      return this.slides.length;
    }
  },
  methods: {
    ...mapActions(['setContextMenuBase', 'pushSlide']),
    ...mapGetters(['getSlides']),
    addSlide() {
      this.pushSlide();
    },
    fetchSlidesL() {
      const query = this.$route.query;
      if (query && query.projectId) {
        this.slides = slidesOfProjectFilterWithSelect(
            this.getSlides(),
            parseInt(query.projectId),
            parseInt(query.slideId)
        );
      } else {
        this.slides = [];
      }
    }
  },
  watch: {
    $route () {
      this.fetchSlidesL();
    }
  }
}
</script>