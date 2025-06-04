const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 环境变量配置
const PORT = process.env.PORT || 10255;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:10256';
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// 安全中间件
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// CORS配置 - 从环境变量读取
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求压缩
app.use(compression());

// 请求日志
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API频率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 限制每个IP 100次请求
  message: {
    success: false,
    error: '请求过于频繁，请稍后重试',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

app.use('/api', limiter);

// 路由配置
app.use('/api/customers', require('./routes/customers'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/products', require('./routes/products'));
app.use('/api/technical', require('./routes/technical'));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: '米多智库后端API',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      version: '1.0.0',
      endpoints: {
        backend: API_BASE_URL,
        frontend: FRONTEND_URL,
        api: `${API_BASE_URL}/api`
      }
    },
    message: '服务运行正常'
  });
});

// 根路径信息
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: '米多智库 - 后端API服务',
      description: '酒水行业客户成功管理系统',
      version: '1.0.0',
      environment: NODE_ENV,
      endpoints: {
        health: '/health',
        api: '/api',
        docs: '/api-docs'
      },
      services: {
        customers: '/api/customers',
        ai: '/api/ai',
        analytics: '/api/analytics',
        products: '/api/products',
        technical: '/api/technical'
      }
    },
    message: '欢迎使用米多智库API服务'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    code: 'ENDPOINT_NOT_FOUND',
    path: req.originalUrl
  });
});

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: NODE_ENV === 'development' ? error.message : '服务器内部错误',
    code: error.code || 'INTERNAL_SERVER_ERROR',
    ...(NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 优雅关闭处理
const gracefulShutdown = (signal) => {
  console.log(`\n收到${signal}信号，正在优雅关闭服务器...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 米多智库后端服务启动成功！');
  console.log(`📡 服务地址: ${API_BASE_URL}`);
  console.log(`🌐 前端地址: ${FRONTEND_URL}`);
  console.log(`🌍 环境: ${NODE_ENV}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
  
  if (NODE_ENV === 'development') {
    console.log('\n📋 可用接口:');
    console.log(`   健康检查: ${API_BASE_URL}/health`);
    console.log(`   客户管理: ${API_BASE_URL}/api/customers`);
    console.log(`   AI服务: ${API_BASE_URL}/api/ai`);
    console.log(`   数据分析: ${API_BASE_URL}/api/analytics`);
    console.log(`   产品管理: ${API_BASE_URL}/api/products`);
    console.log(`   技术文档: ${API_BASE_URL}/api/technical`);
  }
});

module.exports = app; 