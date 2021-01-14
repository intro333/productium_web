<template>
    <div class="p-modal">
      <div class="p-modal-background p-modal-loading"></div>
      <div class="c-loader-popup">
        <div class="lb-item grow-loader"
             :class="{'grow-loader-active': active === 1}"></div>
        <div class="lb-item grow-loader"
             :class="{'grow-loader-active': active === 2}"></div>
        <div class="lb-item grow-loader"
             :class="{'grow-loader-active': active === 3}"></div>
      </div>
<!--      <img class="loading-icon"-->
<!--           src="@/assets/img/common/loading.gif" alt="">-->
    </div>
</template>

<script>
  export default {
    name: "Loading",
    data: () => ({
      active: 0,
      timeoutMs: 0,
      timeoutId: 0,
    }),
    created() {
      this.twist(1);
    },
    beforeDestroy() {
      clearTimeout(this.timeoutId);
    },
    methods: {
      twist(num) {
        this.timeoutId = setTimeout(() => {
          this.timeoutMs = 250;
          this.active = num;
          if (num === 3) {
            this.twist(1);
          } else {
            this.twist(++num);
          }
        }, this.timeoutMs);
      }
    }
  }
</script>