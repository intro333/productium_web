import Vue from 'vue';
import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:3000/api'; /* Для локальной разработки */
axios.defaults.baseURL = 'https://api.productium.org/api'; /* Для DEV & PROD */
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const _axios = axios.create({});

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
