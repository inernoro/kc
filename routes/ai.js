const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// AI服务配置
const AI_CONFIG = {
  url: process.env.AI_MODEL_URL,
  apiKey: process.env.AI_MODEL_API_KEY,
  modelType: process.env.AI_MODEL_TYPE || 'openai',
  timeout: 30000 // 30秒超时
};

// 支持的AI模型列表
const SUPPORTED_MODELS = {
  // SiliconFlow平台模型
  'Pro/deepseek-ai/DeepSeek-V3': {
    name: 'DeepSeek-V3 Pro',
    provider: 'SiliconFlow',
    description: 'DeepSeek最新V3版本，推理能力极强',
    maxTokens: 8000,
    contextWindow: 64000,
    recommended: true
  },
  'qwen-turbo': {
    name: 'Qwen Turbo',
    provider: 'SiliconFlow',
    description: '通义千问快速版，响应速度快',
    maxTokens: 8000,
    contextWindow: 32000
  },
  'qwen-plus': {
    name: 'Qwen Plus',
    provider: 'SiliconFlow', 
    description: '通义千问增强版，理解能力强',
    maxTokens: 8000,
    contextWindow: 32000
  },
  'qwen-max': {
    name: 'Qwen Max',
    provider: 'SiliconFlow',
    description: '通义千问旗舰版，最强性能',
    maxTokens: 8000,
    contextWindow: 32000
  },
  'deepseek-chat': {
    name: 'DeepSeek Chat',
    provider: 'SiliconFlow',
    description: 'DeepSeek对话模型，逻辑推理强',
    maxTokens: 4000,
    contextWindow: 16000
  },
  'glm-4-9b-chat': {
    name: 'GLM-4 9B',
    provider: 'SiliconFlow',
    description: '智谱GLM-4模型，中文理解优秀',
    maxTokens: 4000,
    contextWindow: 8000
  },
  'yi-34b-chat': {
    name: 'Yi-34B Chat',
    provider: 'SiliconFlow',
    description: '零一万物Yi模型，多语言支持',
    maxTokens: 4000,
    contextWindow: 4000
  },
  // OpenAI模型
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'OpenAI经典模型，性价比高',
    maxTokens: 4000,
    contextWindow: 16000
  },
  'gpt-4': {
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'OpenAI最强模型，理解能力卓越',
    maxTokens: 8000,
    contextWindow: 32000
  }
};

// 模拟对话历史存储（实际项目中应该使用数据库）
const conversationHistory = new Map();

// 酒水行业知识库
const wineIndustryKnowledge = {
  products: {
    '白酒': ['茅台', '五粮液', '剑南春', '泸州老窖', '郎酒', '水井坊'],
    '红酒': ['长城', '张裕', '王朝', '威龙', '通化'],
    '啤酒': ['青岛', '燕京', '雪花', '百威', '嘉士伯']
  },
  seasons: {
    '春节': '白酒销售旺季，礼品装需求大',
    '中秋': '月饼酒、团圆酒热销',
    '国庆': '聚会用酒需求增加',
    '夏季': '啤酒销售高峰期'
  },
  customerTypes: {
    'S级': '年采购额超过100万，VIP服务',
    'A级': '年采购额50-100万，重点客户',
    'B级': '年采购额20-50万，潜力客户',
    'C级': '年采购额20万以下，普通客户'
  }
};

// 生成AI提示词
function generatePrompt(message, customerContext, conversationContext) {
  const systemPrompt = `你是米多智库的AI助手，专门为酒水行业客户成功部门提供服务。

行业背景：
- 主营业务：白酒、红酒、啤酒等酒类产品销售
- 客户类型：酒厂、经销商、零售商等
- 关注重点：客户关系维护、销售业绩、季节性需求、库存管理

你的职责：
1. 帮助分析客户需求和行为模式
2. 提供个性化的客户服务建议
3. 协助制定销售策略和促销方案
4. 解答酒水行业相关问题
5. 整理客户信息和历史数据

回答要求：
- 专业、准确、有针对性
- 结合酒水行业特点
- 提供可操作的建议
- 语言简洁明了，条理清晰

${customerContext ? `当前客户信息：${JSON.stringify(customerContext, null, 2)}` : ''}

${conversationContext ? `对话历史：${conversationContext}` : ''}

请基于以上信息回答用户问题。`;

  return {
    system: systemPrompt,
    user: message
  };
}

// 调用大模型API
async function callAIModel(prompt, modelName = 'qwen-turbo') {
  try {
    if (!AI_CONFIG.url || !AI_CONFIG.apiKey) {
      throw new Error('AI模型配置不完整');
    }

    // 获取模型配置
    const modelConfig = SUPPORTED_MODELS[modelName] || SUPPORTED_MODELS['Pro/deepseek-ai/DeepSeek-V3'];
    
    // 构建API URL
    let apiUrl = AI_CONFIG.url;
    if (!apiUrl.includes('/chat/completions')) {
      apiUrl = apiUrl.endsWith('/') ? apiUrl + 'v1/chat/completions' : apiUrl + '/v1/chat/completions';
    }

    const requestData = {
      model: modelName,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ],
      max_tokens: Math.min(1000, modelConfig.maxTokens),
      temperature: 0.7,
      stream: false
    };

    console.log(`🤖 调用AI模型: ${modelConfig.name} (${modelName})`);

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: AI_CONFIG.timeout
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('AI响应格式异常');
    }
  } catch (error) {
    console.error('AI模型调用失败:', error.message);
    if (error.response) {
      console.error('API响应错误:', error.response.status, error.response.data);
    }
    
    // 如果AI调用失败，返回基于规则的回复
    return generateFallbackResponse(prompt.user);
  }
}

// 生成备用回复（当AI模型不可用时）
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('客户') && lowerMessage.includes('档案')) {
    return '我可以帮您查询客户档案信息。请提供客户姓名或公司名称，我将为您整理相关的客户资料、交易历史和联系记录。';
  }
  
  if (lowerMessage.includes('分析') || lowerMessage.includes('需求')) {
    return '基于酒水行业特点，我建议从以下几个维度分析客户需求：\n\n1. 季节性采购规律\n2. 产品偏好和价格敏感度\n3. 库存周转和补货频率\n4. 节假日促销响应\n5. 品质要求和服务期望\n\n请提供具体的客户信息，我可以给出更详细的分析。';
  }
  
  if (lowerMessage.includes('促销') || lowerMessage.includes('策略')) {
    return '针对酒水行业，我推荐以下促销策略：\n\n1. 节假日主题促销（春节、中秋、国庆）\n2. 季节性产品推广（夏季啤酒、冬季白酒）\n3. 客户等级差异化优惠\n4. 新品试饮和品鉴活动\n5. 批量采购折扣方案\n\n需要我为特定客户制定详细的促销计划吗？';
  }
  
  if (lowerMessage.includes('历史') || lowerMessage.includes('反馈')) {
    return '客户历史反馈分析是客户成功管理的重要环节。我可以帮您：\n\n1. 整理客户满意度评分\n2. 分析投诉和建议趋势\n3. 跟踪产品质量反馈\n4. 评估服务响应效果\n5. 识别改进机会\n\n请选择具体的客户或时间段，我将为您生成详细的反馈报告。';
  }
  
  return '我是米多智库AI助手，专门为酒水行业客户成功部门提供服务。我可以帮您：\n\n• 查询和分析客户信息\n• 制定客户服务策略\n• 提供行业洞察和建议\n• 协助处理客户问题\n• 生成业务报告\n\n请告诉我您需要什么帮助？';
}

// 生成智能建议
function generateSuggestions(message, customerContext) {
  const suggestions = [
    '查询客户档案',
    '分析客户需求',
    '制定跟进计划',
    '查看历史反馈',
    '生成客户报告',
    '制定促销方案',
    '分析销售趋势',
    '客户满意度调研',
    '产品推荐策略',
    '价格优化建议'
  ];
  
  // 根据消息内容和客户上下文智能推荐
  if (customerContext) {
    if (customerContext.level === 'S' || customerContext.level === 'A') {
      suggestions.unshift('VIP客户专属服务', '高端产品推荐');
    }
    if (customerContext.riskLevel === 'high') {
      suggestions.unshift('客户挽留策略', '问题解决方案');
    }
  }
  
  return suggestions.slice(0, 6); // 返回前6个建议
}

// 发送消息到AI
router.post('/chat', async (req, res) => {
  try {
    const { message, customerId, conversationId, model = 'qwen-turbo' } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: '消息内容不能为空',
        code: 'EMPTY_MESSAGE'
      });
    }
    
    // 获取客户上下文（如果提供了客户ID）
    let customerContext = null;
    if (customerId) {
      // 这里应该从数据库获取客户信息，现在使用模拟数据
      const mockCustomers = require('./customers').mockCustomers || [];
      customerContext = mockCustomers.find(c => c.id === customerId);
    }
    
    // 获取对话历史
    const sessionId = conversationId || uuidv4();
    let conversation = conversationHistory.get(sessionId) || [];
    
    // 构建对话上下文
    const conversationContext = conversation
      .slice(-5) // 只取最近5轮对话
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    // 生成AI提示词
    const prompt = generatePrompt(message, customerContext, conversationContext);
    
    // 调用AI模型
    const aiResponse = await callAIModel(prompt, model);
    
    // 更新对话历史
    conversation.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: aiResponse, timestamp: new Date() }
    );
    
    // 保持对话历史在合理长度内
    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
    }
    
    conversationHistory.set(sessionId, conversation);
    
    // 生成智能建议
    const suggestions = generateSuggestions(message, customerContext);
    
    res.json({
      success: true,
      data: {
        response: aiResponse,
        suggestions,
        conversationId: sessionId,
        timestamp: new Date().toISOString()
      },
      message: 'AI回复生成成功'
    });
    
  } catch (error) {
    console.error('AI聊天处理失败:', error);
    res.status(500).json({
      success: false,
      error: 'AI服务暂时不可用，请稍后重试',
      code: 'AI_SERVICE_ERROR'
    });
  }
});

// 获取对话历史
router.get('/conversations/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = conversationHistory.get(conversationId) || [];
    
    res.json({
      success: true,
      data: conversation,
      message: '对话历史获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取对话历史失败',
      code: 'FETCH_CONVERSATION_ERROR'
    });
  }
});

// 清除对话历史
router.delete('/conversations/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    conversationHistory.delete(conversationId);
    
    res.json({
      success: true,
      message: '对话历史清除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '清除对话历史失败',
      code: 'CLEAR_CONVERSATION_ERROR'
    });
  }
});

// 获取支持的AI模型列表
router.get('/models', (req, res) => {
  try {
    const models = Object.entries(SUPPORTED_MODELS).map(([key, config]) => ({
      id: key,
      name: config.name,
      provider: config.provider,
      description: config.description,
      maxTokens: config.maxTokens,
      contextWindow: config.contextWindow,
      recommended: key === 'Pro/deepseek-ai/DeepSeek-V3' // 推荐默认模型
    }));

          res.json({
        success: true,
        data: {
          models,
          defaultModel: 'Pro/deepseek-ai/DeepSeek-V3',
          total: models.length
        },
        message: 'AI模型列表获取成功'
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取AI模型列表失败',
      code: 'FETCH_MODELS_ERROR'
    });
  }
});

// 获取知识库信息
router.get('/knowledge', (req, res) => {
  try {
    const { category } = req.query;
    
    if (category && wineIndustryKnowledge[category]) {
      res.json({
        success: true,
        data: wineIndustryKnowledge[category],
        message: `${category}知识库信息获取成功`
      });
    } else {
      res.json({
        success: true,
        data: wineIndustryKnowledge,
        message: '知识库信息获取成功'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取知识库信息失败',
      code: 'FETCH_KNOWLEDGE_ERROR'
    });
  }
});

// 健康检查 - AI服务状态
router.get('/health', async (req, res) => {
  try {
    let aiStatus = 'unknown';
    let aiLatency = null;
    
    if (AI_CONFIG.url && AI_CONFIG.apiKey) {
      const startTime = Date.now();
      try {
        // 发送简单的测试请求
        await callAIModel({
          system: '你是一个AI助手',
          user: '测试连接'
        });
        aiLatency = Date.now() - startTime;
        aiStatus = 'healthy';
      } catch (error) {
        aiStatus = 'error';
      }
    } else {
      aiStatus = 'not_configured';
    }
    
    res.json({
      success: true,
      data: {
        aiService: {
          status: aiStatus,
          latency: aiLatency,
          configured: !!(AI_CONFIG.url && AI_CONFIG.apiKey)
        },
        knowledgeBase: {
          status: 'healthy',
          categories: Object.keys(wineIndustryKnowledge).length
        },
        conversations: {
          active: conversationHistory.size
        }
      },
      message: 'AI服务状态检查完成'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'AI服务状态检查失败',
      code: 'AI_HEALTH_CHECK_ERROR'
    });
  }
});

module.exports = router; 