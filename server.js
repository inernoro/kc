const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 导入路由
const customerRoutes = require('./routes/customers');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// 压缩中间件
app.use(compression());

// 日志中间件
app.use(morgan('combined'));

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 限制每个IP 100个请求
  message: {
    error: '请求过于频繁，请稍后再试',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});
app.use('/api/', limiter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API路由
app.use('/api/customers', customerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    code: 'NOT_FOUND',
    path: req.originalUrl
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 米多智库后端服务启动成功！`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在优雅关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在优雅关闭服务器...');
  process.exit(0);
});

module.exports = app; 