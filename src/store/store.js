import { configureStore } from '@reduxjs/toolkit'
import TurnReducer from '@/reducer/turn';
import TankReducer from '@/reducer/tank';

export default configureStore({
  reducer: {
    turn: TurnReducer,
    tank: TankReducer
  },
});