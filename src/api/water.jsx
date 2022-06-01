import { instance } from "@/service/instance";
const path = '/agua';

const water = {
    get:(url)=>instance.get(path+url).then(res=>res.data),
    getBy:({url,data})=>instance.get(path+url,data).then(res=>res.data),
    post:({url,data})=>instance.post(path+url,data).then(res=>res.data),
    put:({url,data})=>instance.put(path+url,data).then(res=>res.data)
}

async function setRegisterWater(water) {
    const { data } = await instance.post(path, water);
    return data;
}
async function getVerifyWaterByTurn({ tank_id, turn_id }) {
    const { data } = await instance.get(path+'/p_verify',{ params: { tank_id: tank_id, turn_id: turn_id }});
    return data;
}
async function putRegisterWater(water) {
    const { data } = await instance.put(path, water);
    return data;
}
export {
    setRegisterWater,
    getVerifyWaterByTurn,
    putRegisterWater,
    water
}