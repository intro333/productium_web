import {SlideModel} from "@/models/modals/case-tracker/SlideModel";
import {getRandomInt} from "@/functions/calculations";
import router from "@/router";
import {ProjectModel} from "@/models/modals/case-tracker/ProjectModel";
import {SlideList} from "@/models/modals/case-tracker/SlideList";
import {CaseModel} from "@/models/modals/case-tracker/CaseModel";

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
const mockSlides = [
    new SlideModel({
        id: 1,
        slideState: 'in-work',
        projectId: 1,
        order: 0,
        image: '',
    }),
    new SlideModel({
        id: 2,
        slideState: 'done',
        projectId: 1,
        order: 1,
        image: '',
    }),
    new SlideModel({
        id: 3,
        slideState: 'in-work',
        projectId: 1,
        order: 2,
        image: '',
    }),
    new SlideModel({
        id: 4,
        slideState: 'in-work',
        projectId: 1,
        order: 3,
        image: '',
    }),
    new SlideModel({
        id: 5,
        slideState: 'archived',
        projectId: 2,
        order: 0,
        image: '',
    }),
];
const mockSlideLists = [
  new SlideList({
      id: 1,
      slideId: 1,
      name: 'Лист1'
  }),
  new SlideList({
      id: 2,
      slideId: 2,
      name: 'Лист1'
  }),
  new SlideList({
      id: 3,
      slideId: 3,
      name: 'Лист1'
  }),
  new SlideList({
      id: 4,
      slideId: 4,
      name: 'Лист1'
  }),
];
const mockCases = [
    new CaseModel({
      id: 1,
      slideListId: 1,
      title: 'Задача 1',
      caseStatus: 'in-work',
      isOpen: false,
      discus: '',
      resolut: '',
      children: [],
      order: 0
    }),
    new CaseModel({
      id: 2,
      slideListId: 1,
      title: 'Баг с выпадающим списком, когда на него нажимаешь.',
      caseStatus: 'done',
      isOpen: false,
      discus: '',
      resolut: '',
      children: [
          {
              id: 1,
              title: 'Rectangle 1',
              shapeType: 'rectangle'
          },
          {
              id: 2,
              title: 'Rectangle 2',
              shapeType: 'rectangle'
          },
          {
              id: 3,
              title: 'Circle 1',
              shapeType: 'circle'
          },
      ],
      order: 1
    }),
    new CaseModel({
      id: 3,
      title: 'Задача 3.',
      slideListId: 1,
      caseStatus: 'done',
      isOpen: true,
      discus: '',
      resolut: '',
      children: [
          {
              id: 4,
              title: 'Rectangle 1',
              shapeType: 'rectangle'
          },
          {
              id: 5,
              title: 'Circle 1',
              shapeType: 'circle'
          },
      ],
      order: 2
    }),
    new CaseModel({
        id: 4,
        slideListId: 2,
        title: 'Задача 2',
        caseStatus: 'in-work',
        isOpen: false,
        discus: '',
        resolut: '',
        children: [],
        order: 0
    }),
    new CaseModel({
        id: 5,
        slideListId: 2,
        title: 'Задача 3',
        caseStatus: 'done',
        isOpen: true,
        discus: '',
        resolut: '',
        children: [
            {
                id: 1,
                title: 'Rectangle 3',
                shapeType: 'rectangle'
            },
            {
                id: 2,
                title: 'Rectangle 4',
                shapeType: 'rectangle'
            },
            {
                id: 3,
                title: 'Circle 2',
                shapeType: 'circle'
            },
        ],
        order: 1
    }),
    new CaseModel({
        id: 6,
        slideListId: 3,
        title: 'Задача 7',
        caseStatus: 'in-work',
        isOpen: false,
        discus: '',
        resolut: '',
        children: [],
        order: 0
    }),
    new CaseModel({
        id: 7,
        slideListId: 4,
        title: 'Задача 8',
        caseStatus: 'done',
        isOpen: true,
        discus: '',
        resolut: '',
        children: [
            {
                id: 1,
                title: 'Rectangle 3',
                shapeType: 'rectangle'
            },
            {
                id: 2,
                title: 'Rectangle 4',
                shapeType: 'rectangle'
            },
            {
                id: 3,
                title: 'Circle 2',
                shapeType: 'circle'
            },
        ],
        order: 1
    }),
    new CaseModel({
        id: 8,
        slideListId: 4,
        title: 'Задача 9',
        caseStatus: 'in-work',
        isOpen: true,
        discus: '',
        resolut: '',
        children: [],
        order: 0
    }),
];

const state = {
    projects: [],
    slides: [],
    slideLists: [],
    cases: [],
};

const getters = {
    getProjects: state => state.projects,
    getSlides: state => state.slides,
    getSlideLists: state => state.slideLists,
    getCases: state => state.cases,
};

const actions = {
    /* PROJECTS */
    fetchProjects({commit}) {
        commit('SET_PROJECTS', mockProjects);
    },
    pushProject({commit}) {
        commit('PUSH_PROJECT', {});
    },
    /* SLIDES */
    fetchSlides({commit, getters}) {
        commit('SET_SLIDES', {
            slides: mockSlides,
            notifications: getters.getCaseCommentNotifications
        });
    },
    pushSlide({commit}) {
        /* TODO Mock */
        const selectedProject = state.projects.find(_p => _p.isSelected);
        const newSlide = new SlideModel({
            id: getRandomInt(10, 1000),
            slideState: 'in-work',
            projectId: selectedProject.id,
            order: 0,
            image: '',
        });
        const newSlideList = new SlideList({
            id: getRandomInt(10, 1000),
            slideId: newSlide.id,
            name: 'Лист1'
        });
        const caseId = getRandomInt(10, 1000);
        const newSCase = new CaseModel({
            id: caseId,
            slideListId: newSlideList.id,
            title: 'Задача ' + caseId,
            caseStatus: 'in-work',
            isOpen: false,
            discus: '',
            resolut: '',
            children: [],
            order: 0
        });
        commit('PUSH_SLIDE', newSlide);
        commit('PUSH_SLIDE_LIST', newSlideList);
        commit('PUSH_CASE', newSCase);
        setTimeout(() => {
            commit('SELECT_SLIDE', {
                slide: newSlide,
                isNew: true
            });
        }, 20)
    },
    removeSlide({commit}, payload) {
        if (payload.slidesLength > 1) {
            const slide = payload.slide;
            commit('REMOVE_SLIDE', slide);
            if (slide.isSelected) { /* Если удаляемый слайд был выбран, то выбираем последний слайд */
                setTimeout(() => {
                    const query = router.currentRoute.query;
                    if (query && query.projectId) {
                        const _projectId = parseInt(query.projectId);
                        const filteredSlides = state.slides.filter(_s => {
                            if (_s.slideState !== 'archived' && _s.projectId === _projectId) {
                                return _s;
                            }
                        });
                        commit('SELECT_SLIDE', { slide: filteredSlides[filteredSlides.length-1] });
                    }
                }, 20);
            }
        }
    },
    selectSlide({commit}, _slide) {
        commit('SELECT_SLIDE', {slide: _slide});
    },
    /* SLIDE LISTS */
    fetchSlideLists({commit}) {
        commit('SET_SLIDE_LISTS', mockSlideLists);
    },
    pushSlideList({commit}) {
        commit('PUSH_SLIDE_LIST', {});
    },
    /* CASES */
    fetchCases({commit}) {
        commit('SET_CASES', mockCases);
    },
    pushCase({commit}) {
        commit('PUSH_CASE', {});
    },
    selectCase({commit}, _case) {
        commit('SELECT_CASE', _case);
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
    /* SLIDES */
    SET_SLIDES(state, payload) {
        const query = router.currentRoute.query;
        if (query && query.slideId) {
            const _slideId = parseInt(query.slideId);
            state.slides = payload.slides.map(_s => {
                const _notif = payload.notifications.filter(_n1 => _n1.slideId === _s.id)
                  .filter(_n2 => _n2.status === 'notRead');
                _s.isSelected = _s.id === _slideId;
                _s.isNotify = _notif.length;
                return _s;
            });
        } else {
            state.slides = payload.slides;
        }
    },
    PUSH_SLIDE(state, _slide) { state.slides.push(_slide); },
    SELECT_SLIDE(state, payload) {
        const _slide = payload.slide;
        const query = router.currentRoute.query;
        if (query && query.slideId) {
            const _slideId = parseInt(query.slideId);
            if (payload.isNew || (_slideId !== _slide.id)) {
                const _projectId = parseInt(query.projectId);
                state.slides.forEach(_s => {
                    if (_s.slideState !== 'archived' && _s.projectId === _projectId) {
                        _s.isSelected = _s.id === _slide.id;
                    }
                });
                setTimeout(() => {
                    const _slideList = state.slideLists
                      .find(_sl => _sl.slideId === _slide.id);
                    if (_slideList) {
                        // TODO SELECT SLIDE LIST
                        const slideListId = _slideList.id;
                        const _case = state.cases.find(_c => _c.slideListId === slideListId);
                        if (_case) {
                            const caseId = _case.id;
                            state.cases.forEach(_c => {
                                if (_c.caseStatus !== 'archived' && _c.slideListId === slideListId) {
                                    _c.isSelected = _c.id === caseId;
                                }
                            });
                            setTimeout(() => {
                                router.push({
                                    path: '/case-tracker',
                                    query: Object.assign({}, query, {
                                        slideId: _slide.id,
                                        slideListId: _slideList.id,
                                        caseId: _case.id,
                                    })
                                });
                            }, 20)
                        }
                    }
                }, 20);
            }
        }
    },
    REMOVE_SLIDE(state, _slide) {
        _slide.slideState = 'archived';
    },
    /* SLIDE LISTS */
    SET_SLIDE_LISTS(state, _slideLists) {
        const query = router.currentRoute.query;
        if (query && query.slideListId) {
            const _slideListId = parseInt(query.slideListId);
            state.slideLists = _slideLists.map(_sl => {
                _sl.isSelected = _sl.id === _slideListId;
                return _sl;
            });
        } else {
            state.slideLists = _slideLists;
        }
    },
    PUSH_SLIDE_LIST(state, _slideList) { state.slideLists.push(_slideList); },
    /* CASES */
    SET_CASES(state, _cases) {
        const query = router.currentRoute.query;
        if (query && query.caseId) {
            const _caseId = parseInt(query.caseId);
            state.cases = _cases.map(_c => {
                _c.isSelected = _c.id === _caseId;
                return _c;
            });
        } else {
            state.cases = _cases;
        }
    },
    PUSH_CASE(state, _case) { state.cases.push(_case); },
    SELECT_CASE(state, _case) {
        const query = router.currentRoute.query;
        if (query && query.caseId) {
            const caseId = parseInt(query.caseId);
            if (caseId !== _case.id) {
                const slideListId = parseInt(query.slideListId);
                state.cases.forEach(_c => {
                    if (_c.caseStatus !== 'archived' && _c.slideListId === slideListId) {
                        _c.isSelected = _c.id === _case.id;
                    }
                });
                setTimeout(() => {
                    router.push({
                        path: '/case-tracker',
                        query: Object.assign({}, query, {caseId: _case.id})
                    });
                }, 20)
            }
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}