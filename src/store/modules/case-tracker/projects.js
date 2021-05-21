import router from "@/router";
import {
    // mockCaseComments,
    // mockCases,
    mockProjects,
    // mockSlideLists,
    // mockSlides
} from "@/data/testData";
import {ProjectModel} from "@/models/case-tracker/ProjectModel";
import {SlideModel} from "@/models/case-tracker/SlideModel";
import {SlideList} from "@/models/case-tracker/SlideList";
import {CaseModel} from "@/models/case-tracker/CaseModel";
import {state as slidesState} from './slides';
import {state as casesState} from './cases';

const state = {
    projects: [],
    activeColor: 'auto',
    dataId: null,

    test1: {},
};

const getters = {
    getProjects: state => state.projects,
    getActiveColor: state => state.activeColor,
};

const actions = {
    /* INIT */
    // fetchInitData({commit, dispatch}) {
    //     return new Promise((resolve) => {
    //         setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
    //             const data = {
    //                 projects: mockProjects,
    //                 slides: mockSlides,
    //                 slidesList: mockSlideLists,
    //                 cases: mockCases,
    //                 caseComments: mockCaseComments,
    //             };
    //             /* Наполнить основные компоненты */
    //             commit('SET_PROJECTS', data.projects);
    //             commit('SET_SLIDES', data.slides);
    //             commit('SET_SLIDE_LISTS', data.slidesList);
    //             commit('SET_CASES', data.cases);
    //             commit('SET_CASES_COMMENTS', data.caseComments);
    //             const query = router.currentRoute.query;
    //             if (query && query.projectId) {
    //                 const project = state.projects.find(_p => _p.id === parseInt(query.projectId));
    //                 if (project) {
    //                     /* Доп. настройки компонентов */
    //                     setTimeout(() => {
    //                         dispatch('selectFoundSlideFromSlides', query).then(_case => {
    //                             setTimeout(() => {
    //                                 dispatch('selectFoundCaseFromCases', _case);
    //                             }, 400);
    //                         });
    //                     }, 100);
    //                 } else {
    //                     dispatch('setIsLoading', false);
    //                     router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1');
    //                 }
    //             } else {
    //                 dispatch('setIsLoading', false);
    //                 router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1');
    //             }
    //             resolve(data);
    //         }, 300);
    //     });
    // },

    /* SET DATA */
    setData({commit}, userId) {
        return new Promise((resolve, reject) => {
            /* PROJECTS */
            const projects = state;
            const newProject = new ProjectModel({
                id: 1,
                name: 'Untitled1',
                activityStatus: 'active',
            });
            projects.projects = [newProject];

            /* SLIDES */
            const slides = slidesState;
            const newSlide = new SlideModel({
                id: 1,
                slideState: 'in-work',
                projectId: 1,
                order: 0,
                img: null,
            });
            const newSlideList = new SlideList({
                id: 1,
                slideId: 1,
                name: 'Лист1'
            });
            slides.slides = [newSlide];
            slides.slideLists = [newSlideList];
            slides.activeSlide = newSlide;
            slides.activeSlideList = newSlideList;

            /* CASES */
            const cases = casesState;
            const newCase = new CaseModel({
                id: 1,
                projectId: 1,
                slideId: 1,
                slideListId: 1,
                title: 'Case 1',
                caseStatus: 'in-work ',
                isOpen: true,
                discus: '',
                resolut: '',
                children: [],
                order: 0,
            });
            cases.cases = [newCase];
            cases.selectedCase = newCase;

              /* REQUEST */
            window.axios.post('projects-all/set-data', {
                projects,
                slides,
                cases,
                userId,
            }).then(response => {
                const data = response.data;
                console.log('response setData', data);
                commit('SET_DATA_ID', data.id);
                resolve(data);
            }, error => {
                console.log('error setData', error);
                reject(error);
            });
        });
    },

    /* INIT */
    fetchInitData({commit, getters}) {
        return new Promise((resolve, reject) => {
            const currentUser = getters.getCurrentUser;
            console.log('currentUser', currentUser);
            window.axios.post('projects-all/', {
                userId: currentUser.id
            }).then(response => {
                const data = response.data;
                console.log('response projects-all by data id', data);
                commit('FETCH_ALL_DATA', data);
                resolve(data);
            }, error => {
                console.log('error projects-all', error);
                reject(error);
            });
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
    FETCH_ALL_DATA(state, _data) { state.test1 = _data },
    SET_DATA_ID(state, id) { state.dataId = id },
};

export default {
    state,
    getters,
    actions,
    mutations
}