import { instance } from "@/service/instance";

const path = '/volumen'

const volumen = {
    get:async(url)=>instance.get(path+url).then(res=>res.data),
    getBy:async({url,data})=>instance.get(path+url,data).then(res=>res.data),
    post:async({url,data})=>instance.post(path+url,data).then(res=>res.status),
    put:async({url,data})=>instance.put(path+url,data).then(res=>res.status),
    pacht:async({url,data})=>instance.patch(path+url,data).then(res=>res.status)
}

async function getVolumenById(vol_id){
    const {data} = await instance.get(path,{params:{id:vol_id}});
    return data;
}
async function setRegisterVolumen(volumen){
    const {data} = await instance.post(path,volumen);
    return data;
}

async function putVolumenById(volumen){
    const {data} = await instance.put(path,volumen);
    return data;
}

async function getVolumenByTurnAndTank({turn_id,tank_id}){
    const {data} = await instance.get(path+'/vol',{params:{turn:turn_id,tank:tank_id}});
    return data;
}
async function getVolumensByMonthAndTurn({month,turn,tank_name}){
    const {data} = await instance.get(path+'/informe',{params:{month:month,turn:turn,name:tank_name}});
    return data;
}
async function getVolByTurnAndRangueDate({start_date,end_date}){
    const {data} = await instance.get(path+'/range',{params:{start_date:start_date,end_date:end_date}});
    return data;
}

async function getVolByTurnAndRangueDateAndTurn({start_date,end_date,turn}){
    const {data} = await instance.get(path+'/range/turn',{params:{start_date:start_date,end_date:end_date,turn:turn}});
    return data;
}

async function getVolByTurnAndRangueDateAndTurnAndTank({start_date,end_date,turn,tank_id}){
    const {data} = await instance.get(path+'/range/tank',{params:{start_date:start_date,end_date:end_date,turn:turn,tank_id:tank_id}});
    return data;
}


export {
    getVolumenById,
    setRegisterVolumen,
    putVolumenById,
    getVolumenByTurnAndTank,
    getVolumensByMonthAndTurn,
    getVolByTurnAndRangueDate,
    getVolByTurnAndRangueDateAndTurn,
    getVolByTurnAndRangueDateAndTurnAndTank,
    volumen
}