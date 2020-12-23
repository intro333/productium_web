import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {getObjectOffsetByZoom, getOffsetByZoom, getRandomInt} from "@/functions/calculations";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import {mockCases, mockCaseComments} from "@/data/testData";
import {shapeTitleAutoIncrement} from "@/functions/case-tracker/projectsF";
import {CaseCommentModel} from "@/models/case-tracker/CaseCommentModel";

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
    return new Promise((resolve) => {
      setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
        const data = mockCases;
        commit('SET_CASES', data);
        resolve(data);
      }, 200);
    });
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
          commit('SET_ACTIVE_TOOL', 'moveTool');
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
  selectFoundCaseFromCases({dispatch}, _case) {
    dispatch('goToSelectedCase', {
      case: _case,
      reloadWithSlide: false,
      isFirstLoad: true
    });
  },
  goToSelectedCase({commit, dispatch}, payload) {
    const _case = payload.case;
    const query = router.currentRoute.query;
    if (_case) {
      if (query && query.caseId) {
        const caseId = parseInt(query.caseId);
        if (payload.isFirstLoad && _case) {
          commit('SELECT_CASE', payload);
        } else if (caseId !== _case.id) {
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
    } else {
      commit('SET_ACTIVE_SHAPE_TOOL', 'rectangleTool');
      commit('SET_ACTIVE_TOOL', 'superTool');
      if (payload.isFirstLoad && query.caseId !== '0') {
        router.push({
          path: '/case-tracker',
          query: Object.assign({}, query, {caseId: 0})
        });
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
  addCaseComment({commit, getters}, payload) {
    return new Promise((resolve) => {
        setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
          const query = router.currentRoute.query;
          const currentUser = getters.getCurrentUser;
          if (query && query.caseId) {
            const commentId = getRandomInt(10, 1000); // TODO MOCK
            const newComment = { // TODO Этот объект придёт с сервера
              id: commentId,
              projectId: parseInt(query.projectId),
              slideId: parseInt(query.slideId),
              slideListId: parseInt(query.slideListId),
              caseId: parseInt(query.caseId),
              parent: payload.parentKey ? payload.parentKey : null,
              message: payload.commentMessage,
              user: currentUser,
              images: payload.images,
              updatedAt: '2020-10-30 11:46:15', // TODO Дата придёт с сервера
              notifyInfo: {
                status: 'fromCurrentUser',
              }, // Моё сообщение, оно не будет мне показано в оповещении
              userLink: payload.isUserLink ? {
                replyUser: payload.replyUser, // TODO по идее при отправке коммента на бэк отправляем лишь id юзера, а при получении данных мы по нему берём нужные данные, ибо они могут поменяться
                replyCommentId: payload.comment.id
              } : null,
            };
            commit('ADD_CASES_COMMENT', newComment);
            resolve(newComment);
          }
        }, 200);
    });
  },
  removeCaseComment({commit}, commentObj) {
    commit('REMOVE_CASES_COMMENT', commentObj);
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
    return new Promise((resolve, reject) => {
      setTimeout(() => { // TODO Имитация задержки с сервера (УБРАТЬ!)
        // TODO После события mouse:up попадаем сюда, создаём в БД фигуру и затем добавляем её в foundCase
        const id = getRandomInt(10, 1000);
        shapeObj.id = id;
        const foundCase = state.cases.find(_c => _c.id === state.selectedCase.id);
        if (foundCase) {
          const children = foundCase.children;
          const objsByType = children
            .filter(_o => _o.shapeType === shapeObj.shapeType);
          if (objsByType.length) {
            shapeObj.title = shapeTitleAutoIncrement(shapeObj, objsByType);
          }
          setTimeout(() => {
            commit('ADD_SHAPE_TO_CASE', {
              case: foundCase,
              shapeObj
            });
            resolve(shapeObj);
          }, 30);
          if (!foundCase.isOpen) {
            foundCase.isOpen = true;
          }
        } else {
          reject(null);
        }
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
        _c.notifyInfo.status = 'archived';
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
  ADD_CASES_COMMENT(state, commentObj) {
    state.casesComments.push(new CaseCommentModel(commentObj));

  },
  REMOVE_CASES_COMMENT(state, commentObj) {
    state.casesComments = state.casesComments.map(_c => {
      if (_c.id === commentObj.id || _c.parent === commentObj.id) { /* Удаляем и дочерние (если они есть) */
        _c.notifyInfo.status = 'archived';
      }
      return _c;
    });
  },
  CHANGE_CASES_PARAMS_BY_OFFSET(state, payload) {
    const z = payload.z;
    state.cases = state.cases.map(_c => {
      if (_c.caseStatus !== 'archived' &&
        _c.slideListId === payload.activeSlideList.id) {
        if (_c.children && _c.children.length) {
          _c.children.forEach(_ch => {
            const childOldLeft = getObjectOffsetByZoom(z, _ch.params.left);
            const childOldTop = getObjectOffsetByZoom(z, _ch.params.top);
            _ch.params.left = payload.isLeftDirection ? getOffsetByZoom(z, childOldLeft - payload.offsetLeft) : getOffsetByZoom(z, childOldLeft + payload.offsetLeft);
            _ch.params.top = payload.isTopDirection ? getOffsetByZoom(z, childOldTop - payload.offsetTop) : getOffsetByZoom(z, childOldTop + payload.offsetTop);
            console.log('-----------------------')
          });
        }
      }
      return _c;
    });
  },
  CHANGE_CASE_ELEM_FIELDS(state, payload) {
    const fields = payload.fields;
    // console.log(2, fields)
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