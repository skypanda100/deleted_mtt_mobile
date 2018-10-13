<template>
    <v-layout>
        <v-flex xs12 sm6>
            <v-card>
                <v-img
                    src="/static/mtt.jpg"
                    lazy-src="/static/mtt.jpg"
                    aspect-ratio="1"
                    class="grey lighten-2">
                    <v-layout
                        slot="placeholder"
                        fill-height
                        align-center
                        justify-center
                        ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                </v-img>
            </v-card>

            <form ref="form">
                <v-text-field
                    v-model="userName"
                    :rules="userNameRules"
                    label="用户"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="密码"
                    type="password"
                    required
                ></v-text-field>

                <v-btn @click="handleSubmitClicked" block color="primary">登录</v-btn>
            </form>
            <v-alert
                :value="alert"
                type="error"
                transition="scale-transition">
                {{message}}
            </v-alert>
        </v-flex>
    </v-layout>
</template>

<script>
    import util from '../libs/util';
    import auth from '../libs/auth';
    import { getAuthToken } from '../api/auth';
    import sha256 from 'crypto-js/sha256';
    import Base64 from 'crypto-js/enc-base64';

    export default {
        name: 'Login',
        data () {
            return {
                alert: false,
                message: '',
                userName: util.isNull(auth.getUser()) ? '' : auth.getUser(),
                userNameRules: [
                    v => !!v || '请输入用户名',
                    v => v.length >= 3 || '用户名长度必须大于或等于3'
                ],
                password: util.isNull(auth.getPwd()) ? '' : auth.getPwd(),
                passwordRules: [
                    v => !!v || '请输入密码',
                    v => v.length >= 6 || '密码长度必须大于或等于6'
                ],
                token: null,
                avatar: ''
            };
        },
        mounted () {
        },
        methods: {
            setCookies () {
                auth.setToken(this.token);
                auth.setUser(this.userName);
                auth.setPwd(this.password);
                auth.setAvatar(this.avatar);
                this.$store.dispatch('SetAvatar', this.avatar);
            },
            clearCookies () {
                auth.removeUser();
                auth.removePwd();
                auth.removeToken();
                auth.removeAvatar();
                this.$store.dispatch('SetAvatar', '');
            },
            handleSubmitClicked () {
                let params = {
                    username: this.userName,
                    password: Base64.stringify(sha256(this.password))
                };
                getAuthToken(params).then(response => {
                    this.token = response.data.token;
                    this.avatar = response.data.avatar;
                    this.setCookies();
                    this.$router.push('/');
                }).catch(err => {
                    this.alert = true;
                    this.message = err.message;
                    this.clearCookies();
                });
            }
        }
    };
</script>

<style scoped>

</style>
