import React, { useState, useEffect } from 'react';
import { ChevronDown, Bell, Settings, User, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

interface HeaderProps {
  currentDepartment: string;
  onDepartmentChange: (department: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentDepartment, onDepartmentChange }) => {
  const departments = [
    '客户成功部',
    '销售部',
    '技术支持部',
    '市场部',
    '产品部'
  ];

  // 全局指标数据
  const globalMetrics = [
    { label: '今日沟通客户', value: '18', icon: Users, color: 'text-blue-600' },
    { label: '本月收入', value: '¥2,350,000', icon: DollarSign, color: 'text-green-600' },
    { label: '本月业绩回款还剩', value: '¥850,000', icon: TrendingUp, color: 'text-orange-600' },
  ];

  // 续约提醒数据
  const renewalReminders = [
    { customer: '茅台酒业集团', days: 7, value: '¥1,500,000' },
    { customer: '五粮液销售公司', days: 15, value: '¥800,000' },
    { customer: '剑南春酒厂', days: 23, value: '¥650,000' },
    { customer: '泸州老窖股份', days: 30, value: '¥920,000' },
  ];

  const [currentRenewalIndex, setCurrentRenewalIndex] = useState(0);

  // 滚动播放续约提醒
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRenewalIndex((prev) => (prev + 1) % renewalReminders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [renewalReminders.length]);

  return (
    <div className="bg-white border-b border-gray-200">
      {/* 全局指标栏 */}
      <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {globalMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg bg-white shadow-sm ${metric.color}`}>
                  <metric.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{metric.label}</p>
                  <p className={`text-sm font-semibold ${metric.color}`}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 滚动续约提醒 */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-200">
            <Calendar className="w-4 h-4 text-orange-500" />
            <div className="text-sm">
              <span className="text-gray-600">续约提醒：</span>
              <span className="font-medium text-gray-900 ml-1">
                {renewalReminders[currentRenewalIndex].customer}
              </span>
              <span className="text-orange-600 ml-1">
                ({renewalReminders[currentRenewalIndex].days}天后到期)
              </span>
              <span className="text-green-600 ml-1">
                {renewalReminders[currentRenewalIndex].value}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 原有的导航栏 */}
      <header className="h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">米多智库</h1>
        </div>
        
        <div className="relative">
          <select 
            value={currentDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">田曦薇</span>
        </div>
      </div>
      </header>
    </div>
  );
};

export default Header; 