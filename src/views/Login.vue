<template>
    <v-container grid-list-xl text-xs-center>
        <v-layout row wrap>
            <v-flex xs10 offset-xs1>
                <form>
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
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import util from '../libs/util';
    import auth from '../libs/auth';
    import { getAuthToken } from '../api/auth';

    export default {
        name: 'Login',
        data () {
            return {
                userName: util.isNull(auth.getUser()) ? '' : auth.getUser(),
                userNameRules: [
                    v => !!v || 'Name is required',
                    v => v.length >= 5 || 'Name must be greater than 5 characters'
                ],
                password: '',
                passwordRules: [
                    v => v.length >= 5 || 'Password must be greater than 5 characters'
                ]
            };
        },
        mounted () {
        },
        methods: {
            handleSubmitClicked () {
                let params = {
                    username: this.userName,
                    password: this.password
                };
                getAuthToken(params).then(data => {
                    console.log(data);
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
