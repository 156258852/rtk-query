import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 模拟数据存储
interface Post {
  id: number
  title: string
  content: string
  userId: number
}

let posts: Post[] = [
  { id: 1, title: 'First Post', content: 'This is the first post', userId: 1 },
  { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2 },
]

let nextId = 3

// API 路由

// 获取所有帖子
app.get('/api/posts', (req, res) => {
  setTimeout(() => {
    res.json(posts)
  }, 500);
})

// 根据 ID 获取单个帖子
app.get('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const post = posts.find(p => p.id === id)
  
  if (post) {
    res.json(post)
  } else {
    res.status(404).json({ message: 'Post not found' })
  }
})

// 创建新帖子
app.post('/api/posts', (req, res) => {
  const { title, content, userId } = req.body
  
  if (!title || !content || !userId) {
    return res.status(400).json({ message: 'Title, content, and userId are required' })
  }
  
  const newPost: Post = {
    id: nextId++,
    title,
    content,
    userId
  }
  
  posts.push(newPost)
  res.status(201).json(newPost)
})

// 更新帖子
app.put('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const postIndex = posts.findIndex(p => p.id === id)
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' })
  }
  
  const { title, content, userId } = req.body
  
  if (title) posts[postIndex].title = title
  if (content) posts[postIndex].content = content
  if (userId) posts[postIndex].userId = userId
  
  res.json(posts[postIndex])
})

// 删除帖子
app.delete('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const postIndex = posts.findIndex(p => p.id === id)
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' })
  }
  
  posts.splice(postIndex, 1)
  res.json({ success: true, id })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})