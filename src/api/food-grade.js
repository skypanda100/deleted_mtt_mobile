import {service} from '@/libs/request';

export function saveFoodGrade (params) {
    return service({
        method: 'put',
        url: 'foodGrades',
        data: params,
        onUploadProgress: function (progressEvent) {
            if (progressEvent.lengthComputable) {
                let num = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                console.log(num);
            }
        }
    });
}
