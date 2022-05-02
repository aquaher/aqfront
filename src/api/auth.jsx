
import cookie from "@/service/cookie";
import { authenticated } from "@/service/auth"
const kaycloak = (username, password) => {
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', import.meta.env.VITE_GRANT_TYPE);
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    return params;
}
const authentication = {
    login: async (username, password) => {
        const token = await authenticated.post('/protocol/openid-connect/token', kaycloak(username, password));
        if (token) {
            if (token.status == 200) {
                const expires_in = Date.now() + (token.data.expires_in - 15) * 1000;
                const refresh_expires_in = Date.now() + (token.data.refresh_expires_in - 15) * 1000;
                await cookie.setCookie(import.meta.env.VITE_COOKIE_TOKEN, token.data.access_token, {
                    'Max-Age': token.data.expires_in,
                    secure: true
                })
                await cookie.setCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH, token.data.refresh_token, {
                    'Max-Age': token.data.refresh_expires_in,
                    secure: true
                })
                const userinfo = await authenticated.get('/protocol/openid-connect/userinfo')
                if (userinfo) {
                    if (userinfo.status == 200) {
                        return {
                            ...token.data,
                            expires_in: expires_in,
                            refresh_expires_in: refresh_expires_in,
                            user: {
                                ...userinfo.data
                            }
                        }
                    }
                }
            }
        }
    },
    logout: async () => {
        /*
        http://127.0.0.1:8180/auth/admin/realms/heroes/users/83c72e88-7ac9-4fc7-a7fb-97736d67d261/logout
        post
        and token bearer
        */
    },
    refresh_session: async () => {
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN);
        if(token){
            const userinfo = await authenticated.get('/protocol/openid-connect/userinfo')
            if (userinfo) {
                if (userinfo.status == 200) {
                    return {
                        access_token: await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN),
                        user: {
                            ...userinfo.data
                        }
                    }
                }
            }  
        }
    }
}
export default authentication;