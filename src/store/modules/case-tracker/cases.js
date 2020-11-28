import {CaseModel} from "@/models/case-tracker/CaseModel";
import router from "@/router";
import {getRandomInt} from "@/functions/calculations";
import {CentralModalModel} from "@/models/modals/CentralModalModel";

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
const mockCaseComments = [
  {
    id: 1,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: null,
    message: 'Привет. Здесь надо поменять скругление и может вообще убрать stroke.',
    user: {
      fullName: 'Dmitry Kolunov',
      shortName: 'DK',
      color: '#FF2727',
    },
    images: [],
    updatedAt: '2020-10-27 18:24:45',
    notifyInfo: { // join tables, если в таблице case_comment_notification есть запись для текущего юзера, то выести её, если нет то null поставить
      status: 'read', // notRead | read | archived
    }
  },
  {
    id: 2,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: 1,
    message: 'И тебе привет. Я думаю можно сделать как здесь тогда https://ru.wikipedia.org/wiki/Google_%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA',
    user: {
      fullName: 'Genom 89',
      shortName: '',
      color: '#b2b2b2',
    },
    images: [],
    updatedAt: '2020-10-27 18:30:45',
    notifyInfo: {
      status: 'read',
    }
  },
  {
    id: 3,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: null,
    message: 'Привет. Здесь надо поменять скругление и может вообще убрать stroke.',
    user: {
      fullName: 'Dmitry Kolunov',
      shortName: 'DK',
      color: '#FF2727',
    },
    images: [
      {
        id: 15,
        src: '',
        orientation: 'portrait'
      }
    ],
    updatedAt: '2020-10-28 19:13:45',
    notifyInfo: {
      status: 'read',
    }
  },
  {
    id: 4,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: 3,
    message: 'Привет. Здесь надо поменять.',
    user: {
      fullName: 'Dmitry Kolunov',
      shortName: 'DK',
      color: '#FF2727',
    },
    images: [],
    updatedAt: '2020-10-29 01:36:15',
    notifyInfo: {
      status: 'notRead',
    }
  },
  {
    id: 5,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: 3,
    message: 'Привет. Здесь надо .',
    user: {
      fullName: 'Genom 89',
      shortName: 'DK',
      color: '#b2b2b2',
    },
    images: [],
    updatedAt: '2020-10-29 01:46:15',
    notifyInfo: {
      status: 'notRead',
    }
  },
  {
    id: 6,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: null,
    message: 'Моё сообщение',
    user: {
      fullName: 'Derzhaev D',
      shortName: 'DD',
      color: '#7c4a4a',
    },
    images: [],
    updatedAt: '2020-10-30 11:46:15',
    notifyInfo: null // Моё сообщение, оно не будет мне показано в оповещении
  },
];

const state = {
  cases: [],
  casesComments: [],
};

const getters = {
  getCases: state => state.cases,
  getCasesComments: state => state.casesComments,
};

const actions = {
  /* CASES */
  fetchCases({commit}) {
    commit('SET_CASES', mockCases);
  },
  pushCase({commit}) {
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
        order: 0
      });
      commit('PUSH_CASE', newSCase);
      setTimeout(() => {
        commit('SELECT_CASE', newSCase);
      }, 20);
    }
  },
  selectCase({commit}, _case) {
    commit('SELECT_CASE', _case);
  },
  removeCase({commit}, _case) {
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
            commit('SELECT_CASE', filteredCases[filteredCases.length-1]);
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
  }
};

const mutations = {
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
        setTimeout(() => {
          router.push({
            path: '/case-tracker',
            query: Object.assign({}, query, {caseId: _case.id})
          });
        }, 20)
      }
    }
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