<template>
    <div id="app" class="container">
        <!--<router-view></router-view>-->
        <view-box ref="viewBox" body-padding-top="46px">
            <x-header
                slot="header"
                title="MTT"
                style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color: #333"
                :left-options="showBack">
                <span slot="right" v-if="showCamera">
                    <x-icon type="camera" style="fill:#fff;" @click="handleCameraClicked"></x-icon>
                </span>
            </x-header>
            <div style="padding: 3px">
                <router-view></router-view>
            </div>
            <!--<tabbar>-->
                <!--<tabbar-item link="/">-->
                    <!--<img slot="icon" src="./assets/func.png">-->
                    <!--<span slot="label">功能区</span>-->
                <!--</tabbar-item>-->
                <!--<tabbar-item>-->
                    <!--<img slot="icon" src="./assets/me.png">-->
                    <!--<span slot="label">我</span>-->
                <!--</tabbar-item>-->
            <!--</tabbar>-->
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
            showBack () {
                let path = this.route.path.trim();
                path = path.replace('/', '');
                if (path === '') {
                    return {
                        showBack: false
                    };
                }
                return {
                    showBack: true
                };
            },
            showCamera () {
                return this.route.path === '/food-grades' || this.route.path === '/food-grade';
            }
        },
        mounted () {
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
