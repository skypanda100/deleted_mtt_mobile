import {service} from '@/libs/request';

export function saveFoodGrade (params) {
    return service({
        method: 'put',
        url: 'foodGrades',
        data: params
    });
}
