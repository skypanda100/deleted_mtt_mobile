<template>
    <div>
        <img style="width: 100%;height: 100%" src="../assets/mtt.jpg"/>
        <group title="">
            <cell title="空气质量" link="/air-grade">
            </cell>
            <cell title="食物评分" link="/food-grades">
            </cell>
        </group>
    </div>
</template>

<script>
    import { Group, Cell } from 'vux';

    export default {
        name: 'home',
        components: {
            Group,
            Cell
        },
        computed: {
        },
        mounted () {
        }
    };
</script>

<style scoped>

</style>
