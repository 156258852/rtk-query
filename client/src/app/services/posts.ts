import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 定义帖子类型
export interface Post {
  id: number
  title: string
  content: string
  userId: number
}

// 定义请求体类型
export interface PostRequest {
  title: string
  content: string
  userId: number
}

// 定义 API 响应类型
export interface PostsResponse {
  posts: Post[]
}

// 创建主 API slice（只保留壳子）
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  tagTypes: ['Post'], // 在这里定义 tagTypes
  endpoints: () => ({}), // 空的 endpoints
})

// 通过注入的方式添加所有 endpoints
const enhancedApi = api.injectEndpoints({
  // 移除了错误的 tagTypes 属性
  endpoints: (builder) => ({
    // 获取所有帖子
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      async onQueryStarted(args, { dispatch, getState , queryFulfilled ,getCacheEntry}) {
        const { data } = await queryFulfilled;
        console.log('🚀 >>> data',data)
        console.log('🚀 >>> getCacheEntry()',getCacheEntry())
        // return {
        //   data: data,
        // }
      },
      keepUnusedDataFor: 0,
      providesTags: (result) => {
        const res  =  result
          ? [
            ...result.map(({ id }) => ({ type: 'Post' as const, id })),
            { type: 'Post' as const, id: 'LIST' },
          ]
          : [{ type: 'Post' as const, id: 'LIST' }]
        return res
      }
    }),
    // 根据 ID 获取单个帖子
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
    // 创建新帖子
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    // 更新帖子
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
    }),
    // 删除帖子
    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
  }),
})

// 导出所有 hooks（从增强的 API 导出，它包含了所有 endpoints）
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = enhancedApi

// 简化 selectPosts
export const selectPosts = enhancedApi.endpoints.getPosts.select(undefined)
