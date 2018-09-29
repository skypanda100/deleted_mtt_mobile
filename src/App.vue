<template>
    <v-app>
        <v-navigation-drawer
            v-model="showDrawer"
            clipped
            fixed
            app>
        </v-navigation-drawer>
        <v-toolbar dark color="primary">
            <v-btn icon @click.native="handleBackClicked">
                <v-icon v-if="showBack">backspace</v-icon>
            </v-btn>
            <v-toolbar-title>MTT</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="handleCameraClicked">
                <v-icon v-if="showCamera">camera</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <!--<v-container>-->
                <router-view></router-view>
            <!--</v-container>-->
        </v-content>
        <v-footer></v-footer>
    </v-app>
</template>

<script>
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
            }
        },
        mounted () {
        },
        methods: {
            handleCameraClicked () {
                console.log('clicked');
                this.$router.push('/food-upload');
            },
            handleBackClicked () {
                this.$router.go(-1);
            }
        }
    };
</script>

<style lang="less">
</style>
