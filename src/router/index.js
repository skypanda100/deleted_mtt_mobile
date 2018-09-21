import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloFromVux';
import ExampleCard from '@/example/ExampleCard';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/example/ExampleCard',
            name: 'ExampleCard',
            component: ExampleCard
        }
    ]
});
