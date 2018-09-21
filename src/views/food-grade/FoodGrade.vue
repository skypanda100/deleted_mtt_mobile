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
        <card v-for="src in list" style="background-color:white" :key="src + new Date()">
            <x-img slot="content" :src="src" :webp-src="`${src}?type=webp`" @on-success="success" @on-error="error"
                   class="ximg-normal" error-class="ximg-error" :offset="-100" container="#vux_view_box_body"></x-img>
            <div slot="footer" class="card-padding" style="text-align:left;">
                <p style="color:#999;font-size:12px;">Posted on January 21, 2015</p>
                <rater v-model="grade"></rater>
                <p style="font-size:14px;line-height:1.2;">上等羊肉汤，味道鲜美至极，简直就是辛劳一天后的馈赠</p>
            </div>
        </card>
    </div>
</template>

<script>
    import { ViewBox, XHeader, Sticky, XImg, Card, Rater } from 'vux';

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
                errorSrc: '/static/error.png',
                list: [
                    'https://o5omsejde.qnssl.com/demo/test1.jpg',
                    'https://o5omsejde.qnssl.com/demo/test2.jpg',
                    'https://o5omsejde.qnssl.com/demo/test0.jpg',
                    'https://o5omsejde.qnssl.com/demo/test4.jpg',
                    'https://o5omsejde.qnssl.com/demo/test5.jpg',
                    'https://o5omsejde.qnssl.com/demo/test6.jpg',
                    'https://o5omsejde.qnssl.com/demo/test7.jpg',
                    'https://o5omsejde.qnssl.com/demo/test8.jpg'
                ],
                grade: '5'
            };
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

