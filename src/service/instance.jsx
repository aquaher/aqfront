//import { session } from '@/reducer/session';
import axios from 'axios';
import cookie from './cookie';
//import { useSelector } from 'react-redux';

function Axios () {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_BASE_API
    })
    instance.interceptors.request.use(async (request) => {
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN)
        
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    });
    return instance;
}
function AxiosAdmin () {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_BASE_API
    })
    instance.interceptors.request.use(async (request) => {
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN)
        
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    });
    return instance;
}
const instance = Axios();
const instanceAdmin = AxiosAdmin();
export {
    instance,
    instanceAdmin
}