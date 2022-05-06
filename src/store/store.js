import { configureStore } from '@reduxjs/toolkit'
import TurnReducer from '@/reducer/turn';
import TankReducer from '@/reducer/tank';
import EventsReducer from '@/reducer/events';

export default configureStore({
  reducer: {
    turn: TurnReducer,
    tank: TankReducer,
    events: EventsReducer
  },
});