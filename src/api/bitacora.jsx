import { instance } from "@/service/instance";
const path = '/bitacora';

const bitacora = {
    get:url=>instance.get(path+url).then(res=>res.data),
    getByData:({url,data})=>instance.get(path+url,data).then(res=>res.data),
    post:(url,data)=>instance.post(path+url,data).then(res=>res.data),
    put:(url,data)=>instance.put(path+url,data).then(res=>res.data)
}

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
    getRegisterBitacoraByDate,
    bitacora
}