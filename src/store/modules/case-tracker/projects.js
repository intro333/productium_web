import router from "@/router";
import {
    // mockCaseComments,
    // mockCases,
    // mockProjects,
    // mockSlideLists,
    // mockSlides
} from "@/data/testData";
import {ProjectModel} from "@/models/case-tracker/ProjectModel";
import {SlideModel} from "@/models/case-tracker/SlideModel";
import {SlideList} from "@/models/case-tracker/SlideList";
// import {CaseModel} from "@/models/case-tracker/CaseModel";
import {state as slidesState} from './slides';
import {state as casesState} from './cases';

const state = {
    projects: [],
    selectedProject: null,
    activeColor: 'auto',
};

const getters = {
    getProjects: state => state.projects,
    getSelectedProject: state => state.selectedProject,
    getActiveColor: state => state.activeColor,
};

const actions = {
    /* INIT */
    // fetchInitDataOld({commit, dispatch}) {
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
    setData({commit, dispatch}, userId) {
        return new Promise((resolve, reject) => {
            /* PROJECTS */
            const projects = state;
            const newProject = new ProjectModel({
                id: 1,
                name: 'Untitled1',
                activityStatus: 'active',
                isSelected: true,
            });
            projects.projects = [newProject];
            // projects.selectedProject = newProject;

            /* SLIDES */
            const slides = slidesState;
            const newSlide = new SlideModel({
                id: 1,
                slideState: 'in-work',
                projectId: 1,
                order: 0,
                img: null,
                isSelected: true,
            });
            const newSlideList = new SlideList({
                id: 1,
                slideId: 1,
                name: 'Лист1',
                isSelected: true,
            });
            slides.slides = [newSlide];
            slides.slideLists = [newSlideList];
            // slides.activeSlide = newSlide;
            // slides.activeSlideList = newSlideList;

            /* CASES */
            const cases = casesState;
            // const newCase = new CaseModel({
            //     id: 1,
            //     projectId: 1,
            //     slideId: 1,
            //     slideListId: 1,
            //     title: 'Case 1',
            //     caseStatus: 'in-work ',
            //     isOpen: true,
            //     discus: '',
            //     resolut: '',
            //     children: [],
            //     order: 0,
            //     isSelected: true,
            // });
            // cases.cases = [newCase];
            // cases.selectedCase = newCase;

              /* REQUEST */
            window.axios.post('api/projects-all/set-data', {
                projects,
                slides,
                cases,
                userId,
            }).then(response => {
                const data = response.data;
                setProjectDataLoad(data, commit, dispatch);
                console.log('response setData', data);
                resolve(data);
            }, error => {
                console.log('error setData', error);
                reject(error);
            });
        });
    },

    /* INIT */
    fetchInitData({commit, dispatch, getters}) {
        return new Promise((resolve, reject) => {
            const currentUser = getters.getCurrentUser;
            // console.log('currentUser', currentUser);
            window.axios.post('api/projects-all/', {
                userId: currentUser.id
            }).then(response => {
                const data = response.data;
                // console.log('response projects-all by data id', data);
                setProjectDataLoad(data, commit, dispatch);
                resolve(data);
            }, error => {
                console.log('error projects-all', error);
                reject(error);
            });
        });
    },

    /* PROJECTS */
    // fetchProjects({commit}) {
    //     commit('SET_PROJECTS', mockProjects);
    // },
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
    SET_ALL_PROJECTS_STATE(state, newState) {
        Object.keys(newState).forEach(_k => {
            state[_k] = newState[_k];
        });
    },
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

/* FUNCTIONS */
const setProjectDataLoad = (data, commit, dispatch) => {
    const projects = data.projects;
    const slides = data.slides;
    slides.slides.forEach(_s => {
        if (_s.imgUrl) {
            dispatch('getImgByUrl', _s.imgUrl)
              .then(_imgBase64 => {
                  _s.imgBase64 = _imgBase64;
              });
        }
    });
    const cases = data.cases;

    projects.selectedProject = projects.projects.find(_p => _p.isSelected);
    slides.activeSlide = slides.slides.find(_p => _p.isSelected);
    slides.activeSlideList = slides.slideLists.find(_p => _p.isSelected);
    cases.selectedCase = cases.cases;
    // cases.selectedCase = cases.cases.find(_p => _p.isSelected);

    setTimeout(() => {
        commit('SET_ALL_PROJECTS_STATE', projects);
        commit('SET_ALL_SLIDES_STATE', slides);
        commit('SET_ALL_CASES_STATE', cases);
    }, 50);
    const query = router.currentRoute.query;
    // console.log('query', query);
    setTimeout(() => {
        if (query && query.projectId) {
            const project = state.projects.find(_p => _p.id === parseInt(query.projectId));
            if (project) {
                /* Доп. настройки компонентов */
                setTimeout(() => {
                    dispatch('selectFoundSlideFromSlides', query).then(_case => {
                        setTimeout(() => {
                            dispatch('selectFoundCaseFromCases', _case);
                        }, 400);
                    });
                }, 100);
            } else {
                dispatch('setIsLoading', false);
                console.log(131313131313)
                router.push(
                  `/case-tracker?projectId=${projects.selectedProject.id}&slideId=${slides.activeSlide.id}&slideListId=${slides.activeSlideList.id}&caseId=${cases.selectedCase.id}`
                );
            }
        } else {
            const projectId = (projects.selectedProject && projects.selectedProject.id) ? `projectId=${projects.selectedProject.id}` : '';
            const slideId = (slides.activeSlide && slides.activeSlide.id) ? `slideId=${slides.activeSlide.id}` : '';
            const slideListId = (slides.activeSlideList && slides.activeSlideList.id) ? `slideListId=${slides.activeSlideList.id}` : '';
            const caseId = (cases.selectedCase && cases.selectedCase.id) ? `caseId=${cases.selectedCase.id}` : '';
            dispatch('setIsLoading', false);
            console.log(121212121212)
            router.push(`/case-tracker?${projectId}&${slideId}&${slideListId}&${caseId}`);
        }
    }, 100);
};

export default {
    state,
    getters,
    actions,
    mutations
}
