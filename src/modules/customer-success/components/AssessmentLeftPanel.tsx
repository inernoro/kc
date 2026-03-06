import React from 'react';
import { BookOpen, FileText } from 'lucide-react';

interface AssessmentLeftPanelProps {
  isTransitioning: boolean;
  customerSuccessMode: 'normal' | 'assessment';
  sunshineTheme: any;
}

const AssessmentLeftPanel: React.FC<AssessmentLeftPanelProps> = ({ isTransitioning, customerSuccessMode, sunshineTheme }) => (
    <div className={`h-full flex flex-col transition-all duration-1000 ${isTransitioning ? 'transform scale-105' : ''
      } ${customerSuccessMode === 'assessment' ? sunshineTheme.background : ''}`}>
      {/* 变身光效 */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-pink-400/20 animate-pulse pointer-events-none z-10" />
      )}

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
            ? `text-orange-500 ${isTransitioning ? 'animate-spin' : 'animate-pulse'}`
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
            <div className="text-lg font-bold text-green-600">92.3</div>
            <div className="text-xs text-gray-600">平均分</div>
          </div>
        </div>
      </div>

      {/* 项目考核历史 */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <FileText className="w-4 h-4 text-purple-600 mr-2" />
          项目考核历史
        </h4>
        <div className="text-xs text-gray-600 mb-3">基于真实项目的考核记录</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 米多硬件类产品项目 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">米多硬件产品订单管理</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">95分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">负责硬件类产品订单流程优化与客户沟通</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-02-15</span>
            <span className="text-blue-600">客户满意度: 98%</span>
          </div>
        </div>

        {/* 社交云店项目 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">社交云店端口项目</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">88分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">社交云店端口订单管理与技术对接协调</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-02-01</span>
            <span className="text-green-600">项目按期完成</span>
          </div>
        </div>

        {/* 场景码牛券项目 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">场景码牛券系统升级</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">82分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">单填写指引版场景码牛券系统优化项目</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-01-20</span>
            <span className="text-orange-600">需改进沟通</span>
          </div>
        </div>

        {/* 服务协议管理 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">软件服务协议管理</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">91分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">2023财年米多软件服务协议维护与更新</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-01-15</span>
            <span className="text-blue-600">法务配合优秀</span>
          </div>
        </div>

        {/* 营销费用代发项目 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">营销费用代发服务</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">86分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">营销费用代发服务协议(MT)项目执行</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-01-10</span>
            <span className="text-green-600">财务对接顺畅</span>
          </div>
        </div>

        {/* 商户续费协议 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">商户续费协议项目</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">94分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">商户续费协议流程优化与客户维系</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2024-01-05</span>
            <span className="text-blue-600">续费率: 87%</span>
          </div>
        </div>

        {/* 赋码采集项目 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">赋码采集关联集成</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">89分</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">赋码采集关联集成项目协议执行与技术协调</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">考核时间: 2023-12-20</span>
            <span className="text-green-600">技术对接优秀</span>
          </div>
        </div>

        {/* 客户成功运营 */}
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
);

export default AssessmentLeftPanel;
