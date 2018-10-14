import {service} from '@/libs/request';

export function saveSleepQuality (params) {
    return service({
        method: 'post',
        url: 'sleepQualities',
        data: params
    });
}
