<template>
    <div>
        <img style="width: 100%;height: 100%" src="../assets/mtt.jpg"/>
        <v-list dense class="pt-0">
            <v-list-tile
                @click="goNext('/air-grade')">
                <v-list-tile-content>
                    <v-list-tile-title>空气质量</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
                @click="goNext('/food-grades')">
                <v-list-tile-content>
                    <v-list-tile-title>食物评分</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
    export default {
        name: 'home',
        computed: {
        },
        mounted () {
        },
        methods: {
            goNext (url) {
                this.$router.push(url);
            }
        }
    };
</script>

<style scoped>

</style>
