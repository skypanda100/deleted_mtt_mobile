import Vue from 'vue';
import Router from 'vue-router';
import FoodGrades from '@/views/food-grade/FoodGrades';
import FoodGrade from '@/views/food-grade/FoodGrade';
import FoodUpload from '@/views/food-grade/FoodUpload';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'FoodGrades',
            component: FoodGrades
        },
        {
            path: '/food-grade',
            name: 'FoodGrade',
            component: FoodGrade,
            props: (route) => ({
                imagePath: route.query.imagePath,
                grade: route.query.grade,
                dateTime: route.query.dateTime,
                comment: route.query.comment
            })
        },
        {
            path: '/food-upload',
            name: 'FoodUpload',
            component: FoodUpload
        }
    ]
});
