import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import FoodGrades from '@/views/food-grade/FoodGrades';
import FoodGrade from '@/views/food-grade/FoodGrade';
import FoodUpload from '@/views/food-grade/FoodUpload';
import AirGrade from '@/views/air-grade/AirGrade';
import SleepQuality from '@/views/sleep-quality/SleepQuality';
import SleepUpload from '@/views/sleep-quality/SleepUpload';
import Login from '@/views/Login';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            isInHome: false,
            component: Login,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/',
            name: 'Home',
            cName: '主页',
            isInHome: true,
            component: Home,
            icon: 'home',
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/air-grade',
            name: 'AirGrade',
            cName: '空气质量',
            isInHome: true,
            component: AirGrade,
            icon: 'cloud',
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/food-grades',
            name: 'FoodGrades',
            cName: '食物评分',
            isInHome: true,
            component: FoodGrades,
            icon: 'restaurant',
            meta: {
                keepAlive: true,
                isBack: false
            }
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
                comment: route.query.comment,
                user: route.query.user
            }),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/food-upload',
            name: 'FoodUpload',
            isInHome: false,
            component: FoodUpload,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/sleep-quality',
            name: 'SleepQuality',
            cName: '睡眠质量',
            isInHome: true,
            component: SleepQuality,
            icon: 'timer',
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/sleep-upload',
            name: 'SleepUpload',
            isInHome: false,
            component: SleepUpload,
            meta: {
                keepAlive: false
            }
        }
    ]
});
