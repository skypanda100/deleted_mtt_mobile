<template>
    <v-container grid-list-xl text-xs-center>
        <v-layout row wrap>
            <v-flex xs12 offset-xs1>
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

                    <v-btn @click="handleSubmitClicked">submit</v-btn>
                    <v-btn @click="handleClearClicked">clear</v-btn>
                </form>
                <v-alert
                    :value="alert"
                    type="error"
                    transition="scale-transition">
                    {{message}}
                </v-alert>
            </v-flex>
        </v-layout>
    </v-container>
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
                    v => !!v || 'Name is required',
                    v => v.length >= 3 || 'Name must be greater than 3 characters'
                ],
                password: util.isNull(auth.getPwd()) ? '' : auth.getPwd(),
                passwordRules: [
                    v => v.length >= 6 || 'Password must be greater than 6 characters'
                ],
                token: null
            };
        },
        mounted () {
        },
        methods: {
            setCookies () {
                auth.setToken(this.token);
                auth.setUser(this.userName);
                auth.setPwd(this.password);
            },
            clearCookies () {
                auth.removeUser();
                auth.removePwd();
                auth.removeToken();
            },
            handleSubmitClicked () {
                let params = {
                    username: this.userName,
                    password: Base64.stringify(sha256(this.password))
                };
                getAuthToken(params).then(response => {
                    this.token = response.data.token;
                    this.setCookies();
                    this.$router.push('/');
                }).catch(err => {
                    this.alert = true;
                    this.message = err.message;
                    this.clearCookies();
                });
            },
            handleClearClicked () {
                this.$refs.form.reset();
                this.alert = false;
                this.message = '';
            }
        }
    };
</script>

<style scoped>

</style>
