import React from 'react';
import { Activity, CheckCircle, ClipboardCheck, Clock, FileText, Pause, Play, Star, Timer, User } from 'lucide-react';

interface AssessmentCenterPanelProps {
  customerSuccessMode?: 'normal' | 'assessment';
  isTransitioning: boolean;
  sunshineTheme: any;
}

const AssessmentCenterPanel: React.FC<AssessmentCenterPanelProps> = ({ customerSuccessMode = 'normal', isTransitioning, sunshineTheme }) => (
    <div className={`h-full flex flex-col relative overflow-hidden backdrop-blur-sm ${
      customerSuccessMode === 'assessment'
        ? 'bg-gradient-to-br from-orange-50/30 via-yellow-50/30 to-pink-50/30'
        : 'bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30'
    }`}>
      {/* 客户成功背景动画 - 根据模式切换颜色 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.25 }}
        >
          <defs>
            {customerSuccessMode === 'assessment' ? (
              // 考核模式：阳光橙色主题
              <>
                <radialGradient id="CustomerGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
                  <animate attributeName="fx" dur="26s" values="0%;3%;0%" repeatCount="indefinite" />
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#F9731600" />
                </radialGradient>
                <radialGradient id="CustomerGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
                  <animate attributeName="fx" dur="17s" values="0%;3%;0%" repeatCount="indefinite" />
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#FCD34D00" />
                </radialGradient>
                <radialGradient id="CustomerGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
                  <animate attributeName="fx" dur="21s" values="0%;3%;0%" repeatCount="indefinite" />
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#EC489900" />
                </radialGradient>
              </>
            ) : (
              // 普通模式：紫色主题
              <>
                <radialGradient id="CustomerGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
                  <animate attributeName="fx" dur="26s" values="0%;3%;0%" repeatCount="indefinite" />
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#8B5CF600" />
                </radialGradient>
                <radialGradient id="CustomerGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
                  <animate attributeName="fx" dur="17s" values="0%;3%;0%" repeatCount="indefinite" />
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#3B82F600" />
                </radialGradient>
                <radialGradient id="CustomerGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
                  <animate attributeName="fx" dur="21s" values="0%;3%;0%" repeatCount="indefinite" />
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#EC489900" />
                </radialGradient>
              </>
            )}
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#CustomerGradient1)">
            <animate attributeName="x" dur="16s" values="25%;0%;25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="18s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="13s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#CustomerGradient2)">
            <animate attributeName="x" dur="19s" values="-25%;0%;-25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="22s" values="25%;-25%;25%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="-360 50 50"
              dur="16s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#CustomerGradient3)">
            <animate attributeName="x" dur="23s" values="0%;50%;0%" repeatCount="indefinite" />
            <animate attributeName="y" dur="11s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="20s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
      <div className="relative z-10 p-4 border-b border-gray-100/60 bg-white/50 backdrop-blur-sm">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 text-purple-600 mr-2" />
          考核进行状态
        </h3>
        <div className="text-sm text-gray-600">当前正在进行的能力评估与考核</div>
      </div>

      <div className="relative z-10 flex-1 p-3 overflow-y-auto">
        {/* 主要考核状态卡片 - 突出显示 */}
        <div className="bg-gradient-to-br from-blue-50/60 via-purple-50/60 to-pink-50/60 rounded-lg p-4 mb-4 border-2 border-blue-200/60 shadow-sm backdrop-blur-sm">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">季度综合考核</h4>
            <p className="text-sm text-gray-600">2024年第一季度能力评估</p>
          </div>

          {/* 主进度展示 */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-800">考核进度</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
            <div className="text-xs text-gray-600 text-center">预计还需15分钟完成剩余考核项</div>
          </div>

          {/* 统计概览 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">6</div>
              <div className="text-xs text-gray-600">已完成</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">1</div>
              <div className="text-xs text-gray-600">进行中</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-600 mb-1">1</div>
              <div className="text-xs text-gray-600">待开始</div>
            </div>
          </div>

          {/* 主要操作按钮 - 青春阳光版 */}
          <button className={`w-full font-medium py-3 px-5 rounded-lg flex items-center justify-center transition-all duration-700 transform ${customerSuccessMode === 'assessment'
            ? `${sunshineTheme.button} ${sunshineTheme.glow} text-white hover:scale-105 sunshine-button energy-pulse`
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            } ${isTransitioning ? 'animate-bounce' : ''}`}>
            <Play className={`mr-2 transition-all duration-700 ${customerSuccessMode === 'assessment'
              ? 'w-5 h-5 animate-pulse'
              : 'w-4 h-4'
              }`} />
            {customerSuccessMode === 'assessment' ? '继续考核 • 专注模式' : '继续考核'}
          </button>
        </div>

        {/* 当前考核项详情 - 青春阳光版 */}
        <div className={`rounded-lg p-4 mb-3 transition-all duration-700 transform ${customerSuccessMode === 'assessment'
          ? `${sunshineTheme.cardBg} border-2 border-gradient-to-r from-orange-300 to-pink-300 ${sunshineTheme.glow} ${isTransitioning ? 'scale-105' : 'hover:scale-102'}`
          : 'bg-white/60 border border-gray-200/60 shadow-sm backdrop-blur-sm'
          }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-semibold text-lg transition-all duration-700 ${customerSuccessMode === 'assessment' ? sunshineTheme.textPrimary : 'text-gray-900'
              }`}>
              {customerSuccessMode === 'assessment' ? '当前考核项 • 专注执行' : '当前考核项'}
            </h4>
            <span className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-700 ${customerSuccessMode === 'assessment'
              ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 sunshine-float achievement-halo'
              : 'bg-blue-100 text-blue-700'
              }`}>
              {customerSuccessMode === 'assessment' ? '第3/4题 • 专注模式' : '第3/4题'}
            </span>
          </div>

          <div className={`rounded-xl p-5 mb-4 border-2 transition-all duration-700 ${customerSuccessMode === 'assessment'
            ? 'bg-gradient-to-r from-orange-50/80 via-yellow-50/80 to-pink-50/80 border-gradient-to-r from-orange-300 to-pink-300'
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
            }`}>
            <h5 className={`font-semibold mb-3 transition-all duration-700 ${customerSuccessMode === 'assessment' ? 'text-orange-800' : 'text-blue-900'
              }`}>
              {customerSuccessMode === 'assessment' ? '📋 客户沟通案例分析 • 深度聚焦' : '📋 客户沟通案例分析'}
            </h5>
            <p className={`text-sm leading-relaxed transition-all duration-700 ${customerSuccessMode === 'assessment' ? 'text-orange-700' : 'text-blue-700'
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
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex flex-col items-center">
              <Pause className="w-5 h-5 mb-1" />
              <span className="text-sm">暂停</span>
            </button>
            <button className="bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex flex-col items-center">
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-sm">查看</span>
            </button>
            <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex flex-col items-center">
              <Star className="w-5 h-5 mb-1" />
              <span className="text-sm">收藏</span>
            </button>
          </div>
        </div>

        {/* 考核模块进度 - 简化展示 */}
        <div className="bg-white/60 rounded-lg border border-gray-200/60 p-4 shadow-sm backdrop-blur-sm">
          <h5 className="font-medium text-gray-900 mb-4">考核模块进度</h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50/60 rounded-lg border-l-4 border-green-400/60 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900 text-sm">项目管理能力</div>
                  <div className="text-xs text-green-700">基于真实项目的综合评估</div>
                </div>
              </div>
              <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-100 rounded">已完成</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-lg border-l-4 border-blue-400/60 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Timer className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900 text-sm">客户沟通能力</div>
                  <div className="text-xs text-blue-700">客户满意度调研与面谈评估</div>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-100 rounded">进行中</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50/60 rounded-lg border-l-4 border-purple-400/60 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900 text-sm">协议文档管理</div>
                  <div className="text-xs text-purple-700">服务协议制定与维护能力</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">80%</div>
                <div className="text-xs text-purple-600">进度</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-700 text-sm">跨部门协作</div>
                  <div className="text-xs text-gray-600">与技术、财务、法务协作评估</div>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-semibold px-2 py-1 bg-gray-100 rounded">待开始</span>
            </div>
          </div>
        </div>
      </div>
    </div>
);

export default AssessmentCenterPanel;
