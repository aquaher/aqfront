import { createSlice } from "@reduxjs/toolkit";

export const eventsSlice = createSlice({
    name:'events',
    initialState:{
        loading: true,
        error:false,
        event:null
    },
    reducers:{
        setEvents(state,{payload}){
            state.loading = false;
            state.event = payload;
        },
        setEventsError: (state) => {
            state.loading = false;
            state.error = true;
        },
    }
});
export const {setEvents} = eventsSlice.actions;
export const selectEvents = (state)=>state.events;
export default eventsSlice.reducer; 