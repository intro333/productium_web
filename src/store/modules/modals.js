import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {TooltipModel} from "@/models/modals/TooltipModel";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import {SimpleNotifyModel} from "@/models/modals/SimpleNotifyModel";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

const state = {
  contextMenuBase: new ContextMenuBaseModel(),
  centralModal: new CentralModalModel(),
  tooltip: new TooltipModel(),
  simpleNotify: new SimpleNotifyModel(),
  simpleNotifyInside: new SimpleNotifyInsideModel(),
  isLoading: false,
  isNotAvailableForMobile: false,
};

const getters = {
  getContextMenuBase: state => state.contextMenuBase,
  getCentralModal: state => state.centralModal,
  getTooltip: state => state.tooltip,
  getSimpleNotify: state => state.simpleNotify,
  getSimpleNotifyInside: state => state.simpleNotifyInside,
  getIsLoading: state => state.isLoading,
  getNotAvailableForMobile: state => state.isNotAvailableForMobile,
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
  setSimpleNotify({commit}, notify) {
    commit('SET_SIMPLE_NOTIFY', notify);
  },
  setSimpleNotifyInside({commit}, notify) {
    commit('SET_SIMPLE_NOTIFY_INSIDE', notify);
  },
  setIsLoading({commit}, status) {
    commit('SET_IS_LOADING', status);
  },
  setIsNotAvailableForMobile({commit}, status) {
    commit('SET_IS_NOT_AVAILABLE_FOR_MOBILE', status);
  },
};

const mutations = {
  SET_CONTEXT_MENU_BASE(state, menu) { state.contextMenuBase = menu; },
  SET_CENTRAL_MODAL(state, modal) { state.centralModal = modal; },
  SET_TOOLTIP(state, tooltip) { state.tooltip = tooltip; },
  SET_SIMPLE_NOTIFY(state, notify) { state.simpleNotify = notify; },
  SET_SIMPLE_NOTIFY_INSIDE(state, notify) { state.simpleNotifyInside = notify; },
  SET_IS_LOADING(state, isLoading) { state.isLoading = isLoading; },
  SET_IS_NOT_AVAILABLE_FOR_MOBILE(state, status) { state.isNotAvailableForMobile = status; },
};

  export default {
    state,
    getters,
    actions,
    mutations
  }
