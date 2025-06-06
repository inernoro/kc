// API相关类型定义

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: any;
}

// AI相关类型
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
  recommended?: boolean;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeSearchResult {
  path: string;
  key: string;
  content: string;
  relevance: number;
}

export interface FAQResult {
  category: string;
  question: string;
  answer: string;
  relevance: number;
  index: number;
}

// 产品相关类型
export interface ProductDemand {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  urgency: 'urgent' | 'normal' | 'low';
  importance: 'important' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
}

export interface ProductProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  currentStage: string;
  manager: string;
  team: string[];
  startDate: string;
  endDate?: string;
  progress: number;
  milestones: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: string;
}

// 技术相关类型
export interface TechnicalStandard {
  id: string;
  title: string;
  category: string;
  version: string;
  status: 'draft' | 'active' | 'deprecated';
  priority: 'high' | 'medium' | 'low';
  author: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  tags: string[];
}

export interface TechnicalTask {
  id: string;
  title: string;
  type: 'bug' | 'feature' | 'improvement' | 'documentation';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  reporter: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
}

export interface TechnicalReport {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'special';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  publishedAt?: string;
  content: string;
  summary: string;
  tags: string[];
} 