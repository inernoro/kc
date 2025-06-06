// 客户相关类型定义

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  level: 'S' | 'A' | 'B' | 'C';
  status: 'active' | 'inactive' | 'potential';
  priority: 'high' | 'medium' | 'low';
  region?: string;
  totalRevenue?: number;
  value: number;
  lastContact: string;
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  potentialCustomers: number;
  inactiveCustomers: number;
  totalRevenue: number;
  averageValue: number;
  monthlyGrowth: number;
}

export interface CustomerFilter {
  status?: string;
  level?: string;
  priority?: string;
  search?: string;
  region?: string;
  riskLevel?: string;
}

export interface CustomerUpdate {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  level?: Customer['level'];
  status?: Customer['status'];
  priority?: Customer['priority'];
  region?: string;
  totalRevenue?: number;
  value?: number;
  lastContact?: string;
  riskLevel?: Customer['riskLevel'];
  tags?: string[];
  avatar?: string;
}

export interface CustomerStats {
  level: Customer['level'];
  count: number;
  percentage: number;
  totalRevenue: number;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: 'contact' | 'order' | 'meeting' | 'email' | 'call';
  description: string;
  timestamp: string;
  amount?: number;
  status: 'completed' | 'pending' | 'cancelled';
} 