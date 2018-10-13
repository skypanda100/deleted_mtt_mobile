<template>
    <v-layout>
        <v-dialog
            v-model="isShowLoading"
            hide-overlay
            persistent
            width="300">
            <v-card>
                <v-card-text>
                    uploading
                    <v-progress-linear
                        color="white"
                        class="mb-0"
                        v-model="loadingValue"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-flex xs12 sm6>
            <v-card>
                <croppa
                    style="width: 100%;height: 100vmin"
                    :show-loading="true"
                    :auto-sizing="true"
                    @file-choose="handleImageChoose"
                    @image-remove="handleImageRemove"
                    placeholder="点击这里选择一张图片 :)"
                    :prevent-white-space="true"
                    v-model="myCroppa">
                </croppa>
                <v-card-title>
                    <v-rating v-model="grade" color="#f00"></v-rating>
                    <v-textarea
                        solo
                        label="说点啥吧"
                        full-width
                        v-model="comment"
                    ></v-textarea>
                </v-card-title>
                <v-card-actions>
                    <v-btn flat color="primary" @click.native="handleFinishClicked">保存</v-btn>
                    <v-btn flat color="black" @click.native="clearAll">取消</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import util from '@/libs/util';
    import { saveFoodGrade } from '@/api/food-grade';

    export default {
        name: 'food-upload',
        data () {
            return {
                isShowToast: false,
                isShowLoading: false,
                loadingValue: 0,
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
                this.loadingValue = 0;
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
                        this.loadingValue = num;
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
