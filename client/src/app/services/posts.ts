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

// 创建 API slice
export const postsApi = createApi({
  reducerPath: 'postsApi',
  keepUnusedDataFor: 60, // 缓存时间是60秒
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // 获取所有帖子
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result) => {
        const res  =  result
          ? [
            ...result.map(({ id }) => ({ type: 'Post' as const, id })),
            { type: 'Post', id: 'LIST' },
          ]
          : [{ type: 'Post', id: 'LIST' }]
        return res
      }

    }),
    // 根据 ID 获取单个帖子
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`, // id变化时会自动发起请求
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

export const selectPosts =(state:any)=> postsApi.endpoints.getPosts.select()(state)
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLazyGetPostQuery
} = postsApi