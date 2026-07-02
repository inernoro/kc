# 米多智库 - 酒水行业客户成功管理系统

[![部署状态](https://github.com/YOUR_USERNAME/miduo-zhiku/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/miduo-zhiku/actions/workflows/deploy.yml)

## 📖 项目介绍

米多智库是一个专为酒水行业打造的智能客户成功管理系统，集成AI代理能力，为企业提供全方位的客户管理和业务支持。

### 系统架构

系统采用**左-中-右-上**四区域布局设计：

- **左侧**：导航区域，展示每日必做事项、客户列表、项目列表等核心内容
- **中间**：主交互窗口，用户的主要操作区域
- **右侧**：AI提示区，提供智能汇总、打分、总结等辅助信息
- **顶部**：动态状态栏
  - 左侧：与总目标的差距分析
  - 右侧：当前瞬时变化和差距追踪

### 核心功能模块

#### 🎯 品牌域（产品+技术）
- 产品管理和技术开发
- PRD文档管理
- 技术标准库
- 任务追踪系统

#### 📢 市场部（编辑+获客）
- 内容创作和编辑
- 客户信息获取
- 营销活动管理

#### 🤝 客户成功部（售后+创收）
- 客户关系维护
- 定制服务管理
- 续约提醒和追踪
- 客户健康度评分

#### 🎨 平台运营部（运营+交互）
- 平台日常运营
- 开户管理
- 活动策划和执行

### 特色功能

- **空间切换**：支持部门切换（如客户成功部 ↔ 技术部）
- **模式切换**：知识模式（询问）和考核模式（回答）自由切换
- **AI智能助手**：多种AI代理支持不同业务场景
- **实时评估**：动态评分和效果预测

## 🚀 在线预览

### GitHub Pages 部署版本

**[👉 点击访问在线演示](https://YOUR_USERNAME.github.io/miduo-zhiku/)**

> 注意：首次部署后需要等待几分钟才能访问。请确保在仓库设置中启用 GitHub Pages。

## 🛠️ 技术栈

### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Create React App
- **UI组件**：自定义组件 + Lucide Icons
- **动画**：Framer Motion
- **样式**：CSS Modules + Tailwind CSS（可选）
- **Markdown**：React Markdown + Remark GFM

### 后端
- **框架**：Express.js（轻量级，可替换）
- **API管理**：RESTful API
- **安全**：Helmet + CORS + Rate Limiting
- **认证**：JWT

## 📦 安装与运行

### 前置要求
- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
# 复制环境变量模板
cp .env.example .env

# 启动后端 API（默认端口: 10255）
ADMIN_PASSWORD=change-this-password JWT_SECRET=change-this-jwt-secret npm run backend

# 新开一个终端，启动前端开发服务器（默认端口: 10288）
npm run dev
```

前端默认请求 `http://localhost:10255/api`。如需改地址，设置：

```bash
REACT_APP_API_URL=http://localhost:10255/api npm run dev
```

### 后端 API

本仓库包含一个轻量 Express API，覆盖本地开发需要的健康检查、mock 业务数据、AI 对话/SSE 和 admin 登录。

```bash
# 健康检查
curl http://localhost:10255/api/health

# admin 登录，返回 JWT
curl -X POST http://localhost:10255/api/admin/login \
  -H 'Content-Type: application/json' \
  --data '{"username":"admin","password":"change-this-password"}'
```

### 生产构建

```bash
npm run build
ADMIN_PASSWORD=change-this-password JWT_SECRET=change-this-jwt-secret npm run backend:prod
```

构建产物将生成在 `build/` 目录下。

### Docker

```bash
docker build -t kc .
docker run --rm -p 10255:10255 \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=change-this-password \
  -e JWT_SECRET=change-this-jwt-secret \
  kc
```

容器会用 `server.js` 同时提供 `/api/*` 和 React `build/` 静态文件。

## 🔧 GitHub Pages 配置说明

### 首次设置步骤

1. **修改 README 中的占位符**
   - 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名

2. **在 GitHub 仓库中启用 Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

3. **推送代码触发部署**
   ```bash
   git add .
   git commit -m "feat: 添加 GitHub Actions 和 Pages 配置"
   git push origin main
   ```

4. **查看部署状态**
   - 访问仓库的 Actions 标签页
   - 查看工作流运行状态
   - 部署成功后即可访问线上地址

### 自动部署说明

- **触发条件**：每次推送到 `main` 分支或手动触发
- **部署流程**：
  1. 检出代码
  2. 设置 Node.js 环境
  3. 安装项目依赖
  4. 构建 React 应用
  5. 部署到 GitHub Pages

## 📝 开发规范

### API 接口文档

所有涉及后端请求的功能都需要在 [`apidoc.md`](./apidoc.md) 中添加接口文档，包括：

- 接口基本信息（名称、HTTP方法、路径）
- 请求参数和格式
- 响应数据结构
- 开发注意事项
- AI后端开发提示

### 代码规范

- 使用 TypeScript 进行类型约束
- 遵循 React Hooks 最佳实践
- 组件化开发，保持单一职责
- 每次大更新后确保服务可编译运行
- 注意模块正确引用

## 📂 项目结构

```
miduo-zhiku/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 配置
├── public/
│   └── index.html              # HTML 模板
├── src/
│   ├── components/             # React 组件
│   │   ├── BrandAgentCenter.tsx
│   │   ├── CustomerPanel.tsx
│   │   ├── TechnicalAgentCenter.tsx
│   │   └── ...
│   ├── modules/                # 功能模块
│   │   ├── customer-success/   # 客户成功模块
│   │   └── product/            # 产品模块
│   ├── services/               # API 服务
│   ├── styles/                 # 样式文件
│   ├── types/                  # TypeScript 类型定义
│   ├── App.tsx                 # 主应用组件
│   └── index.tsx               # 应用入口
├── apidoc.md                   # API 接口文档
├── package.json                # 项目配置
└── README.md                   # 项目说明
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 团队

米多智库团队

---

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**
