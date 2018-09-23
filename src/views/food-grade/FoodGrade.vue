<template>
    <div>
        <card>
            <x-img slot="content" :src="imageHost + '/' + imagePath" :webp-src="`${imageHost + '/' + imagePath}?type=webp`" @on-success="success" @on-error="error"
                   class="ximg-normal" error-class="ximg-error" :offset="-100" container="#vux_view_box_body"></x-img>
            <div slot="footer" class="card-padding" style="text-align:left;">
                <p style="color:#999;font-size:12px;">Posted on {{dateTime}}</p>
                <rater :disabled="true" :value="grade"></rater>
                <p style="font-size:14px;line-height:1.2;">{{comment}}</p>
            </div>
        </card>
    </div>
</template>

<script>
    import { XImg, Card, Rater } from 'vux';
    import env from '@/../config/env';

    export default {
        name: 'food-grade',
        components: {
            XImg,
            Card,
            Rater
        },
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

