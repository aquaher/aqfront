import { instance, instanceAdmin } from "@/service/instance";

const path = '/users';
const getUsersFetcher = url =>instance.get(path + url).then(res => res.data)

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
    getGroupsKeycloak,
}
