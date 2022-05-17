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
    getVolByTurnAndRangueDateAndTurnAndTank
}