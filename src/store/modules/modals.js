import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {TooltipModel} from "@/models/modals/TooltipModel";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

const state = {
  contextMenuBase: new ContextMenuBaseModel(),
  centralModal: new CentralModalModel(),
  tooltip: new TooltipModel(),
  simpleNotifyInside: new SimpleNotifyInsideModel(),
  isLoading: false,
};

const getters = {
  getContextMenuBase: state => state.contextMenuBase,
  getCentralModal: state => state.centralModal,
  getTooltip: state => state.tooltip,
  getSimpleNotifyInside: state => state.simpleNotifyInside,
  getIsLoading: state => state.isLoading,
};

const actions = {
  setContextMenuBase({commit}, menu) {
    commit('SET_CONTEXT_MENU_BASE', menu);
  },
  setCentralModal({commit}, modal) {
    commit('SET_CENTRAL_MODAL', modal);
  },
  setTooltip({commit}, tooltip) {
    commit('SET_TOOLTIP', tooltip);
  },
  setSimpleNotifyInside({commit}, notify) {
    commit('SET_SIMPLE_NOTIFY_INSIDE', notify);
  },
  setIsLoading({commit}, status) {
    commit('SET_IS_LOADING', status);
  },
};

const mutations = {
  SET_CONTEXT_MENU_BASE(state, menu) { state.contextMenuBase = menu; },
  SET_CENTRAL_MODAL(state, modal) { state.centralModal = modal; },
  SET_TOOLTIP(state, tooltip) { state.tooltip = tooltip; },
  SET_SIMPLE_NOTIFY_INSIDE(state, notify) { state.simpleNotifyInside = notify; },
  SET_IS_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
};

  export default {
    state,
    getters,
    actions,
    mutations
  }