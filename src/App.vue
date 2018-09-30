<template>
    <v-app>
        <v-navigation-drawer
            v-model="showDrawer"
            clipped
            fixed
            app>
            <v-list class="pt-0">
                <v-list-tile v-for="route in routes" v-if="route.isInHome" @click="goNext(route.path)" :key="route.path">
                    <v-list-tile-content>
                        <v-list-tile-title>{{route.cName}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app dark color="primary" fixed>
            <v-toolbar-side-icon @click.stop="showDrawer = !showDrawer"></v-toolbar-side-icon>
            <v-toolbar-title>MTT</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="handleCameraClicked">
                <v-icon v-if="showCamera">camera</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer></v-footer>
    </v-app>
</template>

<script>
    import router from './router';

    export default {
        name: 'app',
        data () {
            return {
                showDrawer: false
            };
        },
        computed: {
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
            routes () {
                return router.options.routes;
            }
        },
        mounted () {
        },
        methods: {
            handleCameraClicked () {
                console.log('clicked');
                this.$router.push('/food-upload');
            },
            goNext (url) {
                this.$router.push(url);
            }
        }
    };
</script>

<style lang="less">
</style>
