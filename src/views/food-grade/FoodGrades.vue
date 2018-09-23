<template>
    <div>
        <Sticky
            ref="sticky">
            <x-header
                style="width:100%;position:absolute;left:0;top:0;z-index:100;"
                :left-options="leftOptions"
                @on-click-back="handleBackClicked">
                <span slot="right">
                    <x-icon type="camera" style="fill:#fff;" @click="handleCameraClicked"></x-icon>
                </span>
            </x-header>
        </Sticky>
        <br>
        <br>
        <grid
            :cols="2"
            :show-lr-borders="true"
            :show-vertical-dividers="true">
            <grid-item v-for="(src, index) in list"
                       :key="index"
                       :link="{path: `/food-grade?imagePath=${src.imagePath}&grade=${src.grade}&dateTime=${src.dateTime}&comment=${src.comment}`}">
                <card style="background-color:white">
                    <x-img
                        slot="content"
                        :src="imageHost + '/' + src.imagePath"
                        :webp-src="`${imageHost + '/' + src.imagePath}?type=webp`"
                        @on-success="success"
                        @on-error="error"
                        @click="handleImageClicked(src)"
                        class="ximg-normal"
                        error-class="ximg-error"
                        :offset="-100"
                        container="#vux_view_box_body">
                    </x-img>
                    <div slot="footer" class="card-padding">
                        <rater :font-size="10" :disabled="true" :value="src.grade"></rater>
                        <p style="color:#999;font-size:10px">{{src.dateTime}}</p>
                    </div>
                </card>
            </grid-item>
        </grid>
    </div>
</template>

<script>
    import { Grid, GridItem, XHeader, Sticky, XImg, Card, Rater } from 'vux';
    import { fetchFoodGrade } from '@/api/food-grade';
    import env from '@/../config/env';

    export default {
        name: 'food-grades',
        components: {
            Grid,
            GridItem,
            XHeader,
            Sticky,
            XImg,
            Card,
            Rater
        },
        data () {
            return {
                imageHost: env.imageHost,
                errorSrc: '/static/error.png',
                list: [],
                grade: '5'
            };
        },
        mounted () {
            fetchFoodGrade('-dateTime').then(response => {
                this.list = response.data;
                console.log(this.list);
            });
        },
        computed: {
            leftOptions () {
                return {
                    showBack: true,
                    backText: '',
                    preventGoBack: true
                };
            }
        },
        methods: {
            handleBackClicked () {
                this.$router.go(-1);
            },
            handleCameraClicked () {
                console.log('clicked');
                this.$router.push('/food-upload');
            },
            handleImageClicked (food) {
                console.log(food);
            },
            success (src, ele) {
                console.log('success load', src, ele);
                // const span = ele.parentNode.querySelector('span');
                // ele.parentNode.removeChild(span);
            },
            error (src, ele, msg) {
                console.log('error load', msg, src);
                ele.src = this.errorSrc;
            }
        }
    };
</script>

<style scoped>
    .ximg-normal {
        width: 100%;
        height: 50vmin;
    }

    .ximg-error {
        background-color: transparent;
    }
</style>

