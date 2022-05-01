
import { authenticated } from "../service/auth"
const kaycloak = (username,password)=>{
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', import.meta.env.VITE_GRANT_TYPE);
    params.append('client_id', import.meta.env.VITE_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SECRET_CLIENT);
    return params;
}
const authentication = {
    login: async(username,password)=>{
        const token = await authenticated.post('/protocol/openid-connect/token',kaycloak(username,password));
        if(token){
            if(token.status==200){
                const userinfo = await authenticated.get('/protocol/openid-connect/userinfo')
                if(userinfo){
                    if(userinfo.status==200){
                        return {
                            ...token.data,
                            user:{
                                ...userinfo.data
                            }
                        }
                    }
                }
            }
        }
       return null;
    },
    logout: async()=>{
    /*
    http://127.0.0.1:8180/auth/admin/realms/heroes/users/83c72e88-7ac9-4fc7-a7fb-97736d67d261/logout
    post
    and token bearer
    */
    }
}
export default authentication;