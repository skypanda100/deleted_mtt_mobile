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
                ]
            };
        },
        mounted () {
        },
        methods: {
            handleSubmitClicked () {
                let params = {
                    username: this.userName,
                    password: Base64.stringify(sha256(this.password))
                };
                getAuthToken(params).then(data => {
                    console.log(1, data);
                }).catch(err => {
                    console.log(2, err);
                    this.alert = true;
                    this.message = err.message;
                });
            },
            handleClearClicked () {
                this.$refs.form.reset();
            }
        }
    };
</script>

<style scoped>

</style>
