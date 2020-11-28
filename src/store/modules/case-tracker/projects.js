import router from "@/router";
import {ProjectModel} from "@/models/case-tracker/ProjectModel";

/* TEST DATA */
const mockProjects = [
    new ProjectModel({
        id: 1,
        name: 'Untitled1',
        activityStatus: 'active',
    }),
    new ProjectModel({
        id: 2,
        name: 'Untitled2',
        activityStatus: 'active',
    }),
    new ProjectModel({
        id: 3,
        name: 'Untitled3',
        activityStatus: 'archived',
    }),
];

const state = {
    projects: [],
};

const getters = {
    getProjects: state => state.projects,
};

const actions = {
    /* PROJECTS */
    fetchProjects({commit}) {
        commit('SET_PROJECTS', mockProjects);
    },
    pushProject({commit}) {
        commit('PUSH_PROJECT', {});
    },
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
};

export default {
    state,
    getters,
    actions,
    mutations
}