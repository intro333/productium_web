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
        const newSlide = {
            id: 1,
            slideState: 'in-work',
            projectId: selectedProject.id,
            order: 0,
            image: '',
            isSelected: false,
            isNotify: false,
        };
        newSlide.id = getRandomInt(10, 1000);
        commit('PUSH_SLIDE', newSlide);
        setTimeout(() => {
            commit('SELECT_SLIDE', newSlide);
        }, 20)
    },
    removeSlide({commit}, _slide) {
        commit('REMOVE_SLIDE', _slide);
    },
    selectSlide({commit}, _slide) {
        commit('SELECT_SLIDE', _slide);
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
    SELECT_SLIDE(state, _slide) {
        state.slides.forEach(_sl => {
            _sl.isSelected = _sl.id === _slide.id;
        });
        const query = router.currentRoute.query;
        if (query && query.slideId) {
            const _slideId = parseInt(query.slideId);
            if (_slideId !== _slide.id) {
                router.push({ path:'/case-tracker',
                    query: Object.assign({}, query, {slideId: _slide.id}) });
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
    PUSH_CASE(state, _case) { state.projects.push(_case); },
};

export default {
    state,
    getters,
    actions,
    mutations
}