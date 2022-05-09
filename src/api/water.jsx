import { instance } from "@/service/instance";

async function setRegisterWater(water) {
    const { data } = await instance.post('/agua', water);
    return data;
}
async function getVerifyWaterByTurn({ tank_id, turn_id }) {
    const { data } = await instance.get('/agua/p_verify',{ params: { tank_id: tank_id, turn_id: turn_id }});
    return data;
}
async function putRegisterWater(water) {
    const { data } = await instance.put('/agua', water);
    return data;
}
export {
    setRegisterWater,
    getVerifyWaterByTurn,
    putRegisterWater
}