import { instance } from "@/service/instance";
const path = '/measure';
async function setRegisterMedidores(medidores){
    const {data} = await instance.post(path,medidores);
    return data;
}
async function putRegisterMedidores(medidores){
    const {data} = await instance.put(path,medidores);
    return data;
}
async function getMedidoresByTurnId({turn_id}){
    const {data} = await instance.get(path+'/turn',{params:{turn_id:turn_id}});
    return data;
}
async function getMedidoresByMonth({number}){
    const {data} = await instance.get(path+'/month',{params:{number:number}});
    return data;
}

async function getMeasureByDay(){
    const {data} = await instance.get(path+'/day');
    return data;
}
export {
    setRegisterMedidores,
    putRegisterMedidores,
    getMedidoresByTurnId,
    getMedidoresByMonth,
    getMeasureByDay
}