import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Star, Target } from 'lucide-react';

const PerformanceMetrics: React.FC = () => {
  const metrics = [
    {
      title: '月度收入',
      value: '¥1,250,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: '活跃客户',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: '客户满意度',
      value: '4.7/5.0',
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: '续约成功率',
      value: '85%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">性能指标</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics; 