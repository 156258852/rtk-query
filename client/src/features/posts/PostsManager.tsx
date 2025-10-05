import React from 'react'
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  selectPosts,
} from '../../app/services/posts'
import type { Post } from '../../app/services/posts'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../app/store'
import Child from './Child'

const PostsManager = () => {
  // 只保留一个 useGetPostsQuery 调用，并设置不缓存
  const { data: posts, isLoading, refetch, isError } = useGetPostsQuery(undefined, {
    refetchOnMountOrArgChange: true, // 每次挂载时都重新获取数据
    // selectFromResult: res=>{
    //   console.log('🚀 >>> res',res)
    //   return {
    //     data: res.data
    //   }
    // },
  })
  const { data: postData } = useSelector(selectPosts)
  console.log('🚀 >>> postData',postData)


  const [createPost] = useCreatePostMutation()
  const [deletePost] = useDeletePostMutation()

  const [newPost, setNewPost] = React.useState({ title: '', content: '', userId: 1 })
  const [editPost, setEditPost] = React.useState<Partial<Post> & { id: number } | null>(null)
  // 从 Redux store 中获取 counter 状态
  const counter = useSelector((state: RootState) => state.counter)
  const dispatch = useDispatch()

  const handleCreatePost = async () => {
    try {
      const res = await createPost(newPost).unwrap()
      console.log('Created post:', res)
      setNewPost({ title: '', content: '', userId: 1 })
    } catch (err) {
      console.error('Failed to create post:', err)
    }
  }

  const handleDeletePost = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await deletePost(id)
      const res = await refetch()
      console.log('🚀 >>> res', res)
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading posts</div>

  return (
    <div>
      <h2>Posts Manager</h2>

      <Child />
      
      {/* 用于测试持久化的计数器 */}
      <div>
        <h3>Counter (for testing persistence): {counter}</h3>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </div>
      
      {/* 创建新帖子 */}
      <div>
        <h3>Create New Post</h3>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>

      {/* 刷新按钮 */}
      <div>
        <button onClick={refetch}>Refetch Posts</button>
      </div>

      {/* 帖子列表 */}
      <div>
        <h3>Posts List</h3>
        {posts && posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            {editPost && editPost.id === post.id ? (
              // 编辑模式
              <div>
                <input
                  type="text"
                  value={editPost.title || ''}
                  onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                />
                <textarea
                  value={editPost.content || ''}
                  onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                />
                <button onClick={() => setEditPost(null)}>Cancel</button>
              </div>
            ) : (
              // 显示模式
              <div>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                <button onClick={() => setEditPost({ id: post.id, title: post.title, content: post.content })}>
                  Edit
                </button>
                <button onClick={(e) => handleDeletePost(post.id, e)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostsManager