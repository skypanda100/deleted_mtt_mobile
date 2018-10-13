import Vue from 'vue';
import Vuex from 'vuex';
import auth from '../libs/auth';

Vue.use(Vuex);

const state = {
    route: {
        path: '',
        name: ''
    },
    avatar: auth.getAvatar()
};
export default new Vuex.Store({
    state,
    mutations: {
        SWITCH_ROUTE (state, route) {
            state.route = route;
        },
        SET_AVATAR (state, avatar) {
            state.avatar = avatar;
        }
    },
    actions: {
        SwitchRoute ({commit}, data) {
            return new Promise(resolve => {
                commit('SWITCH_ROUTE', data);
                resolve();
            });
        },
        SetAvatar ({commit}, data) {
            return new Promise(resolve => {
                commit('SET_AVATAR', data);
                resolve();
            });
        }
    }
});
