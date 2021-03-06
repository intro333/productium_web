import {SlideModel} from "@/models/case-tracker/SlideModel";
import {SlideList} from "@/models/case-tracker/SlideList";
import {getRandomInt} from "@/functions/calculations";
// import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {mockSlideLists, mockSlides} from "@/data/testData";
import {uuidHash} from "@/functions/conversation";
import {totalLimit} from "@/data/consts";
import {SimpleNotifyModel} from "@/models/modals/SimpleNotifyModel";
import i18n from "@/main";

export const state = {
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
  pushSlide({commit, dispatch}, payload) {
    dispatch('setIsLoading', true);
    return new Promise((resolve) => {
      let slidesOfProjectLength = 0;
      state.slides.forEach(_s => {
        if (_s.slideState !== 'archived' && _s.projectId === payload.projectId) {
          slidesOfProjectLength++;
        }
      });
      setTimeout(() => {
        if (slidesOfProjectLength <= totalLimit.slides-1) {
          commit('RESET_SLIDES_STATUS', 'isSelected');
          commit('RESET_SLIDE_LISTS_STATUS', 'isSelected');
          const newSlide = new SlideModel({
            id: uuidHash(),
            slideState: 'in-work',
            projectId: payload.projectId,
            order: slidesOfProjectLength,
            img: null,
            isSelected: true
          });
          const listId = uuidHash();
          const newSlideList = new SlideList({
            id: listId,
            slideId: newSlide.id,
            name: 'Лист' + listId,
            isSelected: true
          });
          commit('PUSH_SLIDE', newSlide);
          commit('PUSH_SLIDE_LIST', newSlideList);
          setTimeout(() => {
            const _slides = [];
            state.slides.forEach(_s => {
              if (_s.projectId === payload.projectId && _s.slideState !== 'archived') {
                const obj = Object.assign({}, _s);
                obj.canvas = null;
                obj.imgBase64 = null;
                obj.imgObj = null;
                _slides.push(obj);
              }
            });
            window.axios.post('api/projects-all/add-slide', {
              projectId: payload.projectId,
              slideData: {
                slides: _slides,
                slideLists: state.slideLists.filter(_l => _slides.find(_s => _s.id === _l.slideId)),
              }
            }).then(() => {
              // const data = response.data;
              setTimeout(() => {
                const query = payload.query ? Object.assign(payload.query, {slideId: newSlide.id, slideListId: newSlideList.id}) : null;
                dispatch('selectCaseListAndCaseOfActiveSlide', {
                  slide: newSlide,
                  isNew: true,
                  query,
                  noRoute: payload.noRoute
                }).then(() => {
                  resolve(newSlide);
                });
              }, 20);
            }, error => {
              console.log('error pushSlide', error);
            });
          }, 20);
        } else {
          dispatch('setIsLoading', false);
          dispatch('setSimpleNotify', new SimpleNotifyModel()
            .set(true,
              450,
              i18n.t('limit.exceeded'),
              [i18n.t('limit.slides'), totalLimit.slides],
              5000
            ))
        }
      }, 200);
    });
  },
  pushSlide2({commit, getters, dispatch}) {
    dispatch('setIsLoading', true);
    return new Promise((resolve) => {
      setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
        /* TODO Mock */
        const selectedProject = getters.getSelectedProject;
        const newSlide = new SlideModel({
          id: getRandomInt(10, 1000),
          slideState: 'in-work',
          projectId: selectedProject.id,
          order: 0,
          img: null
        });
        console.log(5, newSlide);
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
        resolve(newSlide);
        setTimeout(() => {
          dispatch('selectCaseListAndCaseOfActiveSlide', {
            slide: newSlide,
            isNew: true,
          });
        }, 20);
      }, 200);
    });
  },
  removeSlide({commit, getters, dispatch}, payload) {
    const selectedProject = getters.getSelectedProject;
    dispatch('setIsLoading', true);
    const slide = payload.slide;
    return new Promise((resolve) => {
      if (payload.slidesLength > 1) {
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
              resolve();
            }
          }, 20);
        }
        setTimeout(() => {
          const _slides = [];
          state.slides.forEach(_s => {
            if (_s.projectId === selectedProject.id && _s.slideState !== 'archived') {
              const obj = Object.assign({}, _s);
              obj.canvas = null;
              obj.imgBase64 = null;
              obj.imgObj = null;
              _slides.push(obj);
            }
          });
          window.axios.post('api/projects-all/add-slide', {
            projectId: selectedProject.id,
            slideData: {
              slides: _slides,
              slideLists: state.slideLists.filter(_l => _slides.find(_s => _s.id === _l.slideId)),
            }
          }).then(() => {
            dispatch('setIsLoading', false);
            const comments = getters.getCasesComments;
            dispatch('casesToArchiveBySlideId', slide.id);
            dispatch('casesCommentsToArchiveBySlideId', {comments, slideId: slide.id});
            setTimeout(() => {
              dispatch('updateCaseInfoOnServer');
            }, 500);
          }, error => {
            console.log('error removeSlide', error);
          });
        }, 50);
      } else if (payload.slidesLength === 1) {
        /* При удалении последнего слайда удалять картинку и кейсы и оставлять пустой слайд (начальное состояние) */
        commit('REMOVE_SLIDE', slide);
        dispatch('pushSlide', {projectId: selectedProject.id});
        resolve();
      }
    });
  },
  selectSlide({dispatch}, _slide) {
    const query = router.currentRoute.query;
    if (_slide.id !== query.slideId) {
      dispatch('setIsLoading', true);
      dispatch('selectCaseListAndCaseOfActiveSlide', {
        slide: _slide,
      });
    }
  },
  setActiveSlide({commit}, _slide) {
    commit('SET_ACTIVE_SLIDE', _slide);
  },
  updateSlideInfoOnServer({getters}) {
    const selectedProject = getters.getSelectedProject;
    const _slides = [];
    state.slides.forEach(_s => {
      if (_s.projectId === selectedProject.id && _s.slideState !== 'archived') {
        const obj = _s;
        obj.canvas = null;
        obj.imgBase64 = null;
        obj.imgObj = null;
        _slides.push(obj);
      }
    });
    window.axios.post('api/projects-all/add-slide', {
      projectId: selectedProject.id,
      slideData: {
        slides: _slides,
        slideLists: state.slideLists.filter(_l => _slides.find(_s => _s.id === _l.slideId)),
      }
    }).then(() => {
      //
    }, error => {
      console.log('error updateSlideInfoOnServer', error);
    });
  },
  /* SLIDE LISTS */
  fetchSlideLists({commit}) {
    commit('SET_SLIDE_LISTS', mockSlideLists);
  },
  pushSlideList({commit}) {
    commit('PUSH_SLIDE_LIST', {});
  },
  async getImgByUrl(_, url) {
    return new Promise((resolve, reject) => {
      window.axios.get(url, { responseType: 'arraybuffer' })
        .then(response => {
          let image = btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          resolve(`data:${response.headers['content-type'].toLowerCase()};base64,${image}`);
        }, error => {
          console.log('error getImgByUrl', error);
          reject(error);
        });
    });
  },
  /* SLIDE IMAGE */
  setSlideImg({commit, getters, dispatch}, file) {
    const currentUser = getters.getCurrentUser;
    const project = getters.getSelectedProject;
    return new Promise((resolve, reject) => {
      const query = router.currentRoute.query;
      if (query && query.slideId) {
        const foundSlide = state.slides
          .find(_s => _s.id === query.slideId);
        if (foundSlide) {
          const isFileSizeCorrect = file.size <= (1 * 1024 * 1024); // Не больше 4MB
          const isFileTypeCorrect = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'].indexOf(file.type) !== -1;
          if (isFileSizeCorrect && isFileTypeCorrect) {
            let formData = new FormData();
            formData.append('file', file);
            formData.append('userId', currentUser.id);
            formData.append('projectId', project.id);
            formData.append('slideId', state.activeSlide.id);
            window.axios.post('api/projects-all/upload-slide-img', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(response => {
              const data = response.data;
              foundSlide.imgUrl = data.imgUrl;
              commit('SET_SLIDE_IMG', {file, foundSlide});
              resolve(data);
            }, error => {
              console.log('error setSlideImg', error);
              reject(error);
            });
          } else {
            let error = '';
            if (!isFileSizeCorrect) {
              error = [i18n.t('slide.uploadFileErrorSize'), '4MB'];
            } else if (!isFileTypeCorrect) {
              error = [i18n.t('slide.uploadFileErrorType')];
            }
            dispatch('setSimpleNotify', new SimpleNotifyModel()
              .set(true,
                450,
                i18n.t('slide.uploadFileErrorTitle'),
                error,
                3000
              ))
            reject(error);
          }
        }
      }
    });
  },
  /* OTHER */
  setActiveTool({commit, getters, dispatch}, tool) {
    if (tool === 'superTool') {
      const cases = getters.getCases;
      let casesOfSlidesLength = 0;
      cases.forEach(_case => {
        if (_case.slideId === state.activeSlide.id) {
          casesOfSlidesLength++;
        }
      });
      setTimeout(() => {
        if (casesOfSlidesLength === totalLimit.cases) {
          commit('SET_ACTIVE_TOOL', 'moveTool');
          dispatch('setSimpleNotify', new SimpleNotifyModel()
            .set(true,
              450,
              i18n.t('limit.exceeded'),
              [i18n.t('limit.cases'), totalLimit.cases],
              5000
            ))
        }
      }, 100);
    }
    commit('SET_ACTIVE_TOOL', tool);
  },
  setActiveShapeTool({commit}, shapeTool) {
    commit('SET_ACTIVE_SHAPE_TOOL', shapeTool);
  },
  setCanvasInfo({commit}, info) {
    commit('SET_CANVAS_INFO', info);
  },
  /* LOCAL ACTIONS */
  selectFoundSlideFromSlides({dispatch}, query) {
    const slides = state.slides;
    return new Promise((resolve) => {
      const setFirstSlide = () => {
        if (slides[0]) {
          dispatch('selectCaseListAndCaseOfActiveSlide', {
            slide: slides[0],
            isFirstLoad: true
          }).then(_case => {
            dispatch('setIsLoading', false);
            resolve(_case);
          });
        } else {
          console.log('НЕВЕРНЫЙ РОУТ FROM selectFoundSlideFromSlides!');
          // router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1'); // TODO Так нельзя!
        }
      };
      if (query && query.slideId) {
        const _slideId = query.slideId;
        const foundSlide = slides.find(_s => _s.id === _slideId);
        if (foundSlide) {
          dispatch('selectCaseListAndCaseOfActiveSlide', {
            slide: foundSlide,
            isFirstLoad: true,
            query,
          }).then(_case => {
            dispatch('setIsLoading', false);
            resolve(_case);
          });
        } else {
          setFirstSlide(slides);
        }
      } else { /* Если в параметрах url не указан слайд */
        setFirstSlide(slides);
      }
    });
  },
  selectCaseListAndCaseOfActiveSlide({commit, getters, dispatch}, payload) {
    return new Promise((resolve) => {
      const _slide = payload.slide;
      const query = payload.query || router.currentRoute.query;
      const currentQuery = router.currentRoute.query;
      // console.log('query FROM slides', query);
      // console.log('currentQuery FROM slides', currentQuery);
      const _cases = getters.getCases;
      const slideLists = state.slideLists;
      let slideIdNotEqual = true;
      if (query && query.slideId) {
        const _slideId = currentQuery.slideId;
        slideIdNotEqual = _slideId !== _slide.id;
      }
      if (payload.isNew || payload.isFirstLoad || payload.isRepaint || slideIdNotEqual) {
        commit('SELECT_SLIDE', _slide);
        setTimeout(() => {
          let _slideList = null;
          if (payload.isFirstLoad || payload.isRepaint) {
            if (query && query.slideListId) {
              const querySlideListId = query.slideListId;
              _slideList = slideLists
                .find(_sl => (_sl.id === querySlideListId) && (_sl.slideId === _slide.id));
              if (!_slideList) {
                _slideList = slideLists
                  .find(_sl => _sl.slideId === _slide.id);
              }
            }
          } else {
            _slideList = slideLists
              .find(_sl => _sl.slideId === _slide.id);
          }
          setTimeout(() => {
            if (_slideList) {
              commit('SELECT_SLIDE_LIST', _slideList);
              const slideListId = _slideList.id;
              let _case = null;
              if (payload.isFirstLoad || payload.isRepaint) {
                if (query && query.caseId && query.caseId) {
                  const caseId = query.caseId;
                  _case = _cases
                    .find(_c => (_c.id === caseId) && (_c.slideListId === slideListId));
                  if (!_case) {
                    _case = _cases.find(_c => (_c.slideListId === slideListId) &&
                      _c.caseStatus !== 'archived');
                  }
                } else {
                  _case = _cases.find(_c => (_c.slideListId === slideListId) &&
                    _c.caseStatus !== 'archived');
                }
              } else {
                _case = _cases.find(_c => (_c.slideListId === slideListId) &&
                  _c.caseStatus !== 'archived');
              }
              setTimeout(() => {
                if (_case) {
                  if (state.activeTool === 'superTool') {
                    commit('SET_ACTIVE_TOOL', 'moveTool');
                  }
                  if (slideIdNotEqual) {
                    console.log('router push slide 1.1');
                    router.push({
                      path: '/case-tracker',
                      query: Object.assign({}, query, {
                        slideId: _slide.id,
                        slideListId,
                        caseId: _case.id,
                      })
                    });
                  } else if (payload.isFirstLoad) {
                    if (slideListId !== query.slideListId || _case.id !== query.caseId) {
                      console.log('router push slide 1.2');
                      router.push({
                        path: '/case-tracker',
                        query: Object.assign({}, query, {
                          slideId: _slide.id,
                          slideListId,
                          caseId: _case.id,
                        })
                      });
                    }
                  }
                  if (!payload.isFirstLoad) {
                    setTimeout(() => {
                      commit('SELECT_CASE', {
                        case: _case,
                        reloadWithSlide: false
                      });
                    }, 200)
                  }
                  resolve(_case);
                } else { /* Нет ни одного кейса */
                  // console.log('payload.noRoute', payload.noRoute);
                  if (slideIdNotEqual && !payload.noRoute) {
                    console.log('router push slide 1.3', query);
                    router.push({
                      path: '/case-tracker',
                      query: Object.assign({}, query, {
                        slideId: _slide.id,
                        slideListId,
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
                  dispatch('setIsLoading', false);
                  resolve(null);
                }
              }, 20);
            } else {
              console.log('НЕВЕРНЫЙ РОУТ FROM selectCaseListAndCaseOfActiveSlide!');
              dispatch('setIsLoading', false);
              // router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1'); // TODO Так нельзя!
            }
          }, 20);
        }, 20);
      } else {
        dispatch('setIsLoading', false);
      }
    });
  },
  changeSlideZoom({commit}, payload) {
    commit('CHANGE_SLIDE_ZOOM', payload);
  },
};

const mutations = {
  /* SLIDES */
  SET_ALL_SLIDES_STATE(state, newState) {
    Object.keys(newState).forEach(_k => {
      state[_k] = newState[_k];
    });
  },
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
  SET_ACTIVE_SLIDE_LIST(state, _slideLIst) {
    state.activeSlideList = _slideLIst;
  },
  RESET_SLIDES_STATUS(state, status) {
    state.slides.forEach(_s => {
      _s[status] = false;
    });
  },
  RESET_SLIDE_LISTS_STATUS(state, status) {
    state.slideLists.forEach(_s => {
      _s[status] = false;
    });
  },
  UPDATE_SLIDE_LISTS_FROM_SOCKET(state, newSlideLists) {
    // const ids = newSlideLists.map(_nsl => _nsl.id);
    // state.slideLists = state.slideLists.filter(_sl => _sl.id.indexOf(ids) !== -1);
    newSlideLists.forEach(_nsl => {
      const foundSl = state.slideLists.find(_osl => _osl.id === _nsl.id);
      if (foundSl) {
        Object.assign(foundSl, _nsl);
      } else {
        state.slideLists.push(_nsl);
      }
    });
  },
  UPDATE_SLIDES_FROM_SOCKET(state, newSlides) {
    // const ids = newSlides.map(_ns => _ns.id);
    // state.slides = state.slides.filter(_s => _s.id.indexOf(ids) !== -1);
    newSlides.forEach(_ns => {
      const foundSlide = state.slides.find(_os => _os.id === _ns.id);
      if (foundSlide) {
        console.log('foundSlide', foundSlide)
        foundSlide.imgUrl = _ns.imgUrl;
      } else {
        console.log('_ns', _ns)
        state.slides.push(_ns);
      }
    });
  },
  /* SLIDE LISTS */
  SET_SLIDE_LISTS(state, _slideLists) {
    const query = router.currentRoute.query;
    if (query && query.slideListId) {
      const _slideListId = query.slideListId;
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
  SET_SLIDE_IMG(state, payload) {
    const foundSlide = payload.foundSlide;
    const img = payload.file;
    state.activeShapeTool = 'rectangleTool';
    state.activeTool = 'superTool'; /* При добавлении изобр-я переключаемся на суперТул, чтобы создать кейс */
    // console.log('img', img);
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
