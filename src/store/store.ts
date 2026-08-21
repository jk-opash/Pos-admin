import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import adminReducer from './slices/adminSlice';
import auditLogReducer from './slices/auditLogSlice';
import supportTicketReducer from './slices/supportTicketSlice';
import notificationReducer from './slices/notificationSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: any) { return Promise.resolve(null); },
    setItem(_key: any, value: any) { return Promise.resolve(value); },
    removeItem(_key: any) { return Promise.resolve(); },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'pos-admin-root',
  storage,
  whitelist: ['notifications'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  business: businessReducer,
  subscription: subscriptionReducer,
  admin: adminReducer,
  auditLog: auditLogReducer,
  supportTicket: supportTicketReducer,
  notifications: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
