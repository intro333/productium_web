import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";

const state = {
  contextMenuBase: new ContextMenuBaseModel()
};

const getters = {
  getContextMenuBase: state => state.contextMenuBase,
};

const actions = {
  setContextMenuBase({commit}, menu) {
    console.log(2, menu)
    commit('SET_CONTEXT_MENU_BASE', menu);
  },
};

const mutations = {
  SET_CONTEXT_MENU_BASE(state, menu) { state.contextMenuBase = menu; },
};

export default {
  state,
  getters,
  actions,
  mutations
}