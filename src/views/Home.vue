<template>
    <v-layout>
        <v-flex xs12 sm6>
            <v-card>
                <v-img
                    src="/static/mtt.jpg"
                    lazy-src="/static/mtt.jpg"
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
                <v-list-tile v-for="route in routes" v-if="route.isInHome && route.name !== 'Home'" @click="goNext(route.path)" :key="route.path">
                    <v-list-tile-avatar>
                        <v-icon>{{route.icon}}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>{{route.cName}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-flex>
    </v-layout>
</template>

<script>
    import router from '../router';

    export default {
        name: 'home',
        computed: {
            routes () {
                return router.options.routes;
            }
        },
        mounted () {
        },
        methods: {
            goNext (url) {
                this.$router.push(url);
            }
        }
    };
</script>

<style scoped>

</style>
