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
                    <v-flex xs3>
                        <v-avatar>
                            <img :src="imageHost + '/' + getAvatar(user)">
                        </v-avatar>
                    </v-flex>
                    <v-flex xs9>
                        <div class="text-xs-right">
                            <div>{{dateTime}}</div>
                            <v-rating v-model="gradeNumber" dense readonly color="#f00"></v-rating>
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div>{{comment}}</div>
                    </v-flex>
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
            },
            user: {
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
            getAvatar (user) {
                let allUserInfo = this.$store.state.allUserInfo;
                for (let userInfo of allUserInfo) {
                    if (user === userInfo.username) {
                        return userInfo.avatar;
                    }
                }
            }
        }
    };
</script>

<style scoped>
</style>

