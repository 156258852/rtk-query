import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { postsApi } from './services/posts'
import { otherPostsApi } from './services/otherPosts'

console.log('🚀 >>> postsApi',postsApi)

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    [otherPostsApi.reducerPath]: otherPostsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat( ...[
      postsApi.middleware,
      otherPostsApi.middleware
    ]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch