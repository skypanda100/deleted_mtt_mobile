<template>
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                    <h4>{{dateTime}}</h4>
                </v-card-title>
                <v-list two-line>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>temperature(℃)</v-list-tile-title>
                            <v-list-tile-sub-title><v-rating v-model="tempGrade" readonly color="#f00"></v-rating></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>{{ temp }}</v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>humidity(%)</v-list-tile-title>
                            <v-list-tile-sub-title><v-rating v-model="humidityGrade" readonly color="#f00"></v-rating></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>{{ humidity }}</v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>pm2.5(AQI)</v-list-tile-title>
                            <v-list-tile-sub-title><v-rating v-model="pm25Grade" readonly color="#f00"></v-rating></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>{{ pm25 }}</v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>co2(PPM)</v-list-tile-title>
                            <v-list-tile-sub-title><v-rating v-model="co2Grade" readonly color="#f00"></v-rating></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>{{ co2 }}</v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>hcho(mg/m3)</v-list-tile-title>
                            <v-list-tile-sub-title><v-rating v-model="hchoGrade" readonly color="#f00"></v-rating></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>{{ hcho }}</v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card>
            <br>
            <v-card>
                <v-card-title primary-title>
                    <h3>温度</h3>
                </v-card-title>
                <canvas id="tempCanvas" class="chartContainer"></canvas>
            </v-card>
            <br>
            <v-card>
                <v-card-title primary-title>
                    <h3>湿度</h3>
                </v-card-title>
                <canvas id="humidityCanvas" class="chartContainer"></canvas>
            </v-card>
            <br>
            <v-card>
                <v-card-title primary-title>
                    <h3>PM2.5</h3>
                </v-card-title>
                <canvas id="pm25Canvas" class="chartContainer"></canvas>
            </v-card>
            <br>
            <v-card>
                <v-card-title primary-title>
                    <h3>二氧化碳</h3>
                </v-card-title>
                <canvas id="co2Canvas" class="chartContainer"></canvas>
            </v-card>
            <br>
            <v-card>
                <v-card-title primary-title>
                    <h3>甲醛</h3>
                </v-card-title>
                <canvas id="hchoCanvas" class="chartContainer"></canvas>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { fetchLastAirGrade, fetchHistoryAirGrade } from '@/api/air-grade';
    import F2 from '@antv/f2';

    export default {
        name: 'air-grade',
        data () {
            return {
                lastAirGrade: null,
                dateTime: '',
                tempGrade: 0,
                temp: '',
                humidityGrade: 0,
                humidity: '',
                pm25Grade: 0,
                pm25: '',
                co2Grade: 0,
                co2: '',
                hchoGrade: 0,
                hcho: '',
                tempDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD\nHH:mm',
                        tickCount: 3
                    },
                    value: {
                        alias: '温度'
                    }
                },
                tempData: [{ date: '', value: 0 }],
                humidityDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD\nHH:mm',
                        tickCount: 3
                    },
                    value: {
                        alias: '湿度'
                    }
                },
                humidityData: [{ date: '', value: 0 }],
                pm25Def: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD\nHH:mm',
                        tickCount: 3
                    },
                    value: {
                        alias: 'PM2.5'
                    }
                },
                pm25Data: [{ date: '', value: 0 }],
                co2Def: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD\nHH:mm',
                        tickCount: 3
                    },
                    value: {
                        alias: '二氧化碳'
                    }
                },
                co2Data: [{ date: '', value: 0 }],
                hchoDef: {
                    date: {
                        type: 'timeCat',
                        mask: 'MM-DD\nHH:mm',
                        tickCount: 3
                    },
                    value: {
                        alias: '甲醛'
                    }
                },
                hchoData: [{ date: '', value: 0 }]
            };
        },
        watch: {
            lastAirGrade: function (data) {
                this.dateTime = data.dateTime;
                let temp = data.temp;
                this.temp = temp;
                let humidity = data.humidity;
                this.humidity = humidity;
                let co2 = data.co2;
                this.co2 = co2;
                let pm25 = data.pm2_5;
                this.pm25 = pm25;
                let hcho = data.hcho;
                this.hcho = hcho;

                if (temp < 10 || temp > 30) {
                    this.tempGrade = 0;
                } else if (temp < 12 || temp > 29) {
                    this.tempGrade = 1;
                } else if (temp < 14 || temp > 28) {
                    this.tempGrade = 2;
                } else if (temp < 16 || temp > 26) {
                    this.tempGrade = 3;
                } else if (temp < 18 || temp > 25) {
                    this.tempGrade = 4;
                } else {
                    this.tempGrade = 5;
                }

                if (humidity < 10 || humidity > 75) {
                    this.humidityGrade = 0;
                } else if (humidity < 20 || humidity > 72) {
                    this.humidityGrade = 1;
                } else if (humidity < 30 || humidity > 69) {
                    this.humidityGrade = 2;
                } else if (humidity < 35 || humidity > 66) {
                    this.humidityGrade = 3;
                } else if (humidity < 40 || humidity > 63) {
                    this.humidityGrade = 4;
                } else {
                    this.humidityGrade = 5;
                }

                if (co2 < 250 || co2 >= 2000) {
                    this.co2Grade = 0;
                } else if (co2 >= 1500 && co2 < 2000) {
                    this.co2Grade = 1;
                } else if (co2 >= 1300 && co2 < 1500) {
                    this.co2Grade = 2;
                } else if (co2 >= 1000 && co2 < 1300) {
                    this.co2Grade = 3;
                } else if (co2 >= 350 && co2 < 1000) {
                    this.co2Grade = 4;
                } else {
                    this.co2Grade = 5;
                }

                if (pm25 >= 250) {
                    this.pm25Grade = 0;
                } else if (pm25 >= 150 && pm25 < 250) {
                    this.pm25Grade = 1;
                } else if (pm25 >= 115 && pm25 < 150) {
                    this.pm25Grade = 2;
                } else if (pm25 >= 75 && pm25 < 115) {
                    this.pm25Grade = 3;
                } else if (pm25 >= 35 && pm25 < 75) {
                    this.pm25Grade = 4;
                } else {
                    this.pm25Grade = 5;
                }

                if (hcho >= 0.08) {
                    this.hchoGrade = 0;
                } else if (hcho >= 0.07) {
                    this.hchoGrade = 1;
                } else if (hcho >= 0.06) {
                    this.hchoGrade = 2;
                } else if (hcho >= 0.05) {
                    this.hchoGrade = 3;
                } else if (hcho >= 0.04) {
                    this.hchoGrade = 4;
                } else {
                    this.hchoGrade = 5;
                }
            }
        },
        computed: {
        },
        mounted () {
            fetchLastAirGrade().then(response => {
                this.lastAirGrade = response.data;
            });
            fetchHistoryAirGrade().then(response => {
                this.tempData = response.data.temp;
                this.humidityData = response.data.humidity;
                this.hchoData = response.data.hcho;
                this.pm25Data = response.data.pm2_5;
                this.co2Data = response.data.co2;

                this.initCharts();
            });
        },
        methods: {
            initCharts () {
                // temp
                let tempChart = new F2.Chart({
                    id: 'tempCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                tempChart.source(this.tempData, this.tempDef);
                tempChart.tooltip({
                    showCrosshairs: true
                });
                tempChart.line().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                tempChart.area().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                tempChart.render();

                // humidity
                let humidityChart = new F2.Chart({
                    id: 'humidityCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                humidityChart.source(this.humidityData, this.humidityDef);
                humidityChart.tooltip({
                    showCrosshairs: true
                });
                humidityChart.line().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                humidityChart.area().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                humidityChart.render();

                // pm25
                let pm25Chart = new F2.Chart({
                    id: 'pm25Canvas',
                    pixelRatio: window.devicePixelRatio
                });
                pm25Chart.source(this.pm25Data, this.pm25Def);
                pm25Chart.tooltip({
                    showCrosshairs: true
                });
                pm25Chart.line().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                pm25Chart.area().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                pm25Chart.render();

                // co2
                let co2Chart = new F2.Chart({
                    id: 'co2Canvas',
                    pixelRatio: window.devicePixelRatio
                });
                co2Chart.source(this.co2Data, this.co2Def);
                co2Chart.tooltip({
                    showCrosshairs: true
                });
                co2Chart.line().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                co2Chart.area().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                co2Chart.render();

                // hcho
                let hchoChart = new F2.Chart({
                    id: 'hchoCanvas',
                    pixelRatio: window.devicePixelRatio
                });
                hchoChart.source(this.hchoData, this.hchoDef);
                hchoChart.tooltip({
                    showCrosshairs: true
                });
                hchoChart.line().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                hchoChart.area().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                hchoChart.render();
            }
        }
    };
</script>

<style scoped>
.chartContainer {
    width: 100%;
    height: 100%;
}
</style>
