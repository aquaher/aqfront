import { instance } from "@/service/instance";

const path = '/ablandada'

const ablandada = {
    get:async(url)=>instance.get(path+url).then(res=>res.data),
    post:async({url,data})=>instance.post(path+url,data).then(res=>res.status),
    put:async({url,data})=>instance.put(path+url,data).then(res=>res.status)
}

async function getAblandadaById(abl_id){
    const {data} = await instance.get(path,{params:{id:abl_id}});
    return data;
}
async function setRegisterAblandada(ablandada){
    const {data} = await instance.post(path,ablandada);
    return data;
}
async function getAblByTurnAndRangueDate({start_date,end_date}){
    const {data} = await instance.get(path+'/range',{params:{start_date:start_date,end_date:end_date}});
    return data;
}


export {
    getAblandadaById,
    setRegisterAblandada,
    getAblByTurnAndRangueDate,
    ablandada
}