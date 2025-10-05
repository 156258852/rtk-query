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
export const otherPostsApi = createApi({
  reducerPath: 'otherPosts',
  keepUnusedDataFor: 60, // 缓存时间是60秒
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({


    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Post', id: id } as const],
    }),
  }),
})



export const {

  useDeletePostMutation
} = otherPostsApi