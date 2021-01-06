<template>
  <div class="p-modal-only-desktop p-community">
    <div class="na-logo-box">
      <div>
        <img src="@/assets/img/common/communityLogoBlack.svg"
             class="na-logo-img"
             alt="">
        <span class="na-logo-text">roductium</span>
      </div>
      <div class="na-logo-text-box">
        <span class="na-logo-text na-logo-text-white">community</span>
      </div>
    </div>
    <div class="p-box-flex-column na-center">
      <span class="na-center-text na-center-text-left">извините,</span>
      <div class="na-center-box">
        <p class="na-center-box-text">приложение пока не доступно</p>
        <p class="na-center-box-text">для мобильных экранов</p>
      </div>
      <span class="na-center-text na-center-text-right">спасибо</span>
    </div>
    <div class="p-box-flex-center-aj">
      <div @click="goToCommunity()"
           class="p-button p-button-rounded p-button-rounded1 na-button">
        <span class="p-button-text">Вернуться на сайт</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotAvailableForMobile",
  methods: {
    goToCommunity() {
      window.open('http://productium.org:81', 'self'); // TODO вынести линки в .env
    }
  }
}
</script>
