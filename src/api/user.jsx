import { instance } from "@/service/instance"
async function getUserByOperator() {
 const { data } = await instance.get("/users/operador")
 return data;
}
async function registerOperator(turn){
    const {data} = await instance.put('/turn',turn)
    return data;
}
export {
    getUserByOperator,
    registerOperator
}
