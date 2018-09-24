<template>
<div>
    <toast v-model="isShowToast" type="text" :time="2000" is-show-mask :text="toastText">
    </toast>
    <div v-transfer-dom>
        <loading :show="isShowLoading" :text="loadingText"></loading>
    </div>
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
            v-model="comment"
            :rows="5">
        </x-textarea>
    </div>
</div>
</template>

<script>
    import { Toast, Loading, TransferDomDirective as TransferDom, Group, Cell, Rater, XTextarea, Datetime } from 'vux';
    import util from '@/libs/util';
    import { saveFoodGrade } from '@/api/food-grade';

    export default {
        name: 'food-upload',
        directives: {
            TransferDom
        },
        components: {
            Toast,
            Loading,
            Group,
            Cell,
            Rater,
            XTextarea,
            Datetime
        },
        data () {
            return {
                isShowToast: false,
                toastText: '',
                isShowLoading: false,
                loadingText: '',
                myCroppa: {},
                grade: 0,
                dateTime: util.formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
                comment: '',
                image: null
            };
        },
        computed: {
        },
        methods: {
            clearAll () {
                this.isShowLoading = false;
                this.loadingText = '';
                this.myCroppa.remove();
                this.grade = 0;
                this.dateTime = util.formatDate(new Date(), 'yyyy-MM-dd hh:mm');
                this.comment = '';
                this.image = null;
            },
            handleFinishClicked () {
                this.myCroppa.generateBlob(blob => {
                    let params = new FormData();
                    params.append('user', '');
                    params.append('dateTime', this.dateTime);
                    params.append('grade', this.grade);
                    params.append('comment', this.comment);
                    params.append('file', blob, this.image.name);
                    saveFoodGrade(params, this.handleImageUploadProgress).then(data => {
                        console.log(data);
                        if (data.status === 200) {
                            this.isShowToast = true;
                            this.toastText = '保存成功';
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }, this.image.type, 0.8);
            },
            handleImageChoose (file) {
                this.image = file;
            },
            handleImageRemove () {
                this.image = null;
            },
            handleImageUploadProgress (progressEvent) {
                if (progressEvent.lengthComputable) {
                    let num = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    console.log(num);
                    if (num >= 0 && num < 100) {
                        this.isShowLoading = true;
                        this.loadingText = num + '%';
                    } else {
                        this.clearAll();
                    }
                }
            }
        }
    };
</script>

<style scoped>

</style>
