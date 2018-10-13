import Cookies from 'js-cookie';

let auth = {};

const TokenKey = 'MTT-Token';
const UserKey = 'user';
const PwdKey = 'password';
const AvatarKey = 'avatar';
const AliasKey = 'alias';

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

auth.getAvatar = function () {
    return Cookies.get(AvatarKey);
};

auth.setAvatar = function (avatar) {
    return Cookies.set(AvatarKey, avatar);
};

auth.removeAvatar = function () {
    return Cookies.remove(AvatarKey);
};

auth.getAlias = function () {
    return Cookies.get(AliasKey);
};

auth.setAlias = function (alias) {
    return Cookies.set(AliasKey, alias);
};

auth.removeAlias = function () {
    return Cookies.remove(AliasKey);
};

export default auth;
