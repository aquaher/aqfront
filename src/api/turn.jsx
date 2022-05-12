import { setTurn } from "@/reducer/turn";
import { instance } from "@/service/instance"
const path = '/turn';
function getTurnById({id}){
    return async (dispatch)=>{
        instance.get(path,{params:{id:id}}).then(data=>{
            dispatch(setTurn(data.data))
        })
    }    
}
/**
 * turno actula y usuario a pasar el turno
 * @param {*} param0 
 * @returns 
 */
async function endTurnAndCreate({turn_id,user_id}){
    const {data} = await instance.get(path+'/finalize',{params:{turn_id:turn_id,user_id:user_id}});
    return data;
}
/**
 * turno y usuario actual
 * @param {*} param0 
 * @returns 
 */
function registerTurn({turn_id,user_id}){
    return async (dispatch)=>{
        instance.get(path+'/register',{params:{turn_id:turn_id,user_id:user_id}}).then(data=>{
            dispatch(setTurn(data.data))
        })
    }
}

export {
    getTurnById,
    endTurnAndCreate,
    registerTurn
}

