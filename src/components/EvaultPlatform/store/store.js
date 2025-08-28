import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import { authDebugMiddleware, getReduxDevToolsConfig } from './debugMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  version: 1,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['auth._persist'],
      },
    });

    // Add debug middleware in development
    if (process.env.NODE_ENV === 'development') {
      middleware.push(authDebugMiddleware);
    }

    return middleware;
  },
  devTools: getReduxDevToolsConfig(),
});

export const persistor = persistStore(store);