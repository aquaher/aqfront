import { instance } from '@/service/instance';
const path = '/users_access';
async function access({user_id}){
    const {data} = await instance.get(path,{params: {
        id: user_id
    }});
    return data;
}
export {
    access
}