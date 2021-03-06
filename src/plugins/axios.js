import Vue from 'vue';
import axios from "axios";

export const baseURLConst = 'http://localhost:3000'; /* Для локальной разработки */
// export const baseURLConst = 'https://api.productium.org/'; /* Для DEV & PROD */
axios.defaults.baseURL = baseURLConst + '/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

let config = {};

const _axios = axios.create(config);

// request //
_axios.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem('access_token');
    // console.log('token', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('config', config);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// response //
_axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    console.log(error);
    if(error.response && error.response.status === 401) {
      // setAuthStatus ???
      // router.push('/login')
    }
    return Promise.reject(error);
  }
);

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
