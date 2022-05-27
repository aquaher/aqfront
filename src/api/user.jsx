import { instance, instanceAdmin } from "@/service/instance";

const path = '/users';
const getUsersFetcher = url =>instance.get(path + url).then(res => res.data)
const getUsersKeycloak = url => instanceAdmin.get(url).then(res=>res.data)
const deleteUsersKeycloak = url => instanceAdmin.delete(url).then(res=>res.data)
const setUserKeycloak = (url,data) => instanceAdmin.post(url,data).then(res=>res.data)
const getUserByUsernameKeycloak = (url,data) => instanceAdmin.get(url,{params:{exact:true,username:data}}).then(res=>res.data)
const getGroupsKeycloak = url => instanceAdmin.get(url).then(res=>res.data);
async function getUsers() {
    const { data } = await instance.get(path);
    return data;
   }

async function getUserByOperator() {
 const { data } = await instance.get(path+'/operador');
 return data;
}

export {
    getUserByOperator,
    getUsers,
    getUsersFetcher,
    getUsersKeycloak,
    setUserKeycloak,
    getGroupsKeycloak,
    getUserByUsernameKeycloak,
    deleteUsersKeycloak
}
