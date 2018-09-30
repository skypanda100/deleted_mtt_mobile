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
            name: 'Home',
            cName: '主页',
            isInHome: true,
            component: Home
        },
        {
            path: '/air-grade',
            name: 'AirGrade',
            cName: '空气质量',
            isInHome: true,
            component: AirGrade
        },
        {
            path: '/food-grades',
            name: 'FoodGrades',
            cName: '食物评分',
            isInHome: true,
            component: FoodGrades
        },
        {
            path: '/food-grade',
            name: 'FoodGrade',
            isInHome: false,
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
            isInHome: false,
            component: FoodUpload
        }
    ]
});
