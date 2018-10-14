import {service} from '@/libs/request';

export function fetchAuthToken (params) {
    return service({
        method: 'post',
        url: 'users/token',
        data: params
    });
}

export function fetchAllUsers () {
    return service({
        method: 'get',
        url: 'users/all'
    });
}
