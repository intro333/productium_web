import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import common from './modules/common';
import modals from './modules/modals';
import slides from './modules/slides';
import caseTrackerProjects from './modules/case-tracker/projects';

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
    slides,
    caseTrackerProjects,
  }
})
