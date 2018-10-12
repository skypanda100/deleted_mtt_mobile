import {service} from '@/libs/request';

export function getAuthToken (params) {
    return service({
        method: 'post',
        url: 'users/token',
        data: params
    });
}
