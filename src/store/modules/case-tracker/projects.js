import {SlideModel} from "@/models/modals/case-tracker/SlideModel";
import {getRandomInt} from "@/functions/calculations";
import router from "@/router";

/* TEST DATA */
const mockSlides = [
    new SlideModel({
        id: 1,
        slideState: 'in-work',
        projectId: 1,
        order: 0,
        image: '',
    }),
    new SlideModel({
        id: 2,
        slideState: 'done',
        projectId: 1,
        order: 1,
        image: '',
    }),
    new SlideModel({
        id: 3,
        slideState: 'in-work',
        projectId: 1,
        order: 2,
        image: '',
    }),
    new SlideModel({
        id: 4,
        slideState: 'in-work',
        projectId: 1,
        order: 3,
        image: '',
    }),
    new SlideModel({
        id: 5,
        slideState: 'archived',
        projectId: 2,
        order: 0,
        image: '',
    }),
];

const state = {
    projects: [
        {
            id: 1,
            name: 'Untitled1',
            activityStatus: 'active',
            isSelected: true,
        },
        {
            id: 2,
            name: 'Untitled2',
            activityStatus: 'active',
            isSelected: false,
        },
        {
            id: 3,
            name: 'Untitled3',
            activityStatus: 'archived',
            isSelected: false,
        },
    ],
    slides: [],
    slideLists: [],
    cases: [],
};

const getters = {
    getProjects: state => state.projects,
    getSlides: state => state.slides,
    getSlideLists: state => state.slideLists,
    getCases: state => state.cases,
};

const actions = {
    pushProject({commit}) {
        commit('PUSH_PROJECT', {});
    },
    /* SLIDE */
    fetchSlides({commit, getters}) {
        commit('SET_SLIDES', {
            slides: mockSlides,
            notifications: getters.getCaseCommentNotifications
        });
    },
    pushSlide({commit}) {
        /* TODO Mock */
        const selectedProject = state.projects.find(_p => _p.isSelected);
        const newSlide = {
            id: 1,
            slideState: 'in-work',
            projectId: selectedProject.id,
            order: 0,
            image: '',
            isSelected: false,
            isNotify: false,
        };
        newSlide.id = getRandomInt(10, 1000);
        commit('PUSH_SLIDE', newSlide);
        setTimeout(() => {
            commit('SELECT_SLIDE', newSlide);
        }, 20)
    },
    removeSlide({commit}, _slide) {
        commit('REMOVE_SLIDE', _slide);
    },
    selectSlide({commit}, _slide) {
        commit('SELECT_SLIDE', _slide);
    },
    pushSlideList({commit}) {
        commit('PUSH_SLIDE_LIST', {});
    },
    pushCase({commit}) {
        commit('PUSH_CASE', {});
    },
};

const mutations = {
    PUSH_PROJECT(state, _project) { state.projects.push(_project); },
    /* SLIDE */
    SET_SLIDES(state, payload) {
        const query = router.currentRoute.query;
        if (query && query.slideId) {
            const _slideId = parseInt(query.slideId);
            state.slides = payload.slides.map(_s => {
                const _notif = payload.notifications.filter(_n1 => _n1.slideId === _s.id)
                  .filter(_n2 => _n2.status === 'notRead');
                _s.isSelected = _s.id === _slideId;
                _s.isNotify = _notif.length;
                return _s;
            });
        } else {
            state.slides = payload.slides;
        }
    },
    PUSH_SLIDE(state, _slide) { state.slides.push(_slide); },
    SELECT_SLIDE(state, _slide) {
        state.slides.forEach(_sl => {
            _sl.isSelected = _sl.id === _slide.id;
        });
        const query = router.currentRoute.query;
        if (query && query.slideId) {
            const _slideId = parseInt(query.slideId);
            if (_slideId !== _slide.id) {
                router.push({ path:'/case-tracker',
                    query: Object.assign({}, query, {slideId: _slide.id}) });
            }
        }
    },
    REMOVE_SLIDE(state, _slide) {
        _slide.slideState = 'archived';
    },
    PUSH_SLIDE_LIST(state, _slideList) { state.slideLists.push(_slideList); },
    PUSH_CASE(state, _case) { state.projects.push(_case); },
};

export default {
    state,
    getters,
    actions,
    mutations
}