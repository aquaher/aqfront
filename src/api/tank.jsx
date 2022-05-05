import { setTank } from "@/reducer/tank"
import { instance } from "@/service/instance"

export default function getTank(){
    return async (dispatch) =>{
        instance.get("/tank").then(data=>{
            dispatch(setTank(data.data))
        })
    }
}