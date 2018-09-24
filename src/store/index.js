import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    route: {
        path: '',
        name: ''
    }
};
export default new Vuex.Store({
    state,
    mutations: {
        SWITCH_ROUTE (state, route) {
            state.route = route;
        }
    },
    actions: {
        SwitchRoute ({commit}, data) {
            return new Promise(resolve => {
                commit('SWITCH_ROUTE', data);
                resolve();
            });
        }
    }
});
