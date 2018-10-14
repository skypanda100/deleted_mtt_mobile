<template>
    <v-layout row wrap>
        <v-flex
            v-for="(src, index) in list"
            :key="index"
            xs6>
            <v-card :to="{path: `/food-grade?imagePath=${src.imagePath}&grade=${src.grade}&dateTime=${src.dateTime}&comment=${src.comment}&user=${src.user}`}">
                <v-img
                    :src="imageHost + '/' + src.imagePath"
                    :lazy-src="imageHost + '/' + src.imagePath"
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
                    <v-flex xs2>
                        <v-avatar size="30px">
                            <img :src="imageHost + '/' + getAvatar(src.user)">
                        </v-avatar>
                    </v-flex>

                    <v-flex xs10>
                        <div class="text-xs-right" style="font-size: 10px">
                            <div>{{src.dateTime}}</div>
                            <v-rating v-model="src.grade" dense readonly color="#f00" :size="10"></v-rating>
                        </div>
                    </v-flex>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { fetchFoodGrade } from '@/api/food-grade';
    import env from '@/../config/env';

    export default {
        name: 'food-grades',
        data () {
            return {
                imageHost: env.imageHost,
                list: [],
                grade: '5',
                isFirstEnter: false
            };
        },
        mounted () {
            this.isFirstEnter = true;
        },
        /**
         * 不使用keep-alive
         * beforeRouteEnter --> created --> mounted --> destroyed
         * 使用keep-alive
         * beforeRouteEnter --> created --> mounted --> activated --> deactivated
         * 再次进入缓存的页面，只会触发beforeRouteEnter -->activated --> deactivated 。created和mounted不会再执行。
         */
        beforeRouteEnter (to, from, next) {
            if (from.name === 'FoodGrade') {
                if (to.name === 'FoodGrades') {
                    to.meta.isBack = true;
                }
            }
            next();
        },
        activated () {
            if (!this.$route.meta.isBack || this.isFirstEnter) {
                fetchFoodGrade('-dateTime').then(response => {
                    this.list = response.data;
                });
            }
            this.$route.meta.isBack = false;
            this.isFirstEnter = false;
        },
        computed: {
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

