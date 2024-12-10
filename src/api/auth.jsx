
import cookie from "@/service/cookie";
import { authenticated } from "@/service/auth"

const kaycloak_logout = (token_refresh) => {
    return ({
        'client_id':import.meta.env.VITE_CLIENT_ID,
        'client_secret':import.meta.env.VITE_SECRET_CLIENT,
        'refresh_token': token_refresh
    });
    /*
    var params = new URLSearchParams();
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    params.append('refresh_token', token_refresh);
    return params;
     */
}
const kaycloak = (username, password) => {
    return ({
        'username':username,
        'password':password,
        'grant_type': import.meta.env.VITE_GRANT_TYPE,
        'client_id':import.meta.env.VITE_CLIENT_ID,
        'client_secret':import.meta.env.VITE_SECRET_CLIENT,
    });
    /*var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', import.meta.env.VITE_GRANT_TYPE);
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    return params;*/

}
const kaycloak_refresh = (token_refresh) => {
    return ({
        'refresh_token':token_refresh,
        'grant_type': import.meta.env.VITE_GRANT_TYPE_REFRESH,
        'client_id':import.meta.env.VITE_CLIENT_ID,
        'client_secret':import.meta.env.VITE_SECRET_CLIENT,
    });
    /*
    var params = new URLSearchParams();
    params.append('refresh_token', token_refresh);
    params.append('grant_type', import.meta.env.VITE_GRANT_TYPE_REFRESH);
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    return params;

     */
}
/*LO PASE
const hasChildren = (item) => {
    if (item.length == 1) {
      return false;
    }
    return true;
  }
const principal = (data, item, nav) =>{
    hasChildren(nav) ? multi(data.find(e => e.icon == nav[0]), item, nav) : single(data, item);
}
const single = (data, item) => {
    let nuevo = {
        name: item.module,
        title: item.title,
        to: `/${item.path}`,
        icon: item.icon,
        items: []
    }
    data.push(nuevo)
}
function multi(data, item, nav) {
    nav.shift();
    principal(data.items, item, nav);
}*/
const authentication = {
    login: async (username, password) => {
        const token = await authenticated.post(import.meta.env.VITE_PATH_AUTH+'/token', kaycloak(username, password));
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
                const userinfo = await authenticated.get(import.meta.env.VITE_PATH_AUTH+'/userinfo')
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
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN);
        const refresh = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH);
        await authenticated.post(import.meta.env.VITE_PATH_AUTH+`/logout?id_token_hint=${token}`, kaycloak_logout(refresh))
        await cookie.deleteCookie(import.meta.env.VITE_COOKIE_TOKEN)
        await cookie.deleteCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH)
        return true;
    },
    refresh_session: async () => {
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN);
        if (token) {
            const userinfo = await authenticated.get(import.meta.env.VITE_PATH_AUTH+'/userinfo')
            if (userinfo) {
                if (userinfo.status == 200) {
                    const userinfo = await authenticated.get(import.meta.env.VITE_PATH_AUTH+'/userinfo')
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
        } else {
            const token_refresh = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH);
            if (token_refresh) {
                const token = await authenticated.post(import.meta.env.VITE_PATH_AUTH+'/token', kaycloak_refresh(token_refresh));
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
                        const userinfo = await authenticated.get(import.meta.env.VITE_PATH_AUTH+'/userinfo')
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
            }
        }
    }
}
export default authentication;