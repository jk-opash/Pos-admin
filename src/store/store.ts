import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import adminReducer from './slices/adminSlice';
import auditLogReducer from './slices/auditLogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    subscription: subscriptionReducer,
    admin: adminReducer,
    auditLog: auditLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
