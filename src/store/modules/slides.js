const state = {
  caseList: [
    {
      id: 1,
      title: 'Задача 1',
      status: 'in-work', // in-work | done
      discusBlockActivityState: 'discus', // discus | resolut
      isSelected: false,
      isEdited: false,
      isDiscusEdited: false,
      isOpen: false,
      haveNewComments: false,
      children: []
    },
    {
      id: 2,
      title: 'Баг с выпадающим списком, когда на него нажимаешь.',
      status: 'done',
      discusBlockActivityState: 'discus',
      isSelected: true,
      isEdited: false,
      isDiscusEdited: false,
      isOpen: false,
      haveNewComments: true,
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
      ]
    },
    {
      id: 3,
      title: 'Задача 3.',
      status: 'done',
      discusBlockActivityState: 'discus',
      isSelected: false,
      isEdited: false,
      isDiscusEdited: false,
      isOpen: true,
      haveNewComments: false,
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
      ]
    },
  ],
};

const getters = {
  getCaseList: state => state.caseList,
};

const actions = {
  setCaseList({commit}, _case) {
    commit('SET_CASE_LIST', _case);
  },
};

const mutations = {
  SET_CASE_LIST(state, _case) { state.caseList = _case; },
};

export default {
  state,
  getters,
  actions,
  mutations
}