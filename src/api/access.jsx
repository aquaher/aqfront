import { instance } from '@/service/instance';
const path = '/users_access';
async function access({user_id}){
    const {data} = await instance.get(path,{params: {
        id: user_id
    }});
    return data;
}
async function listAcces({user_id}){
    const {data} = await instance.get(path+'/normal',{params: {
        id: user_id
    }});
    return data;
}
async function postCreatePermission(access){
    await instance.post(path,access);
}
async function deletePermission({id}){
    await instance.delete(path,{params:{id:id}});
}
export {
    access,
    listAcces,
    postCreatePermission,
    deletePermission
}