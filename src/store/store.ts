import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import adminReducer from './slices/adminSlice';
import auditLogReducer from './slices/auditLogSlice';
import supportTicketReducer from './slices/supportTicketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    subscription: subscriptionReducer,
    admin: adminReducer,
    auditLog: auditLogReducer,
    supportTicket: supportTicketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
