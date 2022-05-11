
import cookie from "@/service/cookie";
import { authenticated } from "@/service/auth"
import { instance } from '@/service/instance';
const kaycloak_logout = (token_refresh) => {
    var params = new URLSearchParams();
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    params.append('refresh_token', token_refresh);
    return params;
}
const kaycloak = (username, password) => {
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', import.meta.env.VITE_GRANT_TYPE);
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    return params;
}
const kaycloak_refresh = (token_refresh) => {
    var params = new URLSearchParams();
    params.append('refresh_token', token_refresh);
    params.append('grant_type', import.meta.env.VITE_GRANT_TYPE_REFRESH);
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    return params;
}
/*
LO PASE 
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
                        const access = await instance.get('/users_access', {
                            params: {
                                id: userinfo.data.sub
                            }
                        });
                        if (access) {
                            if (access.status == 200) {
                                /**Arreglar menu solo ordenado */
                                let data = []
                                /*
                                LO PASE AL BACKEND
                                access.data.map(elemento => {
                                    let nav = elemento.path.split("/");
                                    principal(data, elemento, nav);
                                })*/
                                return {
                                    ...token.data,
                                    expires_in: expires_in,
                                    refresh_expires_in: refresh_expires_in,
                                    user: {
                                        ...userinfo.data,
                                        access: access.data
                                    }
                                }
                            }
                        } else {
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
    },
    logout: async () => {
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN);
        const refresh = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH);
        await authenticated.post(`/protocol/openid-connect/logout?id_token_hint=${token}`,kaycloak_logout(refresh))
        await cookie.deleteCookie(import.meta.env.VITE_COOKIE_TOKEN)
        await cookie.deleteCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH)
        return true;
    },
    refresh_session: async () => {
        const token = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN);
        if (token) {
            const userinfo = await authenticated.get('/protocol/openid-connect/userinfo')
            if (userinfo) {
                if (userinfo.status == 200) {
                    const userinfo = await authenticated.get('/protocol/openid-connect/userinfo')
                    if (userinfo) {
                        if (userinfo.status == 200) {
                            const access = await instance.get('/users_access', {
                                params: {
                                    id: userinfo.data.sub
                                }
                            });
                            if (access) {
                                if (access.status == 200) {
                                    /**Arreglar menu solo ordenado */
                                    /*let data = []
                                    access.data.map(elemento => {
                                        let nav = elemento.path.split("/");
                                        principal(data, elemento, nav);
                                    })*/
                                    return {
                                        access_token: await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN),
                                        user: {
                                            ...userinfo.data,
                                            access: access.data
                                        }
                                    }
                                }
                            } else {
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
        } else {
            const token_refresh = await cookie.getCookie(import.meta.env.VITE_COOKIE_TOKEN_REFRESH);
            if (token_refresh) {
                const token = await authenticated.post('/protocol/openid-connect/token', kaycloak_refresh(token_refresh));
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
                                const access = await instance.get('/users_access', {
                                    params: {
                                        id: userinfo.data.sub
                                    }
                                });
                                if (access) {
                                    if (access.status == 200) {
                                        /*let data = []
                                        access.data.map(elemento => {
                                            let nav = elemento.path.split("/");
                                            principal(data, elemento, nav);
                                        })*/
                                        return {
                                            ...token.data,
                                            expires_in: expires_in,
                                            refresh_expires_in: refresh_expires_in,
                                            user: {
                                                ...userinfo.data,
                                                access: access.data
                                            }
                                        }
                                    }
                                } else {
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
}
export default authentication;