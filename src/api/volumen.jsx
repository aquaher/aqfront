import { instance } from "@/service/instance";

const path = '/volumen'
async function getVolumenById(vol_id){
    const {data} = await instance.get(path,{params:{id:vol_id}});
    return data;
}
async function setRegisterVolumen(volumen){
    const {data} = await instance.post(path,volumen);
    return data;
}

async function putVolumenById({vol_id,vol}){
    const {data} = await instance.put(path,{params:{id:vol_id,vol:vol}});
    return data;
}

async function getVolumensByMonthAndTurn({month,turn,tank_name}){
    const {data} = await instance.get(path+'/informe',{params:{month:month,turn:turn,name:tank_name}});
    return data;
}

export {
    getVolumenById,
    setRegisterVolumen,
    putVolumenById,
    getVolumensByMonthAndTurn
}