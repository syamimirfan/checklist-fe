import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../modules/auth';
import { checklistsReducer } from '../modules/checklists';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    checklists: checklistsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
