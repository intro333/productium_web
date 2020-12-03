import {SlideModel} from "@/models/case-tracker/SlideModel";
import {SlideList} from "@/models/case-tracker/SlideList";
import {getRandomInt} from "@/functions/calculations";
import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {CanvasAreaModel} from "@/models/case-tracker/CanvasAreaModel";

const mockSlides = [
  new SlideModel({
    id: 1,
    slideState: 'in-work',
    projectId: 1,
    order: 0,
    img: null
  }),
  new SlideModel({
    id: 2,
    slideState: 'done',
    projectId: 1,
    order: 1,
    img: null
  }),
  new SlideModel({
    id: 3,
    slideState: 'in-work',
    projectId: 1,
    order: 2,
    img: null
  }),
  new SlideModel({
    id: 4,
    slideState: 'in-work',
    projectId: 1,
    order: 3,
    img: null
  }),
  new SlideModel({
    id: 5,
    slideState: 'archived',
    projectId: 2,
    order: 0,
    img: null
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

const state = {
  slides: [],
  slideLists: [],
  activeSlide: null,
  activeTool: 'moveTool', /* moveTool | textTool | rectangleTool | circleTool | superTool | handTool */
  canvasArea: new CanvasAreaModel(null, 0, 0)
};

const getters = {
  getSlides: state => state.slides,
  getSlideLists: state => state.slideLists,
  getActiveSlide: state => state.activeSlide,
  getActiveTool: state => state.activeTool,
  getCanvasArea: state => state.canvasArea,
};

const actions = {
  /* SLIDES */
  fetchSlides({commit, getters}) {
    setTimeout(() => { // TODO Имитация задержки с сервера
      return new Promise((resolve) => {
        commit('SET_SLIDES', mockSlides);
        const query = router.currentRoute.query;
        if (query && query.slideId) {
          const _slideId = parseInt(query.slideId);
          const foundSlide = mockSlides.find(_s => _s.id === _slideId);
          commit('SELECT_SLIDE', {
            slide: foundSlide,
            cases: getters.getCases
          });
        }
        resolve(mockSlides);
      });
    }, 500);
  },
  pushSlide({commit, getters}) {
    /* TODO Mock */
    const projects = getters.getProjects;
    const selectedProject = projects.find(_p => _p.isSelected);
    const newSlide = new SlideModel({
      id: getRandomInt(10, 1000),
      slideState: 'in-work',
      projectId: selectedProject.id,
      order: 0,
      img: null
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
        isNew: true,
        cases: getters.getCases
      });
    }, 20)
  },
  removeSlide({commit, getters}, payload) {
    if (payload.slidesLength > 1) {
      const slide = payload.slide;
      commit('REMOVE_SLIDE', slide);
      if (slide.isSelected) { /* Если удаляемый слайд был выбран, то выбираем последний слайд */
        slide.isSelected = false;
        setTimeout(() => {
          const query = router.currentRoute.query;
          if (query && query.projectId) {
            const _projectId = parseInt(query.projectId);
            const filteredSlides = state.slides.filter(_s => {
              if (_s.slideState !== 'archived' && _s.projectId === _projectId) {
                return _s;
              }
            });
            commit('SELECT_SLIDE', {
              slide: filteredSlides[filteredSlides.length-1],
              cases: getters.getCases
            });
          }
        }, 20);
      }
    }
  },
  selectSlide({commit, getters}, _slide) {
    commit('SELECT_SLIDE', {
      slide: _slide,
      cases: getters.getCases
    });
  },
  changeSlidesCanvasSize({commit}, activeSlide) {
    commit('CHANGE_SLIDES_CANVAS_SIZE', activeSlide);
  },
  setCanvasArea({commit}, canvas) {
    commit('SET_CANVAS_AREA', canvas);
  },
  /* SLIDE LISTS */
  fetchSlideLists({commit}) {
    commit('SET_SLIDE_LISTS', mockSlideLists);
  },
  pushSlideList({commit}) {
    commit('PUSH_SLIDE_LIST', {});
  },
  /* SLIDE IMAGE */
  setSlideImg({commit}, file) {
    commit('SET_SLIDE_IMG', file);
  },
  /* OTHER */
  setActiveTool({commit}, tool) {
    commit('SET_ACTIVE_TOOL', tool);
  },
};

const mutations = {
  /* SLIDES */
  SET_SLIDES(state, slides) {
    state.slides = slides;
  },
  PUSH_SLIDE(state, _slide) { state.slides.push(_slide); },
  SELECT_SLIDE(state, payload) {
    const _slide = payload.slide;
    const cases = payload.cases;
    state.activeSlide = _slide;
    const query = router.currentRoute.query;
    if (query && query.slideId) {
      const _slideId = parseInt(query.slideId);
      if (payload.isNew || (_slideId !== _slide.id)) {
        setTimeout(() => {
          const _slideList = state.slideLists
            .find(_sl => _sl.slideId === _slide.id);
          if (_slideList) {
            // TODO SELECT SLIDE LIST
            const slideListId = _slideList.id;
            const _case = cases.find(_c => _c.slideListId === slideListId);
            if (_case) {
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
  SET_ACTIVE_SLIDE(state, _slide) {
    state.activeSlide = _slide;
  },
  CHANGE_SLIDES_CANVAS_SIZE(state, activeSlide) {
    const query = router.currentRoute.query;
    if (activeSlide && query && query.projectId) {
      state.slides = state.slides.map(_s => {
        if (_s.canvasWidth && _s.slideState !== 'archived' &&
          _s.projectId === parseInt(query.projectId)) {
          _s.canvasWidth = activeSlide.canvasWidth;
          _s.canvasHeight = activeSlide.canvasHeight;
        }
        return _s;
      });
    }
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
  /* SLIDE CANVAS */
  SET_SLIDE_IMG(state, img) {
    const query = router.currentRoute.query;
    if (query && query.slideId) {
      const foundSlide = state.slides
        .find(_s => _s.id === parseInt(query.slideId));
      if (img) {
        foundSlide.img = img;
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => {
          foundSlide.imgBase64 = reader.result;
        };
      } else {
        foundSlide.img = null;
        foundSlide.imgBase64 = null;
      }
    }
  },
  SET_ACTIVE_TOOL(state, _activeTool) { state.activeTool = _activeTool; },
  SET_CANVAS_AREA(state, area) {
    state.canvasArea = area;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}