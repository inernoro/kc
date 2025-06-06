# 🐳 米多智库 - Docker部署指南

## 📋 目录
- [概述](#概述)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [部署方式](#部署方式)
- [服务说明](#服务说明)
- [常用命令](#常用命令)
- [故障排除](#故障排除)

## 🎯 概述

米多智库支持完整的Docker容器化部署，包含：
- **前后端一体化**：React前端 + Node.js后端
- **MongoDB数据库**：持久化数据存储
- **Nginx反向代理**：负载均衡和SSL终止（可选）
- **管理界面**：MongoDB Web管理工具（可选）

### 🏗️ 架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Backend       │    │   MongoDB       │
│   (Optional)    │───▶│   + Frontend    │───▶│   Database      │
│   Port: 80      │    │   Port: 10255   │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Mongo Express  │
                       │   (Optional)    │
                       │   Port: 8081    │
                       └─────────────────┘
```

## 🚀 快速开始

### 1. 一键启动（推荐）
```bash
# 使用启动脚本
chmod +x docker-start.sh
./docker-start.sh
```

### 2. 手动启动
```bash
# 复制环境变量配置
cp docker.env .env

# 启动基础服务
docker-compose up -d mongodb backend

# 访问应用
open http://localhost:10255
```

## ⚙️ 环境配置

### 环境变量文件
创建 `.env` 文件（或复制 `docker.env`）：

```env
# 🐳 Docker环境配置文件

# =========================
# 服务端口配置
# =========================
DOCKER_BACKEND_PORT=10255
DOCKER_FRONTEND_PORT=10256

# =========================
# API地址配置
# =========================
DOCKER_API_URL=http://backend:10255/api
API_BASE_URL=http://backend:10255
FRONTEND_URL=http://backend:10255
CORS_ORIGIN=http://localhost:10255

# =========================
# React前端配置
# =========================
REACT_APP_API_URL=http://localhost:10255/api

# =========================
# MongoDB数据库配置
# =========================
MONGODB_USERNAME=admin
MONGODB_PASSWORD=midopassword123
MONGODB_DATABASE=mido-knowledge-base
DOCKER_MONGODB_URI=mongodb://mongodb:27017/mido-knowledge-base

# =========================
# AI大模型配置
# =========================
AI_MODEL_URL=https://api.siliconflow.cn
AI_MODEL_API_KEY=your_api_key_here
AI_MODEL_TYPE=openai
DEFAULT_AI_MODEL=Pro/deepseek-ai/DeepSeek-V3

# =========================
# 安全配置
# =========================
JWT_SECRET=mido-zhiku-docker-secret-2024
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# =========================
# 日志配置
# =========================
LOG_LEVEL=info
NODE_ENV=production
```

### 重要配置说明
- **MONGODB_PASSWORD**: 修改为强密码
- **JWT_SECRET**: 修改为随机字符串
- **AI_MODEL_API_KEY**: 配置你的AI API密钥

## 📦 部署方式

### 方式1: 基础部署
仅启动核心服务：
```bash
docker-compose up -d mongodb backend
```

**包含服务**：
- MongoDB (端口: 27017)
- 后端API + 前端 (端口: 10255)

### 方式2: 完整部署
启动所有服务（包含管理工具）：
```bash
docker-compose --profile nginx --profile admin up -d
```

**包含服务**：
- MongoDB (端口: 27017)
- 后端API + 前端 (端口: 10255)
- Nginx反向代理 (端口: 80, 443)
- MongoDB管理界面 (端口: 8081)

### 方式3: 仅数据库
只启动MongoDB用于开发：
```bash
docker-compose up -d mongodb
```

## 🔧 服务说明

### 📡 Backend Service
- **容器名**: `mido-backend`
- **端口**: `10255`
- **功能**: Node.js API后端 + React前端静态文件
- **健康检查**: `http://localhost:10255/health`

### 🍃 MongoDB Service
- **容器名**: `mido-mongodb`
- **端口**: `27017`
- **数据库**: `mido-knowledge-base`
- **用户**: `admin` / `midopassword123`
- **数据卷**: `mido-mongodb-data`

### 🌐 Nginx Service (可选)
- **容器名**: `mido-nginx`
- **端口**: `80`, `443`
- **功能**: 反向代理和负载均衡
- **配置**: `nginx/default.conf`

### 📊 Mongo Express (可选)
- **容器名**: `mido-mongo-express`
- **端口**: `8081`
- **用户**: `admin` / `password123`
- **功能**: MongoDB Web管理界面

## 💻 常用命令

### 启动和停止
```bash
# 启动所有服务
docker-compose up -d

# 启动特定服务
docker-compose up -d mongodb backend

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

### 日志和调试
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f mongodb

# 查看服务状态
docker-compose ps

# 进入容器shell
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

### 构建和更新
```bash
# 重新构建镜像
docker-compose build --no-cache

# 更新服务
docker-compose pull
docker-compose up -d
```

### 数据管理
```bash
# 备份MongoDB数据
docker-compose exec mongodb mongodump --out=/backup

# 恢复MongoDB数据
docker-compose exec mongodb mongorestore /backup

# 查看数据卷
docker volume ls | grep mido
```

## 🔍 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 检查端口占用
lsof -i :10255
lsof -i :27017

# 修改端口配置
# 编辑 .env 文件中的 DOCKER_BACKEND_PORT
```

#### 2. 服务无法启动
```bash
# 查看详细日志
docker-compose logs backend

# 检查磁盘空间
df -h

# 检查Docker状态
docker system df
```

#### 3. MongoDB连接失败
```bash
# 检查MongoDB状态
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# 重启MongoDB
docker-compose restart mongodb
```

#### 4. 前端无法访问API
```bash
# 检查网络连接
docker-compose exec backend curl http://localhost:10255/health

# 检查环境变量
docker-compose exec backend env | grep API
```

### 性能优化

#### 1. 内存限制
在 `docker-compose.yml` 中添加：
```yaml
services:
  backend:
    mem_limit: 512m
  mongodb:
    mem_limit: 1g
```

#### 2. 磁盘空间清理
```bash
# 清理无用镜像
docker image prune -a

# 清理无用容器
docker container prune

# 清理无用网络
docker network prune

# 一键清理
docker system prune -a
```

## 🌐 生产部署

### 安全配置
1. **修改默认密码**
   ```env
   MONGODB_PASSWORD=your_strong_password
   JWT_SECRET=your_random_secret_key
   ```

2. **启用HTTPS**
   ```bash
   # 复制SSL证书到 ssl/ 目录
   cp your-cert.pem ssl/
   cp your-key.pem ssl/
   
   # 启动Nginx服务
   docker-compose --profile nginx up -d
   ```

3. **配置防火墙**
   ```bash
   # 只开放必要端口
   ufw allow 80
   ufw allow 443
   ufw deny 10255  # 隐藏后端端口
   ufw deny 27017  # 隐藏数据库端口
   ```

### 监控和备份
1. **定期备份**
   ```bash
   # 创建备份脚本
   #!/bin/bash
   docker-compose exec mongodb mongodump --out=/backup/$(date +%Y%m%d)
   ```

2. **日志轮转**
   ```json
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```

## 📞 技术支持

如有问题，请：
1. 查看日志：`docker-compose logs -f`
2. 检查状态：`docker-compose ps`
3. 健康检查：`curl http://localhost:10255/health`
4. 重启服务：`docker-compose restart`

---

**🎉 恭喜！米多智库已成功部署到Docker环境！** 