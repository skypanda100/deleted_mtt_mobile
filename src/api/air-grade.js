import {service} from '@/libs/request';

export function fetchLastAirGrade () {
    return service({
        method: 'get',
        url: 'serials/last'
    });
}
