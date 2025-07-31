# Janus 认证系统 - 前后端联通与路由保护

## 🎯 概述

本文档说明如何测试 Janus 项目的前后端认证系统联通功能，包括：
- 用户登录与身份验证
- 登录成功后自动跳转到 dashboard
- 路由保护，防止未登录用户访问受保护页面
- 基于角色的访问控制
- 全局认证状态管理

## 📋 前置条件

### 1. 后端服务器启动
确保后端服务器正在运行：

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 启动服务器
python run_server.py
```

后端服务器应该运行在 `http://localhost:8000`

### 2. 前端服务器启动
确保前端服务器正在运行：

```bash
# 进入前端目录
cd front

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务器应该运行在 `http://localhost:5173`

## 🧪 测试步骤

### 1. 测试未登录状态的路由保护
直接访问以下受保护的页面，应该自动重定向到登录页面：
```
http://localhost:5173/dashboard
http://localhost:5173/submit-rates
http://localhost:5173/crm/1
```

### 2. 登录功能测试
访问登录页面：
```
http://localhost:5173/
```

使用以下任一测试账号登录：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| sales_manager | sales123 | 销售经理 |
| customer1 | customer123 | 客户 |
| operations | ops123 | 运营 |
| sales_rep | rep123 | 销售代表 |

### 3. 验证登录后自动跳转
登录成功后，应该：
- ✅ 显示成功消息
- ✅ 1秒后自动跳转到 `/dashboard` 页面
- ✅ 用户信息存储在 localStorage
- ✅ 全局认证状态更新

### 4. 测试角色权限控制
不同角色用户可以访问不同的页面：

| 页面 | admin | sales_manager | sales_rep | customer | operations |
|------|-------|---------------|-----------|----------|------------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/crm/:id` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/submit-rates` | ✅ | ✅ | ❌ | ❌ | ✅ |

### 5. 测试登出功能
在任何已登录页面：
- ✅ 点击 "Logout" 按钮
- ✅ 用户信息被清除
- ✅ 本地存储被清理
- ✅ 自动重定向到登录页面

### 6. 测试认证演示页面
访问完整的认证演示：
```
http://localhost:5173/auth-demo
```

## 🔧 技术实现

### 前端组件架构
- **AuthProvider** - 认证上下文提供者，管理全局认证状态
- **useAuth** - 认证Hook，提供认证相关功能
- **LoginForm** - 用户登录表单，登录成功后跳转到dashboard
- **UserProfile** - 用户信息显示组件
- **ProtectedRoute** - 路由保护组件，验证用户登录状态和权限
- **AuthDemo** - 认证演示页面

### 后端接口
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息
- `POST /api/v1/auth/logout` - 用户登出

### 路由保护机制
1. **ProtectedRoute 组件**：包装需要保护的路由
2. **认证检查**：验证用户是否已登录
3. **Token 验证**：检查JWT Token是否有效
4. **角色权限**：验证用户是否有访问权限
5. **自动重定向**：未登录用户重定向到登录页

### 数据流程
1. 用户访问受保护页面
2. ProtectedRoute 检查认证状态
3. 如果未登录，重定向到登录页面（`/`）
4. 用户输入用户名和密码
5. 前端调用后端 `/api/v1/auth/login` 接口
6. 后端验证用户身份，返回 JWT Token 和用户信息
7. 前端存储 Token 到 localStorage 并更新全局状态
8. 登录成功后自动跳转到 `/dashboard`
9. 后续访问受保护页面时自动携带 Token

## 🔒 安全特性

### 1. JWT Token 认证
- 使用 Bearer Token 方式传递
- Token 过期时间：30分钟
- 前端自动在请求头中携带 Token

### 2. 路由级别保护
- 所有敏感页面都被 ProtectedRoute 包装
- 未登录用户无法访问受保护页面
- 自动重定向到登录页面

### 3. 基于角色的访问控制 (RBAC)
- 不同角色拥有不同页面访问权限
- 细粒度权限控制
- 权限不足时显示拒绝访问页面

### 4. 全局状态管理
- 使用 React Context 管理认证状态
- 多标签页状态同步
- 自动 Token 有效性验证

## 🛠️ 调试方法

### 1. 检查网络连接
- 确保后端服务器运行在正确端口
- 检查浏览器开发者工具的 Network 标签页
- 验证 API 请求是否成功发送

### 2. 查看控制台日志
- 打开浏览器开发者工具的 Console 标签页
- 查看是否有错误信息或警告
- 观察登录和路由跳转的日志信息

### 3. 检查本地存储
- 开发者工具 > Application > Local Storage
- 验证 `access_token`、`token_type` 和 `user_info` 是否正确存储
- 登出后检查存储是否被清除

### 4. 测试路由保护
```bash
# 测试直接访问受保护页面
curl "http://localhost:5173/dashboard"

# 应该重定向到登录页面
```

### 5. 测试 API 端点
```bash
# 测试登录
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# 测试获取用户信息
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## ⚡ 常见问题

### 1. 登录后没有跳转到 dashboard
- 检查 LoginForm 组件中的 navigate 调用
- 确认路由配置正确
- 查看控制台是否有 JavaScript 错误

### 2. 直接访问 dashboard 没有重定向到登录页
- 检查 ProtectedRoute 组件是否正确包装路由
- 确认 AuthProvider 是否在 App 组件中正确设置
- 验证认证状态检查逻辑

### 3. 权限控制不生效
- 检查用户角色是否正确设置
- 确认 requiredRoles 参数传递正确
- 验证角色权限检查逻辑

### 4. 多标签页状态不同步
- 检查 localStorage 事件监听器
- 确认 AuthProvider 中的存储变化监听

## 🎨 自定义开发

### 添加新的受保护路由
```tsx
<Route 
  path="/new-protected-page" 
  element={
    <ProtectedRoute requiredRoles={["admin", "manager"]}>
      <NewProtectedPage />
    </ProtectedRoute>
  } 
/>
```

### 自定义权限检查
```tsx
const { user } = useAuth();
const hasPermission = user?.role === "admin" || user?.company_id === targetCompanyId;
```

### 添加登录重定向
```tsx
// 登录成功后重定向到用户尝试访问的页面
const location = useLocation();
const from = location.state?.from || "/dashboard";
navigate(from);
```

## 📝 注意事项

- 这是一个演示系统，使用 Mock 数据
- 生产环境需要使用真实的数据库
- JWT Secret 需要在生产环境中更改
- 建议实施更严格的密码策略
- 考虑添加验证码等安全措施
- Token 刷新机制可以进一步完善

## 🚀 下一步

- 集成真实数据库
- 实现 Token 自动刷新
- 添加邮箱验证
- 实现两步验证
- 添加用户管理界面
- 实现更细粒度的权限控制
- 添加登录日志和审计功能 