# 🤖 AI和知识库API完整使用指南

## 📋 目录
- [概述](#概述)
- [大模型API](#大模型api)
- [知识库API](#知识库api)
- [前端调用示例](#前端调用示例)
- [高级功能](#高级功能)
- [最佳实践](#最佳实践)

## 🎯 概述

米多智库系统集成了强大的AI大模型和知识库功能，支持智能对话、知识搜索、FAQ问答等多种场景。

### 🔧 技术架构
- **后端API**：`routes/ai.js`
- **前端服务**：`src/services/api.ts`
- **AI模型**：SiliconFlow平台（DeepSeek-V3、Qwen系列等）
- **知识库**：内存存储 + 向量搜索

## 🤖 大模型API

### 1. AI对话 - `/api/ai/chat`

**基础对话**
```javascript
// 前端调用
const response = await aiAPI.chat("帮我分析客户需求");

// 请求体
{
  "message": "帮我分析客户需求",
  "customerId": "123",        // 可选，关联客户上下文
  "conversationId": "uuid",   // 可选，维护对话历史
  "model": "Pro/deepseek-ai/DeepSeek-V3"  // 可选，指定模型
}

// 响应
{
  "success": true,
  "data": {
    "response": "AI回复内容",
    "suggestions": ["建议1", "建议2"],
    "conversationId": "uuid",
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

**支持的AI模型**
```javascript
// 获取模型列表
const models = await aiAPI.getModels();

// 可用模型
{
  "Pro/deepseek-ai/DeepSeek-V3": "最强推理能力",
  "qwen-turbo": "快速响应",
  "qwen-plus": "理解能力强", 
  "qwen-max": "旗舰版性能",
  "deepseek-chat": "逻辑推理强",
  "glm-4-9b-chat": "中文理解优秀"
}
```

### 2. 对话管理

**获取对话历史**
```javascript
const history = await aiAPI.getConversation("conversation-id");
```

**清除对话历史**
```javascript
await aiAPI.clearConversation("conversation-id");
```

## 🧠 知识库API

### 1. 基础知识查询 - `/api/ai/knowledge`

```javascript
// 获取所有知识库
const allKnowledge = await aiAPI.getKnowledge();

// 获取特定分类
const products = await aiAPI.getKnowledge("products");
const strategies = await aiAPI.getKnowledge("salesStrategies");
```

**知识库结构**
```javascript
{
  "products": {
    "白酒": ["茅台", "五粮液", "剑南春"],
    "红酒": ["长城", "张裕", "王朝"],
    "啤酒": ["青岛", "燕京", "雪花"]
  },
  "salesStrategies": {
    "高端白酒": {
      "target": "S级、A级客户",
      "approach": "礼品包装、限量版、品牌故事营销"
    }
  },
  "technicalDocs": {
    "API接口": {
      "AI对话": "/api/ai/chat - 发送消息到AI模型"
    }
  },
  "faq": {
    "客户管理": [
      {
        "question": "如何升级客户等级？",
        "answer": "根据年采购额调整..."
      }
    ]
  }
}
```

### 2. 智能搜索 - `/api/ai/knowledge/search`

```javascript
// 全局搜索
const results = await aiAPI.searchKnowledge("客户等级升级");

// 分类搜索
const results = await aiAPI.searchKnowledge("白酒销售", {
  category: "salesStrategies",
  limit: 5
});

// 响应格式
{
  "success": true,
  "data": {
    "query": "客户等级升级",
    "results": [
      {
        "path": "faq.客户管理",
        "key": "如何升级客户等级？",
        "content": "根据年采购额调整...",
        "relevance": 3
      }
    ],
    "total": 10,
    "returned": 5
  }
}
```

### 3. FAQ智能问答 - `/api/ai/knowledge/faq`

```javascript
// FAQ搜索
const faqResults = await aiAPI.askFAQ("怎么提升客户级别");

// 分类FAQ搜索
const faqResults = await aiAPI.askFAQ("季节性销售", "产品销售");

// 响应格式
{
  "success": true,
  "data": {
    "question": "怎么提升客户级别",
    "matches": [
      {
        "category": "客户管理",
        "question": "如何升级客户等级？",
        "answer": "根据年采购额调整...",
        "relevance": 2
      }
    ],
    "total": 3
  }
}
```

### 4. 知识库统计 - `/api/ai/knowledge/stats`

```javascript
const stats = await aiAPI.getKnowledgeStats();

// 响应格式
{
  "totalCategories": 5,
  "categories": {
    "products": {
      "type": "object",
      "count": 3,
      "keys": ["白酒", "红酒", "啤酒"]
    },
    "faq": {
      "type": "object", 
      "count": 2,
      "keys": ["客户管理", "产品销售"]
    }
  },
  "lastUpdated": "2024-01-25T10:30:00.000Z"
}
```

## 💻 前端调用示例

### React组件中使用

```typescript
import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';

const KnowledgeSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await aiAPI.searchKnowledge(query, {
        limit: 10
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="knowledge-search">
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索知识库..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>
      
      <div className="search-results">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <h4>{result.key}</h4>
            <p>{result.content}</p>
            <small>路径: {result.path} | 相关性: {result.relevance}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### AI对话组件

```typescript
const AIChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [conversationId, setConversationId] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await aiAPI.chat(message, {
        conversationId,
        customerId: selectedCustomer?.id
      });

      setConversation(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: response.data.response }
      ]);
      
      setConversationId(response.data.conversationId);
      setMessage('');
    } catch (error) {
      console.error('AI对话失败:', error);
    }
  };

  return (
    <div className="ai-chat">
      <div className="conversation">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  );
};
```

## 🚀 高级功能

### 1. 自定义AI提示词

在`routes/ai.js`中的`generatePrompt`函数可以自定义AI行为：

```javascript
function generatePrompt(message, customerContext, conversationContext) {
  const systemPrompt = `你是米多智库的AI助手，专门为酒水行业客户成功部门提供服务。

行业背景：
- 主营业务：白酒、红酒、啤酒等酒类产品销售
- 客户类型：酒厂、经销商、零售商等

你的职责：
1. 帮助分析客户需求和行为模式
2. 提供个性化的客户服务建议
3. 协助制定销售策略和促销方案

${customerContext ? `当前客户信息：${JSON.stringify(customerContext)}` : ''}
${conversationContext ? `对话历史：${conversationContext}` : ''}`;

  return { system: systemPrompt, user: message };
}
```

### 2. 向量搜索优化

当前实现了简单的关键词匹配，可以升级为真正的向量搜索：

```javascript
// 集成向量数据库示例（如Pinecone、Weaviate等）
const vectorSearch = {
  async embedding(text) {
    // 调用embedding模型生成向量
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
    return response.data[0].embedding;
  },
  
  async search(query, topK = 10) {
    const queryVector = await this.embedding(query);
    // 在向量数据库中搜索相似向量
    return await vectorDB.query({
      vector: queryVector,
      topK,
      includeMetadata: true
    });
  }
};
```

### 3. 知识库扩展

```javascript
// 动态添加知识库内容
router.post('/knowledge/add', (req, res) => {
  const { category, key, content } = req.body;
  
  if (!wineIndustryKnowledge[category]) {
    wineIndustryKnowledge[category] = {};
  }
  
  wineIndustryKnowledge[category][key] = content;
  
  res.json({
    success: true,
    message: '知识库内容添加成功'
  });
});
```

## 🛡️ 最佳实践

### 1. 错误处理

```javascript
const handleAICall = async (message) => {
  try {
    const response = await aiAPI.chat(message);
    return response.data;
  } catch (error) {
    console.error('AI调用失败:', error);
    
    // 降级策略
    return {
      response: '抱歉，AI服务暂时不可用，请稍后重试',
      suggestions: []
    };
  }
};
```

### 2. 性能优化

```javascript
// 缓存频繁查询的知识库内容
const knowledgeCache = new Map();

const getCachedKnowledge = async (category) => {
  if (knowledgeCache.has(category)) {
    return knowledgeCache.get(category);
  }
  
  const data = await aiAPI.getKnowledge(category);
  knowledgeCache.set(category, data);
  
  // 设置缓存过期
  setTimeout(() => {
    knowledgeCache.delete(category);
  }, 5 * 60 * 1000); // 5分钟过期
  
  return data;
};
```

### 3. 安全配置

在`env.example`中配置API密钥：

```env
# AI大模型配置
AI_MODEL_URL=https://api.siliconflow.cn
AI_MODEL_API_KEY=sk-your-api-key-here
AI_MODEL_TYPE=openai
DEFAULT_AI_MODEL=Pro/deepseek-ai/DeepSeek-V3

# 安全配置
JWT_SECRET=your_jwt_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. 监控和日志

```javascript
// 添加API调用监控
const logAIUsage = (model, tokens, latency) => {
  console.log(`AI调用统计:`, {
    model,
    tokens,
    latency: `${latency}ms`,
    timestamp: new Date().toISOString()
  });
};
```

## 🔮 未来扩展

1. **数据库集成**：将知识库迁移到MongoDB
2. **向量搜索**：集成专业向量数据库
3. **多模态支持**：支持图片、文档等多种格式
4. **个性化推荐**：基于用户行为的智能推荐
5. **实时学习**：根据用户反馈优化AI回复

## 📞 技术支持

如有问题，请查看：
- 后端API文档：`README.md`
- 错误日志：控制台输出
- 健康检查：`GET /api/ai/health` 