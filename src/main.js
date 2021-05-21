import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import device from "vue-device-detector";
import { fabric } from 'fabric';
import VueTheMask from 'vue-the-mask';
import Clipboard from 'v-clipboard';
import VueI18n from 'vue-i18n';
import {messages} from '@/plugins/i18n';

Vue.config.productionTip = false;
Vue.use(VueTheMask);
Vue.use(device);
Vue.use(fabric);
Vue.use(require('vue-faker'));
Vue.use(Clipboard);

import "./assets/scss/app.scss";
import middlewarePipeline from "./router/middleware/middlewarePipeline";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'ru', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store
  }
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

new Vue({
  router,
  store,
  render: h => h(App),
  i18n,
}).$mount('#app')
