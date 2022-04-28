import { createSlice } from "@reduxjs/toolkit";

export const turnSlice = createSlice({
    name:'turn',
    initialState:{
        id:0,
        turn:0,
        operador:'',
        start_date:'',
        end_date:''
    },
    reducers:{
        addTurn:(state,{payload})=>{
            state.id = payload.id;
            state.turn = payload.turn
            state.operador = payload.operador
            state.start_date = payload.start_date
            state.end_date = payload.end_date
        }
    }
});
export const {addTurn} = turnSlice.actions;
export const addTurnAsyn = (turn) => (dispatch) => {
    setTimeout(()=>{
        dispatch(addTurn(turn))
    },3000)
} 
export const selectTurn = (state) => state.turn;
export default turnSlice.reducer;