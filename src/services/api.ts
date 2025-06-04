// API配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10255/api';

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
  // AI对话
  chat: (message: string, context?: any) => {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
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

  // 智能知识库搜索
  searchKnowledge: (query: string, options?: {
    category?: string;
    limit?: number;
  }) => {
    return request('/ai/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        category: options?.category,
        limit: options?.limit || 10,
      }),
    });
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