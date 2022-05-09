import { instance } from "@/service/instance";
const path = '/bitacora';
async function setRegisterBitacora(bitacora){
    const {data} = await instance.post(path,bitacora);
    return data;
}
async function getRegisterBitacoraByDate(date){
    const {data} = await instance.get(path+'/date',{params:{date:date}});
    return data;
}
async function getRegisterBitacoraByMonth({number}){
    const {data} = await instance.get(path+'/month',{params:{number:number}});
    return data;
}
export {
    setRegisterBitacora,
    getRegisterBitacoraByMonth,
    getRegisterBitacoraByDate
}