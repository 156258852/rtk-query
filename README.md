# RTK Query Fullstack Example

这是一个使用 Vite + TypeScript + React + Redux Toolkit + RTK Query 技术栈的全栈项目示例，后端使用 Express + Node.js 提供 CRUD 接口。

## 项目结构

```
rtk-query/
├── client/           # 前端应用
│   ├── src/
│   │   ├── app/
│   │   │   ├── store.ts          # Redux store 配置
│   │   │   └── services/
│   │   │       └── posts.ts      # RTK Query API 定义
│   │   ├── features/
│   │   │   └── posts/
│   │   │       └── PostsManager.tsx  # 帖子管理组件
│   │   └── App.tsx               # 主应用组件
├── server/           # 后端服务
│   └── server.ts     # Express 服务器
└── README.md         # 项目说明文档
```

## RTK Query API 使用说明

RTK Query 提供了以下主要 API：

### 1. createApi
创建 API slice 的核心函数，用于定义如何获取数据的配置。

### 2. fetchBaseQuery
用于发送请求的工具函数，是 RTK Query 的默认查询函数。

### 3. endpoints
定义 API 端点的对象，包括查询和变更操作。

### 4. Hooks
- `useQuery` - 用于获取数据的 hook
- `useMutation` - 用于修改数据的 hook

### 5. 标签系统 (Tags)
用于缓存失效和自动重新获取数据。

## 主要功能

### 前端功能
1. 获取所有帖子列表
2. 根据 ID 获取单个帖子
3. 创建新帖子
4. 更新现有帖子
5. 删除帖子

### 后端功能
1. GET `/api/posts` - 获取所有帖子
2. GET `/api/posts/:id` - 根据 ID 获取帖子
3. POST `/api/posts` - 创建新帖子
4. PUT `/api/posts/:id` - 更新帖子
5. DELETE `/api/posts/:id` - 删除帖子

## 运行项目

### 安装依赖
```bash
# 在根目录安装所有依赖
pnpm install
```

### 启动开发服务器
```bash
# 同时启动前端和后端
pnpm run dev
```

或者分别启动：

```bash
# 启动后端服务器
cd server && pnpm run dev

# 启动前端应用
cd client && pnpm run dev
```

## RTK Query 特性演示

1. **自动缓存** - 相同的查询不会重复发送请求
2. **自动重新获取** - 当相关数据变更时自动更新
3. **乐观更新** - 在请求完成前更新 UI
4. **轮询** - 定期重新获取数据
5. **聚焦时重新获取** - 当用户回到页面时重新获取数据

访问 http://localhost:5173 查看应用运行效果。