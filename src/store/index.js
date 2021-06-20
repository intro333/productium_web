import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import '../plugins/axios';
import common from './modules/common';
import modals from './modules/modals';
import caseTrackerProjects from './modules/case-tracker/projects';
import caseTrackerSlides from './modules/case-tracker/slides';
import caseTrackerCases from './modules/case-tracker/cases';

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
    caseTrackerProjects,
    caseTrackerSlides,
    caseTrackerCases,
  }
})

// const state = {
//
// };
//
// const getters = {
//
// };
//
// const actions = {
//
// };
//
// const mutations = {
//
// };
//
// export default {
//   state,
//   getters,
//   actions,
//   mutations
// }
