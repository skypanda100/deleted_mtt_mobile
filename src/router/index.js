import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import FoodGrades from '@/views/food-grade/FoodGrades';
import FoodGrade from '@/views/food-grade/FoodGrade';
import FoodUpload from '@/views/food-grade/FoodUpload';
import AirGrade from '@/views/air-grade/AirGrade';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: '主页',
            component: Home
        },
        {
            path: '/air-grade',
            name: '空气质量',
            component: AirGrade
        },
        {
            path: '/food-grades',
            name: '食物评分',
            component: FoodGrades
        },
        {
            path: '/food-grade',
            name: '食物评分',
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
            name: '食物评分',
            component: FoodUpload
        }
    ]
});
