import {CurrentUserModel} from "@/models/CurrentUserModel";
import {getOS} from "@/functions/validation";
import {shortFullName} from "@/functions/conversation";

const state = {
    accessToken: localStorage.getItem('access_token'),
    isAuthorized: !!localStorage.getItem('access_token'),
    currentUser: new CurrentUserModel(1, 'Dmitriy D', 'DD', '#7c4a4a'),
    sInfo: {
        userIp: '',
        userDevice: '',
        userAgent: '',
    },
    additionalIpInfo: null,
};

const getters = {
    getCurrentUser: state => state.currentUser,
    getOsInfo: state => state.osInfo,
    geIsAuthorized: state => state.isAuthorized,
    getAdditionalIpInfo: state => state.additionalIpInfo,
};

const actions = {
    async login({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            window.axios.post('api/auth/login/', {
              fullName: payload.fullName,
              password: payload.password,
            })
              .then(response => {
                const info = response.data;
                commit('LOGIN', info);
                dispatch('setCurrentUser', new CurrentUserModel(info.userId, payload.fullName, shortFullName(payload.fullName), '#7c4a4a'));
                dispatch('setData', info.userId);
                resolve(info);
              }, () => {
                  reject(false)
              });
        });
    },
    fetchAdditionalIpInfo({ commit }, ip) {
        return new Promise((resolve, reject) => {
            window.axios.get('https://api.ipregistry.co/' + ip + '?key=0sr7pwpf45eqwk', {})
              .then(response => {
                  if (response.data) {
                      const info = response.data;
                      commit('SET_ADDITIONAL_IP_INFO', info);
                      resolve(info);
                  } else {
                      reject(false)
                  }
              }, () => {
                  reject(false)
              });
        });
    },
    fetchIpAddressAndSetOsInfo({ commit }) {
        return new Promise((resolve, reject) => {
            window.axios.get('https://api.ipify.org?format=json', {})
              // axios.get('http://api.ipify.org/?format=json', {})
              .then(response => {
                  const ip = response.data.ip;
                  const osInfo = getOS();
                  osInfo.userIp = ip;
                  commit('SET_OS_INFO', osInfo);
                  resolve(osInfo);
              }, () => {
                  const osInfo = getOS();
                  commit('SET_OS_INFO', osInfo);
                  reject(osInfo)
              });
        });
    },
    setCurrentUser({commit}, user) {
      console.log('user', user);
        commit('SET_CURRENT_USER', user);
    },
};

const mutations = {
    LOGIN(state, info) {
      state.accessToken = info.accessToken;
      state.isAuthorized = true;
      localStorage.setItem('access_token', info.accessToken);
    },
    SET_CURRENT_USER(state, user) { state.currentUser = user; },
    SET_OS_INFO(state, info) { state.osInfo = info; },
    SET_ADDITIONAL_IP_INFO(state, info) { state.additionalIpInfo = info; },
};

export default {
    state,
    getters,
    actions,
    mutations
}
