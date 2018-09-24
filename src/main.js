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

Vue.use(Croppa);
Vue.use(VueRouter);

FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app-box');

router.beforeEach((to, from, next) => {
    next();
});

router.afterEach((to) => {
    window.scrollTo(0, 0);
    let route = {
        path: to.path,
        name: to.name
    };
    console.log(route);
    store.dispatch('SwitchRoute', route);
});
