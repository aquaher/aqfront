import { instance } from "@/service/instance";

const path = '/parametro'

async function getParameters({date,tank_id}){
    const {data} = await instance.get(path,{params:{date:date,tank_id:tank_id}});
    return data;
}

async function setParameters({tank_id,lote}){
    const {data} = await instance.post(path,{params:{tank_id:tank_id,lote:lote}});
    return data;
}
/**
 * lista de parametros
 * @param {*} parameters 
 * @returns 
 */
async function putParameters(parameters){
    const {data} = await instance.put(path,parameters);
    return data;
}

export {
    getParameters,
    setParameters,
    putParameters
}