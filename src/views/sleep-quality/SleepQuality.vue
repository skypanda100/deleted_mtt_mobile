<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-select
                :items="users"
                label="用户"
                v-model="user"
                multiple
            ></v-select>
        </v-flex>
        <v-flex xs12>
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
                <div id="sleepAreaDate" class="dateArea"></div>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h3>睡眠时长趋势</h3>
                </v-card-title>
                <canvas id="sleepLineCanvas" class="sleepContainer"></canvas>
                <div id="sleepLineDate" class="dateArea"></div>
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
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h3>平均睡眠时长</h3>
                </v-card-title>
                <canvas id="sleepBarCanvas" class="sleepContainer"></canvas>
            </v-card>
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
                user: [auth.getUser()],
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
                        range: [0, 1]
                    },
                    value: {
                        formatter: (val) => {
                            return util.formatDate(new Date(val * 1000), 'hh:mm');
                        }
                    }
                },
                sleepAreaData: [{ date: '', value: 0, type: '入睡', user: '' }],
                sleepLineDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD',
                        range: [0, 1]
                    },
                    value: {
                        formatter: (val) => {
                            return val;
                        }
                    }
                },
                sleepLineData: [{ date: '', value: 0, type: '总睡眠', user: '' }],
                sleepBarData: [],
                sleepRadarData: []
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
            getUserAlias (user) {
                for (let userInfo of this.$store.state.allUserInfo) {
                    if (user === userInfo.username) {
                        return userInfo.alias;
                    }
                }
                return '';
            },
            getUser (alias) {
                for (let userInfo of this.$store.state.allUserInfo) {
                    if (alias === userInfo.alias) {
                        return userInfo.username;
                    }
                }
                return '';
            },
            clearRadarData () {
                this.sleepRadarData = [];
                for (let i = 23; i < 24 + 9; i++) {
                    this.user.map(u => {
                        this.sleepRadarData.push({
                            item: i % 24 + '', count: 0, alias: this.getUserAlias(u)
                        });
                    });
                }
            },
            clearBarData () {
                this.sleepBarData = [];
                this.user.map(u => {
                    this.sleepBarData.push({
                        avg: 0.0, name: '总睡', alias: this.getUserAlias(u)
                    });
                    this.sleepBarData.push({
                        avg: 0.0, name: '深睡', alias: this.getUserAlias(u)
                    });
                    this.sleepBarData.push({
                        avg: 0.0, name: '清醒', alias: this.getUserAlias(u)
                    });
                });
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
                if (label === '') {
                    label = '0分';
                }
                return label;
            },
            fetchData () {
                if (this.user.length === 0) {
                    return;
                }
                let params = {
                    user: this.user,
                    days: this.day
                };
                fetchSleepQualities(params).then(response => {
                    let data = response.data;
                    this.sleepCount = data.length;
                    this.makeAreaData(data);
                    this.makeLineData(data);
                    this.makeBarData(data);
                    this.makeRadarData(data);
                    this.makeAreaChart();
                    this.makeLineChart();
                    this.makeBarChart();
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
                        type: '入睡',
                        user: d.user
                    });
                    this.sleepAreaData.push({
                        date: d.date,
                        value: Math.floor(endTime / 1000),
                        type: '睡醒',
                        user: d.user
                    });
                });
            },
            makeLineData (data) {
                this.sleepLineData = [];
                data.map(d => {
                    this.sleepLineData.push({
                        date: d.date,
                        value: d.sumSleep,
                        type: '总睡',
                        user: d.user
                    });
                    this.sleepLineData.push({
                        date: d.date,
                        value: d.sumDeepSleep,
                        type: '深睡',
                        user: d.user
                    });
                    this.sleepLineData.push({
                        date: d.date,
                        value: d.sumAwake,
                        type: '清醒',
                        user: d.user
                    });
                });
            },
            makeBarData (data) {
                this.clearBarData();
                this.user.map(u => {
                    let sumSleep = 0;
                    let sumDeepSleep = 0;
                    let sumAwake = 0;
                    let count = 0;
                    data.map(d => {
                        if (d.user === u) {
                            sumSleep += d.sumSleep;
                            sumDeepSleep += d.sumDeepSleep;
                            sumAwake += d.sumAwake;
                            count++;
                        }
                    });
                    let avgSumSleep = Math.floor(sumSleep / count);
                    let avgDeepSleep = Math.floor(sumDeepSleep / count);
                    let avgAwake = Math.floor(sumAwake / count);
                    for (let sleepData of this.sleepBarData) {
                        if (sleepData.alias === this.getUserAlias(u)) {
                            if (sleepData.name === '总睡') {
                                sleepData.avg = avgSumSleep;
                            } else if (sleepData.name === '深睡') {
                                sleepData.avg = avgDeepSleep;
                            } else if (sleepData.name === '清醒') {
                                sleepData.avg = avgAwake;
                            }
                        }
                    }
                });
            },
            makeRadarData (data) {
                this.clearRadarData();
                data.map(d => {
                    let deepSleeps = d.deepSleeps;
                    deepSleeps.map(deepSleep => {
                        let alias = this.getUserAlias(d.user);
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
                                if (parseInt(sleepData.item) === dspStartHour && sleepData.alias === alias) {
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
                    custom: true,
                    onChange: (obj) => {
                        // legend
                        let legend = sleepAreaChart.get('legendController').legends.top[0];
                        let tooltipItems = obj.items;
                        let legendItems = legend.items;
                        let map = {};
                        legendItems.map((item) => {
                            map[item.name] = item;
                            map[item.name].value = '';
                        });
                        tooltipItems.map((item) => {
                            let name = item.name;
                            let value = item.value;
                            if (map[name]) {
                                map[name].value += value + ' ';
                            }
                        });
                        legend.setItems();
                        // tooltip
                        let coord = sleepAreaChart.get('coord');
                        let title = tooltipItems[0].title;
                        let dateEle = document.getElementById('sleepAreaDate');
                        dateEle.innerHTML = title;
                        dateEle.style.visibility = 'visible';
                        dateEle.style.left = obj.x + 'px';
                        dateEle.style.top = coord.y.start + coord.y.end + dateEle.offsetHeight / 2 + 'px';
                    },
                    showCrosshairs: true
                });
                sleepAreaChart.line().position('date*value').color('type', [SleepColor, AwakeColor]).shape('user', (user) => {
                    let userIndex = this.user.indexOf(user);
                    if (userIndex % 2 === 0) {
                        return 'line';
                    } else {
                        return 'dash';
                    }
                });
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
                    custom: true,
                    onChange: (obj) => {
                        // legend
                        let legend = sleepLineChart.get('legendController').legends.top[0];
                        let tooltipItems = obj.items;
                        let legendItems = legend.items;
                        let map = {};
                        legendItems.map((item) => {
                            map[item.name] = item;
                            map[item.name].value = '';
                        });
                        tooltipItems.map((item) => {
                            let name = item.name;
                            let value = this.formatTime(item.value);
                            if (map[name]) {
                                map[name].value += value + ' ';
                            }
                        });
                        legend.setItems();
                        // tooltip
                        let coord = sleepLineChart.get('coord');
                        let title = tooltipItems[0].title;
                        let dateEle = document.getElementById('sleepLineDate');
                        dateEle.innerHTML = title;
                        dateEle.style.visibility = 'visible';
                        dateEle.style.left = obj.x + 'px';
                        dateEle.style.top = coord.y.start + coord.y.end + dateEle.offsetHeight / 2 + 'px';
                    },
                    showCrosshairs: true
                });
                sleepLineChart.line().position('date*value').color('type', [SleepColor, DeepSleepColor, AwakeColor]).shape('user', (user) => {
                    let userIndex = this.user.indexOf(user);
                    if (userIndex % 2 === 0) {
                        return 'line';
                    } else {
                        return 'dash';
                    }
                });
                sleepLineChart.render();
            },
            makeBarChart () {
                let sleepBarChart = new F2.Chart({
                    id: 'sleepBarCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                sleepBarChart.source(this.sleepBarData);
                sleepBarChart.tooltip({
                    showItemMarker: false,
                    custom: true,
                    onChange: (obj) => {
                        let legend = sleepBarChart.get('legendController').legends.top[0];
                        let tooltipItems = obj.items;
                        let legendItems = legend.items;
                        let map = {};
                        legendItems.map((item) => {
                            map[item.name] = item;
                            map[item.name].value = '';
                        });
                        tooltipItems.map((item) => {
                            let name = item.name;
                            let value = this.formatTime(item.value);
                            if (map[name]) {
                                map[name].value += value + ' ';
                            }
                        });
                        legend.setItems();
                    }
                });
                sleepBarChart.interval().position('name*avg').color('alias', (alias) => {
                    let userIndex = this.user.indexOf(this.getUser(alias));
                    if (userIndex % 2 === 0) {
                        return 'l(90) 0:#1890ff 1:#00B2EE';
                    } else {
                        return 'l(90) 0:#CD6889 1:#CD5C5C';
                    }
                }).adjust({
                    type: 'dodge',
                    marginRatio: 0.05 // 设置分组间柱子的间距
                });
                sleepBarChart.render();
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
                sleepRadarchart.tooltip({
                    showItemMarker: false,
                    custom: true,
                    onChange: (obj) => {
                        let legend = sleepRadarchart.get('legendController').legends.top[0];
                        let tooltipItems = obj.items;
                        let legendItems = legend.items;
                        let map = {};
                        legendItems.map((item) => {
                            map[item.name] = item;
                            map[item.name].value = '';
                        });
                        tooltipItems.map((item) => {
                            let name = item.name;
                            let value = item.value;
                            if (map[name]) {
                                map[name].value += value + ' ';
                            }
                        });
                        legend.setItems();
                    }
                });
                sleepRadarchart.area().position('item*count').style({
                    fillOpacity: 0.6
                }).color('alias', (alias) => {
                    let userIndex = this.user.indexOf(this.getUser(alias));
                    if (userIndex % 2 === 0) {
                        return '#00B2EE';
                    } else {
                        return '#CD5C5C';
                    }
                });
                sleepRadarchart.line().position('item*count').color('alias', (alias) => {
                    let userIndex = this.user.indexOf(this.getUser(alias));
                    if (userIndex % 2 === 0) {
                        return '#00B2EE';
                    } else {
                        return '#CD5C5C';
                    }
                }).style({
                    lineWidth: 1
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
    .dateArea {
        visibility: hidden;
        position: absolute;
        width: 10vw;
        font-size: 3.2vw;
        color: #fff;
        margin-left: -5vw;
        margin-top: 1vw;
        background-color: #808080;
        padding: 0 2px;
        z-index: 100;
    }
</style>
