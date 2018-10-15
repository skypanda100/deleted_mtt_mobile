<template>
    <v-app>
        <v-navigation-drawer
            v-model="showDrawer"
            clipped
            fixed
            app>
            <v-card>
                <v-img
                    :src="avatar === '' ? '' : imageHost + '/' + avatar"
                    :lazy-src="avatar === '' ? '' : imageHost + '/' + avatar"
                    aspect-ratio="1"
                    class="grey lighten-2">
                    <v-layout
                        slot="placeholder"
                        fill-height
                        align-center
                        justify-center
                        ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                </v-img>
            </v-card>
            <v-list class="pt-0">
                <v-list-tile v-for="route in routes" v-if="route.isInHome" @click="goNext(route.path)" :key="route.path">
                    <v-list-tile-avatar>
                        <v-icon>{{route.icon}}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>{{route.cName}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app dark color="primary" fixed>
        <!--<v-toolbar app fixed>-->
        <v-toolbar-side-icon @click.stop="showDrawer = !showDrawer"></v-toolbar-side-icon>
            <v-toolbar-title>MTT</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="handleCameraClicked" v-if="showCamera">
                <v-icon>camera</v-icon>
            </v-btn>
            <v-btn icon @click.native="handleUploadClicked" v-if="showUpload">
                <v-icon>cloud_upload</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid grid-list-sm>
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive">
                    </router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive">
                </router-view>
            </v-container>
        </v-content>
        <v-footer></v-footer>
    </v-app>
</template>

<script>
    import router from './router';
    import env from '@/../config/env';
    import util from './libs/util';

    export default {
        name: 'app',
        data () {
            return {
                showDrawer: false,
                imageHost: env.imageHost
            };
        },
        computed: {
            avatar () {
                if (util.isNull(this.$store.state.userInfo.avatar)) {
                    return '';
                }
                return this.$store.state.userInfo.avatar + '?timestamp=' + new Date().getTime();
            },
            route () {
                return this.$store.state.route;
            },
            showBack () {
                let path = this.route.path.trim();
                path = path.replace('/', '');
                if (path === '') {
                    return false;
                }
                return true;
            },
            showCamera () {
                return this.route.path === '/food-grades' || this.route.path === '/food-grade';
            },
            showUpload () {
                return this.route.path === '/sleep-quality';
            },
            routes () {
                return router.options.routes;
            }
        },
        mounted () {
        },
        methods: {
            handleCameraClicked () {
                this.$router.push('/food-upload');
            },
            handleUploadClicked () {
                this.$router.push('/sleep-upload');
            },
            goNext (url) {
                this.$router.push(url);
            }
        }
    };
</script>

<style lang="less">
</style>
