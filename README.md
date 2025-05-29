# 米多智库后端API服务

酒水行业客户成功管理系统的后端服务，提供AI对话、客户管理、数据分析等功能。

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量示例文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，配置必要的环境变量：

```env
# 服务器配置
PORT=3001
NODE_ENV=development

# CORS配置
FRONTEND_URL=http://localhost:3000

# AI大模型配置（重要：需要您提供）
AI_MODEL_URL=your_ai_model_url_here
AI_MODEL_API_KEY=your_api_key_here
AI_MODEL_TYPE=openai

# 安全配置
JWT_SECRET=your_jwt_secret_here
```

### 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务启动后访问：http://localhost:3001

## 📡 API接口文档

### 基础信息

- 基础URL: `http://localhost:3001/api`
- 响应格式: JSON
- 字符编码: UTF-8

### 通用响应格式

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "code": "SUCCESS"
}
```

### 客户管理 API

#### 获取客户列表
```
GET /api/customers
```

查询参数：
- `status`: 客户状态 (active/potential/inactive)
- `level`: 客户级别 (S/A/B/C)
- `priority`: 优先级 (high/medium/low)
- `search`: 搜索关键词

#### 获取客户详情
```
GET /api/customers/:id
```

#### 更新客户信息
```
PUT /api/customers/:id
```

#### 获取客户活动记录
```
GET /api/customers/:id/activities
```

#### 添加客户活动记录
```
POST /api/customers/:id/activities
```

### AI对话 API

#### 发送消息
```
POST /api/ai/chat
```

请求体：
```json
{
  "message": "用户消息内容",
  "customerId": "客户ID（可选）",
  "conversationId": "对话ID（可选）"
}
```

#### 获取对话历史
```
GET /api/ai/conversations/:conversationId
```

#### 清除对话历史
```
DELETE /api/ai/conversations/:conversationId
```

#### 获取知识库信息
```
GET /api/ai/knowledge?category=products
```

### 数据分析 API

#### 获取全局指标
```
GET /api/analytics/metrics
```

#### 获取续约提醒
```
GET /api/analytics/renewals
```

#### 获取销售趋势
```
GET /api/analytics/sales-trends?period=monthly
```

#### 获取客户细分数据
```
GET /api/analytics/customer-segmentation
```

#### 生成客户报告
```
POST /api/analytics/reports/customer/:customerId
```

### 健康检查

#### 服务健康状态
```
GET /health
```

#### AI服务状态
```
GET /api/ai/health
```

## 🔧 配置说明

### AI大模型配置

系统支持多种AI模型，需要在环境变量中配置：

1. **OpenAI GPT系列**
   ```env
   AI_MODEL_URL=https://api.openai.com/v1/chat/completions
   AI_MODEL_API_KEY=sk-your-openai-api-key
   AI_MODEL_TYPE=openai
   ```

2. **其他兼容OpenAI API的模型**
   ```env
   AI_MODEL_URL=your_model_endpoint
   AI_MODEL_API_KEY=your_api_key
   AI_MODEL_TYPE=openai
   ```

### 安全配置

- `JWT_SECRET`: JWT令牌签名密钥，建议使用强随机字符串
- `RATE_LIMIT_*`: API请求频率限制配置

## 🏗️ 项目结构

```
backend/
├── server.js              # 主服务器文件
├── package.json           # 项目配置
├── env.example            # 环境变量示例
├── routes/                # 路由文件
│   ├── customers.js       # 客户管理路由
│   ├── ai.js             # AI对话路由
│   └── analytics.js      # 数据分析路由
├── middleware/           # 中间件
│   └── auth.js          # 认证中间件
└── README.md            # 项目文档
```

## 🔌 与前端集成

### CORS配置

后端已配置CORS支持，默认允许来自 `http://localhost:3000` 的请求。

### 前端调用示例

```javascript
// 发送AI消息
const response = await fetch('http://localhost:3001/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: '查询客户档案',
    customerId: '1'
  })
});

const data = await response.json();
```

## 🚦 开发指南

### 添加新的API端点

1. 在相应的路由文件中添加新路由
2. 实现业务逻辑
3. 添加错误处理
4. 更新API文档

### 错误处理

所有API都使用统一的错误响应格式：

```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

### 日志记录

系统使用Morgan中间件记录HTTP请求日志，开发环境下会显示详细的请求信息。

## 📊 性能优化

- 使用compression中间件进行响应压缩
- 实现API请求频率限制
- 支持HTTP缓存头
- 异步处理大数据量操作

## 🔒 安全特性

- Helmet安全头设置
- CORS跨域保护
- 请求频率限制
- JWT身份认证
- 输入验证和清理

## 🐛 故障排除

### 常见问题

1. **AI模型调用失败**
   - 检查AI_MODEL_URL和AI_MODEL_API_KEY配置
   - 确认网络连接正常
   - 查看控制台错误日志

2. **CORS错误**
   - 检查FRONTEND_URL配置
   - 确认前端请求地址正确

3. **端口占用**
   - 修改PORT环境变量
   - 或停止占用端口的其他服务

### 日志查看

开发模式下，所有请求和错误都会在控制台显示。生产环境建议配置专业的日志系统。

## 📝 更新日志

### v1.0.0 (2024-01-25)
- 初始版本发布
- 实现客户管理API
- 实现AI对话功能
- 实现数据分析API
- 添加安全中间件

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 📞 技术支持

如有问题，请联系米多智库技术团队。 