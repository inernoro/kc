import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Settings, User, TrendingUp, Users, DollarSign, Calendar, Code, GitBranch, Bug, Star, Package, Activity, Palette, Megaphone, Award, Layers, Zap, Target } from 'lucide-react';

interface HeaderProps {
  currentDepartment: string;
  onDepartmentChange: (department: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentDepartment, onDepartmentChange }) => {
  // 动画控制状态
  const [displayContent, setDisplayContent] = useState(currentDepartment);
  const [isVisible, setIsVisible] = useState(true);
  
  // 部门配置，真正的Mac风格
  const departments = [
    {
      id: '客户成功部',
      name: '客户成功部',
      shortName: '客户成功',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: '品牌域',
      name: '品牌域',
      shortName: '品牌域',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: '基础研发部',
      name: '基础研发部',
      shortName: '基础研发',
      icon: Palette,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  // 根据部门动态配置指标数据
  const departmentMetrics = useMemo(() => {
    switch (displayContent) {
      case '客户成功部':
        return {
          metrics: [
            { label: '今日沟通客户', value: '18', icon: Users, color: 'text-blue-600' },
            { label: '本月收入', value: '¥2,350,000', icon: DollarSign, color: 'text-green-600' },
            { label: '本月业绩回款还剩', value: '¥850,000', icon: TrendingUp, color: 'text-orange-600' },
          ],
          reminders: [
            { customer: '茅台酒业集团', days: 7, value: '¥1,500,000', type: '续约提醒' },
            { customer: '五粮液销售公司', days: 15, value: '¥800,000', type: '续约提醒' },
            { customer: '剑南春酒厂', days: 23, value: '¥650,000', type: '续约提醒' },
            { customer: '泸州老窖股份', days: 30, value: '¥920,000', type: '续约提醒' },
          ]
        };
      
      case '品牌域':
        return {
          metrics: [
            { label: '今日代码提交', value: '47', icon: Code, color: 'text-purple-600' },
            { label: '开发进度', value: '78.3%', icon: Target, color: 'text-green-600' },
            { label: '待修复Bug', value: '12', icon: Bug, color: 'text-red-600' },
          ],
          reminders: [
            { customer: 'N元换购非明文兑奖模式', days: 3, value: 'v2.1版本', type: '产品发布' },
            { customer: '皇沟酒业智能营销策略', days: 7, value: '功能优化', type: '开发完成' },
            { customer: '核销管理明细报销', days: 12, value: 'UI重构', type: '设计评审' },
            { customer: '小程序富文本兼容', days: 18, value: '响应式布局', type: '测试上线' },
          ]
        };
      
      case '基础研发部':
        return {
          metrics: [
            { label: '技术规范文档', value: '23', icon: Code, color: 'text-green-600' },
            { label: '代码质量评分', value: '92.5%', icon: Star, color: 'text-blue-600' },
            { label: '架构债务处理', value: '8', icon: Bug, color: 'text-orange-600' },
          ],
          reminders: [
            { customer: '前端开发规范V3.2', days: 5, value: '规范评审', type: '规范制定' },
            { customer: 'API接口标准化', days: 8, value: '标准化改造', type: '架构优化' },
            { customer: '代码质量检查工具', days: 12, value: '工具升级', type: '工具建设' },
            { customer: '技术分享培训会', days: 15, value: 'React18新特性', type: '知识分享' },
          ]
        };
      
      default:
        return {
          metrics: [
            { label: '今日沟通客户', value: '18', icon: Users, color: 'text-blue-600' },
            { label: '本月收入', value: '¥2,350,000', icon: DollarSign, color: 'text-green-600' },
            { label: '本月业绩回款还剩', value: '¥850,000', icon: TrendingUp, color: 'text-orange-600' },
          ],
          reminders: []
        };
    }
  }, [displayContent]);

  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);

  // 滚动播放提醒
  useEffect(() => {
    if (departmentMetrics.reminders.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentReminderIndex((prev) => (prev + 1) % departmentMetrics.reminders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [departmentMetrics.reminders.length]);

  // 重置提醒索引当部门改变时
  useEffect(() => {
    setCurrentReminderIndex(0);
  }, [currentDepartment]);

  // 部门切换时的过渡效果
  useEffect(() => {
    if (displayContent !== currentDepartment) {
      // 先淡出
      setIsVisible(false);
      
      // 300ms后更新内容并淡入
      const timer = setTimeout(() => {
        setDisplayContent(currentDepartment);
        
        // 小延迟后淡入
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentDepartment, displayContent]);

  const getReminderAction = () => {
    switch (currentDepartment) {
      case '品牌域': return '上线';
      case '基础研发部': return '评审';
      case '平台运营部': return '执行';
      case '客户成功部': return '到期';
      default: return '执行';
    }
  };

  const getStatusInfo = (dept: string) => {
    switch (dept) {
      case '客户成功部':
        return '正常';
      case '品牌域':
        return '研发中';
      case '基础研发部':
        return '技术规范制定中';
      default:
        return '未知';
    }
  };

  const getUrgentInfo = (dept: string) => {
    switch (dept) {
      case '客户成功部': return '到期';
      case '品牌域': return '立项';
      case '基础研发部': return '规范评审';
      default: return '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* 全局指标栏 - 平滑翻转切换效果 */}
      <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div 
          className={`flex items-center justify-between transition-all duration-300 ease-out ${
            !isVisible ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: !isVisible ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
          }}
        >
          <div className="flex items-center space-x-8">
            {departmentMetrics.metrics.map((metric, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2"
              >
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
          
          {/* 滚动提醒 */}
          {departmentMetrics.reminders.length > 0 && (
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-200">
              <Calendar className="w-4 h-4 text-orange-500" />
              <div className="text-sm">
                <span className="text-gray-600">{departmentMetrics.reminders[currentReminderIndex].type}：</span>
                <span className="font-medium text-gray-900 ml-1">
                  {departmentMetrics.reminders[currentReminderIndex].customer}
                </span>
                <span className="text-orange-600 ml-1">
                  ({departmentMetrics.reminders[currentReminderIndex].days}天后{getReminderAction()})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 导航栏 */}
      <header className="h-14 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">米多智库</h1>
          </div>
          
          {/* 简洁的部门切换器 */}
          <div className="relative flex bg-gray-100/70 backdrop-blur-sm rounded-xl p-1 shadow-inner" style={{ width: '420px' }}>
            {/* 滑动背景 - 使用固定宽度确保完全一致 */}
            <div 
              className="absolute bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
              style={{
                top: '2px',
                bottom: '2px',
                left: `${departments.findIndex(d => d.id === currentDepartment) * 136 + 2}px`,
                width: '132px',
                transform: 'translateZ(0)', // 硬件加速
                willChange: 'left' // 优化动画性能
              }}
            />
            
            {departments.map((dept, index) => {
              const IconComponent = dept.icon;
              const isActive = currentDepartment === dept.id;
              
              return (
                <button
                  key={dept.id}
                  onClick={() => onDepartmentChange(dept.id)}
                  className={`
                    relative z-10 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-medium
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  style={{ 
                    width: '136px',
                    minWidth: '136px',
                    maxWidth: '136px',
                    textAlign: 'center',
                    letterSpacing: '0.01em'
                  }}
                >
                  <IconComponent 
                    className="w-3 h-3 transition-colors duration-300 flex-shrink-0" 
                    style={{ color: isActive ? dept.color : undefined }}
                  />
                  <span className="whitespace-nowrap text-xs font-medium">
                    {dept.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧区域 - 压缩信息密度，将指标融入 */}
        <div className="flex items-center space-x-4">
          {/* 当前部门的关键指标 - 仅品牌域显示 */}
          {currentDepartment === '品牌域' && (
            <div className="flex items-center space-x-4 mr-4">
              <div className="flex items-center space-x-1.5">
                <Code className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs text-gray-600">今日:</span>
                <span className="text-sm font-semibold text-purple-600">47</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-gray-600">进度:</span>
                <span className="text-sm font-semibold text-green-600">78.3%</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Bug className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs text-gray-600">Bug:</span>
                <span className="text-sm font-semibold text-red-600">12</span>
              </div>
            </div>
          )}
          
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Settings className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 pl-3 ml-2 border-l border-gray-200">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">田曦薇</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header; 