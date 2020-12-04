import {SlideModel} from "@/models/case-tracker/SlideModel";
import {SlideList} from "@/models/case-tracker/SlideList";
import {getRandomInt} from "@/functions/calculations";
// import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {mockSlideLists, mockSlides} from "@/data/testData";

const state = {
  slides: [],
  slideLists: [],
  activeSlide: null,
  activeSlideList: null,
  activeTool: 'moveTool', /* moveTool | textTool | shapeTool | superTool | handTool */
  activeShapeTool: 'rectangleTool', /* rectangleTool | circleTool */
  canvasInfo: {
    canvasWidth: 0,
    canvasHeight: 0,
  }
};

const getters = {
  getSlides: state => state.slides,
  getSlideLists: state => state.slideLists,
  getActiveSlide: state => state.activeSlide,
  getActiveTool: state => state.activeTool,
  getActiveShapeTool: state => state.activeShapeTool,
  getCanvasInfo: state => state.canvasInfo,
};

const actions = {
  /* SLIDES */
  fetchSlides({commit}) {
    setTimeout(() => { // TODO Имитация задержки с сервера
      return new Promise((resolve) => {
        const data = mockSlides;
        commit('SET_SLIDES', data);
        resolve(data);
      });
    }, 500);
  },
  pushSlide({commit, getters, dispatch}) {
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
    // const caseId = getRandomInt(10, 1000);
    // const newSCase = new CaseModel({
    //   id: caseId,
    //   slideListId: newSlideList.id,
    //   title: 'Задача ' + caseId,
    //   caseStatus: 'in-work',
    //   isOpen: false,
    //   discus: '',
    //   resolut: '',
    //   children: [],
    //   order: 0
    // });
    commit('PUSH_SLIDE', newSlide);
    commit('PUSH_SLIDE_LIST', newSlideList);
    // commit('PUSH_CASE', newSCase);
    setTimeout(() => {
      dispatch('selectCaseListAndCaseOfActiveSlide', {
        slide: newSlide,
        isNew: true,
      });
    }, 20)
  },
  removeSlide({commit, dispatch}, payload) {
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
            dispatch('selectCaseListAndCaseOfActiveSlide', {
              slide: filteredSlides[filteredSlides.length-1],
            });
          }
        }, 20);
      }
    }
  },
  selectSlide({dispatch}, _slide) {
    dispatch('selectCaseListAndCaseOfActiveSlide', {
      slide: _slide,
    });
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
  setActiveShapeTool({commit}, shapeTool) {
    commit('SET_ACTIVE_SHAPE_TOOL', shapeTool);
  },
  setCanvasInfo({commit}, info) {
    commit('SET_CANVAS_INFO', info);
  },
  /* LOCAL ACTIONS */
  selectFoundSlideFromSlides({dispatch}, slides) {
    return new Promise((resolve, reject) => {
      const query = router.currentRoute.query;
      if (query && query.slideId) {
        const _slideId = parseInt(query.slideId);
        const foundSlide = slides.find(_s => _s.id === _slideId);
        if (foundSlide) {
          dispatch('selectCaseListAndCaseOfActiveSlide', {
            slide: foundSlide,
          });
          resolve(foundSlide);
        } else {
          reject(false);
        }
      }
    });
  },
  selectCaseListAndCaseOfActiveSlide({commit, getters}, payload) {
    const _slide = payload.slide;
    commit('SELECT_SLIDE', _slide);
    const _cases = getters.getCases;
    const query = router.currentRoute.query;
    if (query && query.slideId) {
      const _slideId = parseInt(query.slideId);
      if (payload.isNew || (_slideId !== _slide.id)) {
        setTimeout(() => {
          const _slideList = state.slideLists
            .find(_sl => _sl.slideId === _slide.id);
          if (_slideList) {
            commit('SELECT_SLIDE_LIST', _slideList);
            const slideListId = _slideList.id;
            const _case = _cases.find(_c => (_c.slideListId === slideListId) &&
              _c.caseStatus !== 'archived');
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
                setTimeout(() => {
                  commit('SELECT_CASE', _case);
                }, 200);
              }, 20)
            } else {
              setTimeout(() => {
                router.push({
                  path: '/case-tracker',
                  query: Object.assign({}, query, {
                    slideId: _slide.id,
                    slideListId: _slideList.id,
                    caseId: 0,
                  })
                });
                setTimeout(() => {
                  commit('SELECT_CASE', null);
                }, 200);
              }, 20)
            }
          }
        }, 20);
      }
    }
  },
};

const mutations = {
  /* SLIDES */
  SET_SLIDES(state, slides) {
    state.slides = slides;
  },
  PUSH_SLIDE(state, _slide) { state.slides.push(_slide); },
  SELECT_SLIDE(state, _slide) {
    state.activeSlide = _slide;
  },
  REMOVE_SLIDE(state, _slide) {
    _slide.slideState = 'archived';
  },
  SET_ACTIVE_SLIDE(state, _slide) {
    state.activeSlide = _slide;
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
  SELECT_SLIDE_LIST(state, _slideList) {
    state.activeSlideList = _slideList;
  },
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
  SET_ACTIVE_SHAPE_TOOL(state, _activeShapeTool) { state.activeShapeTool = _activeShapeTool; },
  SET_CANVAS_INFO(state, info) { state.canvasInfo = info; },
};

export default {
  state,
  getters,
  actions,
  mutations
}