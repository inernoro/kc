# 🐳 米多智库 - 多阶段Docker构建文件
# 支持前后端一体化部署

# =========================
# 阶段1: 前端构建
# =========================
FROM node:18-alpine AS frontend-builder

# 设置工作目录
WORKDIR /app/frontend

# 复制前端包管理文件
COPY package*.json ./

# 安装前端依赖
RUN npm ci --only=production

# 复制前端源代码
COPY src/ ./src/
COPY public/ ./public/
COPY tsconfig.json ./
COPY .env* ./

# 设置构建环境变量
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-http://backend:10255/api}

# 构建前端静态文件
RUN npm run build

# =========================
# 阶段2: 后端构建和运行时
# =========================
FROM node:18-alpine AS backend

# 设置工作目录
WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 复制后端包管理文件
COPY package*.json ./

# 安装后端依赖
RUN npm ci --only=production && npm cache clean --force

# 复制后端源代码
COPY server.js ./
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY env.example ./.env

# 复制前端构建产物（从第一阶段）
COPY --from=frontend-builder /app/frontend/build ./public

# 修改文件权限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 10255

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:10255/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# 启动命令
CMD ["node", "server.js"] 