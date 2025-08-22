import React from 'react';
import { 
  BookOpen, Play, TrendingUp, CheckCircle, Clock, User, Target, Star
} from 'lucide-react';

// 青春阳光主题配置
const sunshineTheme = {
  background: 'bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50',
  primary: 'from-orange-400 via-yellow-400 to-pink-400',
  secondary: 'from-pink-400 via-rose-400 to-red-400',
  accent: 'from-yellow-300 via-orange-300 to-pink-300',
  cardBg: 'bg-gradient-to-br from-white/80 via-orange-50/30 to-pink-50/50',
  glow: 'shadow-2xl shadow-orange-200/50',
  sparkle: 'animate-pulse',
  textPrimary: 'text-orange-800',
  button: 'bg-gradient-to-r from-orange-500 to-pink-500'
};

// 考核左侧面板
export const AssessmentLeftPanel = ({ customerSuccessMode = 'normal' }: { customerSuccessMode?: 'normal' | 'assessment' }) => (
  <div className={`h-full flex flex-col transition-all duration-1000 ${
    customerSuccessMode === 'assessment' ? sunshineTheme.background : ''
  }`}>
    {/* 考核管理导航 */}
    <div className="p-4 border-b border-orange-100 relative">
      {/* 考核理念口号 - 青春版 */}
      <div className={`mb-4 p-4 rounded-xl ${customerSuccessMode === 'assessment'
        ? `${sunshineTheme.cardBg} border-2 border-gradient-to-r from-orange-300 to-pink-300 ${sunshineTheme.glow}`
        : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
        } transition-all duration-700`}>
        <div className="text-center">
          {customerSuccessMode === 'assessment' && (
            <div className="text-xs font-medium text-orange-500 mb-1 sunshine-sparkle">✨ 考核模式已激活 ✨</div>
          )}
          <div className={`text-lg font-bold text-transparent bg-clip-text transition-all duration-700 ${customerSuccessMode === 'assessment'
            ? `bg-gradient-to-r ${sunshineTheme.primary}`
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
            「提升均值、减少方差」
          </div>
          <div className={`text-xs mt-1 transition-all duration-700 ${customerSuccessMode === 'assessment' ? 'text-orange-600' : 'text-gray-600'
            }`}>
            {customerSuccessMode === 'assessment'
              ? '让团队整体更强，个体差距更小 • 考核激活模式'
              : '让团队整体更强，个体差距更小'
            }
          </div>
          {/* 青春阳光模式专属能量条 */}
          {customerSuccessMode === 'assessment' && (
            <div className="mt-3 bg-white/60 rounded-lg p-2 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
                <span>专注执行力</span>
                <span className="sunshine-sparkle">⚡ 88%</span>
              </div>
              <div className="w-full bg-orange-200/50 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 sunshine-glow" style={{ width: '88%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <h3 className={`font-semibold mb-3 flex items-center transition-all duration-700 ${customerSuccessMode === 'assessment' ? sunshineTheme.textPrimary : 'text-gray-900'
        }`}>
        <BookOpen className={`w-5 h-5 mr-2 transition-all duration-700 ${customerSuccessMode === 'assessment'
          ? 'text-orange-500 animate-pulse'
          : 'text-blue-600'
          }`} />
        {customerSuccessMode === 'assessment' ? '考核管理 • 活力模式' : '考核管理'}
      </h3>
      
      <div className={`text-sm mb-4 transition-all duration-700 ${customerSuccessMode === 'assessment' ? 'text-orange-600' : 'text-gray-600'
        }`}>
        {customerSuccessMode === 'assessment' ? '考核计划与项目历史记录 • 专注执行模式' : '考核计划与项目历史记录'}
      </div>
      
      {/* 本月考核计划 */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-medium text-gray-700 mb-2">本月考核计划</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded">
            <span>客户成功综合考核</span>
            <span className="text-blue-600 font-medium">进行中</span>
          </div>
          <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
            <span>项目协议管理专项</span>
            <span className="text-gray-500">待开始</span>
          </div>
          <div className="flex items-center justify-between text-xs bg-green-50 p-2 rounded">
            <span>商户续费沟通评估</span>
            <span className="text-green-600 font-medium">已完成</span>
          </div>
        </div>
      </div>
      
      {/* 考核统计 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="text-center bg-blue-50 rounded p-2">
          <div className="text-lg font-bold text-blue-600">15</div>
          <div className="text-xs text-gray-600">本年项目</div>
        </div>
        <div className="text-center bg-green-50 rounded p-2">
          <div className="text-lg font-bold text-green-600">92%</div>
          <div className="text-xs text-gray-600">完成率</div>
        </div>
      </div>
    </div>

    {/* 项目历史记录 */}
    <div className="flex-1 overflow-y-auto p-4">
      <div className="text-xs font-medium text-gray-700 mb-3">近期考核历史</div>
      <div className="space-y-2">
        {/* 考核项目1 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">大客户关系维护专项</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">95分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">针对重点客户的关系维护和续费跟进工作评估</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-01-10</span>
            <span className="text-green-600">客户满意度优秀</span>
          </div>
        </div>

        {/* 考核项目2 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">产品需求对接评估</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">88分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">客户需求收集、整理和产品对接能力综合评估</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2023-12-20</span>
            <span className="text-green-600">技术对接优秀</span>
          </div>
        </div>

        {/* 考核项目3 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">客户成功部运营指南</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">96分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">客户成功部运营指南制定与团队培训</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2023-12-15</span>
            <span className="text-blue-600">团队评价: 优秀</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 考核中心面板
export const AssessmentCenterPanel = ({ customerSuccessMode = 'normal' }: { customerSuccessMode?: 'normal' | 'assessment' }) => (
  <div className={`h-full flex flex-col relative overflow-hidden backdrop-blur-sm ${
    customerSuccessMode === 'assessment' 
      ? 'bg-gradient-to-br from-orange-50/30 via-yellow-50/30 to-pink-50/30'
      : 'bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30'
  }`}>
    {/* 背景动画 */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ opacity: 0.25 }}
      >
        <defs>
          <radialGradient id="CustomerGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
            <animate attributeName="fx" dur="26s" values="0%;3%;0%" repeatCount="indefinite" />
            <stop offset="0%" stopColor={customerSuccessMode === 'assessment' ? "#F97316" : "#3B82F6"} />
            <stop offset="100%" stopColor={customerSuccessMode === 'assessment' ? "#F9731600" : "#3B82F600"} />
          </radialGradient>
        </defs>
        <circle cx="20%" cy="20%" r="30%" fill="url(#CustomerGradient1)">
          <animate attributeName="r" dur="20s" values="30%;40%;30%" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>

    {/* 内容区域 */}
    <div className="relative z-10 h-full flex flex-col p-6">
      {/* 标题区域 */}
      <div className="mb-6 text-center">
        <h2 className={`text-2xl font-bold mb-2 transition-all duration-700 ${
          customerSuccessMode === 'assessment' ? 'text-orange-700' : 'text-blue-700'
        }`}>
          {customerSuccessMode === 'assessment' ? '🌟 考核进行中 • 专注模式' : '🎯 考核中心'}
        </h2>
        <p className={`text-sm transition-all duration-700 ${
          customerSuccessMode === 'assessment' ? 'text-orange-600' : 'text-gray-600'
        }`}>
          {customerSuccessMode === 'assessment' 
            ? '展现你的专业能力，成就更好的自己' 
            : '客户成功能力评估与提升'
          }
        </p>
      </div>

      {/* 主要操作按钮 */}
      <div className="mb-6">
        <button className={`w-full font-medium py-3 px-5 rounded-lg flex items-center justify-center transition-all duration-700 transform ${
          customerSuccessMode === 'assessment'
            ? `${sunshineTheme.button} ${sunshineTheme.glow} text-white hover:scale-105`
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
        }`}>
          <Play className={`mr-2 transition-all duration-700 ${
            customerSuccessMode === 'assessment' ? 'w-5 h-5 animate-pulse' : 'w-4 h-4'
          }`} />
          {customerSuccessMode === 'assessment' ? '继续考核 • 专注模式' : '继续考核'}
        </button>
      </div>

      {/* 当前考核项详情 */}
      <div className={`rounded-lg p-4 mb-3 transition-all duration-700 transform ${
        customerSuccessMode === 'assessment'
          ? `${sunshineTheme.cardBg} border-2 border-gradient-to-r from-orange-300 to-pink-300 ${sunshineTheme.glow}`
          : 'bg-white/60 border border-gray-200/60 shadow-sm backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-semibold text-lg transition-all duration-700 ${
            customerSuccessMode === 'assessment' ? sunshineTheme.textPrimary : 'text-gray-900'
          }`}>
            {customerSuccessMode === 'assessment' ? '当前考核项 • 专注执行' : '当前考核项'}
          </h4>
          <span className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-700 ${
            customerSuccessMode === 'assessment'
              ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {customerSuccessMode === 'assessment' ? '第3/4题 • 专注模式' : '第3/4题'}
          </span>
        </div>
        
        <div className={`rounded-xl p-5 mb-4 border-2 transition-all duration-700 ${
          customerSuccessMode === 'assessment'
            ? 'bg-gradient-to-r from-orange-50/80 via-yellow-50/80 to-pink-50/80 border-gradient-to-r from-orange-300 to-pink-300'
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
        }`}>
          <h5 className={`font-semibold mb-3 transition-all duration-700 ${
            customerSuccessMode === 'assessment' ? 'text-orange-800' : 'text-blue-900'
          }`}>
            {customerSuccessMode === 'assessment' ? '📋 客户沟通案例分析 • 深度聚焦' : '📋 客户沟通案例分析'}
          </h5>
          <p className={`text-sm leading-relaxed transition-all duration-700 ${
            customerSuccessMode === 'assessment' ? 'text-orange-700' : 'text-blue-700'
          }`}>
            {customerSuccessMode === 'assessment'
              ? '某客户反馈产品功能不满足预期，作为客户成功经理，请分析问题原因并制定解决方案。请充分运用你的专业能力，展现优秀的客户沟通技巧。'
              : '某客户反馈产品功能不满足预期，作为客户成功经理，请分析问题原因并制定解决方案。'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-600 text-sm">考核类型</div>
            <div className="font-semibold text-gray-900">案例分析</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <div className="text-gray-600 text-sm">剩余时间</div>
            <div className="font-semibold text-orange-600">⏰ 15分钟</div>
          </div>
        </div>
      </div>

      {/* 次要操作区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
        <h5 className="font-medium text-gray-900 mb-3">操作选项</h5>
        <div className="grid grid-cols-3 gap-3">
          <button className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded transition-colors">
            <Clock className="w-4 h-4 mx-auto mb-1" />
            暂停考核
          </button>
          <button className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded transition-colors">
            <Target className="w-4 h-4 mx-auto mb-1" />
            查看提示
          </button>
          <button className="text-xs bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded transition-colors">
            <CheckCircle className="w-4 h-4 mx-auto mb-1" />
            提交答案
          </button>
        </div>
      </div>

      {/* 进度指示器 */}
      <div className="flex-1 flex items-end">
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>考核进度</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all duration-700 ${
              customerSuccessMode === 'assessment' 
                ? 'bg-gradient-to-r from-orange-400 to-pink-400' 
                : 'bg-blue-500'
            }`} style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 考核右侧面板
export const AssessmentRightPanel = ({ customerSuccessMode = 'normal' }: { customerSuccessMode?: 'normal' | 'assessment' }) => (
  <div className={`h-full flex flex-col transition-all duration-1000 ${
    customerSuccessMode === 'assessment' ? sunshineTheme.background : ''
  }`}>
    <div className="p-4 border-b border-gray-200">
      <h3 className={`font-semibold mb-3 flex items-center transition-all duration-700 ${
        customerSuccessMode === 'assessment' ? sunshineTheme.textPrimary : 'text-gray-900'
      }`}>
        <TrendingUp className={`w-5 h-5 mr-2 transition-all duration-700 ${
          customerSuccessMode === 'assessment' ? 'text-orange-500 animate-pulse' : 'text-green-600'
        }`} />
        {customerSuccessMode === 'assessment' ? '能力分析 • 实时反馈' : '能力分析'}
      </h3>
      
      <div className={`text-sm mb-4 transition-all duration-700 ${
        customerSuccessMode === 'assessment' ? 'text-orange-600' : 'text-gray-600'
      }`}>
        {customerSuccessMode === 'assessment' ? '实时跟踪您的能力表现和提升建议' : '跟踪能力表现和提升建议'}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4">
      {/* 能力雷达图区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
        <h5 className="font-medium text-gray-900 mb-3">核心能力评估</h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">客户沟通</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-gray-500">85%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">需求理解</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <span className="text-xs text-gray-500">90%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">问题解决</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-gray-500">75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">项目管理</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <span className="text-xs text-gray-500">80%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 实时反馈 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-green-600 mr-1" />
          <span className="text-sm font-medium text-green-800">实时反馈</span>
        </div>
        <p className="text-xs text-green-700">
          {customerSuccessMode === 'assessment' 
            ? '您在客户沟通方面表现优秀，继续保持专业性和耐心！建议在问题分析深度上进一步加强。'
            : '您在客户沟通方面表现良好，建议加强问题分析能力。'
          }
        </p>
      </div>

      {/* 提升建议 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center mb-2">
          <Target className="w-4 h-4 text-blue-600 mr-1" />
          <span className="text-sm font-medium text-blue-800">提升建议</span>
        </div>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 深入了解客户业务背景</li>
          <li>• 提升主动沟通频次</li>
          <li>• 强化数据分析能力</li>
          <li>• 建立客户关系维护体系</li>
        </ul>
      </div>
    </div>
  </div>
);

export default { AssessmentLeftPanel, AssessmentCenterPanel, AssessmentRightPanel };