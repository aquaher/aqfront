import { configureStore } from '@reduxjs/toolkit'
import TurnReducer from '@/reducer/turn';
import TankReducer from '@/reducer/tank';
import SessionReducer from '@/reducer/session';

export default configureStore({
  reducer: {
    turn: TurnReducer,
    tank: TankReducer,
    session:  SessionReducer
  },
});