import Cookies from 'js-cookie';

let auth = {};

const TokenKey = 'MTT-Token';
const UserKey = 'user';
const PwdKey = 'password';

auth.getToken = function () {
    return Cookies.get(TokenKey);
};

auth.setToken = function (token) {
    return Cookies.set(TokenKey, token);
};

auth.removeToken = function () {
    return Cookies.remove(TokenKey);
};

auth.getUser = function () {
    return Cookies.get(UserKey);
};

auth.setUser = function (user) {
    return Cookies.set(UserKey, user);
};

auth.removeUser = function () {
    return Cookies.remove(UserKey);
};

auth.getPwd = function () {
    return Cookies.get(PwdKey);
};

auth.setPwd = function (pwd) {
    return Cookies.set(PwdKey, pwd);
};

auth.removePwd = function () {
    return Cookies.remove(PwdKey);
};

export default auth;
