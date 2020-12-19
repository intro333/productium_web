import router from "@/router";
import {mockCaseComments, mockCases, mockProjects, mockSlideLists, mockSlides} from "@/data/testData";

const state = {
    projects: [],
    activeColor: 'auto'
};

const getters = {
    getProjects: state => state.projects,
    getActiveColor: state => state.activeColor,
};

const actions = {
    /* INIT */
    fetchInitData({commit, dispatch, getters}) {
        return new Promise((resolve) => {
            setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
                const data = {
                    projects: mockProjects,
                    slides: mockSlides,
                    slidesList: mockSlideLists,
                    cases: mockCases,
                    caseComments: mockCaseComments,
                };
                /* Наполнить основные компоненты */
                commit('SET_PROJECTS', data.projects);
                commit('SET_SLIDES', data.slides);
                commit('SET_SLIDE_LISTS', data.slidesList);
                commit('SET_CASES', data.cases);
                commit('SET_CASES_COMMENTS', data.caseComments);
                /* Доп. настройки компонентов */
                setTimeout(() => {
                    dispatch('selectFoundSlideFromSlides', getters.getSlides).then(() => {
                        setTimeout(() => {
                            dispatch('selectFoundCaseFromCases');
                        }, 400);
                    });
                }, 100);
                resolve(data);
            }, 200);
        });
    },
    /* PROJECTS */
    fetchProjects({commit}) {
        commit('SET_PROJECTS', mockProjects);
    },
    pushProject({commit}) {
        commit('PUSH_PROJECT', {});
    },
    /*  */
    setActiveColor({commit}, color) {
        if (color && color !== '') {
            // TODO Можно ещё поставить проверку, есть ли этот увет в массиве pickerColors (через Object.keys)
            commit('SET_ACTIVE_COLOR', color);
        }
    }
};

const mutations = {
    /* PROJECTS */
    SET_PROJECTS(state, _projects) {
        const query = router.currentRoute.query;
        if (query && query.projectId) {
            const _projectId = parseInt(query.projectId);
            state.projects = _projects.map(_p => {
                _p.isSelected = _p.id === _projectId;
                return _p;
            });
        } else {
            state.projects = _projects;
        }
    },
    PUSH_PROJECT(state, _project) { state.projects.push(_project); },
    SET_ACTIVE_COLOR(state, color) { state.activeColor = color.replace(/#/g, ''); },
};

export default {
    state,
    getters,
    actions,
    mutations
}