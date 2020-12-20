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
  activeTool: 'moveTool', /* moveTool | markerTool | textTool | shapeTool | superTool | handTool */
  activeShapeTool: 'rectangleTool', /* rectangleTool | ellipseTool */
  canvasInfo: {
    canvasWidth: 0,
    canvasHeight: 0,
  }
};

const getters = {
  getSlides: state => state.slides,
  getSlideLists: state => state.slideLists,
  getActiveSlide: state => state.activeSlide,
  getActiveSlideList: state => state.activeSlideList,
  getActiveTool: state => state.activeTool,
  getActiveShapeTool: state => state.activeShapeTool,
  getCanvasInfo: state => state.canvasInfo,
};

const actions = {
  /* SLIDES */
  fetchSlides({commit}) {
    return new Promise((resolve) => {
      setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
        const data = mockSlides;
        commit('SET_SLIDES', data);
        resolve(data);
      }, 200);
    });
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
  setActiveSlide({commit}, _slide) {
    commit('SET_ACTIVE_SLIDE', _slide);
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
    return new Promise((resolve) => {
      const setFirstSlide = () => {
        if (slides[0]) {
          dispatch('selectCaseListAndCaseOfActiveSlide', {
            slide: slides[0],
            isFirstLoad: true
          });
          dispatch('setIsLoading');
          resolve(slides[0]);
        }
      };
      const query = router.currentRoute.query;
      if (query && query.slideId) {
        const _slideId = parseInt(query.slideId);
        const foundSlide = slides.find(_s => _s.id === _slideId);
        if (foundSlide) {
          dispatch('selectCaseListAndCaseOfActiveSlide', {
            slide: foundSlide,
            isFirstLoad: true
          });
          dispatch('setIsLoading');
          resolve(foundSlide);
        } else {
          setFirstSlide(slides);
        }
      } else { /* Если в параметрах url не указан слайд */
        setFirstSlide(slides);
      }
    });
  },
  selectCaseListAndCaseOfActiveSlide({commit, getters}, payload) {
    const _slide = payload.slide;
    const query = router.currentRoute.query;
    const _cases = getters.getCases;
    let slideIdNotEqual = true;
    if (query && query.slideId) {
      const _slideId = parseInt(query.slideId);
      slideIdNotEqual = _slideId !== _slide.id;
    }
    if (payload.isNew || payload.isFirstLoad || payload.isRepaint || slideIdNotEqual) {
      commit('SELECT_SLIDE', _slide);
      setTimeout(() => {
        const _slideList = state.slideLists
          .find(_sl => _sl.slideId === _slide.id);
        if (_slideList) {
          commit('SELECT_SLIDE_LIST', _slideList);
          const slideListId = _slideList.id;
          const _case = _cases.find(_c => (_c.slideListId === slideListId) &&
            _c.caseStatus !== 'archived');
          if (_case) {
            if (state.activeTool === 'superTool') {
              commit('SET_ACTIVE_TOOL', 'moveTool');
            }
            setTimeout(() => {
              if (slideIdNotEqual) {
                router.push({
                  path: '/case-tracker',
                  query: Object.assign({}, query, {
                    slideId: _slide.id,
                    slideListId: _slideList.id,
                    caseId: _case.id,
                  })
                });
              }
              if (!payload.isFirstLoad) {
                setTimeout(() => {
                  commit('SELECT_CASE', {
                    case: _case,
                    reloadWithSlide: false
                  });
                }, 200)
              }
            }, 20)
          } else { /* Нет ни одного кейса */
            setTimeout(() => {
              if (slideIdNotEqual) {
                router.push({
                  path: '/case-tracker',
                  query: Object.assign({}, query, {
                    slideId: _slide.id,
                    slideListId: _slideList.id,
                    caseId: 0,
                  })
                });
              }
              if (!payload.isFirstLoad) {
                setTimeout(() => {
                  if (_slide.img) { /* Переключаемся на суперТул только, если добавлено изобр-е */
                    commit('SET_ACTIVE_SHAPE_TOOL', 'rectangleTool');
                    commit('SET_ACTIVE_TOOL', 'superTool');
                  } else { /* Если нет изобр-я, то перекинуть на moveTool */
                    commit('SET_ACTIVE_TOOL', 'moveTool');
                  }
                  commit('SELECT_CASE', {
                    case: null,
                    reloadWithSlide: false
                  });
                }, 200);
              }
            }, 20)
          }
        }
      }, 20);
    }
  },
  changeSlideZoom({commit}, payload) {
    commit('CHANGE_SLIDE_ZOOM', payload);
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
      if (foundSlide) {
        state.activeShapeTool = 'rectangleTool';
        state.activeTool = 'superTool'; /* При добавлении изобр-я переключаемся на суперТул, чтобы создать кейс */
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
    }
  },
  SET_ACTIVE_TOOL(state, _activeTool) { state.activeTool = _activeTool; },
  SET_ACTIVE_SHAPE_TOOL(state, _activeShapeTool) { state.activeShapeTool = _activeShapeTool; },
  SET_CANVAS_INFO(state, info) { state.canvasInfo = info; },
  CHANGE_SLIDE_ZOOM(state, payload) {
    payload.z = parseFloat(payload.z.toFixed(2));
    state.activeSlide.zoom = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}