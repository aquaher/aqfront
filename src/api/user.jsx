import {instance, instanceAdmin} from "@/service/instance";

const path = '/users';
const getUsersFetcher = url => instance.get(path + url).then(res => res.data)

const getGroupsKeycloak = url => instanceAdmin.get(url).then(res => res.data);

async function getUsers() {
    const {data} = await instance.get(path);
    return data;
}

async function postUser(user) {
    const data = await instance.post(path, user);
    return data;
}

async function getUserByOperator() {
    const {data} = await instance.get(path + '/operador');
    return data;
}

async function deleteUser(userId) {
    const {data} = await instance.delete(`${path}/${userId}`);
    return data;
}

async function editUser(userId, user) {
    const {data} = await instance.put(`${path}/${userId}`, user);
    return data;
}

async function editUserPw(userId,pw){
    const {data} = await instance.put(`${path}/pw/${userId}`, pw);
    return data;
}

export {
    getUserByOperator,
    getUsers,
    getUsersFetcher,
    getGroupsKeycloak,
    postUser,
    deleteUser,
    editUser,
    editUserPw
}
