import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    subscription: subscriptionReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
