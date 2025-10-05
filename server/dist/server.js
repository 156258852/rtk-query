"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = 3000;
// 中间件
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post', userId: 1 },
    { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2 },
];
let nextId = 3;
// API 路由
// 获取所有帖子
app.get('/api/posts', (req, res) => {
    res.json(posts);
});
// 根据 ID 获取单个帖子
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (post) {
        res.json(post);
    }
    else {
        res.status(404).json({ message: 'Post not found' });
    }
});
// 创建新帖子
app.post('/api/posts', (req, res) => {
    const { title, content, userId } = req.body;
    if (!title || !content || !userId) {
        return res.status(400).json({ message: 'Title, content, and userId are required' });
    }
    const newPost = {
        id: nextId++,
        title,
        content,
        userId
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});
// 更新帖子
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }
    const { title, content, userId } = req.body;
    if (title)
        posts[postIndex].title = title;
    if (content)
        posts[postIndex].content = content;
    if (userId)
        posts[postIndex].userId = userId;
    res.json(posts[postIndex]);
});
// 删除帖子
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }
    posts.splice(postIndex, 1);
    res.json({ success: true, id });
});
// 启动服务器
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// 优雅关闭服务器
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
