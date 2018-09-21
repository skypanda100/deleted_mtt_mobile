import Vue from 'vue';
import Router from 'vue-router';
import FoodGrade from '@/views/food-grade/FoodGrade';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'FoodGrade',
            component: FoodGrade
        }
    ]
});
