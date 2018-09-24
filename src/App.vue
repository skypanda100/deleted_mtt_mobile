<template>
    <div id="app" class="container">
        <div>
            <sticky :check-sticky-support="false">
                <x-header
                    title="MTT"
                    style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color: #333"
                    :left-options="showBack">
                    <span slot="right" v-if="showCamera">
                        <x-icon type="camera" style="fill:#fff;" @click="handleCameraClicked"></x-icon>
                    </span>
                </x-header>
            </sticky>
        </div>
        <br>
        <br>
        <div style="padding: 2px">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import { Sticky, XHeader, Group, Cell } from 'vux';

    export default {
        name: 'app',
        components: {
            Sticky,
            XHeader,
            Group,
            Cell
        },
        computed: {
            route () {
                return this.$store.state.route;
            },
            showBack () {
                let path = this.route.path.trim();
                path = path.replace('/', '');
                if (path === '') {
                    return {
                        showBack: false
                    };
                }
                return {
                    showBack: true
                };
            },
            showCamera () {
                return this.route.path === '/food-grades' || this.route.path === '/food-grade';
            }
        },
        mounted () {
        },
        methods: {
            handleCameraClicked () {
                console.log('clicked');
                this.$router.push('/food-upload');
            }
        }
    };
</script>

<style lang="less">
    @import '~vux/src/styles/reset.less';

    html, body {
        width: 100%;
        overflow-x: hidden;
        background-color: #fff;
    }

    .container {
    }
</style>
