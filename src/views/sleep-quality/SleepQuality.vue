<template>
    <v-layout row wrap>
        <v-select
            :items="days"
            label="显示期间"
            v-model="day"
        ></v-select>
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

    export default {
        name: 'SleepQuality',
        data () {
            return {
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
                            return this.formatTime(val);
                        }
                    }
                },
                sleepLineData: [{ date: '', value: 0, type: '总睡眠' }],
                sleepPieData: [
                    {num: 0.0, ratio: 0.0, name: '浅睡', a: '1'},
                    {num: 0.0, ratio: 0.0, name: '深睡', a: '1'},
                    {num: 0.0, ratio: 0.0, name: '清醒', a: '1'}
                ]
            };
        },
        watch: {
            'day': function (data) {
                this.fetchData();
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
                    user: auth.getUser(),
                    days: this.day
                };
                this.sleepLineData = [];
                fetchSleepQualities(params).then(response => {
                    let data = response.data;
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
                        this.sleepPieData[0].num += d.sumSleep - d.sumDeepSleep;
                        this.sleepPieData[1].num += d.sumDeepSleep;
                        this.sleepPieData[2].num += d.sumAwake;
                    });
                    let sumShallowSleep = this.sleepPieData[0].num;
                    let sumDeepSleep = this.sleepPieData[1].num;
                    let sumAwake = this.sleepPieData[2].num;
                    this.sleepPieData[0].ratio += sumShallowSleep / (sumShallowSleep + sumDeepSleep + sumAwake);
                    this.sleepPieData[1].ratio += sumDeepSleep / (sumShallowSleep + sumDeepSleep + sumAwake);
                    this.sleepPieData[2].ratio += sumAwake / (sumShallowSleep + sumDeepSleep + sumAwake);

                    this.makeCharts();
                });
            },
            makeCharts () {
                // line
                let sleepLineChart = new F2.Chart({
                    id: 'sleepLineCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepLineChart.source(this.sleepLineData, this.sleepLineDef);
                sleepLineChart.line().position('date*value').color('type', ['#4169E1', '#483D8B', '#FFA500']);
                sleepLineChart.render();
                // pie
                let sleepPieChart = new F2.Chart({
                    id: 'sleepPieCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepPieChart.source(this.sleepPieData, {
                    num: {
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
                        let num = 0;
                        for (let sleepData of this.sleepPieData) {
                            if (sleepData.name === val) {
                                num = sleepData.num;
                                break;
                            }
                        }
                        return val + ' ' + this.formatTime(num);
                    }
                });
                sleepPieChart.tooltip(false);
                sleepPieChart.coord('polar', {
                    transposed: true,
                    radius: 0.85
                });
                sleepPieChart.axis(false);
                sleepPieChart.interval().position('a*ratio').color('name', ['#7B68EE', '#483D8B', '#FFA500']).adjust('stack');
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
