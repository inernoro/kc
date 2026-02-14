import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入已有组件
import ChatArea from './ChatArea';
import CustomerPanel from './CustomerPanel';
import Sidebar from './Sidebar';
import DemandPool from './DemandPool';
import ResumeAgentSidebar from './ResumeAgentSidebar';
import ResumeChatArea from './ResumeChatArea';
import ResumeRanking from './ResumeRanking';

// 导入模块化组件
import { VersionManagement, BrandAgentCenter } from '../modules/brand';
import { TechnicalStandardLibrary, TechnicalTaskTracker, TechnicalAgentCenter } from '../modules/technical';
import { AssessmentLeftPanel, AssessmentCenterPanel, AssessmentRightPanel } from '../modules/customer-success';

// 导入共享组件
import { FlipModule } from '../shared/components';

// 导入数据
import { productDemands } from '../modules/brand/data/productDemands';

// 导入类型
import { DepartmentConfig, ModuleManagerProps } from '../types';
import { ProductDemand, TechnicalStandard } from '../types/moduleTypes';

// 青春阳光主题配置
const sunshineTheme = {
  background: 'bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50',
  primary: 'from-orange-400 via-yellow-400 to-pink-400',
  secondary: 'from-green-400 via-blue-400 to-purple-400',
  accent: 'from-pink-400 via-purple-400 to-indigo-400',
  cardBg: 'bg-white/80 backdrop-blur-sm',
  textPrimary: 'text-orange-600',
  textSecondary: 'text-purple-600',
  button: 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500',
  glow: 'shadow-lg shadow-orange-200/50'
};

const ModuleManager: React.FC<ModuleManagerProps> = ({
  currentDepartment,
  onCustomerSelect,
  selectedCustomer,
  customerSuccessMode = 'normal'
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousDepartment, setPreviousDepartment] = useState<string | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<ProductDemand>(productDemands[0]);
  const [selectedStandard, setSelectedStandard] = useState<TechnicalStandard | null>(null);
  const [previousMode, setPreviousMode] = useState<'normal' | 'assessment'>('normal');

  // 监听模式变化
  useEffect(() => {
    if (customerSuccessMode !== previousMode) {
      setIsTransitioning(true);
      setPreviousMode(customerSuccessMode);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }
  }, [customerSuccessMode, previousMode]);

  // 考核模式面板包装组件 - 传递闭包变量作为 props
  const WrappedAssessmentLeftPanel = useCallback(() => (
    <AssessmentLeftPanel
      isTransitioning={isTransitioning}
      customerSuccessMode={customerSuccessMode}
      sunshineTheme={sunshineTheme}
    />
  ), [isTransitioning, customerSuccessMode]);

  const WrappedAssessmentCenterPanel = useCallback(({ customerSuccessMode: mode }: { customerSuccessMode?: 'normal' | 'assessment' }) => (
    <AssessmentCenterPanel
      customerSuccessMode={mode}
      isTransitioning={isTransitioning}
      sunshineTheme={sunshineTheme}
    />
  ), [isTransitioning]);

  const WrappedAssessmentRightPanel = useCallback(() => (
    <AssessmentRightPanel />
  ), []);

  // 部门配置
  const baseDepartmentConfigs: { [key: string]: DepartmentConfig } = useMemo(() => ({
    '客户成功部': {
      id: 'customer-success',
      name: '客户成功部',
      modules: customerSuccessMode === 'normal' ? [
        { id: 'customer-list', name: '客户列表', component: Sidebar, position: 'left', props: {} },
        { id: 'chat-area', name: '对话区域', component: ChatArea, position: 'center', props: {} },
        { id: 'right-panel', name: '右侧面板', component: CustomerPanel, position: 'right', props: {} }
      ] : [
        { id: 'assessment-left', name: '考核管理', component: WrappedAssessmentLeftPanel, position: 'left', props: {} },
        { id: 'assessment-center', name: '考核进行状态', component: WrappedAssessmentCenterPanel, position: 'center', props: {} },
        { id: 'assessment-right', name: '能力分析', component: WrappedAssessmentRightPanel, position: 'right', props: {} }
      ],
      theme: { primary: '#3B82F6', secondary: '#EFF6FF', background: '#F8FAFC' }
    },
    '品牌域': {
      id: 'brand',
      name: '品牌域',
      modules: [
        { id: 'demand-pool', name: 'TAPD需求池', component: DemandPool, position: 'left', props: {} },
        { id: 'brand-agent-center', name: '品牌域智能体中心', component: BrandAgentCenter, position: 'center', props: {} },
        { id: 'version-management', name: '版本管理', component: VersionManagement, position: 'right', props: {} }
      ],
      theme: { primary: '#8B5CF6', secondary: '#F3E8FF', background: '#FAFAFA' }
    },
    '基础研发部': {
      id: 'technical',
      name: '基础研发部',
      modules: [
        { id: 'standard-library', name: '技术规范管理库', component: TechnicalStandardLibrary, position: 'left', props: {} },
        { id: 'agent-center', name: '技术智能体中心', component: TechnicalAgentCenter, position: 'center', props: {} },
        { id: 'task-tracker', name: '任务跟踪管理', component: TechnicalTaskTracker, position: 'right', props: {} }
      ],
      theme: { primary: '#10B981', secondary: '#D1FAE5', background: '#F0FDF4' }
    },
    'HR': {
      id: 'hr',
      name: 'HR',
      modules: [
        { id: 'resume-agent-sidebar', name: '简历智能体', component: ResumeAgentSidebar, position: 'left', props: {} },
        { id: 'resume-chat-area', name: '智能体对话', component: ResumeChatArea, position: 'center', props: {} },
        { id: 'resume-ranking', name: '候选人排序', component: ResumeRanking, position: 'right', props: {} }
      ],
      theme: { primary: '#EA580C', secondary: '#FED7AA', background: '#FFF7ED' }
    }
  }), [customerSuccessMode, WrappedAssessmentLeftPanel, WrappedAssessmentCenterPanel, WrappedAssessmentRightPanel]);

  // 动态更新 props
  const getModuleProps = useCallback((moduleId: string) => {
    switch (moduleId) {
      case 'customer-list':
        return { onCustomerSelect, selectedCustomer };
      case 'chat-area':
        return { selectedCustomer };
      case 'right-panel':
        return { customer: selectedCustomer };
      case 'demand-pool':
        return { selectedDemand, onDemandSelect: setSelectedDemand, productDemands };
      case 'project-flow':
      case 'version-management':
        return { selectedDemand };
      case 'standard-library':
        return { selectedStandard, onStandardSelect: setSelectedStandard };
      case 'agent-center':
      case 'task-tracker':
        return { selectedStandard };
      case 'assessment-center':
        return { customerSuccessMode };
      case 'assessment-left':
      case 'assessment-right':
        return {};
      default:
        return {};
    }
  }, [selectedCustomer, onCustomerSelect, selectedDemand, selectedStandard, customerSuccessMode]);

  // 获取当前部门配置
  const currentConfig = baseDepartmentConfigs[currentDepartment];
  const previousConfig = previousDepartment ? baseDepartmentConfigs[previousDepartment] : null;

  // 部门切换动效
  useEffect(() => {
    if (!currentConfig) return;
    if (!previousDepartment) {
      setPreviousDepartment(currentDepartment);
      return;
    }
    if (previousDepartment === currentDepartment) return;

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousDepartment(currentDepartment);
    }, 150);
    return () => clearTimeout(timer);
  }, [currentDepartment, previousDepartment, currentConfig]);

  if (!currentConfig) return null;

  // 按位置分组模块
  const modulesByPosition = {
    left: currentConfig.modules.filter(m => m.position === 'left')[0] || null,
    center: currentConfig.modules.filter(m => m.position === 'center')[0] || null,
    right: currentConfig.modules.filter(m => m.position === 'right')[0] || null
  };

  const previousModulesByPosition = previousConfig ? {
    left: previousConfig.modules.filter(m => m.position === 'left')[0] || null,
    center: previousConfig.modules.filter(m => m.position === 'center')[0] || null,
    right: previousConfig.modules.filter(m => m.position === 'right')[0] || null
  } : { left: null, center: null, right: null };

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-1000 ${customerSuccessMode === 'assessment' && currentDepartment === '客户成功部'
        ? sunshineTheme.background
        : ''
        } ${isTransitioning ? 'animate-pulse' : ''}`}
      style={{
        backgroundColor: customerSuccessMode === 'assessment' && currentDepartment === '客户成功部'
          ? 'transparent'
          : currentConfig.theme.background
      }}
    >
      {/* HR部门背景动画效果 */}
      {currentDepartment === 'HR' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 80, 0], y: [0, -60, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-3 h-3 bg-blue-300/20 rounded-full"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, 80, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-4 h-4 bg-green-300/15 rounded-full"
          />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20 w-2 h-2 bg-purple-300/20 rounded-full"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 50, 0], rotate: [0, 90, 180] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-60 left-80 w-2 h-2 bg-orange-300/15 rounded-full"
          />
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 right-80 w-3 h-3 bg-red-300/18 rounded-full"
          />
          <motion.div
            animate={{ x: [0, -70, 0], y: [0, 60, 0], rotate: [0, 270, 360], scale: [1, 1.4, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute top-32 right-40 w-4 h-4 bg-gradient-to-br from-blue-400/15 to-cyan-400/10 rounded-full"
          />
          <motion.div
            animate={{ x: [0, 45, 0], y: [0, -70, 0], rotate: [0, -120, -240] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-32 left-60 w-2 h-2 bg-gradient-to-br from-green-400/20 to-emerald-400/15 rounded-full"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 40, 0], scale: [1, 1.8, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-80 left-32 w-3 h-3 bg-gradient-to-br from-indigo-400/12 to-purple-400/8 rounded-full"
          />
          <motion.div
            animate={{ x: [0, 35, 0], y: [0, -45, 0], rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-80 right-60 w-2 h-2 bg-gradient-to-br from-teal-400/18 to-cyan-400/12 rounded-full"
          />
        </div>
      )}

      {/* 模块区域 */}
      <div className="flex-1 grid grid-cols-[320px_1fr_320px] gap-0 overflow-hidden relative z-10 min-h-0" style={{ height: 'calc(100vh - 120px)' }}>
        <FlipModule
          position="left"
          currentModule={modulesByPosition.left}
          previousModule={previousModulesByPosition.left}
          getModuleProps={getModuleProps}
          isFlipping={isTransitioning}
        />
        <FlipModule
          position="center"
          currentModule={modulesByPosition.center}
          previousModule={previousModulesByPosition.center}
          getModuleProps={getModuleProps}
          isFlipping={isTransitioning}
        />
        <FlipModule
          position="right"
          currentModule={modulesByPosition.right}
          previousModule={previousModulesByPosition.right}
          getModuleProps={getModuleProps}
          isFlipping={isTransitioning}
        />
      </div>
    </div>
  );
};

export default ModuleManager;
