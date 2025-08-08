# 🚀 NPM 脚本使用指南

## 📦 简化后的前端脚本

### 🎯 **标准前端命令**

```bash
# 🔥 开发模式 - 启动前端开发服务器 (端口: 10288)
npm run dev

# 🚀 生产模式 - 启动前端开发服务器 (默认端口: 3000)
npm start

# 📦 构建项目 - 生成生产版本文件
npm run build

# 🧪 运行测试
npm test

# ⚡ 弹出配置 (不推荐)
npm run eject
```

### 🎛️ **后端命令 (独立运行)**

```bash
# 🔧 后端开发模式 - 自动重启
npm run backend

# 🏭 后端生产模式 - 稳定运行
npm run backend:prod
```

## 📋 **使用说明**

### 前端开发
1. **日常开发**: 使用 `npm run dev`
2. **预览生产版本**: 先 `npm run build`，再使用静态服务器
3. **测试**: 使用 `npm test`

### 后端开发
1. **API开发**: 使用 `npm run backend`
2. **生产部署**: 使用 `npm run backend:prod`

### 完整应用运行
```bash
# 终端1: 启动后端
npm run backend

# 终端2: 启动前端  
npm run dev
```

## ✨ **优势**

✅ **简化配置** - 移除了复杂的并发运行脚本  
✅ **标准化** - 使用React生态标准命令  
✅ **独立运行** - 前端和后端完全分离  
✅ **易于维护** - 清晰的职责分工  

## 🔧 **端口配置**

- **前端开发**: 10288 (dev模式)
- **前端标准**: 3000 (start模式)  
- **后端API**: 根据server.js配置

## 📝 **注意事项**

- 开发时建议使用 `npm run dev` (固定端口10288)
- 生产构建使用 `npm run build`
- 后端API需要单独启动 `npm run backend`