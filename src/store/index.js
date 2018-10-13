import Vue from 'vue';
import Vuex from 'vuex';
import auth from '../libs/auth';

Vue.use(Vuex);

const state = {
    route: {
        path: '',
        name: ''
    },
    userInfo: {
        avatar: auth.getAvatar(),
        alias: auth.getAlias()
    }
};
export default new Vuex.Store({
    state,
    mutations: {
        SWITCH_ROUTE (state, route) {
            state.route = route;
        },
        SET_USER_INFO (state, userInfo) {
            state.userInfo = {
                avatar: userInfo.avatar,
                alias: userInfo.alias
            };
        }
    },
    actions: {
        SwitchRoute ({commit}, data) {
            return new Promise(resolve => {
                commit('SWITCH_ROUTE', data);
                resolve();
            });
        },
        SetUserInfo ({commit}, data) {
            return new Promise(resolve => {
                commit('SET_USER_INFO', data);
                resolve();
            });
        }
    }
});
