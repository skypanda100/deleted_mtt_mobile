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
                <canvas id="sleepLineCanvas" class="sleepContainer"></canvas>
            </v-card>
            <br>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <canvas id="sleepPieCanvas" class="sleepContainer"></canvas>
            </v-card>
            <br>
        </v-flex>
    </v-layout>
</template>

<script>
    import auth from '@/libs/auth';
    import { fetchSleepQualities } from '@/api/sleep-quality';
    import F2 from '@antv/f2';

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
                sleepLineDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD',
                        tickCount: 7,
                        range: [0, 1]
                    },
                    value: {
                        tickCount: 5,
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

                    this.makeLineData(data);
                    this.makePieData(data);
                    this.makeLineChart();
                    this.makePieChart();
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
            makeLineChart () {
                let sleepLineChart = new F2.Chart({
                    id: 'sleepLineCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepLineChart.source(this.sleepLineData, this.sleepLineDef);
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
                    position: 'right',
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
