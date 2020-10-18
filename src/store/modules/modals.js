import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {TooltipModel} from "@/models/modals/TooltipModel";
import {CentralModalModel} from "@/models/modals/CentralModalModel";

const state = {
  contextMenuBase: new ContextMenuBaseModel(),
  centralModal: new CentralModalModel(),
  tooltip: new TooltipModel(),
};

const getters = {
  getContextMenuBase: state => state.contextMenuBase,
  getCentralModal: state => state.centralModal,
  getTooltip: state => state.tooltip,
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
};

const mutations = {
  SET_CONTEXT_MENU_BASE(state, menu) { state.contextMenuBase = menu; },
  SET_CENTRAL_MODAL(state, modal) { state.centralModal = modal; },
  SET_TOOLTIP(state, tooltip) { state.tooltip = tooltip;},
};

export default {
  state,
  getters,
  actions,
  mutations
}