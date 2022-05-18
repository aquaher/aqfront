import { instance } from "@/service/instance";

const path = '/users';

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
    getUsers
}
