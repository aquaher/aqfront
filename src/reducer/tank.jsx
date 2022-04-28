import { createSlice } from "@reduxjs/toolkit";

export const tankSlice = createSlice({
    name:'tank',
    initialState:{
        value:null
    },
    reducers:{
        addTankToList(state,{payload}){
            state.value = payload;
        }
    }
});
export const {addTankToList} = tankSlice.actions;
export const selectTank = (state)=>state.tank.value;
export default tankSlice.reducer; 