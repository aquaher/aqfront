import { instance } from "@/service/instance";

async function setRegisterMedidores(medidores){
    const {data} = await instance.post('/measure',medidores);
    return data;
}
async function putRegisterMedidores(medidores){
    const {data} = await instance.put('/measure',medidores);
    return data;
}
async function getMedidoresByTurnId({turn_id}){
    const {data} = await instance.get('/measure/turn',{params:{turn_id:turn_id}});
    return data;
}
async function getMedidoresByMonth({number}){
    const {data} = await instance.get('/measure/month',{params:{number:number}});
    return data;
}
export {
    setRegisterMedidores,
    putRegisterMedidores,
    getMedidoresByTurnId,
    getMedidoresByMonth
}