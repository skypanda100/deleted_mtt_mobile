<template>
<div>
    <div v-transfer-dom>
        <loading :show="isShowLoading" :text="loadingText"></loading>
    </div>
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
            v-model="comment"
            :rows="5">
        </x-textarea>
    </div>
</div>
</template>

<script>
    import { Loading, TransferDomDirective as TransferDom, Sticky, XHeader, Group, Cell, Rater, XTextarea, Datetime } from 'vux';
    import util from '@/libs/util';
    import { saveFoodGrade } from '@/api/food-grade';

    export default {
        name: 'food-upload',
        directives: {
            TransferDom
        },
        components: {
            Loading,
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
            leftOptions () {
                return {
                    showBack: true,
                    backText: '',
                    preventGoBack: true
                };
            }
        },
        methods: {
            clearAll () {
                this.isShowLoading = false;
                this.loadingText = '';
                this.myCroppa = {};
                this.grade = 0;
                this.dateTime = util.formatDate(new Date(), 'yyyy-MM-dd hh:mm');
                this.comment = '';
                this.image = null;
            },
            handleBackClicked () {
                this.$router.go(-1);
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
                    }).catch(err => {
                        console.log(err);
                    });
                });
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
