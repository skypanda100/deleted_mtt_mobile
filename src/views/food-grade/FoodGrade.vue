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
        <card v-for="src in list" style="background-color:white;padding: 10px" :key="src.imagePath">
            <x-img slot="content" :src="imageHost + '/' + src.imagePath" :webp-src="`${imageHost + '/' + src.imagePath}?type=webp`" @on-success="success" @on-error="error"
                   class="ximg-normal" error-class="ximg-error" :offset="-100" container="#vux_view_box_body"></x-img>
            <div slot="footer" class="card-padding" style="text-align:left;">
                <p style="color:#999;font-size:12px;">Posted on {{src.dateTime}}</p>
                <rater :value="src.grade"></rater>
                <p style="font-size:14px;line-height:1.2;">{{src.comment}}</p>
            </div>
        </card>
    </div>
</template>

<script>
    import { ViewBox, XHeader, Sticky, XImg, Card, Rater } from 'vux';
    import { fetchFoodGrade } from '@/api/food-grade';
    import env from '@/../config/env';

    export default {
        name: 'food-grade',
        components: {
            ViewBox,
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
            console.log(process.env);
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
                console.log('back');
            },
            handleCameraClicked () {
                console.log('clicked');
                this.$router.push('/food-upload');
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
        height: auto;
    }

    .ximg-error {
        background-color: transparent;
    }
</style>

