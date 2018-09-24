<template>
    <div>
        <group title="">
            <cell title="Indoor Air Quality" link="/air-grade">
            </cell>
            <cell title="Food Quality" link="/food-grades">
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
