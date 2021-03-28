<template>
  <div class="p-modal">
    <div class="p-modal-background p-modal-background-60"
         @click="closeVideo"></div>
    <div class="video-preview">
      <img @click="closeVideo"
           src="@/assets/img/common/closeIconWhite.svg"
           class="video-preview-close-icon"
           alt="">
      <p class="video-preview-title">Preview</p>
      <div class="video-preview-box">
        <video id="video"
               class="video-preview-player"
               @play="play"
               @pause="pause"
               controls
               controlsList="nodownload"
               disablePictureInPicture
               ref="videoPreviewRef"
               muted
               poster="video/poster.gif"
        >
          <source src="/video/learning.mp4"
                  type="video/mp4">
        </video>
        <img v-if="videoIsPaused"
             @click="play"
             src="@/assets/img/common/buttons/buttonPlay.svg"
             class="video-preview-control-play"
             alt="" >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoLearning",
  props: {
    close: Function,
  },
  data: () => ({
    video: null,
    videoIsPlayed: false, /* Было запущено видео или нет (первый раз) */
    videoIsPaused: true,
  }),
  mounted() {
    if (this.$refs['videoPreviewRef']) {
      this.video = this.$refs['videoPreviewRef'];
    }
  },
  methods: {
    closeVideo() {
      this.close();
    },
    play() {
      if (this.video) {
        this.video.play();
        this.videoIsPlayed = true;
        this.videoIsPaused = false;
      }
    },
    pause() {
      this.video.pause();
      this.videoIsPaused = true;
    },
  }
}
</script>
