<template>
    <v-layout row wrap>
        <v-flex xs5>
            <v-select
                :items="users"
                label="用户"
                v-model="user"
            ></v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs5>
            <v-select
                :items="days"
                label="显示期间"
                v-model="day"
            ></v-select>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h3>入睡睡醒时间趋势</h3>
                </v-card-title>
                <canvas id="sleepAreaCanvas" class="sleepContainer"></canvas>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h3>睡眠时长趋势</h3>
                </v-card-title>
                <canvas id="sleepLineCanvas" class="sleepContainer"></canvas>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h3>平均睡眠时长</h3>
                </v-card-title>
                <canvas id="sleepPieCanvas" class="sleepContainer"></canvas>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h3>深睡时间分布</h3>
                </v-card-title>
                <canvas id="sleepRadarCanvas" class="sleepContainer"></canvas>
            </v-card>
            <br>
        </v-flex>
    </v-layout>
</template>

<script>
    import auth from '@/libs/auth';
    import { fetchSleepQualities } from '@/api/sleep-quality';
    import F2 from '@antv/f2';
    import util from '@/libs/util';

    const SleepColor = '#7B68EE';
    const DeepSleepColor = '#483D8B';
    const AwakeColor = '#FFA500';

    export default {
        name: 'SleepQuality',
        data () {
            return {
                user: auth.getUser(),
                day: 7,
                days: [
                    {
                        text: '过去一周',
                        value: 7
                    },
                    {
                        text: '过去一月',
                        value: 30
                    },
                    {
                        text: '过去一年',
                        value: 365
                    }
                ],
                sleepCount: 0,
                sleepAreaDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD',
                        tickCount: 7,
                        range: [0, 1]
                    },
                    value: {
                        formatter: (val) => {
                            return util.formatDate(new Date(val * 1000), 'hh:mm');
                        }
                    }
                },
                sleepAreaData: [{ date: '', value: 0, type: '入睡' }],
                sleepLineDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD',
                        tickCount: 7,
                        range: [0, 1]
                    },
                    value: {
                        formatter: (val) => {
                            return val;
                        }
                    }
                },
                sleepLineData: [{ date: '', value: 0, type: '总睡眠' }],
                sleepPieData: [
                    {avg: 0.0, ratio: 0.0, name: '总睡', a: '1'},
                    {avg: 0.0, ratio: 0.0, name: '深睡', a: '1'},
                    {avg: 0.0, ratio: 0.0, name: '清醒', a: '1'}
                ],
                sleepRadarData: [
                ]
            };
        },
        watch: {
            'user': function (data) {
                this.fetchData();
            },
            'day': function (data) {
                this.fetchData();
            }
        },
        computed: {
            users () {
                let list = [];
                this.$store.state.allUserInfo.map(userInfo => {
                    list.push({
                        text: userInfo.alias,
                        value: userInfo.username
                    });
                });
                return list;
            }
        },
        mounted () {
            this.fetchData();
        },
        methods: {
            clearRadarData () {
                this.sleepRadarData = [];
                for (let i = 23; i < 24 + 9; i++) {
                    this.sleepRadarData.push({
                        item: i % 24 + '', count: 0
                    });
                }
            },
            formatTime (val) {
                let label = '';
                let hours = Math.floor(val / 60);
                let minutes = Math.floor(val % 60);
                if (hours > 0) {
                    label = hours + '时';
                }
                if (minutes > 0) {
                    label += minutes + '分';
                }
                return label;
            },
            fetchData () {
                let params = {
                    user: this.user,
                    days: this.day
                };
                fetchSleepQualities(params).then(response => {
                    let data = response.data;
                    this.sleepCount = data.length;
                    this.makeAreaData(data);
                    this.makeLineData(data);
                    this.makePieData(data);
                    this.makeRadarData(data);
                    this.makeAreaChart();
                    this.makeLineChart();
                    this.makePieChart();
                    this.makeRadarChart();
                });
            },
            makeAreaData (data) {
                this.sleepAreaData = [];
                data.map(d => {
                    let start = util.parseDate(d.sleepStart, 'yyyy-MM-dd hh:mm');
                    let end = util.parseDate(d.sleepEnd, 'yyyy-MM-dd hh:mm');

                    let startDay = parseInt(util.formatDate(start, 'dd'), 10);
                    let endDay = parseInt(util.formatDate(end, 'dd'), 10);

                    let curStandardYmd = '2018-10-14';
                    let nxtStandardYmd = '2018-10-15';
                    let startTime = 0;
                    let endTime = 0;

                    if (startDay === endDay) {
                        startTime = util.parseDate(nxtStandardYmd + ' ' + d.sleepStart.substr(11), 'yyyy-MM-dd hh:mm').getTime();
                        endTime = util.parseDate(nxtStandardYmd + ' ' + d.sleepEnd.substr(11), 'yyyy-MM-dd hh:mm').getTime();
                    } else {
                        startTime = util.parseDate(curStandardYmd + ' ' + d.sleepStart.substr(11), 'yyyy-MM-dd hh:mm').getTime();
                        endTime = util.parseDate(nxtStandardYmd + ' ' + d.sleepEnd.substr(11), 'yyyy-MM-dd hh:mm').getTime();
                    }
                    this.sleepAreaData.push({
                        date: d.date,
                        value: Math.floor(startTime / 1000),
                        type: '入睡'
                    });
                    this.sleepAreaData.push({
                        date: d.date,
                        value: Math.floor(endTime / 1000),
                        type: '睡醒'
                    });
                });
            },
            makeLineData (data) {
                this.sleepLineData = [];
                data.map(d => {
                    this.sleepLineData.push({
                        date: d.date,
                        value: d.sumSleep,
                        type: '总睡眠'
                    });
                    this.sleepLineData.push({
                        date: d.date,
                        value: d.sumDeepSleep,
                        type: '深睡'
                    });
                    this.sleepLineData.push({
                        date: d.date,
                        value: d.sumAwake,
                        type: '清醒'
                    });
                });
            },
            makePieData (data) {
                let sumSleep = 0;
                let sumDeepSleep = 0;
                let sumAwake = 0;
                data.map(d => {
                    sumSleep += d.sumSleep;
                    sumDeepSleep += d.sumDeepSleep;
                    sumAwake += d.sumAwake;
                });
                let avgSumSleep = Math.floor(sumSleep / data.length);
                let avgDeepSleep = Math.floor(sumDeepSleep / data.length);
                let avgAwake = Math.floor(sumAwake / data.length);
                this.sleepPieData[0].avg = avgSumSleep;
                this.sleepPieData[1].avg = avgDeepSleep;
                this.sleepPieData[2].avg = avgAwake;
                this.sleepPieData[0].ratio = avgSumSleep / (avgSumSleep + avgDeepSleep + avgAwake);
                this.sleepPieData[1].ratio = avgDeepSleep / (avgSumSleep + avgDeepSleep + avgAwake);
                this.sleepPieData[2].ratio = avgAwake / (avgSumSleep + avgDeepSleep + avgAwake);
            },
            makeRadarData (data) {
                this.clearRadarData();
                data.map(d => {
                    let deepSleeps = d.deepSleeps;
                    deepSleeps.map(deepSleep => {
                        let start = deepSleep.start;
                        let end = deepSleep.end;
                        let startTime = util.parseDate(start, 'yyyy-MM-dd hh:mm').getTime();
                        let endTime = util.parseDate(end, 'yyyy-MM-dd hh:mm').getTime();
                        let startHour = parseInt(util.formatDate(new Date(startTime), 'hh'));
                        let endHour = parseInt(util.formatDate(new Date(endTime), 'hh'));
                        let diffHour = endHour - startHour;
                        diffHour = diffHour < 0 ? diffHour + 24 : diffHour;
                        for (let i = 0; i <= diffHour; i++) {
                            let dspStartHour = (startHour + i) % 24;
                            for (let sleepData of this.sleepRadarData) {
                                if (parseInt(sleepData.item) === dspStartHour) {
                                    sleepData.count++;
                                    break;
                                }
                            }
                        }
                    });
                });
            },
            makeAreaChart () {
                let sleepAreaChart = new F2.Chart({
                    id: 'sleepAreaCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepAreaChart.source(this.sleepAreaData, this.sleepAreaDef);
                sleepAreaChart.tooltip({
                    showItemMarker: false,
                    onShow: function onShow (ev) {
                        let items = ev.items;
                        items[0].name = items[0].title + '  ' + items[0].name;
                    },
                    showCrosshairs: true
                });
                sleepAreaChart.line().position('date*value').shape('smooth').color('type', [SleepColor, AwakeColor]);
                sleepAreaChart.render();
            },
            makeLineChart () {
                let sleepLineChart = new F2.Chart({
                    id: 'sleepLineCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepLineChart.source(this.sleepLineData, this.sleepLineDef);
                sleepLineChart.tooltip({
                    showItemMarker: false,
                    onShow: function onShow (ev) {
                        let items = ev.items;
                        items[0].name = items[0].title + '  ' + items[0].name;
                    },
                    showCrosshairs: true
                });
                sleepLineChart.line().position('date*value').shape('smooth').color('type', [SleepColor, DeepSleepColor, AwakeColor]);
                sleepLineChart.render();
            },
            makePieChart () {
                let sleepPieChart = new F2.Chart({
                    id: 'sleepPieCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepPieChart.source(this.sleepPieData, {
                    avg: {
                        formatter: (val) => {
                            return this.formatTime(val);
                        }
                    }
                });
                sleepPieChart.coord('polar', {
                    transposed: true,
                    innerRadius: 0.4,
                    radius: 0.8
                });
                sleepPieChart.legend({
                    position: 'top',
                    itemFormatter: (val) => {
                        let avg = 0;
                        for (let sleepData of this.sleepPieData) {
                            if (sleepData.name === val) {
                                avg = sleepData.avg;
                                break;
                            }
                        }
                        return val + ' ' + this.formatTime(avg);
                    }
                });
                sleepPieChart.tooltip(false);
                sleepPieChart.coord('polar', {
                    transposed: true,
                    radius: 0.85
                });
                sleepPieChart.axis(false);
                sleepPieChart.interval().position('a*ratio').color('name', [SleepColor, DeepSleepColor, AwakeColor]).adjust('stack');
                sleepPieChart.render();
            },
            makeRadarChart () {
                let sleepRadarchart = new F2.Chart({
                    id: 'sleepRadarCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepRadarchart.coord('polar');
                sleepRadarchart.source(this.sleepRadarData, {
                    count: {
                        nice: false,
                        tickCount: 4
                    }
                });
                sleepRadarchart.axis('item', {
                    grid: {
                        lineDash: null
                    }
                });
                sleepRadarchart.area().position('item*count').style({
                    fill: DeepSleepColor,
                    fillOpacity: 0.6
                });
                sleepRadarchart.line().position('item*count').style({
                    stroke: DeepSleepColor
                });
                sleepRadarchart.render();
            }
        }
    };
</script>

<style scoped>
    .sleepContainer {
        width: 100%;
        height: 100%;
    }
</style>
