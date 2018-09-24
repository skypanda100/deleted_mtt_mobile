<template>
    <div id="app" class="container">
        <!--<router-view></router-view>-->
        <view-box ref="viewBox" body-padding-top="46px">
            <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
                <span slot="right" v-if="showCamera">
                    <x-icon type="camera" style="fill:#fff;" @click="handleCameraClicked"></x-icon>
                </span>
            </x-header>
            <router-view></router-view>
            <tabbar>
                <tabbar-item link="/">
                    <img slot="icon" src="./assets/logo.png">
                    <span slot="label">主页</span>
                </tabbar-item>
                <tabbar-item>
                    <img slot="icon" src="./assets/logo.png">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>
    </div>
</template>

<script>
    import { ViewBox, XHeader, Tabbar, TabbarItem, Group, Cell } from 'vux';

    export default {
        name: 'app',
        components: {
            ViewBox,
            XHeader,
            Tabbar,
            TabbarItem,
            Group,
            Cell
        },
        computed: {
            route () {
                return this.$store.state.route;
            },
            showCamera () {
                return this.route.path === '/food-grades' || this.route.path === '/food-grade';
            }
        },
        mounted () {
            console.log('mounted');
        },
        methods: {
            handleCameraClicked () {
                console.log('clicked');
                this.$router.push('/food-upload');
            }
        }
    };
</script>

<style lang="less">
    @import '~vux/src/styles/reset.less';

    html, body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        background-color: #fbf9fe;
    }

    .container {
        height: 100%;
    }
</style>
