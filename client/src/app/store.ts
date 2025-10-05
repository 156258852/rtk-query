import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './services/posts'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// 定义 counter reducer
const counterReducer = (state = 0, action: { type: string; payload?: number }) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'RESET':
      return 0
    case 'SET_COUNTER':
      return action.payload || 0
    default:
      return state
  }
}

// 创建 root reducer
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  counter: counterReducer, // 添加 counter reducer
})

// 配置 persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // 指定需要持久化的 reducer
  blacklist: [api.reducerPath],
}

// 创建持久化 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
})

// 创建 persistor
export const persistor = persistStore(store)

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

// 正确的根状态类型定义
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch