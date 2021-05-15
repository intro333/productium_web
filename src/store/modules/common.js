import {CurrentUserModel} from "@/models/CurrentUserModel";
import {getOS} from "@/functions/validation";

const state = {
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
    getAdditionalIpInfo: state => state.additionalIpInfo,
};

const actions = {
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
        commit('SET_CURRENT_USER', user);
    },
};

const mutations = {
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