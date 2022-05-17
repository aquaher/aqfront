import { createSlice } from "@reduxjs/toolkit";

export const tankSlice = createSlice({
    name:'tank',
    initialState:{
        loading: true,
        error:false,
        value:[]
    },
    reducers:{
        setTank(state,{payload}){
            state.loading = false;
            state.value = payload;
        },
        setTurnError: (state) => {
            state.loading = false;
            state.error = true;
        },
    }
});
export const {setTank} = tankSlice.actions;
export const selectTank = (state)=>state.tank;
export default tankSlice.reducer; 