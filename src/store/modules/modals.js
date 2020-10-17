import {ContextMenuBaseModel} from "@/models/modals/ContextMenuBaseModel";
import {TooltipModel} from "@/models/modals/TooltipModel";

const state = {
  contextMenuBase: new ContextMenuBaseModel(),
  tooltip: new TooltipModel(),
};

const getters = {
  getContextMenuBase: state => state.contextMenuBase,
  getTooltip: state => state.tooltip,
};

const actions = {
  setContextMenuBase({commit}, menu) {
    commit('SET_CONTEXT_MENU_BASE', menu);
  },
  setTooltip({commit}, tooltip) {
    commit('SET_TOOLTIP', tooltip);
  },
};

const mutations = {
  SET_CONTEXT_MENU_BASE(state, menu) { state.contextMenuBase = menu; },
  SET_TOOLTIP(state, tooltip) { state.tooltip = tooltip;},
};

export default {
  state,
  getters,
  actions,
  mutations
}