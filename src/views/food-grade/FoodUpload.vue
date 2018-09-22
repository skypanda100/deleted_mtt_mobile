<template>
<div>
    <Sticky
        ref="sticky">
        <x-header
            style="width:100%;position:absolute;left:0;top:0;z-index:100;"
            :left-options="leftOptions"
            @on-click-back="handleBackClicked">
            <span slot="right">
                <x-icon v-if="image !== null" type="checkmark" style="fill:#fff;" @click="handleFinishClicked"></x-icon>
            </span>
        </x-header>
    </Sticky>
    <br>
    <br>
    <div style="padding: 10px;text-align: center">
        <croppa
            style="width: 100%;height: 100vmin"
            placeholder=""
            :show-loading="true"
            :auto-sizing="true"
            @file-choose="handleImageChoose"
            @image-remove="handleImageRemove"
            v-model="myCroppa">
        </croppa>
        <rater v-model="grade"></rater>
        <datetime
            v-model="dateTime"
            format="YYYY-MM-DD HH:mm"
            title="日期">
        </datetime>
        <x-textarea
            placeholder="说点啥吧"
            :rows="5">
        </x-textarea>
    </div>
</div>
</template>

<script>
    import { Sticky, XHeader, Group, Cell, Rater, XTextarea, Datetime } from 'vux';
    import util from '@/libs/util';

    export default {
        name: 'food-upload',
        components: {
            Sticky,
            XHeader,
            Group,
            Cell,
            Rater,
            XTextarea,
            Datetime
        },
        data () {
            return {
                myCroppa: {},
                grade: 0,
                dateTime: util.formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
                image: null
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
                this.$router.go(-1);
            },
            handleFinishClicked () {
                console.log('clicked');
            },
            uploadCroppedImage () {
                this.myCroppa.generateBlob((blob) => {
                    // write code to upload the cropped image file (a file is a blob)
                }, 'image/jpeg', 0.8); // 80% compressed jpeg file
            },
            handleImageChoose (file) {
                console.log(file);
                this.image = file;
            },
            handleImageRemove () {
                this.image = null;
            }
        }
    };
</script>

<style scoped>

</style>
