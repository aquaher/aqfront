import { setTurn } from "@/reducer/turn";
import { instance } from "@/service/instance"

export function verifyTurnByUser(){
    return async (dispatch) =>{
        const {data} = await instance.get("/turn")
        switch (data.messaje) {
            case 'registrado':
                const last = await getTurnLast('registrado')
                dispatch(setTurn(last));
            case 'siguente':
                const create = await getTurnCreate()
                dispatch(setTurn(create));
            case 'registra':
                const lastT = await getTurnLast('registra')
                dispatch(setTurn(lastT));
            default:
                break;
        }
    }
}
async function getTurnLast(msg){
    const last = await instance.get('/turn/last');
    if(last.status==200){
        return {
            ...last.data,
            messaje:msg!='registra'?"El turno ya esta registrado":'Registra el turno'
        };
    }
}
async function getTurnCreate(){
    const last = await instance.get('/turn/create');
    if(last.status==200){
        return {
            ...last.data,
            messaje:'Registra el turno'
        };
    }
}
