import axios from 'axios';
import env from '../../config/env';
import auth from './auth';

const service = axios.create({
    baseURL: env.host,
    timeout: 60000,
    responseType: 'json'
});

service.interceptors.request.use(config => {
    config.headers['mtt-token'] = auth.getToken();
    return config;
}, error => {
    Promise.reject(error);
});

service.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

export {service};
