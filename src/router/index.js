import Vue from 'vue';
import Router from 'vue-router';
import FoodGrade from '@/views/food-grade/FoodGrade';
import FoodUpload from '@/views/food-grade/FoodUpload';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'FoodGrade',
            component: FoodGrade
        },
        {
            path: '/food-upload',
            name: 'FoodUpload',
            component: FoodUpload
        }
    ]
});
