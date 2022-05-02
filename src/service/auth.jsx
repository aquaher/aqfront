//import { session } from '@/reducer/session';
import axios from 'axios';
import cookie from './cookie';
//import { useSelector } from 'react-redux';

function Axios () {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_BASE_AUTH
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
export const authenticated = Axios();