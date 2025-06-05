import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  FileText, 
  Database, 
  TrendingUp, 
  Clock, 
  Star,
  Filter,
  Plus
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive' | 'potential';
  lastContact: string;
  priority: 'high' | 'medium' | 'low';
  value: number;
  level: 'S' | 'A' | 'B' | 'C';
}

interface SidebarProps {
  onCustomerSelect: (customer: Customer) => void;
  selectedCustomer: Customer | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onCustomerSelect, selectedCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');

  const quickActions = [
    { icon: Users, label: '客户档案查询', color: 'bg-blue-500', action: () => setActiveTab('customers') },
    { icon: FileText, label: '知识库搜索', color: 'bg-green-500', action: () => setActiveTab('knowledge') },
    { icon: Database, label: '历史记录', color: 'bg-purple-500', action: () => setActiveTab('history') },
    { icon: TrendingUp, label: '成交分析', color: 'bg-orange-500', action: () => setActiveTab('analytics') },
  ];

  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: '李明',
      company: '茅台酒业集团',
      status: 'active',
      lastContact: '2024-01-15',
      priority: 'high',
      value: 1500000,
      level: 'S'
    },
    {
      id: '2',
      name: '王小红',
      company: '五粮液销售公司',
      status: 'potential',
      lastContact: '2024-01-14',
      priority: 'medium',
      value: 800000,
      level: 'A'
    },
    {
      id: '3',
      name: '张伟',
      company: '剑南春酒厂',
      status: 'active',
      lastContact: '2024-01-13',
      priority: 'high',
      value: 650000,
      level: 'S'
    },
    {
      id: '4',
      name: '刘芳',
      company: '泸州老窖股份',
      status: 'inactive',
      lastContact: '2024-01-10',
      priority: 'low',
      value: 920000,
      level: 'C'
    }
  ];

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'potential': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-3 h-3 text-red-500 fill-current" />;
      case 'medium': return <Star className="w-3 h-3 text-yellow-500 fill-current" />;
      case 'low': return <Star className="w-3 h-3 text-gray-400" />;
      default: return null;
    }
  };

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'S': 
        return {
          badge: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse',
          border: 'border-yellow-400 shadow-yellow-200',
          glow: 'shadow-lg shadow-yellow-200/50'
        };
      case 'A': 
        return {
          badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md',
          border: 'border-purple-400 shadow-purple-200',
          glow: 'shadow-md shadow-purple-200/30'
        };
      case 'B': 
        return {
          badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
          border: 'border-blue-400',
          glow: 'shadow-sm shadow-blue-200/20'
        };
      case 'C': 
        return {
          badge: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
          border: 'border-gray-300',
          glow: ''
        };
      default: 
        return {
          badge: 'bg-gray-400 text-white',
          border: 'border-gray-300',
          glow: ''
        };
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 快速操作区域 */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
            >
                              <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2 transition-colors`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户或公司..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
          <button className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700">
            <Plus className="w-4 h-4" />
            <span>新建</span>
          </button>
        </div>
      </div>

      {/* 客户列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {activeTab === 'customers' ? '客户列表' : 
               activeTab === 'knowledge' ? '知识库' :
               activeTab === 'history' ? '历史记录' : 
               activeTab === 'analytics' ? '成交分析' : '客户列表'}
            </h3>
            <span className="text-xs text-gray-500">{filteredCustomers.length} 个客户</span>
          </div>
          
          <div className="space-y-2">
            {filteredCustomers.map((customer) => {
              const levelStyle = getLevelStyle(customer.level);
              return (
                <div
                  key={customer.id}
                  onClick={() => onCustomerSelect(customer)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all relative ${levelStyle.glow} ${
                    selectedCustomer?.id === customer.id
                      ? `${levelStyle.border} bg-primary-50`
                      : `border-gray-200 hover:${levelStyle.border} hover:bg-gray-50`
                  }`}
                >
                {/* 级别徽章 */}
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${levelStyle.badge}`}>
                  {customer.level}
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {customer.name}
                      </h4>
                      {getPriorityIcon(customer.priority)}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{customer.company}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status === 'active' ? '活跃' : customer.status === 'potential' ? '潜在' : '非活跃'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{customer.lastContact}</span>
                  </div>
                  <span className="font-medium">¥{customer.value.toLocaleString()}</span>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 