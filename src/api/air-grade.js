import {service} from '@/libs/request';

export function fetchLastAirGrade () {
    return service({
        method: 'get',
        url: 'serials/last'
    });
}

export function fetchHistoryAirGrade () {
    return service({
        method: 'get',
        url: 'serials/history'
    });
}
