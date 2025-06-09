// API配置 - 从环境变量读取
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:10255/api';

// 通用请求函数
const request = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 产品相关API
export const productAPI = {
  // 获取产品需求列表
  getDemands: (params?: {
    status?: string;
    priority?: string;
    urgency?: string;
    importance?: string;
  }) => {
    const searchParams = new URLSearchParams(params as any);
    return request(`/products/demands?${searchParams}`);
  },

  // 获取单个需求详情
  getDemand: (id: string) => {
    return request(`/products/demands/${id}`);
  },

  // 获取产品项目列表
  getProjects: (params?: {
    status?: string;
    currentStage?: string;
    manager?: string;
  }) => {
    const searchParams = new URLSearchParams(params as any);
    return request(`/products/projects?${searchParams}`);
  },

  // 获取单个项目详情
  getProject: (id: string) => {
    return request(`/products/projects/${id}`);
  },

  // 获取四象限统计数据
  getQuadrantStats: () => {
    return request('/products/demands/stats/quadrant');
  },
};

// 技术相关API
export const technicalAPI = {
  // 获取技术规范列表
  getStandards: (params?: {
    category?: string;
    status?: string;
    priority?: string;
  }) => {
    const searchParams = new URLSearchParams(params as any);
    return request(`/technical/standards?${searchParams}`);
  },

  // 获取单个技术规范详情
  getStandard: (id: string) => {
    return request(`/technical/standards/${id}`);
  },

  // 获取技术任务列表
  getTasks: (params?: {
    type?: string;
    status?: string;
    priority?: string;
    assignee?: string;
  }) => {
    const searchParams = new URLSearchParams(params as any);
    return request(`/technical/tasks?${searchParams}`);
  },

  // 获取技术简报列表
  getReports: (params?: {
    type?: string;
    status?: string;
    author?: string;
  }) => {
    const searchParams = new URLSearchParams(params as any);
    return request(`/technical/reports?${searchParams}`);
  },
};

// 客户相关API
export const customerAPI = {
  // 获取客户列表
  getCustomers: (params?: {
    status?: string;
    level?: string;
    priority?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams(params as any);
    return request(`/customers?${searchParams}`);
  },

  // 获取单个客户详情
  getCustomer: (id: string) => {
    return request(`/customers/${id}`);
  },
};

// 分析数据API
export const analyticsAPI = {
  // 获取分析数据
  getAnalytics: () => {
    return request('/analytics');
  },
};

// AI相关API
export const aiAPI = {
  // AI对话（普通模式）
  chat: (params: {
    message: string;
    conversationId?: string;
    knowledgeBase?: string;
    customerId?: string;
  } | string, context?: any) => {
    // 兼容旧的调用方式（传入字符串）和新的调用方式（传入对象）
    if (typeof params === 'string') {
      return request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: params, context }),
      });
    } else {
      return request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    }
  },

  // AI对话（流式模式）- 按照OpenAI标准实现
  chatStream: async (params: {
    message: string;
    conversationId?: string;
    knowledgeBase?: string;
    customerId?: string;
  }, onMessage: (data: any) => void, onError?: (error: any) => void, onComplete?: () => void) => {
    try {
      console.log('🚀 开始流式请求:', params);
      
      // 发送流式请求
      const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`流式请求失败: HTTP ${response.status}`);
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      console.log('📡 响应类型:', contentType);
      
      if (contentType && contentType.includes('text/event-stream')) {
        // 处理真正的流式响应
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('无法获取响应流读取器');
        }

        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        
        console.log('📖 开始读取流数据');
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('✅ 流读取完成');
              onComplete?.();
              break;
            }
            
            // 处理接收到的数据块
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop() || ''; // 保留不完整的事件

            for (const event of events) {
              const trimmedLine = event.trim();
              if (trimmedLine.startsWith('data:')) {
                const dataStr = trimmedLine.slice(5).trim();
                
                if (dataStr) {
                  try {
                    const data = JSON.parse(dataStr);
                    console.log('📦 收到流数据:', data);
                    
                    onMessage(data);
                    
                    // 检查是否完成或出错
                    if (data.type === 'done' || data.type === 'error') {
                      console.log('🎯 流处理完成，类型:', data.type);
                      onComplete?.();
                      return;
                    }
                  } catch (parseError) {
                    console.warn('⚠️ 解析SSE数据失败:', parseError, '原始数据:', dataStr);
                    // 继续处理其他数据，不因解析错误而中断
                  }
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // 不是流式响应，降级到普通模式
        console.log('🔄 非流式响应，降级到普通模式');
        const normalResponse = await request('/ai/chat', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        
        // 模拟流式输出效果
        onMessage({ type: 'start', conversationId: params.conversationId });
        
        if (normalResponse.data?.response) {
          // 模拟逐字输出效果
          const text = normalResponse.data.response;
          let currentText = '';
          
          for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            onMessage({ 
              type: 'delta', 
              content: text[i],
              timestamp: new Date().toISOString()
            });
            
            // 添加小延迟模拟流式输出
            if (i % 5 === 0) {
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }
          
          onMessage({ 
            type: 'done',
            fullResponse: text,
            suggestions: normalResponse.data.suggestions,
            timestamp: new Date().toISOString()
          });
        }
        
        onComplete?.();
      }
    } catch (error) {
      console.error('❌ 流式请求失败:', error);
      
      try {
        // 最后的降级方案：普通模式
        console.log('🔄 最终降级到普通模式');
        const normalResponse = await request('/ai/chat', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        
        onMessage({ type: 'start', conversationId: params.conversationId });
        
        if (normalResponse.data?.response) {
          onMessage({ 
            type: 'fallback', 
            content: normalResponse.data.response,
            suggestions: normalResponse.data.suggestions,
            timestamp: new Date().toISOString()
          });
        }
        
        onComplete?.();
      } catch (fallbackError) {
        console.error('❌ 普通模式也失败了:', fallbackError);
        onError?.(fallbackError);
      }
    }
  },

  // 获取AI模型列表
  getModels: () => {
    return request('/ai/models');
  },

  // 获取对话历史
  getConversation: (conversationId: string) => {
    return request(`/ai/conversations/${conversationId}`);
  },

  // 清除对话历史
  clearConversation: (conversationId: string) => {
    return request(`/ai/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },

  // 获取知识库信息
  getKnowledge: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return request(`/ai/knowledge${params}`);
  },

  // 智能知识库搜索 - 支持两种调用方式
  searchKnowledge: (params: {
    query: string;
    knowledgeType: string;
    customerId?: string;
    limit?: number;
  } | string, options?: {
    category?: string;
    limit?: number;
  }) => {
    // 新的调用方式（传入对象）
    if (typeof params === 'object') {
      return request('/ai/knowledge/search', {
        method: 'POST',
        body: JSON.stringify({
          query: params.query,
          category: params.knowledgeType,
          customerId: params.customerId,
          limit: params.limit || 10,
        }),
      });
    } else {
      // 兼容旧的调用方式（传入字符串）
      return request('/ai/knowledge/search', {
        method: 'POST',
        body: JSON.stringify({
          query: params,
          category: options?.category,
          limit: options?.limit || 10,
        }),
      });
    }
  },

  // 获取知识库统计信息
  getKnowledgeStats: () => {
    return request('/ai/knowledge/stats');
  },

  // FAQ智能问答
  askFAQ: (question: string, category?: string) => {
    return request('/ai/knowledge/faq', {
      method: 'POST',
      body: JSON.stringify({
        question,
        category,
      }),
    });
  },

  // AI服务健康检查
  healthCheck: () => {
    return request('/ai/health');
  },
}; 