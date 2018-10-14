import {service} from '@/libs/request';

export function saveSleepQuality (params) {
    return service({
        method: 'post',
        url: 'sleepQualities',
        data: params
    });
}

export function fetchUndoSleepQualities (params) {
    return service({
        method: 'get',
        url: 'sleepQualities/undo',
        params: params
    });
}

export function fetchSleepQualities (params) {
    return service({
        method: 'get',
        url: 'sleepQualities/last',
        params: params
    });
}
