import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {getRandomInt} from "@/functions/calculations";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import {mockCases, mockCaseComments} from "@/data/testData";

const state = {
  cases: [],
  casesComments: [],
  selectedCase: null
};

const getters = {
  getCases: state => state.cases,
  getCasesComments: state => state.casesComments,
  getSelectedCase: state => state.selectedCase,
};

const actions = {
  /* CASES */
  fetchCases({commit}) {
    setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
      return new Promise((resolve) => {
        const data = mockCases;
        commit('SET_CASES', data);
        resolve(data);
      });
    }, 200);
  },
  pushCase({commit, dispatch}) {
    return new Promise((resolve) => {
      setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
        const query = router.currentRoute.query;
        if (query && query.slideListId) {
          // TODO MOCK
          const caseId = getRandomInt(10, 1000);
          const newSCase = new CaseModel({
            id: caseId,
            projectId: parseInt(query.projectId),
            slideId: parseInt(query.slideId),
            slideListId: parseInt(query.slideListId),
            title: 'Задача ' + caseId,
            caseStatus: 'in-work',
            isOpen: true,
            discus: '',
            resolut: '',
            children: [],
            order: 0,
          });
          commit('PUSH_CASE', newSCase);
          setTimeout(() => {
            dispatch('goToSelectedCase', {
              case: newSCase,
              reloadWithSlide: true
            });
          }, 20);
          resolve(newSCase);
        }
      }, 200);
    });
  },
  selectCase({commit, dispatch}, payload) {
    if (!payload.isSelectedChild) {
      commit('CLEAR_CASE_CHILDREN', payload._case);
    }
    dispatch('goToSelectedCase', {
      case: payload._case,
      reloadWithSlide: true
    });
  },
  removeCase({commit, dispatch}, _case) {
    commit('REMOVE_CASE', _case);
    if (_case.isSelected) {
      _case.isSelected = false;
      setTimeout(() => {
        const query = router.currentRoute.query;
        if (query && query.slideListId) {
          const _slideListId = parseInt(query.slideListId);
          const filteredCases = state.cases.filter(_s =>
            _s.caseStatus !== 'archived' && _s.slideListId === _slideListId);
          const anotherCase = filteredCases.length ? filteredCases[filteredCases.length-1] : { id: 0 };
          dispatch('goToSelectedCase', {
            case: anotherCase,
            reloadWithSlide: true,
            closeCommentsModal: true
          });
        }
      }, 20);
    }
  },
  goToSlideAndCase({dispatch, getters}, notify) {
    router.push({
      path: '/case-tracker',
      query: {
        projectId: notify.projectId,
        slideId: notify.slideId,
        slideListId: notify.slideListId,
        caseId: notify.caseId,
        commentId: notify.id
      }
    });
    const _slideId = parseInt(notify.slideId);
    const foundSlide = getters.getSlides.find(_s => _s.id === _slideId);
    if (foundSlide) {
      dispatch('selectCaseListAndCaseOfActiveSlide', {
        slide: foundSlide,
        isRepaint: true
      });
    }
    dispatch('openCommentsModalByCommentId', notify.id);
  },
  selectFoundCaseFromCases({dispatch}) {
    const query = router.currentRoute.query;
    if (query && query.caseId) {
      const _caseId = parseInt(query.caseId);
      const foundCase = state.cases.find(_s => _s.id === _caseId);
      if (foundCase) {
        dispatch('goToSelectedCase', {
          case: foundCase,
          reloadWithSlide: false,
          isFirstLoad: true
        });
      }
    }
  },
  goToSelectedCase({commit, dispatch}, payload) {
    const _case = payload.case;
    const query = router.currentRoute.query;
    if (query && query.caseId) {
      const caseId = parseInt(query.caseId);
      if (payload.isFirstLoad) {
        commit('SELECT_CASE', payload);
      }
      if (caseId !== _case.id) {
        commit('SELECT_CASE', payload);
        if (payload.closeCommentsModal && query.commentId) {
          delete query.commentId;
          dispatch('setCentralModal', new CentralModalModel());
        }
        setTimeout(() => {
          router.push({
            path: '/case-tracker',
            query: Object.assign({}, query, {caseId: _case.id})
          });
        }, 20);
      }
    }
  },
  openCase({commit}) {
    commit('OPEN_CASE');
  },
  /* CASE COMMENTS */
  fetchCaseComments({commit}) {
    commit('SET_CASES_COMMENTS', mockCaseComments);
  },
  openCommentsModalByCommentId({dispatch}, commentId) {
    dispatch('setCentralModal',
      new CentralModalModel()
        .set(true,
          'CommentsModal',
          400,
          commentId,
          {
            close: () => {
              const query = router.currentRoute.query;
              const newQuery = {
                projectId: query.projectId,
                slideId: query.slideId,
                slideListId: query.slideListId,
                caseId: query.caseId,
              }
              setTimeout(() => {
                router.push({
                  path: '/case-tracker',
                  query: newQuery
                });
              }, 30);
            }
          })
    );
  },
  /* SHAPES */
  addShapeToCase({commit}, shapeObj) {
    return new Promise((resolve) => {
      setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
        // TODO После события mouse:up попадаем сюда, создаём в БД фигуру и затем добавляем её в foundCase
        const id = getRandomInt(10, 1000);
        shapeObj.id = id;
        const foundCase = state.cases.find(_c => _c.id === state.selectedCase.id);
        if (foundCase) {
          commit('ADD_SHAPE_TO_CASE', {
            case: foundCase,
            shapeObj
          });
        }
        resolve(shapeObj);
      }, 200);
    });
  },
  selectCaseChild({commit}, payload) {
    commit('SELECT_CASE_CHILD', payload);
  },
  removeCaseChild({commit}, _caseChild) {
    commit('REMOVE_CASE_CHILD', _caseChild);
  },
  changeCaseStatus({commit}, payload) {
    commit('CHANGE_CASE_STATUS', payload);
  },
  changeCasesParamsByOffset({commit}, payload) {
    commit('CHANGE_CASES_PARAMS_BY_OFFSET', payload);
  },
  changeCaseElemFields({commit}, fields) {
    return new Promise((resolve, reject) => {
      const foundCase = state.cases.find(_c => _c.id === state.selectedCase.id);
      if (foundCase) {
        commit('CHANGE_CASE_ELEM_FIELDS', {
          fields,
          foundCase
        });
        resolve(foundCase);
      } else {
        reject(false);
      }
    });
  },
  clearCaseChildren({commit}, _case) {
    commit('CLEAR_CASE_CHILDREN', _case);
  },
};

const mutations = {
  /* CASES */
  SET_CASES(state, _cases) {
    state.cases = _cases;
  },
  PUSH_CASE(state, _case) { state.cases.push(_case); },
  SELECT_CASE(state, payload) {
    state.selectedCase = payload.case;
  },
  REMOVE_CASE(state, _case) {
    _case.caseStatus = 'archived';
    // TODO На серваке поместим в архив кейс и что делать с оповещениями?
    // Можно оставить так и после перезагрузки страницы их не будет, а до этого они будут со статусом archived
    state.casesComments.forEach(_c => {
      if (_c.caseId === _case.id) {
        _c.notifyInfo = 'archived';
      }
    })
  },
  REMOVE_CASE_CHILD(state, _caseChild) {
    const activeCase = state.cases.find(_c => _c.id === state.selectedCase.id);
    if (activeCase) {
      activeCase.children = activeCase.children
        .filter(_ch => _ch.id !== _caseChild.id);
      state.selectedCase = activeCase;
    }
  },
  CHANGE_CASE_STATUS(state, payload) {
    payload._case.caseStatus = payload.status;
  },
  OPEN_CASE(state) {
    state.selectedCase.isOpen = true;
  },
  /* CASE COMMENTS */
  SET_CASES_COMMENTS(state, comments) {
    state.casesComments = comments;
  },
  CHANGE_CASES_PARAMS_BY_OFFSET(state, payload) {
    state.cases = state.cases.map(_c => {
      if (_c.caseStatus !== 'archived' &&
        _c.slideListId === payload.activeSlideList.id) {
        if (_c.children && _c.children.length) {
          _c.children.forEach(_ch => {
            const childOldLeft = _ch.params.left;
            const childOldTop = _ch.params.top;
            _ch.params.left = payload.isLeftDirection ? (childOldLeft - payload.offsetLeft) : (childOldLeft + payload.offsetLeft);
            _ch.params.top = payload.isTopDirection ? (childOldTop - payload.offsetTop) : (childOldTop + payload.offsetTop);
          });
        }
      }
      return _c;
    });
  },
  CHANGE_CASE_ELEM_FIELDS(state, payload) {
    const fields = payload.fields;
    console.log(2, fields)
    payload.foundCase.children.forEach(_child => {
      if (_child.id === fields.id) {
        Object.keys(fields).forEach(field => {
          if (field !== 'id') {
            _child.params[field] = fields[field];
            // console.log(3, fields[field])
          }
        });
      }
    });
  },
  /* SHAPES */
  ADD_SHAPE_TO_CASE(state, payload) {
    const _case = payload.case;
    const children = _case.children;
    children.push(payload.shapeObj);
    _case.children = children;
  },
  SELECT_CASE_CHILD(state, payload) {
    if (payload._case) {
      payload._case.children.forEach(_child => {
        _child.isSelected = _child.id === payload._child.id;
      });
    }
  },
  CLEAR_CASE_CHILDREN(state, _case) {
    if (_case.children && _case.children.length) {
      /* Если кликнули по самому кейсу, а НЕ по его эементу, то анселектим все эл-ты */
      _case.children.forEach(_child => {
        _child.isSelected = false;
      })
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}