import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {getObjectOffsetByZoom, getOffsetByZoom} from "@/functions/calculations";
import {CentralModalModel} from "@/models/modals/CentralModalModel";
import {mockCases, mockCaseComments} from "@/data/testData";
import {shapeTitleAutoIncrement} from "@/functions/case-tracker/projectsF";
import {CaseCommentModel} from "@/models/case-tracker/CaseCommentModel";
import moment from 'moment';
import {uuidHash} from "@/functions/conversation";
import {totalLimit} from "@/data/consts";
import {SimpleNotifyModel} from "@/models/modals/SimpleNotifyModel";
import i18n from "@/main";
import {SimpleNotifyInsideModel} from "@/models/modals/SimpleNotifyInsideModel";

export const state = {
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
  pushCase({commit, dispatch, getters}) {
    const activeSlide = getters.getActiveSlide;
    return new Promise((resolve) => {
      let casesOfSlidesLength = 0;
      state.cases.forEach(_case => {
        if (_case.caseStatus !== 'archived' && _case.slideId === activeSlide.id) {
          casesOfSlidesLength++;
        }
      });
      setTimeout(() => {
        if (casesOfSlidesLength <= totalLimit.cases-1) {
          const query = router.currentRoute.query;
          if (query && query.slideListId) {
            // TODO MOCK
            const caseId = uuidHash();
            const newSCase = new CaseModel({
              id: caseId,
              projectId: parseInt(query.projectId),
              slideId: query.slideId,
              slideListId: query.slideListId,
              title: 'Case ' + (state.cases.length + 1),
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
              dispatch('updateCaseInfoOnServer').then(() => {
                dispatch('goToSelectedCase', {
                  case: newSCase,
                  reloadWithSlide: true
                });
                setTimeout(() => {
                  resolve(newSCase);
                }, 500);
              }).catch(err => {
                console.log('error pushCase', err);
              });
            }, 20);
          }
        } else {
          dispatch('setIsLoading', false);
          dispatch('setSimpleNotify', new SimpleNotifyModel()
            .set(true,
              450,
              i18n.t('limit.exceeded'),
              [i18n.t('limit.cases'), totalLimit.cases],
              5000
            ))
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
  removeCase({commit, dispatch, getters}, _case) {
    const currentUser = getters.getCurrentUser;
    commit('REMOVE_CASE', {
      _case,
      currentUser
    });
    // _case.isSelected = false;
    _case.children.forEach(_shape => {
      dispatch('removeCaseChild', {
        _case,
        caseChild: _shape,
        removeOnlyOnCanvas: true
      });
    });
    setTimeout(() => {
      if (_case.isSelected) {
        const query = router.currentRoute.query;
        if (query && query.slideListId) {
          const _slideListId = query.slideListId;
          const filteredCases = state.cases.filter(_s =>
            _s.caseStatus !== 'archived' && _s.slideListId === _slideListId);
          // const anotherCase = filteredCases.length ? filteredCases[filteredCases.length-1] : { id: 0 };
          const anotherCase = filteredCases.length ? filteredCases[filteredCases.length-1] : null;
          dispatch('goToSelectedCase', {
            case: anotherCase,
            reloadWithSlide: true,
            closeCommentsModal: true
          });
        }
      }
    }, 20);
    setTimeout(() => {
      dispatch('updateCaseInfoOnServer').then(() => {

      }).catch(error => {
        console.log('error removeCase', error);
      });
    }, 40);
  },
  goToSlideAndCase({dispatch, getters}, notify) {
    const _slideId = notify.slideId;
    const foundSlide = getters.getSlides.find(_s => _s.id === _slideId);
    if (foundSlide) {
      console.log('router push case 1.1');
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
      dispatch('selectCaseListAndCaseOfActiveSlide', {
        slide: foundSlide,
        isRepaint: true
      }).then(() => {
        setTimeout(() => {
          dispatch('updateCaseInfoOnServer');
        }, 700);
      });
      dispatch('openCommentsModalByCommentId', notify.id);
    }
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
      if (query && ("caseId" in query)) { /* caseId может быть 0 или null - это норм */
        const caseId = query.caseId;
        if (payload.isFirstLoad && _case) {
          commit('SELECT_CASE', payload);
        } else if (caseId !== _case.id) {
          commit('SELECT_CASE', payload);
          if (payload.closeCommentsModal && query.commentId) {
            delete query.commentId;
            dispatch('setCentralModal', new CentralModalModel());
          }
          setTimeout(() => {
            console.log('router push case 1.2');
            router.push({
              path: '/case-tracker',
              query: Object.assign({}, query, {caseId: _case.id})
            });
          }, 20);
        }
      }
    } else {
      commit('SELECT_CASE', {case: null});
      commit('SET_ACTIVE_SHAPE_TOOL', 'rectangleTool');
      commit('SET_ACTIVE_TOOL', 'superTool');
      if (payload.isFirstLoad && query.caseId !== '0') {
        console.log('router push case 1.3');
        router.push({
          path: '/case-tracker',
          query: Object.assign({}, query, {caseId: 0})
        });
      } else {
        console.log('router push case 1.4');
        router.push({
          path: '/case-tracker',
          query: Object.assign({}, query, {caseId: null})
        });
      }
    }
  },
  openCase({commit}) {
    commit('OPEN_CASE');
  },
  casesToArchiveBySlideId({commit}, slideId) {
    commit('CASES_TO_ARCHIVE_BY_SLIDE_ID', slideId);
  },
  updateCaseInfoOnServer({getters}) {
    return new Promise((resolve, reject) => {
      const project = getters.getSelectedProject;
      const user = getters.getCurrentUser;
      setTimeout(() => {
        window.axios.post('api/projects-all/add-case', {
          projectId: project.id,
          caseData: {
            cases: state.cases.filter(_c => _c.caseStatus !== 'archived' && _c.projectId === project.id),
            casesComments: state.casesComments
              .filter(_cCm => _cCm.projectId === project.id &&
                _cCm.notifyInfo[user.id].status !== 'archived'),
          }
        }).then(() => {
          resolve();
        }, error => {
          console.log('error updateCaseInfoOnServer', error);
          reject();
        });
      }, 20);
    });
  },
  /* CASE COMMENTS */
  fetchCaseComments({commit}) {
    commit('SET_CASES_COMMENTS', mockCaseComments);
  },
  addCaseComment({commit, getters, dispatch}, payload) {
    const nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
    return new Promise((resolve) => {
      const query = router.currentRoute.query;
      const currentUser = getters.getCurrentUser;
      const shareUsers = getters.getShareUsers;
      if (query && query.caseId) {
        let commentsOfCaseLength = 0;
        state.casesComments.forEach(_s => {
          if (_s.caseId === query.caseId && _s.notifyInfo[currentUser.id].status !== 'archived') {
            commentsOfCaseLength++;
          }
        });
        setTimeout(() => {
          if (commentsOfCaseLength <= totalLimit.comments-1) {
            const commentId = uuidHash();
            const notifyInfo = { [currentUser.id]: { status: "read" } };
            shareUsers.forEach(_user => { notifyInfo[_user.id] = { status: "notRead" } });
            setTimeout(() => {
              const newComment = {
                id: commentId,
                projectId: parseInt(query.projectId),
                slideId: query.slideId,
                slideListId: query.slideListId,
                caseId: query.caseId,
                parent: payload.parentKey || null,
                message: payload.commentMessage,
                user: currentUser,
                images: payload.images,
                updatedAt: nowDate,
                notifyInfo,
                userLink: payload.isUserLink ? {
                  replyUser: payload.replyUser, // TODO по идее при отправке коммента на бэк отправляем лишь id юзера, а при получении данных мы по нему берём нужные данные, ибо они могут поменяться
                  replyCommentId: payload.comment.id
                } : null,
              };
              commit('ADD_CASES_COMMENT', newComment);
              dispatch('updateCaseInfoOnServer');
              resolve(newComment);
            }, 100);
          } else {
            dispatch('setIsLoading', false);
            dispatch('setSimpleNotifyInside', new SimpleNotifyInsideModel()
              .set(true,
                300,
                i18n.t('limit.comments') + totalLimit.comments,
                1500
              ))
          }
        }, 200);
      }
    });
  },
  removeCaseComment({commit, dispatch, getters}, commentObj) {
    const currentUser = getters.getCurrentUser;
    commit('REMOVE_CASES_COMMENT', {commentObj, currentUser});
    setTimeout(() => {
      dispatch('updateCaseInfoOnServer');
    }, 100);
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
                console.log('router push case 1.5');
                router.push({
                  path: '/case-tracker',
                  query: newQuery
                });
              }, 30);
            }
          })
    );
  },
  readAllMessageByIds({commit, getters, dispatch}, commentsIds) {
    return new Promise((resolve) => {
      const currentUser = getters.getCurrentUser;
      commit('READ_ALL_MESSAGES_BY_IDS', { commentsIds, currentUser });
      setTimeout(() => {
        dispatch('updateCaseInfoOnServer');
        resolve(true);
      }, 500);
    });
  },
  casesCommentsToArchiveBySlideId({commit, dispatch}, payload) {
    const {slideId, comments} = payload;
    comments.forEach(_c => {
      if (_c.slideId === slideId) {
        if (_c.children && _c.children.length) {
          dispatch('casesCommentsToArchiveBySlideId', {comments: _c.children, slideId});
        }
        commit('CASE_COMMENT_TO_ARCHIVE', _c);
      }
    });
  },
  /* SHAPES */
  addShapeToCase({commit, dispatch}, shapeObj) {
    return new Promise((resolve, reject) => {
      const foundCase = state.cases.find(_c => _c.id === state.selectedCase.id);
      if (shapeObj.params && shapeObj.params.canvas) {
        shapeObj.params.canvas = null;
      }
      if (foundCase) {
        const children = foundCase.children;
        console.log('children', children)
        if (children.length <= totalLimit.shapeOfCases-1) {
          shapeObj.id = uuidHash();
          const objsByType = children.filter(_o => _o.shapeType === shapeObj.shapeType);
          if (objsByType.length) {
            shapeObj.title = shapeTitleAutoIncrement(shapeObj, objsByType);
          }
          if (!foundCase.isOpen) {
            foundCase.isOpen = true;
          }
          children.push(shapeObj);
          setTimeout(() => {
            dispatch('updateCaseInfoOnServer').then(() => {
              // const data = response.data;
              commit('ADD_SHAPE_TO_CASE', {
                _case: foundCase,
                children,
                shapeObj: null
              });
              resolve(shapeObj);
            }).catch(error => {
              console.log('error addShapeToCase', error);
            });
          }, 30);
        } else {
          commit('SET_ACTIVE_TOOL', 'moveTool');
          dispatch('setSimpleNotify', new SimpleNotifyModel()
            .set(true,
              450,
              i18n.t('limit.exceeded'),
              [i18n.t('limit.shapeOfCases'), totalLimit.shapeOfCases],
              5000
            ));
          reject(null);
        }
      } else {
        reject(null);
      }
    });
  },
  selectCaseChild({commit}, payload) {
    commit('SELECT_CASE_CHILD', payload);
  },
  removeCaseChild({commit, dispatch}, payload) {
    const _caseChild = payload.caseChild;
    return new Promise((resolve) => {
      const activeCase = payload._case || state.cases.find(_c => _c.id === state.selectedCase.id);
      if (activeCase) {
        activeCase.children = activeCase.children
          .filter(_ch => {
            if (_ch.id !== _caseChild.id) {
              return _ch;
            }
          });
        commit('REMOVE_CASE_CHILD', {
          activeCase,
          caseChildId: _caseChild.id
        });
        if (!payload.removeOnlyOnCanvas) {
          setTimeout(() => {
            dispatch('updateCaseInfoOnServer').then(() => {
              resolve(activeCase);
            }).catch(error => {
              console.log('error removeCaseChild', error);
            });
          }, 30);
        }
      }
    });
  },
  changeCaseStatus({commit, dispatch}, payload) {
    commit('CHANGE_CASE_STATUS', payload);
    setTimeout(() => {
      dispatch('updateCaseInfoOnServer');
    }, 30);
  },
  caseRename({dispatch}) {
    dispatch('updateCaseInfoOnServer');
  },
  changeCasesParamsByOffset({commit}, payload) {
    commit('CHANGE_CASES_PARAMS_BY_OFFSET', payload);
  },
  changeCaseElemFields({commit, dispatch}, fields) {
    return new Promise((resolve, reject) => {
      const foundCase = state.cases.find(_c => _c.id === state.selectedCase.id);
      if (foundCase) {
        commit('CHANGE_CASE_ELEM_FIELDS', {
          fields,
          foundCase
        });
        setTimeout(() => {
          dispatch('updateCaseInfoOnServer').then(() => {
            resolve(foundCase);
          });
        }, 30);
      } else {
        reject(false);
      }
    });
  },
  clearCaseChildren({commit}, _case) {
    commit('CLEAR_CASE_CHILDREN', _case);
  },
  updateCasesFromSocket({commit, dispatch}, newCases) {
    newCases.forEach(_nc => {
      const foundOldCase = state.cases.find(_oc => _oc.id === _nc.id);
      if (foundOldCase) {
        if (foundOldCase.children && foundOldCase.children.length) {
          _nc.children.forEach(_nch => {
            const foundOChild = foundOldCase.children.find(_och => _och.id === _nch.id);
            if (foundOChild) { /* Обновить параметры фигуры */
              commit('UPDATE_SHAPES_FROM_SOCKET', {oldChild: foundOChild, newChild: _nch});
            } else { /* Значит добавили новый child */
              const children = foundOldCase.children;
              children.push(_nch);
              commit('ADD_SHAPE_TO_CASE', {
                _case: foundOldCase,
                children,
                shapeObj: _nch
              });
            }
          });
          foundOldCase.children.forEach(_och => { /* Если child не найдётся, значит его удалили */
            const foundNChild = _nc.children.find(_nch => _nch.id === _och.id);
            if (!foundNChild) { /* В старом есть, а в новом нет, удаляем */
              dispatch('removeCaseChild', {
                caseChild: _och,
                _case: foundOldCase,
                removeOnlyOnCanvas: true
              });
            }
          });
        }
      } else { /* Значит добавили новый кейс */
//
      }
    });
  },
};

const mutations = {
  // UPDATE_CASES_FROM_SOCKET(state, newCases) {
  //
  // },
  UPDATE_SHAPES_FROM_SOCKET(state, payload) {
    const {oldChild, newChild} = payload;
    oldChild.params = Object.assign({}, newChild.params);
  },
  /* CASES */
  SET_ALL_CASES_STATE(state, newState) {
    Object.keys(newState).forEach(_k => {
      state[_k] = newState[_k];
    });
  },
  SET_CASES(state, _cases) {
    state.cases = _cases;
  },
  PUSH_CASE(state, _case) {
    state.cases.push(_case);
    state.selectedCase = _case;
  },
  SELECT_CASE(state, payload) {
    state.selectedCase = payload.case;
  },
  REMOVE_CASE(state, payload) {
    payload._case.caseStatus = 'archived';
    // TODO На серваке поместим в архив кейс и что делать с оповещениями?
    // Можно оставить так и после перезагрузки страницы их не будет, а до этого они будут со статусом archived
    state.casesComments.forEach(_c => {
      if (_c.caseId === payload._case.id) {
        _c.notifyInfo[payload.currentUser.id].status = 'archived';
      }
    })
  },
  REMOVE_CASE_CHILD(state, payload) {
    if (payload.activeCase && payload.activeCase.isSelected) {
      state.selectedCase = payload.activeCase;
    }
  },
  CHANGE_CASE_STATUS(state, payload) {
    payload._case.caseStatus = payload.status;
  },
  OPEN_CASE(state) {
    state.selectedCase.isOpen = true;
  },
  CASES_TO_ARCHIVE_BY_SLIDE_ID(state, slideId) {
    state.cases.forEach(_c => {
      if (_c.slideId === slideId) {
        _c.caseStatus = 'archived';
      }
    });
  },
  /* CASE COMMENTS */
  SET_CASES_COMMENTS(state, comments) {
    state.casesComments = comments;
  },
  ADD_CASES_COMMENT(state, commentObj) {
    state.casesComments.push(new CaseCommentModel(commentObj));

  },
  REMOVE_CASES_COMMENT(state, payload) {
    state.casesComments = state.casesComments.map(_c => {
      if (_c.id === payload.commentObj.id || _c.parent === payload.commentObj.id) { /* Удаляем и дочерние (если они есть) */
        Object.keys(_c.notifyInfo).forEach(_k => {
          _c.notifyInfo[_k].status = 'archived';
        });
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
    payload.foundCase.children.forEach(_child => {
      if (_child.id === fields.id) {
        Object.keys(fields).forEach(field => {
          if (field !== 'id') {
            _child.params[field] = fields[field];
          }
        });
      }
    });
  },
  READ_ALL_MESSAGES_BY_IDS(state, payload) {
    state.casesComments.forEach(_c => {
      if (payload.commentsIds.indexOf(_c.id) !== -1) {
        _c.notifyInfo[payload.currentUser.id].status = 'read';
      }
    });
  },
  CASE_COMMENT_TO_ARCHIVE(state, comment) {
    Object.keys(comment.notifyInfo).forEach(_k => {
      comment.notifyInfo[_k].status = 'archived';
    });
  },
  /* SHAPES */
  ADD_SHAPE_TO_CASE(state, payload) {
    const {_case, children} = payload;
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
