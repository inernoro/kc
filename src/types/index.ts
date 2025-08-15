// 统一导出所有类型定义

// 客户相关类型
export type {
  Customer,
  CustomerAnalytics,
  CustomerFilter,
  CustomerUpdate,
  CustomerStats,
  CustomerActivity
} from './customer';

// API相关类型
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  AIMessage,
  AIModel,
  AIConversation,
  KnowledgeSearchResult,
  FAQResult,
  ProductDemand,
  ProductProject,
  ProjectMilestone,
  TechnicalStandard,
  TechnicalTask,
  TechnicalReport
} from './api';

// 通用UI类型
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  width?: number;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
  href?: string;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 统计数据类型
export interface MetricCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

// 表单相关类型
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

// ModuleManager 相关类型
export interface ModuleConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  position: 'left' | 'center' | 'right';
  icon?: React.ComponentType<any>;
  color?: string;
  bgColor?: string;
  props?: any;
}

export interface DepartmentConfig {
  id: string;
  name: string;
  modules: ModuleConfig[];
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  topBarInfo?: {
    title: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
      icon: React.ComponentType<any>;
      trend?: 'up' | 'down' | 'stable';
    }>;
  };
}

export interface ModuleManagerProps {
  currentDepartment: string;
  onCustomerSelect?: (customer: any) => void;
  selectedCustomer?: any;
  customerSuccessMode?: 'normal' | 'assessment';
}

export interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  speciality: string;
  description: string;
  capabilities: string[];
  experience: string;
  responseStyle: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  completedTasks: number;
  category?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
} 