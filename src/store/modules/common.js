import {CurrentUserModel} from "@/models/CurrentUserModel";

const state = {
    currentUser: new CurrentUserModel('Dmitriy D', 'DD', '#7c4a4a'),
    caseCommentNotifications: [
        {
            id: 1,
            projectId: 1,
            user: new CurrentUserModel('Dmitriy D', 'DD', '#7c4a4a'),
            status: 'notRead', // notRead | read
            slideOrder: 0,
            comment: 'Давайте сверим часы, чтобы все видели картину по динамике работы над проектом. Пишите кто на каком этапе и что планирует делать в ближайшую неделю.',
            created_at: '2020-10-11 12:24:19',
            updated_at: '2020-10-11 12:24:19'
        },
        {
            id: 2,
            projectId: 1,
            user: new CurrentUserModel('Dmitriy M', 'DM', '#F30C0C'),
            status: 'notRead',
            slideOrder: 2,
            comment: 'На главной странице сайта перечислены последние добавленные на сайт дизайнерские работы, для каждой работы указывается число просмотров, картинка, содержащая часть дизайна, количество оставленных комментариев и оценка со стороны пользователей.',
            created_at: '2020-10-11 11:14:34',
            updated_at: '2020-10-11 11:14:34'
        },
        {
            id: 3,
            projectId: 1,
            user: new CurrentUserModel('Alex G', 'AG', '#466a96'),
            status: 'read',
            slideOrder: 1,
            comment: 'Через час могу. Заодно у Димы был вопрос. И надо ему про идею с привлечением денег рассказать.',
            created_at: '2020-10-10 17:11:29',
            updated_at: '2020-10-10 17:11:29'
        },
        {
            id: 4,
            projectId: 2,
            user: new CurrentUserModel('Dmitriy M', 'DM', '#F30C0C'),
            status: 'read',
            slideOrder: 7,
            comment: 'Какой вариант? мне две нравится.',
            created_at: '2020-10-09 13:11:29',
            updated_at: '2020-10-09 13:11:29'
        },
        {
            id: 5,
            projectId: 1,
            user: new CurrentUserModel('Alex G', 'AG', '#466a96'),
            status: 'read',
            slideOrder: 1,
            comment: 'Через час могу. Заодно у Димы был вопрос. И надо ему про идею с привлечением денег рассказать.',
            created_at: '2020-10-10 17:11:29',
            updated_at: '2020-10-10 17:11:29'
        },
        {
            id: 6,
            projectId: 1,
            user: new CurrentUserModel('Alex G', 'AG', '#466a96'),
            status: 'read',
            slideOrder: 1,
            comment: 'Через час могу. Заодно у Димы был вопрос. И надо ему про идею с привлечением денег рассказать.',
            created_at: '2020-10-10 17:11:29',
            updated_at: '2020-10-10 17:11:29'
        },
        {
            id: 7,
            projectId: 1,
            user: new CurrentUserModel('Dmitriy M', 'DM', '#F30C0C'),
            status: 'read',
            slideOrder: 1,
            comment: 'Через час могу. Заодно у Димы был вопрос. И надо ему про идею с привлечением денег рассказать.',
            created_at: '2020-10-10 17:11:29',
            updated_at: '2020-10-10 17:11:29'
        },
        {
            id: 8,
            projectId: 1,
            user: new CurrentUserModel('Dmitriy D', 'DD', '#7c4a4a'),
            status: 'read',
            slideOrder: 1,
            comment: 'Через час могу. Заодно у Димы был вопрос. И надо ему про идею с привлечением денег рассказать.',
            created_at: '2020-10-10 17:11:29',
            updated_at: '2020-10-10 17:11:29'
        },
    ]
};

const getters = {
    getCurrentUser: state => state.currentUser,
    getCaseCommentNotifications: state => state.caseCommentNotifications,
};

const actions = {
    setCurrentUser({commit}, user) {
        commit('SET_CURRENT_USER', user);
    },
    setCaseCommentNotifications({commit}, notifications) {
        commit('SET_CASE_COMMENT_NOTIFICATIONS', notifications);
    },
};

const mutations = {
    SET_CURRENT_USER(state, user) { state.currentUser = user; },
    SET_CASE_COMMENT_NOTIFICATIONS(state, notifications) { state.caseCommentNotifications = notifications; },
};

export default {
    state,
    getters,
    actions,
    mutations
}