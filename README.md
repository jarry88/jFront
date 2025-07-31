# Fusion Starter

一个现代化的、生产就绪的全栈React应用程序模板，使用react-router-dom构建的单页应用(SPA)。

## 🚀 技术栈

### 核心框架
- **React 18** - 现代化的前端框架
- **TypeScript** - 提供类型安全
- **Vite** - 快速的构建工具和开发服务器
- **React Router 6** - 客户端路由管理

### UI & 样式
- **TailwindCSS 3** - 实用优先的CSS框架
- **Radix UI** - 无障碍UI组件库
- **Framer Motion** - 流畅的动画效果
- **Lucide React** - 美观的图标库
- **next-themes** - 暗黑模式支持

### 3D渲染
- **Three.js** - 3D图形库
- **React Three Fiber** - React的Three.js渲染器
- **React Three Drei** - 实用的Three.js助手

### 状态管理 & 工具
- **TanStack Query** - 强大的数据获取和缓存
- **React Hook Form** - 高性能表单库
- **Zod** - TypeScript优先的模式验证

### 开发工具
- **Vitest** - 快速的单元测试框架
- **Prettier** - 代码格式化
- **ESLint** - 代码检查

## 📋 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 (或 **yarn** / **pnpm**)

## 🛠️ 安装与启动

### 快速启动 (推荐)
```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

开发服务器将在 http://localhost:5173 启动

### 详细步骤

#### 1. 克隆项目
```bash
git clone <repository-url>
cd Janus
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 启动开发服务器
```bash
npm run dev
```

#### 4. 构建生产版本
```bash
npm run build
```

## 🚨 故障排除

### 网络超时问题
如果遇到 `ERR_SOCKET_TIMEOUT` 错误，请使用国内镜像源：

```bash
# 设置淘宝镜像源
npm config set registry https://registry.npmmirror.com

# 清理缓存
npm cache clean --force

# 重新安装
npm install
```

### Windows权限问题
如果遇到 `EPERM: operation not permitted` 错误：

#### 方案1：删除node_modules重新安装
```powershell
# PowerShell命令
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
```

#### 方案2：使用yarn替代npm
```bash
# 安装yarn
npm install -g yarn

# 使用yarn安装依赖
yarn install

# 启动开发服务器
yarn dev
```

#### 方案3：以管理员身份运行
1. 右键点击PowerShell或命令提示符
2. 选择"以管理员身份运行"
3. 导航到项目目录并运行安装命令

### 常见问题解决

| 问题 | 解决方案 |
|------|----------|
| 网络超时 | 使用国内镜像源：`npm config set registry https://registry.npmmirror.com` |
| 权限错误 | 以管理员身份运行或使用yarn |
| 端口占用 | 更改端口：`npm run dev -- --port 3000` |
| 缓存问题 | 清理缓存：`npm cache clean --force` |

## 📁 项目结构

```
├── public/              # 静态资源文件
├── src/
│   ├── components/      # 可复用的UI组件
│   │   └── ui/         # 核心UI组件库
│   ├── hooks/          # 自定义React Hooks
│   ├── lib/            # 工具函数和配置
│   ├── pages/          # 页面组件
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 应用入口点
│   └── index.css       # 全局样式
├── package.json        # 项目配置和依赖
├── vite.config.ts      # Vite配置
├── tailwind.config.ts  # TailwindCSS配置
└── tsconfig.json       # TypeScript配置
```

## 🔧 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (支持热重载) |
| `npm run build` | 构建生产版本 |
| `npm run test` | 运行单元测试 |
| `npm run typecheck` | 验证TypeScript类型 |
| `npm run format.fix` | 自动格式化代码 |

## 🎨 样式系统

项目使用多层样式系统：

### TailwindCSS
- 实用优先的CSS类
- 内置响应式设计
- 支持暗黑模式

### 组件变体
使用 `class-variance-authority` 创建组件变体：

```typescript
import { cn } from "@/lib/utils"

function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        {
          "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
          "h-9 px-3 text-sm": size === "sm",
          "h-11 px-8 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  )
}
```

## 🧭 路由系统

路由使用React Router 6定义在 `src/App.tsx`：

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom"

<Routes>
  <Route path="/" element={<Index />} />
  {/* 在通配符路由之前添加自定义路由 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## 🧪 测试

- 使用 **Vitest** 进行单元测试
- 测试文件使用 `.spec.ts` 后缀
- 运行测试：`npm run test`

## 🌐 部署

项目包含Netlify配置文件 (`netlify.toml`)，可以直接部署到Netlify：

1. 连接GitHub仓库到Netlify
2. 构建命令：`npm run build`
3. 发布目录：`dist`

## 🚀 快速开始指南

1. **克隆并安装**：
   ```bash
   git clone <repository-url>
   cd Janus
   npm install
   ```

2. **启动开发**：
   ```bash
   npm run dev
   ```

3. **开始开发**：
   - 在 `src/pages/` 添加新页面
   - 在 `src/components/` 创建可复用组件
   - 在 `src/App.tsx` 中配置路由

## 🎯 核心特性

- ✅ **TypeScript支持** - 完整的类型安全
- ✅ **响应式设计** - 移动端友好
- ✅ **暗黑模式** - 内置主题切换
- ✅ **3D渲染能力** - Three.js集成
- ✅ **现代化构建** - Vite快速构建
- ✅ **组件库** - 丰富的UI组件
- ✅ **表单处理** - React Hook Form集成
- ✅ **数据获取** - TanStack Query
- ✅ **动画效果** - Framer Motion
- ✅ **测试就绪** - Vitest配置

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## �� 许可证

MIT License 