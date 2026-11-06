import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../modules/auth';
import { checklistsReducer } from '../modules/checklists';
import { toastReducer } from '../shared/toast';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    checklists: checklistsReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
