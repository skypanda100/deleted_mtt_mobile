<template>
    <v-layout row wrap>
        <v-flex xs12 sm6>
            <croppa
                style="width: 100%;height: 80vmin"
                :show-loading="true"
                :auto-sizing="true"
                @file-choose="handleImageChoose"
                @image-remove="handleImageRemove"
                placeholder="点击这里选择睡眠图片进行识别 :)"
                :prevent-white-space="true">
            </croppa>
        </v-flex>
        <v-flex xs12 sm6>
            <v-menu
                ref="sleepDateMenu"
                :close-on-content-click="false"
                v-model="sleepDateMenu"
                :nudge-right="40"
                :return-value.sync="sleepDate"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px">
                <v-text-field
                    slot="activator"
                    v-model="sleepDate"
                    label="睡眠日期"
                    prepend-icon="event"
                    readonly
                ></v-text-field>
                <v-date-picker
                    v-model="sleepDate"
                    @input="$refs.sleepDateMenu.save(sleepDate)"
                    :event-color="'red'"
                    :events="functionUndoEvents"
                ></v-date-picker>
            </v-menu>
        </v-flex>
        <v-flex xs6 sm6>
            <v-menu
                ref="startTimeMenu"
                :close-on-content-click="false"
                v-model="startTimeMenu"
                :nudge-right="40"
                :return-value.sync="startTime"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
            >
                <v-text-field
                    slot="activator"
                    v-model="startTime"
                    label="起始时间"
                    prepend-icon="access_time"
                    readonly
                ></v-text-field>
                <v-time-picker
                    v-if="startTimeMenu"
                    v-model="startTime"
                    full-width
                    @change="$refs.startTimeMenu.save(startTime)"
                    format="24hr"
                ></v-time-picker>
            </v-menu>
        </v-flex>
        <v-flex xs6 sm6>
            <v-menu
                ref="endTimeMenu"
                :close-on-content-click="false"
                v-model="endTimeMenu"
                :nudge-right="40"
                :return-value.sync="endTime"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
            >
                <v-text-field
                    slot="activator"
                    v-model="endTime"
                    label="结束时间"
                    prepend-icon="access_time"
                    readonly
                ></v-text-field>
                <v-time-picker
                    v-if="endTimeMenu"
                    v-model="endTime"
                    full-width
                    @change="$refs.endTimeMenu.save(endTime)"
                    format="24hr"
                ></v-time-picker>
            </v-menu>
        </v-flex>
        <v-flex xs8 sm6 v-if="deepSleepTimes.length > 0">
            <h4>深睡</h4>
        </v-flex>
        <v-flex xs4 sm6 v-if="deepSleepTimes.length > 0">
            <p class="text-lg-right">{{Math.floor(sumDeepSleep / 60)}}时{{Math.floor(sumDeepSleep % 60)}}分</p>
        </v-flex>
        <v-layout row wrap v-for="(deepSleep, index) in deepSleepTimes" :key="'deepSleep' + index">
            <v-flex xs6 sm6>
                <v-text-field
                    slot="activator"
                    :value="deepSleep.start.substr(11)"
                    label="起始时间"
                    prepend-icon="access_time"
                    readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6>
                <v-text-field
                    slot="activator"
                    :value="deepSleep.end.substr(11)"
                    label="结束时间"
                    prepend-icon="access_time"
                    readonly
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-flex xs8 sm6 v-if="awakeTimes.length > 0">
            <h4>清醒</h4>
        </v-flex>
        <v-flex xs4 sm6 v-if="awakeTimes.length > 0">
            <p class="text-lg-right">{{Math.floor(sumAwake / 60)}}时{{Math.floor(sumAwake % 60)}}分</p>
        </v-flex>
        <v-layout row wrap v-for="(awake, index) in awakeTimes" :key="'awake' + index">
            <v-flex xs6 sm6>
                <v-text-field
                    slot="activator"
                    :value="awake.start.substr(11)"
                    label="起始时间"
                    prepend-icon="access_time"
                    readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6>
                <v-text-field
                    slot="activator"
                    :value="awake.end.substr(11)"
                    label="结束时间"
                    prepend-icon="access_time"
                    readonly
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-flex xs6 sm6>
            <v-btn @click="handleTransformClicked" block color="primary" :disabled="!canTransform">识别</v-btn>
        </v-flex>
        <v-flex xs6 sm6>
            <v-btn @click="handleSaveClicked" block color="primary" :disabled="!canTransform">保存</v-btn>
        </v-flex>
        <v-flex xs12 sm6>
            <v-alert
                :value="alert.show"
                :type="alert.type"
                transition="scale-transition">
                {{alert.message}}
            </v-alert>
        </v-flex>
    </v-layout>
</template>

<script>
    import util from '@/libs/util';
    import auth from '@/libs/auth';
    import UPNG from 'upng-js';
    import { saveSleepQuality, fetchUndoSleepQualities } from '@/api/sleep-quality';

    const deepSleepRGBA = [96, 80, 176, 255];
    const awakeRGBA = [255, 156, 44, 255];
    const dividerRGBA = [246, 247, 248, 255];
    const sleepRowOffset = 10;

    export default {
        name: 'SleepUpload',
        data () {
            return {
                undoTimes: [],
                image: null,
                sleepDateMenu: false,
                sleepDate: util.formatDate(new Date(), 'yyyy-MM-dd'),
                startTimeMenu: false,
                startTime: null,
                endTimeMenu: false,
                endTime: null,
                deepSleepTimes: [],
                sumDeepSleep: 0,
                awakeTimes: [],
                sumAwake: 0,
                alert: {
                    show: false,
                    type: 'error',
                    message: ''
                }
            };
        },
        computed: {
            canTransform () {
                return !util.isNull(this.image) &&
                    !util.isNull(this.sleepDate) &&
                    !util.isNull(this.startTime) &&
                    !util.isNull(this.endTime);
            }
        },
        watch: {
            'sleepDate': function (data) {
                this.clearTransformZone();
            },
            'startTime': function (data) {
                this.clearTransformZone();
            },
            'endTime': function (data) {
                this.clearTransformZone();
            },
            'deepSleepTimes': function (data) {
                let sum = 0;
                data.map(d => {
                    sum += d.diff;
                });
                this.sumDeepSleep = sum;
            },
            'awakeTimes': function (data) {
                let sum = 0;
                data.map(d => {
                    sum += d.diff;
                });
                this.sumAwake = sum;
            }
        },
        mounted () {
            this.getUndoTimes();
        },
        methods: {
            getUndoTimes () {
                let params = {
                    user: auth.getUser()
                };
                fetchUndoSleepQualities(params).then(response => {
                    this.undoTimes = response.data;
                });
            },
            functionUndoEvents (date) {
                return this.undoTimes.indexOf(date) > -1;
            },
            getSleepStartTime () {
                let date = this.sleepDate;
                if (this.startTime > this.endTime) {
                    let dateObj = util.parseDate(date, 'yyyy-MM-dd');
                    date = util.formatDate(new Date(dateObj.getTime() - 1000 * 1), 'yyyy-MM-dd');
                }
                date = date + ' ' + this.startTime;
                return date;
            },
            getSleepEndTime () {
                let date = this.sleepDate + ' ' + this.endTime;
                return date;
            },
            getSumSleep () {
                let startTime = util.parseDate(this.getSleepStartTime(), 'yyyy-MM-dd hh:mm');
                let endTime = util.parseDate(this.getSleepEndTime(), 'yyyy-MM-dd hh:mm');
                let offsetTime = endTime.getTime() - startTime.getTime();
                return Math.floor(offsetTime / 1000 / 60) - this.sumAwake;
            },
            clearTransformZone () {
                this.deepSleepTimes = [];
                this.sumDeepSleep = 0;
                this.awakeTimes = [];
                this.sumAwake = 0;
                this.alert.show = false;
            },
            transformTime (arr, sumLen) {
                let sleepTimes = [];
                let startTime = util.parseDate(this.getSleepStartTime(), 'yyyy-MM-dd hh:mm');
                let endTime = util.parseDate(this.getSleepEndTime(), 'yyyy-MM-dd hh:mm');
                let offsetTime = endTime.getTime() - startTime.getTime();
                arr.map(data => {
                    let subStartTime = new Date(startTime.getTime() + data.start / sumLen * offsetTime);
                    let subEndTime = new Date(startTime.getTime() + data.end / sumLen * offsetTime);
                    let subStartTimeStr = util.formatDate(subStartTime, 'yyyy-MM-dd hh:mm');
                    let subEndTimeStr = util.formatDate(subEndTime, 'yyyy-MM-dd hh:mm');
                    sleepTimes.push({
                        start: subStartTimeStr,
                        end: subEndTimeStr,
                        diff: Math.floor((subEndTime.getTime() - subStartTime.getTime()) / 1000 / 60) + 1
                    });
                });
                return sleepTimes;
            },
            transformImage (buff) {
                let img = UPNG.decode(buff);
                let rgba = UPNG.toRGBA8(img)[0];
                let rgbaView = new DataView(rgba);
                let sleepRow = -1;
                let currentRGBA = [0, 0, 0, 0];
                for (let row = 0; row < img.height; row++) {
                    let offset = (row * img.width + 0) * 4;
                    currentRGBA[0] = rgbaView.getUint8(offset);
                    currentRGBA[1] = rgbaView.getUint8(offset + 1);
                    currentRGBA[2] = rgbaView.getUint8(offset + 2);
                    currentRGBA[3] = rgbaView.getUint8(offset + 3);
                    if (currentRGBA[0] === dividerRGBA[0] &&
                        currentRGBA[1] === dividerRGBA[1] &&
                        currentRGBA[2] === dividerRGBA[2] &&
                        currentRGBA[3] === dividerRGBA[3]) {
                        sleepRow = row - sleepRowOffset;
                        break;
                    }
                }
                if (sleepRow !== -1) {
                    let sleepRGBAs = [];
                    for (let col = 0; col < img.width; col++) {
                        let offset = (sleepRow * img.width + col) * 4;
                        sleepRGBAs.push(
                            [
                                rgbaView.getUint8(offset),
                                rgbaView.getUint8(offset + 1),
                                rgbaView.getUint8(offset + 2),
                                rgbaView.getUint8(offset + 3)
                            ]
                        );
                    }
                    // 深睡分布
                    let deepSleeps = [];
                    let firstDeepSleepIndex = -1;
                    sleepRGBAs.map((sleepRGBA, index) => {
                        if (sleepRGBA[0] === deepSleepRGBA[0] &&
                            sleepRGBA[1] === deepSleepRGBA[1] &&
                            sleepRGBA[2] === deepSleepRGBA[2] &&
                            sleepRGBA[3] === deepSleepRGBA[3]) {
                            if (firstDeepSleepIndex === -1) {
                                firstDeepSleepIndex = index;
                            }
                        } else {
                            if (firstDeepSleepIndex !== -1) {
                                deepSleeps.push({
                                    start: firstDeepSleepIndex,
                                    end: index - 1
                                });
                                firstDeepSleepIndex = -1;
                            }
                        }
                    });
                    if (firstDeepSleepIndex !== -1) {
                        deepSleeps.push({
                            start: firstDeepSleepIndex,
                            end: sleepRGBAs.length - 1
                        });
                        firstDeepSleepIndex = -1;
                    }
                    this.deepSleepTimes = this.transformTime(deepSleeps, sleepRGBAs.length);
                    // 清醒分布
                    let awakes = [];
                    let firstAwakeIndex = -1;
                    sleepRGBAs.map((sleepRGBA, index) => {
                        if (sleepRGBA[0] === awakeRGBA[0] &&
                            sleepRGBA[1] === awakeRGBA[1] &&
                            sleepRGBA[2] === awakeRGBA[2] &&
                            sleepRGBA[3] === awakeRGBA[3]) {
                            if (firstAwakeIndex === -1) {
                                firstAwakeIndex = index;
                            }
                        } else {
                            if (firstAwakeIndex !== -1) {
                                awakes.push({
                                    start: firstAwakeIndex,
                                    end: index - 1
                                });
                                firstAwakeIndex = -1;
                            }
                        }
                    });
                    if (firstAwakeIndex !== -1) {
                        awakes.push({
                            start: firstAwakeIndex,
                            end: sleepRGBAs.length - 1
                        });
                        firstAwakeIndex = -1;
                    }
                    this.awakeTimes = this.transformTime(awakes, sleepRGBAs.length);
                }
            },
            handleImageChoose (file) {
                this.image = file;
            },
            handleImageRemove () {
                this.image = null;
                this.clearTransformZone();
            },
            handleTransformClicked () {
                let reader = new FileReader();
                reader.onloadend = (event) => {
                    console.log(event);
                    this.transformImage(reader.result);
                };
                reader.readAsArrayBuffer(this.image);
            },
            handleSaveClicked () {
                let params = {
                    user: auth.getUser(),
                    date: this.sleepDate,
                    sleepStart: this.getSleepStartTime(),
                    sleepEnd: this.getSleepEndTime(),
                    sumSleep: this.getSumSleep(),
                    deepSleeps: this.deepSleepTimes,
                    sumDeepSleep: this.sumDeepSleep,
                    awakes: this.awakeTimes,
                    sumAwake: this.sumAwake
                };
                console.log(params);
                saveSleepQuality(params).then(response => {
                    let data = response.data;
                    console.log(data);
                    if (data.status === 200) {
                        this.alert.show = true;
                        this.alert.type = 'success';
                        this.alert.message = data.message;
                        this.getUndoTimes();
                    } else {
                        this.alert.show = true;
                        this.alert.type = 'error';
                        this.alert.message = data.message;
                    }
                });
            }
        }
    };
</script>

<style scoped>

</style>
