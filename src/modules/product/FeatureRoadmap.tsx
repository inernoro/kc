import React, { useState } from 'react';
import { Calendar, Flag, Users, Star, ChevronRight, Clock, CheckCircle } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'released';
  priority: 'high' | 'medium' | 'low';
  quarter: string;
  estimatedUsers: number;
  votes: number;
  tags: string[];
}

const FeatureRoadmap: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2024');

  const features: Feature[] = [
    {
      id: '1',
      title: '智能推荐系统',
      description: '基于用户行为和偏好的个性化产品推荐',
      status: 'development',
      priority: 'high',
      quarter: 'Q1 2024',
      estimatedUsers: 15000,
      votes: 234,
      tags: ['AI', '个性化', '核心功能']
    },
    {
      id: '2',
      title: '移动端优化',
      description: '提升移动端用户体验，优化页面加载速度',
      status: 'testing',
      priority: 'high',
      quarter: 'Q1 2024',
      estimatedUsers: 8000,
      votes: 156,
      tags: ['移动端', '性能', 'UX']
    },
    {
      id: '3',
      title: '高级分析仪表板',
      description: '为企业客户提供详细的数据分析和报告功能',
      status: 'planning',
      priority: 'medium',
      quarter: 'Q2 2024',
      estimatedUsers: 3000,
      votes: 89,
      tags: ['分析', '企业', '数据']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'released': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return '规划中';
      case 'development': return '开发中';
      case 'testing': return '测试中';
      case 'released': return '已发布';
      default: return '未知';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">产品路线图</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {quarters.map(quarter => (
              <option key={quarter} value={quarter}>{quarter}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {features
          .filter(feature => feature.quarter === selectedQuarter)
          .map((feature) => (
            <div key={feature.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                      {getStatusText(feature.status)}
                    </span>
                    <Flag className={`w-4 h-4 ${getPriorityColor(feature.priority)}`} />
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{feature.estimatedUsers.toLocaleString()} 预计用户</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{feature.votes} 票数</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{feature.quarter}</span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>

      {features.filter(feature => feature.quarter === selectedQuarter).length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无计划功能</h3>
          <p className="text-sm text-gray-500">该季度暂无计划中的功能</p>
        </div>
      )}
    </div>
  );
};

export default FeatureRoadmap; 