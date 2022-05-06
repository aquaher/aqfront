import { setEvents } from "@/reducer/events";
import { instance } from "@/service/instance";

function getEvents(){
    return async (dispatch) =>{
        const {data} = await instance.get('/event');
        dispatch(setEvents(data))
    }
}
export {
    getEvents
}