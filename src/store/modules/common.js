import {CurrentUserModel} from "@/models/CurrentUserModel";

const state = {
    currentUser: new CurrentUserModel(1, 'Dmitriy D', 'DD', '#7c4a4a'),
};

const getters = {
    getCurrentUser: state => state.currentUser,
};

const actions = {
    setCurrentUser({commit}, user) {
        commit('SET_CURRENT_USER', user);
    },
};

const mutations = {
    SET_CURRENT_USER(state, user) { state.currentUser = user; },
};

export default {
    state,
    getters,
    actions,
    mutations
}