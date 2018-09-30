<template>
    <v-layout>
        <v-flex xs12 sm6>
            <v-card>
                <v-img
                    :src="imageHost + '/' + imagePath"
                    :lazy-src="imageHost + '/' + imagePath"
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
                <v-card-title>
                    <div class="text-xs-left">
                        <div>Posted on {{dateTime}}</div>
                        <v-rating v-model="gradeNumber" dense readonly color="#f00"></v-rating>
                        <div>{{comment}}</div>
                    </div>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import env from '@/../config/env';

    export default {
        name: 'food-grade',
        data () {
            return {
                imageHost: env.imageHost,
                errorSrc: '/static/error.png'
            };
        },
        props: {
            imagePath: {
                type: String
            },
            grade: {
                type: String
            },
            dateTime: {
                type: String
            },
            comment: {
                type: String
            }
        },
        mounted () {
        },
        computed: {
            gradeNumber () {
                return parseInt(this.grade, 10);
            }
        },
        methods: {
        }
    };
</script>

<style scoped>
</style>

