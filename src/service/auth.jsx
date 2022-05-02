//import { session } from '@/reducer/session';
import axios from 'axios';
//import { useSelector } from 'react-redux';

function Axios () {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_BASE_AUTH
    })
    /*instance.interceptors.request.use(async (request) => {
        const active_session = useSelector(session);

        if (active_session) {
            request.headers.Authorization = `Bearer ${active_session.access_token}`;
        }
        return request;
    });*/
    return instance;
}
export const authenticated = Axios();