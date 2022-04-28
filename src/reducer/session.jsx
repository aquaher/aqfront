import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        data: {
            access_token: null,
            expires_in: null,
            refresh_expires_in: null,
            refresh_token: null,
            user:{
                full_name: null,
                email: null
            }
        }
    },
reducers: {
    addSession: (state, { payload }) => {
        console.log(payload)
        /*state.data.access_token = payload.access_token;
        state.data.refresh_in = payload.refresh_in;
        state.data.refresh_expires_in = payload.refresh_expires_in;
        state.data.refresh_token = payload.refresh_token;
        state.data.user = payload.user;*/
    },
        removeSession: (state) => {
            state.data = null;
        }
}
});
export const { addSession, removeSession } = sessionSlice.actions;
export const session = (state) => state.session.data;
export default sessionSlice.reducer; 