import { createSlice } from "@reduxjs/toolkit";

export const turnSlice = createSlice({
    name: 'turn',
    initialState: {
        loading: true,
        error: false,
        turn: {
            id: 0,
            turn: 0,
            user: null,
            start_date: null,
            end_date: null
        }
    },
    reducers: {
        setTurn: (state, { payload }) => {
            state.turn.id = payload.id;
            state.turn.turn = payload.turn;
            state.turn.user = payload.user;
            state.turn.start_date = payload.start_date;
            state.turn.end_date = payload.end_date;
            state.loading = false;
        },
        setTurnError: (state) => {
            state.error = true;
            state.loading = false;
        },
    }
});
export const { setTurn,setTurnError } = turnSlice.actions;
export const setTurnAsyn = (turn) => (dispatch) => {
    setTimeout(() => {
        dispatch(setTurn(turn))
    }, 3000)
}
export const selectTurn = (state) => state.turn;
export default turnSlice.reducer;