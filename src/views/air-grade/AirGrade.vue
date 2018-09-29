<template>
    <div>
        <group :title="dateTime">
            <cell title="temp(℃)" :inline-desc="temp">
                <rater v-model="tempGrade"></rater>
            </cell>
            <cell title="humidity(%)" :inline-desc="humidity">
                <rater v-model="humidityGrade"></rater>
            </cell>
            <cell title="pm2.5(AQI)" :inline-desc="pm25">
                <rater v-model="pm25Grade"></rater>
            </cell>
            <cell title="co2(PPM)" :inline-desc="co2">
                <rater v-model="co2Grade"></rater>
            </cell>
            <cell title="hcho(mg/m3)" :inline-desc="hcho">
                <rater v-model="hchoGrade"></rater>
            </cell>
        </group>

        <divider>temperature</divider>
        <v-chart :data="tempData" prevent-default>
            <v-scale x :tick-count="3" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-line shape="smooth" :colors="gradient"/>
        </v-chart>

        <divider>humidity</divider>
        <v-chart :data="humidityData" prevent-default>
            <v-scale x :tick-count="3" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-line shape="smooth" :colors="gradient"/>
        </v-chart>

        <divider>pm2.5</divider>
        <v-chart :data="pm25Data" prevent-default>
            <v-scale x :tick-count="3" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-line shape="smooth" :colors="gradient"/>
        </v-chart>

        <divider>co2</divider>
        <v-chart :data="co2Data" prevent-default>
            <v-scale x :tick-count="3" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-line shape="smooth" :colors="gradient"/>
        </v-chart>

        <divider>hcho</divider>
        <v-chart :data="hchoData" prevent-default>
            <v-scale x :tick-count="3" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-line shape="smooth" :colors="gradient"/>
        </v-chart>
    </div>
</template>

<script>
    import { Rater, Group, Cell, Divider, VChart, VTooltip, VLine, VScale } from 'vux';
    import { fetchLastAirGrade, fetchHistoryAirGrade } from '@/api/air-grade';

    export default {
        name: 'air-grade',
        components: {
            Rater,
            Group,
            Cell,
            Divider,
            VChart,
            VTooltip,
            VLine,
            VScale
        },
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
                gradient: [
                    [0, '#F2C587'],
                    [0.5, '#ED7973'],
                    [1, '#8659AF']
                ],
                tempData: [{ date: '', value: 0 }],
                humidityData: [{ date: '', value: 0 }],
                pm25Data: [{ date: '', value: 0 }],
                co2Data: [{ date: '', value: 0 }],
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
            leftOptions () {
                return {
                    showBack: true,
                    backText: '',
                    preventGoBack: true
                };
            }
        },
        mounted () {
            fetchLastAirGrade().then(response => {
                this.lastAirGrade = response.data;
            });
            fetchHistoryAirGrade().then(response => {
                console.log(response.data);
                this.tempData = response.data.temp;
                this.humidityData = response.data.humidity;
                this.hchoData = response.data.hcho;
                this.pm25Data = response.data.pm2_5;
                this.co2Data = response.data.co2;
            });
        },
        methods: {
        }
    };
</script>

<style scoped>

</style>
