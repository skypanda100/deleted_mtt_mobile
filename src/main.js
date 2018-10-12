// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import App from './App';
import router from './router';
import Croppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';
import store from './store';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'babel-polyfill';
import auth from './libs/auth';

Vue.use(Croppa);
Vue.use(VueRouter);
Vue.use(Vuetify);

FastClick.attach(document.body);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (!auth.getToken() && to.name !== 'Login') {
        next({
            name: 'Login'
        });
    } else {
        next();
    }
});

router.afterEach((to) => {
    // window.scrollTo(0, 0);
    let route = {
        path: to.path,
        name: to.name
    };
    store.dispatch('SwitchRoute', route);
});

/* eslint-disable no-new */
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app-box');
