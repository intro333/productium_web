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
    setTimeout(() => { // TODO Имитация задержки с сервера
      return new Promise((resolve) => {
        const data = mockCases;
        commit('SET_CASES', data);
        resolve(data);
      });
    }, 500);
  },
  pushCase({commit, dispatch}) {
    const query = router.currentRoute.query;
    if (query && query.slideListId) {
      // TODO MOCK
      const caseId = getRandomInt(10, 1000);
      const newSCase = new CaseModel({
        id: caseId,
        slideListId: parseInt(query.slideListId),
        title: 'Задача ' + caseId,
        caseStatus: 'in-work',
        isOpen: false,
        discus: '',
        resolut: '',
        children: [],
        order: 0,
      });
      commit('PUSH_CASE', newSCase);
      setTimeout(() => {
        dispatch('goToSelectedCase', newSCase);
      }, 20);
    }
  },
  selectCase({dispatch}, _case) {
    dispatch('goToSelectedCase', _case);
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
          if (filteredCases.length) {
            dispatch('goToSelectedCase', filteredCases[filteredCases.length-1]);
          } else {
            setTimeout(() => {
              router.push({
                path: '/case-tracker',
                query: Object.assign({}, query, {caseId: 0})
              });
            }, 20)
          }
        }
      }, 20);
    }
  },
  goToSlideAndCase({dispatch}, notify) {
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
    dispatch('openCommentsModalByCommentId', notify.id);
  },
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
  /* LOCAL ACTIONS */
  selectFoundCaseFromCases({dispatch}, cases) {
    const query = router.currentRoute.query;
    if (query && query.caseId) {
      const _caseId = parseInt(query.caseId);
      const foundCase = cases.find(_s => _s.id === _caseId);
      if (foundCase) {
        dispatch('goToSelectedCase', foundCase);
      }
    }
  },
  goToSelectedCase({commit}, _case) {
    commit('SELECT_CASE', _case);
    const query = router.currentRoute.query;
    if (query && query.caseId) {
      const caseId = parseInt(query.caseId);
      if (caseId !== _case.id) {
        setTimeout(() => {
          router.push({
            path: '/case-tracker',
            query: Object.assign({}, query, {caseId: _case.id})
          });
        }, 20)
      }
    }
  },
};

const mutations = {
  /* CASES */
  SET_CASES(state, _cases) {
    state.cases = _cases;
  },
  PUSH_CASE(state, _case) { state.cases.push(_case); },
  SELECT_CASE(state, _case) {
    state.selectedCase = _case;
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
  SET_CASES_COMMENTS(state, comments) {
    state.casesComments = comments;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}