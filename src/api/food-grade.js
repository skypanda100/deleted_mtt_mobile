import {service} from '@/libs/request';

export function saveFoodGrade (params, progress) {
    return service({
        method: 'put',
        url: 'foodGrades',
        data: params,
        onUploadProgress: progress
    });
}

export function fetchFoodGrade (sortField) {
    let params = {
        sort: sortField
    };
    return service({
        method: 'get',
        url: 'foodGrades',
        params: params
    });
}
