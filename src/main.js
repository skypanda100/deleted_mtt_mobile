// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import App from './App';
import router from './router';
import Croppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';

Vue.use(Croppa);
Vue.use(VueRouter);

FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box');
