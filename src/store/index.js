import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import common from './modules/common';
import modals from './modules/modals';

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    common,
    modals,
  }
})
