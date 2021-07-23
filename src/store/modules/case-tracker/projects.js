import router from "@/router";
import {
    // mockCaseComments,
    // mockCases,
    // mockProjects,
    // mockSlideLists,
    // mockSlides
} from "@/data/testData";
import {ProjectModel} from "@/models/case-tracker/ProjectModel";
// import {SlideModel} from "@/models/case-tracker/SlideModel";
// import {SlideList} from "@/models/case-tracker/SlideList";
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
            /* PROJECT */
            const newProject = new ProjectModel({
                id: 0,
                name: 'Untitled1',
                activityStatus: 'active',
                isSelected: true,
            });

            /* SLIDES */
            const slides = {slides: [], slideLists: []};
            // const newSlide = new SlideModel({
            //     id: 1,
            //     slideState: 'in-work',
            //     projectId: 1,
            //     order: 0,
            //     img: null,
            //     isSelected: true,
            // });
            // const newSlideList = new SlideList({
            //     id: 1,
            //     slideId: 1,
            //     name: 'Лист1',
            //     isSelected: true,
            // });
            // slides.slides = [newSlide];
            // slides.slideLists = [newSlideList];

            /* CASES */
            const cases = {cases: [], casesComments: []};
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
                name: newProject.name,
                activityStatus: newProject.activityStatus,
                slides,
                cases,
                userId,
            }).then(response => {
                const projectDB = response.data;
                dispatch('pushSlide', {
                    projectId: projectDB.id,
                    query: {projectId: projectDB.id},
                    noRoute: true
                }).then(() => {
                    projectDB.slides.slides = slidesState.slides;
                    projectDB.slides.slideLists = slidesState.slideLists;
                    setProjectDataLoad([projectDB], commit, dispatch);
                });
                resolve(projectDB);
            }, error => {
                console.log('error setData', error);
                reject(error);
            });
        });
    },
    addNewProject({commit, getters, dispatch}) {
        const currentUser = getters.getCurrentUser;
        state.selectedProject.isSelected = false;
        const slides = {slides: [], slideLists: []};
        const cases = {cases: [], casesComments: []};
        dispatch('setIsLoading', true);
        return new Promise(() => {
            const id = state.projects.length+1;
            window.axios.post('api/projects-all/add-project', {
                name: 'Untitled' + id,
                activityStatus: 'active',
                slides,
                cases,
                userId: currentUser.id,
            }).then(response => {
                const newProject = new ProjectModel(response.data);
                delete newProject.slides;
                delete newProject.cases;
                commit('SET_PROJECT', newProject);
                dispatch('pushSlide', {
                    projectId: newProject.id,
                    query: {projectId: newProject.id},
                    noRoute: true
                }).then(() => {
                    dispatch('selectProject', newProject);
                });
            }, error => {
                console.log('error addNewProject', error);
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
    },
    updateProjectInfoOnServer({getters}) {
        return new Promise((resolve) => {
            const currentUser = getters.getCurrentUser;
            setTimeout(() => {
                window.axios.post('api/projects-all/update-project-info', {
                    userId: currentUser.id,
                    projectData: {
                        projects: state.projects,
                        selectedProject: null,
                        activeColor: state.activeColor,
                    }
                }).then(() => {
                    resolve();
                }, error => {
                    console.log('error updateProjectInfoOnServer', error);
                });
            }, 100);
        });
    },
    updateSimpleProjectInfoOnServer(_, _project) {
        return new Promise((resolve) => {
            setTimeout(() => {
                window.axios.post('api/projects-all/update-simple-project-info', {
                    project: _project,
                }).then(() => {
                    resolve();
                }, error => {
                    console.log('error updateSimpleProjectInfoOnServer', error);
                });
            }, 100);
        });
    },
    selectProject({commit, dispatch}, _project) {
        dispatch('setIsLoading', true);
        commit('SELECT_PROJECT', _project);
        const _slidesState = slidesState;
        const _casesState = casesState;
        let isFindSlide = false;
        let activeSlide = null;
        let activeSlideList = null;
        _slidesState.slides.forEach(_s => {
            if (!isFindSlide && _s.slideState !== 'archived' && _s.projectId === _project.id) {
                activeSlide = _s; // Записываем первый попавшийся слайд
                _s.isSelected = true;
                isFindSlide = true;
            } else {
                _s.isSelected = false;
            }
        });
        _slidesState.slideLists.forEach(_l => {
            if (activeSlide && activeSlide.id === _l.slideId) {
                _l.isSelected = true;
                activeSlideList = _l;
            } else {
                _l.isSelected = false;
            }
        });
        _slidesState.activeSlide = activeSlide;
        _slidesState.activeSlideList = activeSlideList;
        _casesState.selectedCase = null;
        setTimeout(() => {
            // const projects = state.projects;
            // projects.cases = casesState;
            // projects.slides = _slidesState;
            setProjectDataLoad(state.projects, commit, dispatch, {
                projectId: _project.id,
                slideId: activeSlide.id,
                slideListId: activeSlideList.id,
            });
            // setProjectDataLoad({
            //     userId: currentUser.id,
            //     projects: state,
            //     slides: _slidesState,
            //     cases: casesState,
            // }, commit, dispatch, {
            //     projectId: state.selectedProject.id,
            //     slideId: activeSlide.id,
            //     slideListId: activeSlideList.id,
            // });
        }, 200);
    },
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
    SET_PROJECT(state, _project) {
        state.projects.push(_project);
    },
    SELECT_PROJECT(state, _project) {
        state.projects = state.projects.map(_p => {
            _p.isSelected = _p.id === _project.id;
            return _p;
        });
        state.selectedProject = _project;
    },
    PUSH_PROJECT(state, _project) { state.projects.push(_project); },
    SET_ACTIVE_COLOR(state, color) { state.activeColor = color.replace(/#/g, ''); },
};

/* FUNCTIONS */
const setProjectDataLoad = (projects, commit, dispatch, _query=null) => {
    let query = _query || router.currentRoute.query;
    // console.log('query FROM project', query);
    const projectsState = state;
    const slides = slidesState;
    const cases = casesState;
    const allSlides = [];
    const allSlideLists = [];
    const allCases = [];
    projects.forEach(_project => {
        if (_project.slides) {
            _project.slides.slides.forEach(_s => {
                if (_s.imgUrl) {
                    dispatch('getImgByUrl', _s.imgUrl)
                      .then(_imgBase64 => {
                          _s.imgBase64 = _imgBase64;
                      });
                }
                allSlides.push(_s);
            });
            _project.slides.slideLists.forEach(_c => {
                allSlideLists.push(_c);
            });
            _project.cases.cases.forEach(_c => {
                allCases.push(_c);
            });
            delete _project.slides;
            delete _project.cases;
        }
    });
    if (allSlides.length) {
        projectsState.projects = projects;
        slides.slides = allSlides;
        slides.slideLists = allSlideLists;
        cases.cases = allCases;
    }

    // slides.slides.forEach(_s => {
    //     if (_s.imgUrl) {
    //         dispatch('getImgByUrl', _s.imgUrl)
    //           .then(_imgBase64 => {
    //               _s.imgBase64 = _imgBase64;
    //           });
    //     }
    // });
    // const cases = data.cases;

    if (query) {
        if (query.projectId) {
            const foundProject = projects.find(_p => _p.id === parseInt(query.projectId));
            projectsState.selectedProject = foundProject;
            commit('SELECT_PROJECT', foundProject);
            if (query.slideId) {
                let foundSlide = slides.slides.find(_s => _s.id === parseInt(query.slideId));
                if (foundSlide) {
                    if (foundSlide.slideState === 'archived' || foundSlide.projectId !== foundProject.id) {
                        foundSlide = slides.slides.find(_s => (_s.slideState !== 'archived') && (_s.projectId === foundProject.id));
                        if (foundSlide) {
                            slides.activeSlide = foundSlide;
                            const foundSlideList = slides.activeSlideList = slides.slideLists.find(_l => _l.slideId === foundSlide.id);
                            query = Object.assign(query, {slideId: foundSlide.id, slideListId: foundSlideList.id});
                        }
                    } else { /* Слайд из текущего проекта */
                        slides.activeSlide = foundSlide;
                        slides.activeSlideList = slides.slideLists.find(_l => _l.slideId === foundSlide.id);
                    }
                }
            }
        }
    }
    setTimeout(() => {
        commit('SET_ALL_PROJECTS_STATE', projectsState);
        commit('SET_ALL_SLIDES_STATE', slides);
        commit('SET_ALL_CASES_STATE', cases);
    }, 50);
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
                router.push(
                  `/case-tracker?projectId=${projectsState.selectedProject.id}&slideId=${slides.activeSlide.id}&slideListId=${slides.activeSlideList.id}&caseId=${cases.selectedCase.id}`
                );
            }
        } else {
            let projectId, slideId, slideListId, caseId;
            projectId = slideId = slideListId = caseId = '';
            if (projects[0] && projects[0].id) {
                const firstProject = projects[0];
                projectId = `?projectId=${firstProject.id}`;
                const foundSlide = slides.slides.find(_s => _s.slideState !== 'archived' &&
                  (_s.projectId === firstProject.id));
                if (foundSlide) {
                    slideId = `&slideId=${foundSlide.id}`;
                    slideListId = `&slideListId=${foundSlide.id}`;
                    const foundCase = cases.cases.find(_c => _c.caseStatus !== 'archived' &&
                      _c.slideId === foundSlide.id);
                    if (foundCase) {
                        caseId = `&caseId=${foundCase.id}`;
                    }
                }
            }
            dispatch('setIsLoading', false);
            router.push(`/case-tracker?${projectId}${slideId}${slideListId}${caseId}`);
            setProjectDataLoad(projects, commit, dispatch, _query);
        }
    }, 100);
};

export default {
    state,
    getters,
    actions,
    mutations
}
