import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Bot,
  Bug,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Code,
  Crown,
  Database,
  Eye,
  FileText,
  Image,
  Layers,
  Lightbulb,
  MessageSquare,
  Monitor,
  Package,
  Palette,
  Paperclip,
  Pause,
  PieChart,
  Play,
  Rocket,
  Send,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  User,
  X,
  Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 导入组件
import ChatArea from './ChatArea';
import CustomerPanel from './CustomerPanel';
import PRDPreview from './PRDPreview';
import Sidebar from './Sidebar';
import DemandPool from './DemandPool';
import ResumeAgentCenter from './ResumeAgentCenter';
import ResumeAgentSidebar from './ResumeAgentSidebar';
import ResumeChatArea from './ResumeChatArea';
import ResumeRanking from './ResumeRanking';

// 导入类型
import { ModuleConfig, DepartmentConfig, ModuleManagerProps } from '../types';
import { ProductDemand, ProductProject, TechnicalStandard, TechnicalTask } from '../types/moduleTypes';




// 米多产品体系四级结构
const MIDO_PRODUCT_STRUCTURE = {
  platform: '米多平台',
  systems: ['大数据引擎', '无界分销（规划中）', '智慧零售（规划中）'],
  applications: ['社交云店', '防窜物流', '智能营销', '积分商城', '会员管理'],
  plugins: ['签到', '抽奖', '问卷', '投票', '拼团', '砍价', '分销'],
  channelRouters: ['新经销助手', '万能零售助手', '业务帮帮', '金牌导购员']
};

// 产品需求数据（基于TAPD需求管理池）
const productDemands: ProductDemand[] = [
  {
    id: 'TAPD-001',
    title: '智能营销新增指定门店发奖策略组件',
    source: '商户需求',
    priority: 'High',
    status: '已立项',
    submitter: '王丽（客户成功部）',
    reviewer: '王忠（产品经理）',
    submitTime: '2024-01-15',
    reviewTime: '2024-01-16',
    description: '维达希望智能营销新增指定门店发奖的策略组件，来做精准化的扫码活动',
    businessValue: 9,
    developmentCost: 6,
    customer: '维达纸业',
    urgency: '紧急',
    importance: '重要'
  },
  {
    id: 'TAPD-002',
    title: '社交云店店铺装修支持自定义配置',
    source: '商户需求',
    priority: 'Middle',
    status: '待规划',
    submitter: '张明（客户成功部）',
    reviewer: '陈周满（产品经理）',
    submitTime: '2024-01-20',
    reviewTime: '2024-01-21',
    description: '百年糊涂希望社交云店的店铺装修支持自定义配置，来实现个性化装修的诉求',
    businessValue: 7,
    developmentCost: 8,
    customer: '百年糊涂酒业',
    urgency: '不紧急',
    importance: '重要'
  },
  {
    id: 'TAPD-003',
    title: '积分商城增加批量导入商品功能',
    source: '内部团队',
    priority: 'Low',
    status: '待评审',
    submitter: '李华（产品助理）',
    reviewer: '张坤（产品经理）',
    submitTime: '2024-02-01',
    description: '运营人员反馈商品录入效率低，需要批量导入功能提升操作效率',
    businessValue: 5,
    developmentCost: 3,
    customer: '内部运营',
    urgency: '不紧急',
    importance: '不重要'
  },
  {
    id: 'TAPD-004',
    title: '会员管理支持多级分销佣金设置',
    source: '代理伙伴',
    priority: 'High',
    status: '开发中',
    submitter: '赵强（代理商）',
    reviewer: '王忠（产品经理）',
    submitTime: '2024-01-10',
    reviewTime: '2024-01-11',
    description: '代理商希望支持多级分销佣金设置，满足复杂的渠道分润需求',
    businessValue: 8,
    developmentCost: 7,
    customer: '华南代理商',
    urgency: '紧急',
    importance: '重要'
  },
  {
    id: 'TAPD-005',
    title: '防窜物流新增GPS轨迹追踪',
    source: '商户需求',
    priority: 'Middle',
    status: '已上线',
    submitter: '周杰（客户成功部）',
    reviewer: '陈周满（产品经理）',
    submitTime: '2023-12-20',
    reviewTime: '2023-12-21',
    description: '茅台集团要求增加GPS轨迹追踪功能，加强物流监管',
    businessValue: 9,
    developmentCost: 5,
    customer: '茅台集团',
    urgency: '不紧急',
    importance: '重要'
  },
  {
    id: 'TAPD-006',
    title: '签到插件支持连续签到奖励递增',
    source: '商户需求',
    priority: 'Nice to have',
    status: '待规划',
    submitter: '孙磊（客户成功部）',
    reviewer: '张坤（产品经理）',
    submitTime: '2024-02-05',
    description: '多个客户反馈希望签到奖励能递增，提升用户粘性',
    businessValue: 6,
    developmentCost: 4,
    customer: '多个客户',
    urgency: '不紧急',
    importance: '不重要'
  }
];

// 产品项目数据（基于产品立项流程）
const productProjects: ProductProject[] = [
  {
    id: 'PRD-001',
    name: '智能营销V2.4.0（策略组件化升级）',
    version: 'V2.4.0',
    versionType: '中版本',
    status: '开发中',
    progress: 78,
    currentStage: '开发跟踪',
    manager: '王忠',
    developer: '李名芳',
    tester: '王苒',
    relatedSystems: ['智能营销', '大数据引擎'],
    demandId: 'TAPD-001',
    deadline: '2024-02-28',
    createTime: '2024-01-16',
    prototype: {
      draft1: 'https://axure.com/draft1',
      draft2: 'https://axure.com/draft2',
      draft3: 'https://axure.com/draft3'
    },
    reviewRecords: [
      {
        stage: '一稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '价值确认通过，明确了指定门店发奖的业务价值',
        time: '2024-01-18'
      },
      {
        stage: '二稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '结构设计合理，策略组件化架构清晰',
        time: '2024-01-25'
      },
      {
        stage: '三稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '交互细节完善，可进入开发',
        time: '2024-02-01'
      }
    ]
  },
  {
    id: 'PRD-002',
    name: '会员管理T2.1.5（多级分销佣金）',
    version: 'T2.1.5',
    versionType: '中版本',
    status: '三稿设计',
    progress: 45,
    currentStage: '产品立项',
    manager: '王忠',
    relatedSystems: ['会员管理', '大数据引擎'],
    demandId: 'TAPD-004',
    deadline: '2024-03-15',
    createTime: '2024-01-11',
    prototype: {
      draft1: 'https://axure.com/draft1',
      draft2: 'https://axure.com/draft2'
    },
    reviewRecords: [
      {
        stage: '一稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '多级分销需求明确，业务价值高',
        time: '2024-01-15'
      },
      {
        stage: '二稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '分销层级结构设计合理',
        time: '2024-01-22'
      }
    ]
  },
  {
    id: 'PRD-003',
    name: '社交云店T1.8.2（个性化装修）',
    version: 'T1.8.2',
    versionType: '中版本',
    status: '一稿设计',
    progress: 15,
    currentStage: '产品立项',
    manager: '陈周满',
    relatedSystems: ['社交云店'],
    demandId: 'TAPD-002',
    deadline: '2024-04-01',
    createTime: '2024-01-21',
    reviewRecords: []
  },
  {
    id: 'PRD-004',
    name: '防窜物流V3.1.0（GPS轨迹追踪）',
    version: 'V3.1.0',
    versionType: '中版本',
    status: '已上线',
    progress: 100,
    currentStage: '产品总结',
    manager: '陈周满',
    developer: '张技术',
    tester: '李测试',
    relatedSystems: ['防窜物流', '大数据引擎'],
    demandId: 'TAPD-005',
    deadline: '2024-01-31',
    createTime: '2023-12-21',
    prototype: {
      draft1: 'https://axure.com/draft1',
      draft2: 'https://axure.com/draft2',
      draft3: 'https://axure.com/draft3'
    },
    reviewRecords: [
      {
        stage: '一稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: 'GPS追踪需求明确，技术方案可行',
        time: '2023-12-25'
      },
      {
        stage: '二稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '轨迹数据结构设计完整',
        time: '2024-01-05'
      },
      {
        stage: '三稿',
        reviewer: '产品委员会',
        result: '通过',
        feedback: '交互体验良好，可上线',
        time: '2024-01-10'
      }
    ]
  }
];

// 基础研发部数据
const technicalStandards: TechnicalStandard[] = [
  {
    id: 'STD-001',
    title: '前端React组件开发规范V3.2',
    category: '前端开发',
    version: 'V3.2',
    status: '评审中',
    creator: '张技术',
    reviewer: '李架构师',
    createTime: '2024-01-15',
    updateTime: '2024-02-01',
    description: '规范React组件的命名、结构、Props定义、状态管理、生命周期使用等最佳实践',
    priority: 'High',
    complexity: 8,
    impact: ['社交云店', '智能营销', '会员管理'],
    downloadUrl: 'https://docs.mido.com/frontend-react-v3.2.pdf'
  },
  {
    id: 'STD-002',
    title: 'RESTful API接口设计标准',
    category: '后端API',
    version: 'V2.1',
    status: '已发布',
    creator: '王后端',
    reviewer: '姚帆',
    createTime: '2024-01-10',
    description: '统一API接口设计规范，包括URL设计、HTTP状态码、错误处理、版本控制等',
    priority: 'High',
    complexity: 9,
    impact: ['大数据引擎', '智能营销', '防窜物流', '积分商城'],
    downloadUrl: 'https://docs.mido.com/api-design-v2.1.pdf'
  },
  {
    id: 'STD-003',
    title: 'MySQL数据库表设计规范',
    category: '数据库设计',
    version: 'V1.8',
    status: '已发布',
    creator: '陈数据',
    reviewer: '李架构师',
    createTime: '2024-01-05',
    description: '数据库表结构设计、索引优化、命名规范、性能优化指导原则',
    priority: 'Medium',
    complexity: 7,
    impact: ['所有业务系统'],
    downloadUrl: 'https://docs.mido.com/db-design-v1.8.pdf'
  },
  {
    id: 'STD-004',
    title: 'TypeScript代码质量规范',
    category: '代码规范',
    version: 'V2.0',
    status: '草案',
    creator: '赵前端',
    reviewer: '张技术',
    createTime: '2024-02-01',
    description: 'TypeScript编码风格、类型定义、ESLint配置、代码审查checklist',
    priority: 'Medium',
    complexity: 6,
    impact: ['前端项目'],
    downloadUrl: undefined
  },
  {
    id: 'STD-005',
    title: '微服务架构设计原则',
    category: '架构设计',
    version: 'V1.5',
    status: '评审中',
    creator: '李架构师',
    reviewer: '姚帆',
    createTime: '2024-01-20',
    description: '微服务拆分原则、服务边界定义、API网关设计、服务治理策略',
    priority: 'High',
    complexity: 10,
    impact: ['整体架构'],
    downloadUrl: undefined
  }
];

// 技术任务数据
const technicalTasks: TechnicalTask[] = [
  {
    id: 'TASK-001',
    title: '前端React组件开发规范V3.2评审',
    type: '规范制定',
    assignee: '李架构师',
    reporter: '张技术',
    priority: 'P0',
    status: '进行中',
    createTime: '2024-02-01',
    deadline: '2024-02-10',
    progress: 75,
    description: '对前端React组件开发规范V3.2进行全面评审，确保规范的实用性和可执行性',
    relatedStandards: ['STD-001'],
    estimatedHours: 16,
    actualHours: 12
  },
  {
    id: 'TASK-002',
    title: 'API接口标准化改造 - 智能营销模块',
    type: '架构优化',
    assignee: '王后端',
    reporter: '李架构师',
    priority: 'P1',
    status: '待开始',
    createTime: '2024-02-05',
    deadline: '2024-02-20',
    progress: 0,
    description: '按照RESTful API设计标准，对智能营销模块的接口进行标准化改造',
    relatedStandards: ['STD-002'],
    estimatedHours: 40,
    actualHours: undefined
  },
  {
    id: 'TASK-003',
    title: '代码质量检查工具升级',
    type: '工具建设',
    assignee: '赵前端',
    reporter: '王质量',
    priority: 'P1',
    status: '已完成',
    createTime: '2024-01-25',
    deadline: '2024-02-05',
    progress: 100,
    description: '升级ESLint、Prettier、SonarQube等代码质量检查工具，提升检查精度',
    relatedStandards: ['STD-004'],
    estimatedHours: 24,
    actualHours: 28
  },
  {
    id: 'TASK-004',
    title: 'React18新特性技术分享会',
    type: '培训分享',
    assignee: '张技术',
    reporter: '李架构师',
    priority: 'P2',
    status: '待开始',
    createTime: '2024-02-08',
    deadline: '2024-02-25',
    progress: 15,
    description: '组织React18新特性技术分享会，提升团队技术水平',
    relatedStandards: ['STD-001'],
    estimatedHours: 8,
    actualHours: undefined
  },
  {
    id: 'TASK-005',
    title: '历史项目TypeScript改造 - 社交云店',
    type: '技术债务',
    assignee: '陈前端',
    reporter: '李架构师',
    priority: 'P2',
    status: '进行中',
    createTime: '2024-01-30',
    deadline: '2024-03-15',
    progress: 45,
    description: '将社交云店项目从JavaScript改造为TypeScript，提升代码质量',
    relatedStandards: ['STD-004'],
    estimatedHours: 80,
    actualHours: 36
  },
  {
    id: 'TASK-006',
    title: '数据库性能优化 - 用户表索引重建',
    type: '质量提升',
    assignee: '陈数据',
    reporter: '李架构师',
    priority: 'P1',
    status: '已延期',
    createTime: '2024-01-20',
    deadline: '2024-02-01',
    progress: 30,
    description: '重建用户表索引，优化查询性能，预期提升查询速度50%',
    relatedStandards: ['STD-003'],
    estimatedHours: 16,
    actualHours: 8
  }
];

// 产品立项流程组件（中间）

// 版本管理与开发跟踪组件（右侧）
const VersionManagement = ({ selectedDemand }: { selectedDemand: ProductDemand | null }) => {
  // 冲突分析数据
  const getConflictAnalysis = (demand: ProductDemand) => {
    const conflicts = [];

    // 模拟冲突检测逻辑
    if (demand.title.includes('智能营销')) {
      conflicts.push({
        type: '功能冲突',
        severity: 'high',
        conflictWith: 'PRD-002 会员管理T2.1.5',
        similarity: 78,
        description: '智能营销的指定门店发奖功能与会员管理的多级分销佣金功能在业务逻辑上可能重叠',
        misunderstanding: '可能混淆门店发奖与分销佣金的触发条件',
        suggestion: '建议统一奖励机制设计，避免用户困惑'
      });

      conflicts.push({
        type: '数据冲突',
        severity: 'medium',
        conflictWith: '积分商城现有积分体系',
        similarity: 65,
        description: '新增的发奖策略可能与现有积分奖励机制产生数据不一致',
        misunderstanding: '用户可能不理解积分与奖励的区别',
        suggestion: '制定统一的积分奖励标准和展示规范'
      });
    }

    if (demand.title.includes('社交云店')) {
      conflicts.push({
        type: 'UI冲突',
        severity: 'medium',
        conflictWith: '智能营销装修组件',
        similarity: 72,
        description: '店铺装修配置与智能营销的页面装修功能存在交互体验冲突',
        misunderstanding: '商户可能不知道该在哪个入口进行装修',
        suggestion: '整合装修入口，制定统一的装修流程'
      });
    }

    if (demand.title.includes('会员管理')) {
      conflicts.push({
        type: '架构冲突',
        severity: 'high',
        conflictWith: '防窜物流代理商体系',
        similarity: 85,
        description: '多级分销与防窜物流的代理商层级管理存在架构设计冲突',
        misunderstanding: '代理商角色与分销员身份可能产生混淆',
        suggestion: '重新设计用户角色体系，明确权限边界'
      });
    }

    return conflicts;
  };

  // 技术影响评估
  const getTechnicalImpact = (demand: ProductDemand) => {
    const impacts = [];

    if (demand.developmentCost >= 7) {
      impacts.push({
        area: '数据库设计',
        impact: 'high',
        description: '需要新增多张业务表，可能影响现有查询性能',
        suggestion: '考虑分库分表，优化索引设计'
      });

      impacts.push({
        area: '接口设计',
        impact: 'medium',
        description: '新增接口较多，需要考虑版本兼容性',
        suggestion: '采用API版本控制，确保向下兼容'
      });
    }

    if (demand.title.includes('智能营销') || demand.title.includes('会员管理')) {
      impacts.push({
        area: '缓存策略',
        impact: 'medium',
        description: '涉及用户数据频繁读写，需要优化缓存策略',
        suggestion: '使用Redis集群，分层缓存设计'
      });
    }

    return impacts;
  };

  // 业务风险评估
  const getBusinessRisks = (demand: ProductDemand) => {
    const risks = [];

    if (demand.urgency === '紧急' && demand.importance === '重要') {
      risks.push({
        type: '时间风险',
        level: 'high',
        description: '紧急重要需求，时间压力大，容易忽略质量把控',
        mitigation: '增加code review轮次，延长测试时间'
      });
    }

    if (demand.businessValue / demand.developmentCost < 1.2) {
      risks.push({
        type: '投入产出风险',
        level: 'medium',
        description: 'ROI较低，投入与收益不成正比',
        mitigation: '重新评估需求价值，考虑分期实现'
      });
    }

    if (demand.customer.includes('代理') || demand.source === '代理伙伴') {
      risks.push({
        type: '需求变更风险',
        level: 'medium',
        description: '代理商需求容易变化，影响开发进度',
        mitigation: '锁定需求范围，制定变更管理流程'
      });
    }

    return risks;
  };

  if (!selectedDemand) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">智能版本管理</h3>
          <p className="text-sm text-gray-500">选择需求查看详细分析</p>
        </div>
      </div>
    );
  }

  // 根据需求找到对应项目
  const relatedProject = productProjects.find(p => p.demandId === selectedDemand.id);
  const conflicts = getConflictAnalysis(selectedDemand);
  const technicalImpacts = getTechnicalImpact(selectedDemand);
  const businessRisks = getBusinessRisks(selectedDemand);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-purple-50 overflow-hidden">
      <div className="p-3 pb-2 flex-shrink-0 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
        <h3 className="text-xs font-semibold text-gray-800 mb-0.5 flex items-center">
          <Crown className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
          智能版本管理
        </h3>
        <p className="text-xs text-gray-400">AI驱动的冲突检测与风险评估</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-3">
          {/* 关联项目信息 - 置顶显示 */}
          {relatedProject && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-green-50">
                <h4 className="font-medium text-slate-900 flex items-center text-xs">
                  <Package className="w-3.5 h-3.5 text-green-600 mr-1.5" />
                  关联项目信息
                </h4>
              </div>
              <div className="p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-500">版本号:</span>
                      <span className="text-purple-700 font-bold ml-1">{relatedProject.version}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">版本类型:</span>
                      <span className={`ml-1 px-1 py-0.5 rounded text-xs font-medium border ${relatedProject.versionType === '大版本' ? 'bg-red-100 text-red-700 border-red-200' :
                        relatedProject.versionType === '中版本' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        {relatedProject.versionType}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-500">当前状态:</span>
                      <span className="text-blue-700 font-medium ml-1">{relatedProject.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">预计交付:</span>
                      <span className="text-slate-800 ml-1 font-medium">{relatedProject.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* 进度条 - 统一设计 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">整体进度</span>
                    <span className="text-xs font-medium text-gray-900">{relatedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 relative"
                      style={{ width: `${relatedProject.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"></div>
                    </div>
                  </div>
                </div>

                {/* 团队信息 */}
                <div className="border-t border-slate-100 pt-2">
                  <div className="text-xs font-medium text-slate-800 mb-1">项目团队</div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-purple-600" />
                      <span className="text-slate-500">产品经理:</span>
                      <span className="text-slate-800 font-medium">{relatedProject.manager}</span>
                    </div>
                    {relatedProject.developer && (
                      <div className="flex items-center space-x-1">
                        <Code className="w-3 h-3 text-blue-600" />
                        <span className="text-slate-500">技术负责人:</span>
                        <span className="text-slate-800 font-medium">{relatedProject.developer}</span>
                      </div>
                    )}
                    {relatedProject.tester && (
                      <div className="flex items-center space-x-1">
                        <Bug className="w-3 h-3 text-emerald-600" />
                        <span className="text-slate-500">测试负责人:</span>
                        <span className="text-slate-800 font-medium">{relatedProject.tester}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 冲突分析 */}
          {conflicts.length > 0 && (
            <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
                <h4 className="font-medium text-red-900 flex items-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  冲突风险分析
                  <span className="ml-2 text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded-full font-medium">
                    {conflicts.length}个冲突
                  </span>
                </h4>
              </div>
              <div className="p-2.5 space-y-2.5">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2.5 space-y-2 border border-gray-200">
                    {/* 冲突头部信息 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${conflict.severity === 'high' ? 'bg-red-500 shadow-red-300 shadow-sm' :
                          conflict.severity === 'medium' ? 'bg-amber-500 shadow-amber-300 shadow-sm' : 'bg-emerald-500 shadow-emerald-300 shadow-sm'
                          }`} />
                        <span className="font-medium text-gray-800 text-xs">{conflict.type}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          {conflict.similarity}%
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${conflict.severity === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                          conflict.severity === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                          {conflict.severity === 'high' ? '高风险' : conflict.severity === 'medium' ? '中风险' : '低风险'}
                        </span>
                      </div>
                    </div>

                    {/* 冲突对象 */}
                    <div className="bg-white rounded p-2 border-l-2 border-blue-400 shadow-sm">
                      <div className="text-xs text-slate-500 mb-0.5 font-medium">冲突对象</div>
                      <div className="text-xs text-blue-700 font-medium break-words">{conflict.conflictWith}</div>
                    </div>

                    {/* 问题描述 */}
                    <div className="bg-white rounded p-2 border-l-2 border-slate-300 shadow-sm">
                      <div className="text-xs text-slate-500 mb-0.5 font-medium">问题描述</div>
                      <div className="text-xs text-slate-700 leading-relaxed break-words">{conflict.description}</div>
                    </div>

                    {/* 误解风险和修正建议 */}
                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded p-2 border border-orange-200 shadow-sm">
                        <div className="flex items-start space-x-1">
                          <AlertTriangle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-orange-900 mb-0.5">误解风险</div>
                            <div className="text-xs text-orange-800 leading-relaxed break-words">{conflict.misunderstanding}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-2 border border-blue-200 shadow-sm">
                        <div className="flex items-start space-x-1">
                          <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-blue-900 mb-0.5">修正建议</div>
                            <div className="text-xs text-blue-800 leading-relaxed break-words">{conflict.suggestion}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 技术影响评估 */}
          {technicalImpacts.length > 0 && (
            <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="font-medium text-blue-900 flex items-center text-xs">
                  <Code className="w-3.5 h-3.5 mr-1.5" />
                  技术影响评估
                </h4>
              </div>
              <div className="p-2.5 space-y-2">
                {technicalImpacts.map((impact, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded p-2 space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 text-xs">{impact.area}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${impact.impact === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                        impact.impact === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        {impact.impact === 'high' ? '高影响' : impact.impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed break-words">{impact.description}</p>
                    <div className="text-xs bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-800 p-2 rounded border border-emerald-200 leading-relaxed shadow-sm">
                      💡 建议: {impact.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 业务风险评估 */}
          {businessRisks.length > 0 && (
            <div className="bg-white rounded-lg border border-amber-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <h4 className="font-medium text-amber-900 flex items-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  业务风险评估
                </h4>
              </div>
              <div className="p-2.5 space-y-2">
                {businessRisks.map((risk, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded p-2 space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 text-xs">{risk.type}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${risk.level === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                        risk.level === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed break-words">{risk.description}</p>
                    <div className="text-xs bg-gradient-to-br from-sky-50 to-blue-100 text-sky-800 p-2 rounded border border-sky-200 leading-relaxed shadow-sm">
                      🛡️ 缓解措施: {risk.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 米多产品体系 */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50">
              <h4 className="font-medium text-slate-900 flex items-center text-xs">
                <Layers className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
                米多产品架构影响
              </h4>
            </div>
            <div className="p-2.5 space-y-1.5">
              <div className="grid grid-cols-1 gap-1.5">
                <div className="border border-blue-200 rounded p-2 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm">
                  <div className="font-medium text-blue-900 mb-0.5 flex items-center text-xs">
                    <Database className="w-3 h-3 mr-1" />
                    平台层影响
                  </div>
                  <div className="text-xs text-blue-700 leading-relaxed">
                    对{MIDO_PRODUCT_STRUCTURE.platform}的核心数据架构产生影响
                  </div>
                </div>

                <div className="border border-emerald-200 rounded p-2 bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm">
                  <div className="font-medium text-emerald-900 mb-0.5 flex items-center text-xs">
                    <Monitor className="w-3 h-3 mr-1" />
                    系统层影响
                  </div>
                  <div className="text-xs text-emerald-700 leading-relaxed">
                    主要影响: {MIDO_PRODUCT_STRUCTURE.systems.slice(0, 2).join('、')}
                  </div>
                </div>

                <div className="border border-purple-200 rounded p-2 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
                  <div className="font-medium text-purple-900 mb-0.5 flex items-center text-xs">
                    <Smartphone className="w-3 h-3 mr-1" />
                    应用层影响
                  </div>
                  <div className="text-xs text-purple-700 leading-relaxed">
                    涉及{MIDO_PRODUCT_STRUCTURE.applications.filter(app =>
                      selectedDemand.title.includes(app.substring(0, 2))
                    ).join('、')}等系统
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* 如果没有对应项目，显示AI建议 */}
          {!relatedProject && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-purple-200 shadow-sm">
              <div className="p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI智能建议
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-900 mb-1">版本规划建议</div>
                    <div className="text-purple-800">
                      建议版本类型: <span className="font-bold">{selectedDemand.businessValue >= 8 ? '中版本' : '小版本'}</span>
                    </div>
                    <div className="text-purple-800">
                      预计版本号: <span className="font-bold">{selectedDemand.businessValue >= 8 ? 'V2.X.0' : 'V2.X.X'}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-900 mb-1">立项流程建议</div>
                    <div className="text-blue-800">
                      {selectedDemand.businessValue >= 8 ?
                        '需通过产品委员会三稿制立项评审' :
                        '可走产品经理简化立项流程'
                      }
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-green-100">
                    <div className="font-medium text-green-900 mb-1">资源配置建议</div>
                    <div className="text-green-800">
                      预计需要配置: 产品经理1人 + 开发工程师{Math.ceil(selectedDemand.developmentCost / 3)}人 + 测试工程师1人
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 单个模块翻转容器
const FlipModule: React.FC<{
  position: 'left' | 'center' | 'right';
  currentModule: ModuleConfig | null;
  previousModule: ModuleConfig | null;
  getModuleProps: (moduleId: string) => any;
  isFlipping: boolean;
}> = ({ position, currentModule, previousModule, getModuleProps, isFlipping }) => {
  const getContainerClass = () => {
    switch (position) {
      case 'left':
        return 'bg-gradient-to-br from-white to-gray-50/30 border-r border-gray-200/60 shadow-sm h-full overflow-hidden min-h-full backdrop-blur-sm';
      case 'center':
        return 'flex flex-col min-w-0 h-full bg-gray-50 px-4 min-h-full';
      case 'right':
        return 'bg-gradient-to-br from-white to-gray-50/30 border-l border-gray-200/60 shadow-sm h-full overflow-hidden min-h-full backdrop-blur-sm';
      default:
        return '';
    }
  };

  // 简单的淡入淡出 + 缩放特效 - 统一且稳定，快速切换
  const flipVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 10,
    },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
        opacity: { duration: 0.12 },
        scale: { duration: 0.15 },
        y: { duration: 0.15 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.1,
        ease: [0.4, 0.0, 0.6, 1] as any,
        opacity: { duration: 0.08 },
        scale: { duration: 0.1 },
        y: { duration: 0.1 }
      }
    }
  };

  // 翻转中的3D效果
  const flippingVariants = {
    initial: {
      rotateY: 0,
      scale: 1
    },
    flip: {
      rotateY: [0, -45, -90, -135, -180],
      rotateX: [0, 5, 10, 5, 0],
      scale: [1, 0.9, 0.8, 0.9, 1],
      transition: {
        duration: 1.2,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <div className={getContainerClass()}>
      <AnimatePresence>
        {currentModule && (
          <motion.div
            key={`${currentModule.id}-${position}`}
            className="w-full h-full relative min-h-full"
            variants={flipVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{
              minHeight: '100%',
              height: '100%'
            }}
          >
            {/* 简单的内容容器 */}
            <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm">
              {React.createElement(currentModule.component, {
                ...getModuleProps(currentModule.id)
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 万花筒动效组件 - 文档转换为精美页面的循环动画
const KaleidoscopeAnimation: React.FC = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-6 border border-purple-200/60 backdrop-blur-lg shadow-lg">
      <div className="text-center">
        <h4 className="font-bold text-purple-800 mb-4 flex items-center justify-center drop-shadow-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          万花筒设计转换
        </h4>
        
        {/* 动画容器 */}
        <div className="relative h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {animationStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600">上传文档</p>
              </motion.div>
            )}

            {animationStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-lg shadow-lg flex items-center justify-center mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </motion.div>
                </div>
                <p className="text-xs text-purple-600">AI 分析中</p>
              </motion.div>
            )}

            {animationStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg shadow-lg flex items-center justify-center mb-2">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-purple-600">生成设计</p>
              </motion.div>
            )}

            {animationStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg shadow-lg flex items-center justify-center mb-2">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.7, 1] }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
                <p className="text-xs text-green-600">精美页面完成</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 进度指示器 */}
          <div className="absolute bottom-0 flex space-x-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  animationStep === step ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-800 mb-2 font-semibold drop-shadow-sm">专业的产品方案可视化设计助手</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-700 font-medium">
            <span className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              多格式支持
            </span>
            <span className="flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              AI 智能设计
            </span>
            <span className="flex items-center">
              <Monitor className="w-3 h-3 mr-1" />
              精美输出
            </span>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [selectedStandard, setSelectedStandard] = useState<TechnicalStandard>(technicalStandards[0]);
  const [previousMode, setPreviousMode] = useState<'normal' | 'assessment'>('normal');
  

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



  // 监听模式变化 - 统一使用 isTransitioning 状态
  useEffect(() => {
    if (customerSuccessMode !== previousMode) {
      setIsTransitioning(true);
      setPreviousMode(customerSuccessMode);

      // 大幅缩短动画时长，减少白屏
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }
  }, [customerSuccessMode, previousMode]);

  // 考核模式的组件 - 拆分为真正的三个模块 (青春阳光版)
  const AssessmentLeftPanel = () => (
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

  const AssessmentCenterPanel = ({ customerSuccessMode = 'normal' }: { customerSuccessMode?: 'normal' | 'assessment' }) => (
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

  const AssessmentRightPanel = () => (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <PieChart className="w-5 h-5 text-purple-600 mr-2" />
          能力分析
        </h3>
        <div className="text-sm text-gray-600">个人能力发展报告</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 雷达图区域 - 缩小尺寸 */}
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-3">能力发展趋势</h4>
          <div className="flex justify-center mb-3">
            {/* 优化的雷达图 - 修复样式问题 */}
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                {/* 雷达图背景网格 - 同心六边形 */}
                {[20, 35, 50, 65, 80].map((radius, index) => {
                  const points = Array.from({ length: 6 }, (_, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={index}
                      points={points}
                      fill="none"
                      stroke={index === 4 ? "#e2e8f0" : "#f1f5f9"}
                      strokeWidth={index === 4 ? "1" : "0.5"}
                    />
                  );
                })}

                {/* 六边形网格线 */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const x = 100 + 80 * Math.cos(angle);
                  const y = 100 + 80 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="0.5"
                    />
                  );
                })}

                {/* 当前能力数据多边形 */}
                {(() => {
                  const abilities = [88, 82, 90, 78, 85, 75]; // 客户洞察、问题解决、沟通表达、数据分析、团队协作、创新思维
                  const currentPoints = abilities.map((value, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const radius = (value / 100) * 70; // 最大半径70
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      points={currentPoints}
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                  );
                })()}

                {/* 目标能力数据多边形（虚线） */}
                {(() => {
                  const targetAbilities = [95, 90, 95, 85, 90, 85]; // 目标值
                  const targetPoints = targetAbilities.map((value, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const radius = (value / 100) * 70;
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      points={targetPoints}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4,3"
                    />
                  );
                })()}

                {/* 能力标签和数值点 */}
                {(() => {
                  const labels = ['客户洞察', '问题解决', '沟通表达', '数据分析', '团队协作', '创新思维'];
                  const values = [88, 82, 90, 78, 85, 75];
                  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

                  return labels.map((label, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const labelRadius = 110; // 增加标签距离
                    const dotRadius = (values[i] / 100) * 70;
                    const valueRadius = dotRadius + 15; // 数值标签位置在数据点外侧

                    const labelX = 100 + labelRadius * Math.cos(angle);
                    const labelY = 100 + labelRadius * Math.sin(angle);

                    const dotX = 100 + dotRadius * Math.cos(angle);
                    const dotY = 100 + dotRadius * Math.sin(angle);

                    const valueX = 100 + valueRadius * Math.cos(angle);
                    const valueY = 100 + valueRadius * Math.sin(angle);

                    return (
                      <g key={i}>
                        {/* 数据点 */}
                        <circle
                          cx={dotX}
                          cy={dotY}
                          r="4"
                          fill={colors[i]}
                          stroke="white"
                          strokeWidth="2"
                        />

                        {/* 标签背景 */}
                        <rect
                          x={labelX - 28}
                          y={labelY - 10}
                          width="56"
                          height="20"
                          rx="10"
                          fill="white"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />

                        {/* 标签文字 */}
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium"
                          fill="#374151"
                        >
                          {label}
                        </text>

                        {/* 数值标签背景 */}
                        <rect
                          x={valueX - 15}
                          y={valueY - 8}
                          width="30"
                          height="16"
                          rx="8"
                          fill={colors[i]}
                          fillOpacity="0.9"
                        />

                        {/* 数值标签 */}
                        <text
                          x={valueX}
                          y={valueY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold"
                          fill="white"
                        >
                          {values[i]}%
                        </text>
                      </g>
                    );
                  });
                })()}

                {/* 中心点 */}
                <circle
                  cx="100"
                  cy="100"
                  r="2"
                  fill="#64748b"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full opacity-20 border-2 border-green-500"></div>
              <span className="text-gray-600 font-medium">当前能力</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500 border border-dashed"></div>
              <span className="text-gray-600 font-medium">目标水平</span>
            </div>
          </div>
        </div>

        {/* 能力发展势态 - 扩展内容 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">能力发展势态</h4>
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-900 text-sm">客户洞察力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">优秀</span>
              </div>
              <div className="text-xs text-green-700 mb-2">
                具备深度洞察客户需求的能力，建议加强行业趋势分析
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 text-sm">问题解决力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">良好</span>
              </div>
              <div className="text-xs text-blue-700 mb-2">
                沟通技巧娴熟，建议增强跨部门协调能力
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-900 text-sm">沟通表达力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">优秀</span>
              </div>
              <div className="text-xs text-purple-700 mb-2">
                表达清晰有条理，继续保持并提升演讲技巧
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-purple-500" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-amber-900 text-sm">数据分析力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700">待提升</span>
              </div>
              <div className="text-xs text-amber-700 mb-2">
                需加强数据挖掘和统计分析技能
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 月度能力变化趋势 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">月度能力变化</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="text-green-600 font-bold">+5.2%</div>
                <div className="text-gray-600">客户洞察</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-bold">+3.1%</div>
                <div className="text-gray-600">问题解决</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-bold">+2.8%</div>
                <div className="text-gray-600">沟通表达</div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-bold">+1.5%</div>
                <div className="text-gray-600">数据分析</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold">+4.2%</div>
                <div className="text-gray-600">团队协作</div>
              </div>
              <div className="text-center">
                <div className="text-pink-600 font-bold">+2.3%</div>
                <div className="text-gray-600">创新思维</div>
              </div>
            </div>
          </div>
        </div>

        {/* 同事评价摘要 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">同事评价摘要</h4>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
              <div className="text-sm font-medium text-blue-900">产品部 - 王经理</div>
              <div className="text-xs text-blue-700 mt-1">"沟通能力很强，能快速理解客户需求，提出的解决方案很有针对性。"</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
              <div className="text-sm font-medium text-green-900">技术部 - 李工程师</div>
              <div className="text-xs text-green-700 mt-1">"合作愉快，善于协调各方资源，项目推进效率很高。"</div>
            </div>
          </div>
        </div>

        {/* 最新评估结果 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            最新评估结果
          </h4>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">综合评分</span>
              <span className="text-xl font-bold text-blue-600">88</span>
            </div>
            <div className="text-xs text-gray-600 mb-2">季度综合考核 • 2024-01-15</div>
            <div className="text-xs text-gray-600">
              排名：部门第3名 / 全公司前15%
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-amber-900 text-sm">改进建议</span>
            </div>
            <div className="space-y-1 text-xs text-amber-800">
              <div>• 加强数据分析力训练，建议参与BI工具培训</div>
              <div>• 参与更多客户沟通实践，提升现场应变能力</div>
              <div>• 定期更新产品知识，关注行业发展趋势</div>
              <div>• 加强跨部门协作，提升项目统筹能力</div>
            </div>
          </div>
        </div>

        {/* 能力提升计划 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">下季度提升计划</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-900">数据分析专项培训</div>
                <div className="text-xs text-gray-600">3月15日 - 3月30日</div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">进行中</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-900">客户沟通实战演练</div>
                <div className="text-xs text-gray-600">4月1日 - 4月15日</div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">待开始</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-900">跨部门协作项目</div>
                <div className="text-xs text-gray-600">4月15日 - 5月15日</div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">计划中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 固定的基础配置 - 根据模式动态生成
  const baseDepartmentConfigs: { [key: string]: DepartmentConfig } = useMemo(() => ({
    '客户成功部': {
      id: 'customer-success',
      name: '客户成功部',
      modules: customerSuccessMode === 'normal' ? [
        {
          id: 'customer-list',
          name: '客户列表',
          component: Sidebar,
          position: 'left',
          props: {}
        },
        {
          id: 'chat-area',
          name: '对话区域',
          component: ChatArea,
          position: 'center',
          props: {}
        },
        {
          id: 'right-panel',
          name: '右侧面板',
          component: CustomerPanel,
          position: 'right',
          props: {}
        }
      ] : [
        {
          id: 'assessment-left',
          name: '考核管理',
          component: AssessmentLeftPanel,
          position: 'left',
          props: {}
        },
        {
          id: 'assessment-center',
          name: '考核进行状态',
          component: AssessmentCenterPanel,
          position: 'center',
          props: {}
        },
        {
          id: 'assessment-right',
          name: '能力分析',
          component: AssessmentRightPanel,
          position: 'right',
          props: {}
        }
      ],
      theme: {
        primary: '#3B82F6',
        secondary: '#EFF6FF',
        background: '#F8FAFC'
      }
    },
    '品牌域': {
      id: 'brand',
      name: '品牌域',
      modules: [
        {
          id: 'demand-pool',
          name: 'TAPD需求池',
          component: DemandPool,
          position: 'left',
          props: {}
        },
        {
          id: 'brand-agent-center',
          name: '品牌域智能体中心',
          component: BrandAgentCenter,
          position: 'center',
          props: {}
        },
        {
          id: 'version-management',
          name: '版本管理',
          component: VersionManagement,
          position: 'right',
          props: {}
        }
      ],
      theme: {
        primary: '#8B5CF6',
        secondary: '#F3E8FF',
        background: '#FAFAFA'
      }
    },
    '基础研发部': {
      id: 'technical',
      name: '基础研发部',
      modules: [
        {
          id: 'standard-library',
          name: '技术规范管理库',
          component: TechnicalStandardLibrary,
          position: 'left',
          props: {}
        },
        {
          id: 'agent-center',
          name: '技术智能体中心',
          component: TechnicalAgentCenter,
          position: 'center',
          props: {}
        },
        {
          id: 'task-tracker',
          name: '任务跟踪管理',
          component: TechnicalTaskTracker,
          position: 'right',
          props: {}
        }
      ],
      theme: {
        primary: '#10B981',
        secondary: '#D1FAE5',
        background: '#F0FDF4'
      }
    },
    'HR': {
      id: 'hr',
      name: 'HR',
      modules: [
        {
          id: 'resume-agent-sidebar',
          name: '简历智能体',
          component: ResumeAgentSidebar,
          position: 'left',
          props: {}
        },
        {
          id: 'resume-chat-area',
          name: '智能体对话',
          component: ResumeChatArea,
          position: 'center',
          props: {}
        },
        {
          id: 'resume-ranking',
          name: '候选人排序',
          component: ResumeRanking,
          position: 'right',
          props: {}
        }
      ],
      theme: {
        primary: '#EA580C',
        secondary: '#FED7AA',
        background: '#FFF7ED'
      }
    }
  }), [customerSuccessMode]);

  // 动态更新props的函数
  const getModuleProps = useCallback((moduleId: string) => {
    switch (moduleId) {
      case 'customer-list':
        return {
          onCustomerSelect: onCustomerSelect,
          selectedCustomer: selectedCustomer
        };
      case 'chat-area':
        return {
          selectedCustomer: selectedCustomer
        };
      case 'right-panel':
        return {
          customer: selectedCustomer
        };
      case 'demand-pool':
        return {
          selectedDemand: selectedDemand,
          onDemandSelect: setSelectedDemand,
          productDemands: productDemands
        };
      case 'project-flow':
        return {
          selectedDemand: selectedDemand
        };
      case 'version-management':
        return {
          selectedDemand: selectedDemand
        };
      case 'standard-library':
        return {
          selectedStandard: selectedStandard,
          onStandardSelect: setSelectedStandard
        };
      case 'agent-center':
        return {
          selectedStandard: selectedStandard
        };
      case 'task-tracker':
        return {
          selectedStandard: selectedStandard
        };
      // 考核模式的组件不需要额外props
      case 'assessment-center':
        return {
          customerSuccessMode: customerSuccessMode
        };
      case 'assessment-left':
        return {};
      case 'assessment-right':
        return {};
      default:
        return {};
    }
  }, [selectedCustomer, onCustomerSelect, selectedDemand, selectedStandard]);

  // 获取当前部门配置
  const currentConfig = baseDepartmentConfigs[currentDepartment];
  const previousConfig = previousDepartment ? baseDepartmentConfigs[previousDepartment] : null;

  // 当部门切换时的动效处理
  useEffect(() => {
    if (!currentConfig) return;

    // 如果是初始加载，不需要翻转动效
    if (!previousDepartment) {
      setPreviousDepartment(currentDepartment);
      return;
    }

    // 如果部门没有变化，不需要翻转
    if (previousDepartment === currentDepartment) return;

    setIsTransitioning(true);

    // 模块翻转动效延迟
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousDepartment(currentDepartment);
    }, 150); // 大幅缩短翻转时间，减少白屏

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
            animate={{ 
              x: [0, 80, 0],
              y: [0, -60, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-3 h-3 bg-blue-300/20 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, -60, 0],
              y: [0, 80, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 right-20 w-4 h-4 bg-green-300/15 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, 40, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 left-20 w-2 h-2 bg-purple-300/20 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, -30, 0],
              y: [0, 50, 0],
              rotate: [0, 90, 180]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-60 left-80 w-2 h-2 bg-orange-300/15 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 22,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-40 right-80 w-3 h-3 bg-red-300/18 rounded-full"
          />
          
          {/* 额外的HR专属背景动效 */}
          <motion.div
            animate={{ 
              x: [0, -70, 0],
              y: [0, 60, 0],
              rotate: [0, 270, 360],
              scale: [1, 1.4, 1]
            }}
            transition={{ 
              duration: 28,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-32 right-40 w-4 h-4 bg-gradient-to-br from-blue-400/15 to-cyan-400/10 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, 45, 0],
              y: [0, -70, 0],
              rotate: [0, -120, -240]
            }}
            transition={{ 
              duration: 35,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-32 left-60 w-2 h-2 bg-gradient-to-br from-green-400/20 to-emerald-400/15 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, -25, 0],
              y: [0, 40, 0],
              scale: [1, 1.8, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-80 left-32 w-3 h-3 bg-gradient-to-br from-indigo-400/12 to-purple-400/8 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, 35, 0],
              y: [0, -45, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 26,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-80 right-60 w-2 h-2 bg-gradient-to-br from-teal-400/18 to-cyan-400/12 rounded-full"
          />
        </div>
      )}

      {/* 模块区域 - 固定高度防止切换时塌陷 */}
      <div className="flex-1 grid grid-cols-[280px_1fr_280px] gap-0 overflow-hidden relative z-10 min-h-0" style={{ height: 'calc(100vh - 64px)' }}>
        {/* 左侧模块 */}
        <FlipModule
          position="left"
          currentModule={modulesByPosition.left}
          previousModule={previousModulesByPosition.left}
          getModuleProps={getModuleProps}
          isFlipping={isTransitioning}
        />

        {/* 中间模块 */}
        <FlipModule
          position="center"
          currentModule={modulesByPosition.center}
          previousModule={previousModulesByPosition.center}
          getModuleProps={getModuleProps}
          isFlipping={isTransitioning}
        />

        {/* 右侧模块 */}
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

// 技术规范管理库组件（左侧）
const TechnicalStandardLibrary = ({ selectedStandard, onStandardSelect }: {
  selectedStandard: TechnicalStandard | null,
  onStandardSelect: (standard: TechnicalStandard) => void
}) => {
  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-green-50/40 to-blue-50/40 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Code className="w-5 h-5 text-green-600 mr-2" />
          技术规范管理库
        </h3>
        <p className="text-sm text-gray-600">制定、维护、跟踪技术规范执行情况</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {technicalStandards.map((standard) => (
          <button
            key={standard.id}
            onClick={() => onStandardSelect(standard)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedStandard?.id === standard.id
              ? 'border-green-300/60 bg-green-50/60 shadow-sm backdrop-blur-sm'
              : 'border-gray-200/60 hover:border-green-200/60 hover:bg-gray-50/60 backdrop-blur-sm'
              }`}
          >
            <h4 className="font-medium text-gray-900 text-sm mb-1">{standard.title}</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{standard.category}</span>
              <span className="text-green-600">{standard.version}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 任务跟踪管理组件（右侧）
const TechnicalTaskTracker = ({ selectedStandard }: { selectedStandard: TechnicalStandard | null }) => {
  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-blue-50/40 to-green-50/40 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-2" />
          任务跟踪管理
        </h3>
        <p className="text-sm text-gray-600">跟踪技术任务执行进度</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {technicalTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3">
            <h4 className="font-medium text-gray-900 text-sm mb-2">{task.title}</h4>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-600">{task.type}</span>
              <span className={`px-2 py-1 rounded ${task.priority === 'P0' ? 'bg-red-100 text-red-700' :
                task.priority === 'P1' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                {task.priority}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{task.progress}% 完成</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 智能体相关类型定义
interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  description: string;
  model: string;
  capabilities: string[];
  temperature: number;
  systemPrompt: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentId?: string;
}

// 基础研发部智能体定义
const technicalAgents: AIAgent[] = [
  {
    id: 'report-generator',
    name: '简报输出助手',
    avatar: '📊',
    specialty: '技术简报生成',
    description: '专业的技术简报撰写助手，能够基于数据生成周报、月报、技术洞察等各类简报',
    model: 'GPT-4-Turbo',
    capabilities: [
      '数据分析总结',
      '多格式简报生成',
      '技术趋势洞察',
      '可视化图表建议',
      'KPI指标解读'
    ],
    temperature: 0.7,
    systemPrompt: `你是一位专业的技术简报撰写助手。你的任务是帮助基础研发部生成高质量的技术简报。

你的专长包括：
1. 数据分析和总结
2. 技术趋势分析
3. 项目进展汇报
4. 风险识别和建议
5. 可视化呈现建议

请以专业、简洁、数据驱动的方式回应用户需求，确保输出的简报具有实用性和可读性。`,
    icon: MessageSquare,
    color: 'text-blue-600'
  },
  {
    id: 'code-reviewer',
    name: '代码评审专家',
    avatar: '🔍',
    specialty: '代码质量分析',
    description: '专注于代码审查、质量评估、最佳实践指导的AI助手',
    model: 'GPT-4-Code',
    capabilities: [
      '代码质量评估',
      '安全漏洞检测',
      '性能优化建议',
      '架构设计审查',
      '编码规范检查'
    ],
    temperature: 0.3,
    systemPrompt: `你是一位资深的代码评审专家。专注于帮助开发团队提升代码质量和技术水平。

你的核心能力：
1. 代码质量评估和建议
2. 安全性分析
3. 性能优化指导
4. 架构设计评审
5. 最佳实践推荐

请以严谨、专业的态度进行代码评审，提供具体可行的改进建议。`,
    icon: Eye,
    color: 'text-purple-600'
  },
  {
    id: 'architecture-advisor',
    name: '架构设计顾问',
    avatar: '🏗️',
    specialty: '系统架构设计',
    description: '专业的系统架构设计顾问，提供架构方案、技术选型、扩展性设计建议',
    model: 'GPT-4-Turbo',
    capabilities: [
      '系统架构设计',
      '技术选型建议',
      '扩展性规划',
      '微服务架构',
      '云原生方案'
    ],
    temperature: 0.4,
    systemPrompt: `你是一位资深的系统架构师。专注于帮助团队设计高可用、可扩展、可维护的系统架构。

你的专业领域：
1. 系统架构设计和优化
2. 技术选型和评估
3. 微服务架构设计
4. 云原生解决方案
5. 性能和扩展性规划

请基于实际需求提供专业的架构建议，考虑技术可行性、团队能力和业务发展。`,
    icon: Layers,
    color: 'text-green-600'
  },
  {
    id: 'performance-optimizer',
    name: '性能优化专家',
    avatar: '⚡',
    specialty: '性能调优',
    description: '专注于系统性能监控、分析、优化的AI助手',
    model: 'GPT-4-Turbo',
    capabilities: [
      '性能瓶颈分析',
      '数据库优化',
      '前端性能优化',
      '缓存策略设计',
      '监控方案设计'
    ],
    temperature: 0.5,
    systemPrompt: `你是一位性能优化专家。专注于帮助团队识别和解决各类性能问题。

你的专业能力：
1. 性能瓶颈识别和分析
2. 数据库查询和索引优化
3. 前端加载和渲染优化
4. 缓存策略设计
5. 监控和告警方案

请提供具体、可操作的性能优化建议，并考虑成本效益比。`,
    icon: Zap,
    color: 'text-orange-600'
  },
  {
    id: 'standard-keeper',
    name: '规范制定助手',
    avatar: '📋',
    specialty: '技术规范管理',
    description: '协助制定、维护、推广各类技术规范和最佳实践',
    model: 'GPT-4-Turbo',
    capabilities: [
      '规范文档编写',
      '最佳实践整理',
      '规范执行监督',
      '团队培训内容',
      '工具链建设'
    ],
    temperature: 0.6,
    systemPrompt: `你是一位技术规范管理专家。专注于帮助团队建立和维护高质量的技术规范体系。

你的专业职责：
1. 技术规范文档编写和维护
2. 最佳实践总结和推广
3. 规范执行效果评估
4. 团队培训内容设计
5. 自动化工具建设建议

请提供实用、易执行的规范管理建议，确保规范的落地性和有效性。`,
    icon: Monitor,
    color: 'text-indigo-600'
  },
  {
    id: 'tech-trainer',
    name: '技术培训专家',
    avatar: '🎓',
    specialty: '团队技能提升',
    description: '设计技术培训方案，提升团队整体技术水平',
    model: 'GPT-4-Turbo',
    capabilities: [
      '培训方案设计',
      '技能评估体系',
      '学习路径规划',
      '知识分享组织',
      '技术趋势解读'
    ],
    temperature: 0.8,
    systemPrompt: `你是一位技术培训专家。专注于帮助团队设计有效的技术培训和能力提升方案。

你的核心职能：
1. 个性化学习路径设计
2. 技能评估和差距分析
3. 培训内容和方法设计
4. 知识分享活动组织
5. 技术发展趋势指导

请提供实用的培训建议，注重学习效果和团队参与度。`,
    icon: Crown,
    color: 'text-red-600'
  }
];

// 品牌域智能体定义
const brandAgents: AIAgent[] = [
  {
    id: 'kaleidoscope-agent',
    name: '万花筒智能体',
    avatar: '✨',
    specialty: '产品方案可视化',
    description: '专业的产品方案可视化设计助手，能够生成精美的设计图和原型',
    model: 'GPT-5',
    capabilities: [
      '产品原型设计',
      '视觉方案生成',
      '用户界面设计',
      '交互流程设计',
      '设计规范制定'
    ],
    temperature: 0.8,
    systemPrompt: `你是万花筒智能体，专注于产品方案的可视化设计和呈现。

你的核心能力：
1. 根据产品需求生成视觉化方案
2. 设计用户界面和交互流程
3. 提供设计建议和最佳实践
4. 生成产品原型和效果图
5. 制定视觉设计规范

请以创意、美观、实用的方式帮助用户实现产品可视化需求。`,
    icon: Sparkles,
    color: 'text-purple-600'
  },
  {
    id: 'project-assistant',
    name: '项目智能助手',
    avatar: '🤖',
    specialty: '项目管理与分析',
    description: '基于七步成诗法的项目管理AI助手，提供全流程项目支持',
    model: 'GPT-4-Turbo',
    capabilities: [
      '项目进度分析',
      '风险评估预警',
      '资源配置优化',
      '需求分析整理',
      '决策支持建议'
    ],
    temperature: 0.6,
    systemPrompt: `你是品牌域的项目智能助手，基于"七步成诗"项目管理法为用户提供专业支持。

七步成诗法包括：
1. 立项调研 - 项目启动和需求分析
2. 原型设计 - 产品原型和方案设计
3. 开发跟踪 - 开发进度监控
4. 测试上线 - 质量保证和发布
5. 用户反馈 - 用户体验收集
6. 数据分析 - 效果评估分析
7. 项目复盘 - 经验总结沉淀

请结合当前项目情况，为用户提供专业的项目管理建议。`,
    icon: Bot,
    color: 'text-blue-600'
  },
  {
    id: 'data-analyst',
    name: '数据分析专家',
    avatar: '📊',
    specialty: '数据洞察与分析',
    description: '专业的数据分析和可视化专家，提供深度数据洞察',
    model: 'GPT-4-Analytics',
    capabilities: [
      '数据趋势分析',
      '用户行为洞察',
      '业务指标监控',
      '预测建模分析',
      '可视化图表设计'
    ],
    temperature: 0.4,
    systemPrompt: `你是数据分析专家，专注于为品牌域项目提供数据驱动的洞察和建议。

你的专业领域：
1. 用户数据分析和行为洞察
2. 业务指标监控和趋势分析
3. A/B测试设计和结果解读
4. 预测模型建立和验证
5. 数据可视化和报告生成

请以数据为基础，为用户提供准确、有价值的分析结果和建议。`,
    icon: PieChart,
    color: 'text-green-600'
  },
  {
    id: 'content-creator',
    name: '内容创作大师',
    avatar: '✍️',
    specialty: '创意内容生成',
    description: '擅长创作各类营销内容和品牌文案的创意专家',
    model: 'GPT-4-Creative',
    capabilities: [
      '品牌文案创作',
      '营销内容策划',
      '社交媒体文案',
      '产品描述优化',
      '创意故事编写'
    ],
    temperature: 0.9,
    systemPrompt: `你是内容创作大师，专注于为品牌提供创意、吸引人的内容创作服务。`,
    icon: Lightbulb,
    color: 'text-orange-600'
  },
  {
    id: 'marketing-strategist',
    name: '营销策略师',
    avatar: '🎯',
    specialty: '营销策略规划',
    description: '专业的营销策略制定和市场推广专家',
    model: 'GPT-4-Strategy',
    capabilities: [
      '营销策略制定',
      '市场调研分析',
      '竞品分析',
      '推广渠道规划',
      'ROI效果评估'
    ],
    temperature: 0.7,
    systemPrompt: `你是营销策略师，帮助品牌制定有效的营销策略和推广方案。`,
    icon: Target,
    color: 'text-red-600'
  },
  {
    id: 'ui-designer',
    name: '界面设计师',
    avatar: '🎨',
    specialty: 'UI/UX设计',
    description: '专业的用户界面和用户体验设计专家',
    model: 'GPT-4-Design',
    capabilities: [
      '界面设计方案',
      '用户体验优化',
      '交互原型设计',
      '设计系统建立',
      '可用性测试'
    ],
    temperature: 0.8,
    systemPrompt: `你是界面设计师，专注于创造美观且易用的用户界面设计。`,
    icon: Palette,
    color: 'text-pink-600'
  },
  {
    id: 'brand-consultant',
    name: '品牌顾问',
    avatar: '👑',
    specialty: '品牌战略咨询',
    description: '资深品牌战略顾问，提供全方位品牌建设指导',
    model: 'GPT-4-Consultant',
    capabilities: [
      '品牌定位策略',
      '品牌形象设计',
      '品牌传播策略',
      '品牌价值提升',
      '危机公关处理'
    ],
    temperature: 0.6,
    systemPrompt: `你是品牌顾问，帮助企业建立强有力的品牌形象和市场地位。`,
    icon: Crown,
    color: 'text-purple-800'
  },
  {
    id: 'tech-innovator',
    name: '技术创新者',
    avatar: '⚡',
    specialty: '技术创新方案',
    description: '前沿技术应用和创新解决方案专家',
    model: 'GPT-4-Tech',
    capabilities: [
      '技术方案设计',
      '创新产品构思',
      '技术趋势分析',
      '系统架构规划',
      '技术选型建议'
    ],
    temperature: 0.8,
    systemPrompt: `你是技术创新者，专注于探索和应用前沿技术解决实际问题。`,
    icon: Zap,
    color: 'text-yellow-600'
  }
];

// 智能体对话中心组件（中间）
const TechnicalAgentCenter = ({ selectedStandard }: { selectedStandard: TechnicalStandard | null }) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(technicalAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好！我是${selectedAgent.name}，${selectedAgent.description}。我可以帮你：\n\n${selectedAgent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n有什么我可以帮助你的吗？`,
      timestamp: new Date().toISOString(),
      agentId: selectedAgent.id
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 文件上传处理
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // 当切换智能体时重置对话
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `你好！我是${selectedAgent.name}，${selectedAgent.description}。我可以帮你：\n\n${selectedAgent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n有什么我可以帮助你的吗？`,
        timestamp: new Date().toISOString(),
        agentId: selectedAgent.id
      }
    ]);
  }, [selectedAgent]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAgentResponse(inputMessage, selectedAgent, selectedStandard);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        agentId: selectedAgent.id
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAgentResponse = (userInput: string, agent: AIAgent, context?: TechnicalStandard | null): string => {
    switch (agent.id) {
      case 'report-generator':
        if (userInput.includes('月报') || userInput.includes('简报')) {
          return `## 基础研发部技术月报 - ${new Date().getFullYear()}年${new Date().getMonth() + 1}月

### 📊 本月技术指标概览
- **技术规范文档**: 新增3个，更新2个
- **代码质量评分**: 92.5% (↑2.1%)
- **架构债务处理**: 完成8项，进行中5项
- **团队培训参与**: 95%覆盖率

### 🎯 主要成果亮点
1. **前端React组件规范V3.2** 完成评审，即将发布
2. **API接口标准化改造** 已覆盖78%的业务模块
3. **性能优化专项** 平均响应时间减少15%
4. **代码质量工具升级** 新增TypeScript严格模式检查

### 🚧 面临的挑战
- 老项目技术栈升级进度需要加速
- 跨团队规范执行的一致性有待提升
- 新技术培训与实际项目应用的衔接

### 📋 下月工作重点
1. 推进微服务架构设计原则制定
2. 启动React18升级技术调研
3. 建立自动化代码质量监控体系
4. 组织架构设计专题培训

需要我深入分析某个具体方面吗？`;
        }
        if (userInput.includes('数据') || userInput.includes('分析')) {
          return `基于当前技术数据，我为你分析：

**代码质量趋势分析**
- 当前评分: 92.5%
- 月增长: +2.1%
- 主要提升点: TypeScript类型覆盖率从78%提升到89%

**规范执行情况**
- 前端规范执行率: 87%
- API规范执行率: 78%
- 数据库规范执行率: 91%

**建议关注点**
1. API规范执行率相对较低，需要加强推广
2. 新项目规范执行情况良好，老项目需要专项改造
3. 建议设立规范执行情况月度review机制

需要我生成详细的数据可视化建议吗？`;
        }
        return `作为简报输出助手，我可以帮你：

📊 **生成各类技术简报**
- 周报/月报/季报模板
- 技术洞察分析
- 项目进展汇报
- 风险评估报告

📈 **数据分析服务**
- KPI指标解读
- 趋势分析预测
- 对比分析报告

你希望我帮你生成什么类型的简报？请告诉我具体需求和数据范围。`;

      case 'code-reviewer':
        return `作为代码评审专家，针对你的问题：

🔍 **代码质量检查重点**
1. **安全性**: SQL注入、XSS防护、身份验证
2. **性能**: 算法复杂度、内存使用、查询优化
3. **可维护性**: 代码结构、命名规范、注释质量
4. **可测试性**: 单元测试覆盖、模块解耦

📋 **当前项目评估建议**
基于最新规范STD-001 (React组件开发规范V3.2)：
- 组件Props类型定义完整性
- Hooks使用最佳实践
- 状态管理模式一致性
- 错误边界处理

需要我针对特定代码进行深度分析吗？请提供代码片段或具体模块。`;

      case 'architecture-advisor':
        return `作为架构设计顾问，我来分析你的需求：

🏗️ **当前系统架构评估**
- **微服务拆分合理性**: 基于业务域边界
- **数据一致性策略**: 分布式事务vs最终一致性
- **扩展性设计**: 水平扩展能力评估

⚡ **技术选型建议**
考虑团队现状和业务发展：
1. **前端框架**: React18升级路径规划
2. **状态管理**: Redux Toolkit vs Zustand
3. **构建工具**: Vite vs Webpack性能对比
4. **部署策略**: 容器化vs传统部署

🎯 **下一步行动计划**
基于现有架构STD-005规范，建议优先考虑：
- API网关标准化
- 服务注册发现机制
- 监控和链路追踪

具体哪个架构模块需要我深入分析？`;

      case 'performance-optimizer':
        return `性能优化分析报告：

⚡ **当前性能指标**
- 页面加载时间: 平均2.3s (目标<2s)
- API响应时间: 平均180ms (已优化15%)
- 数据库查询: 慢查询减少到<5%

🎯 **优化建议优先级**
1. **P0级别** - 首屏加载优化
   - 代码分割和懒加载
   - 图片压缩和CDN
   - 关键渲染路径优化

2. **P1级别** - 数据库性能
   - 索引优化建议
   - 查询语句重构
   - 连接池配置调优

3. **P2级别** - 缓存策略
   - Redis缓存层设计
   - 浏览器缓存策略
   - CDN缓存配置

📊 **监控方案建议**
建议建立性能监控仪表板，包含核心指标实时追踪。

需要我针对特定性能瓶颈提供详细优化方案吗？`;

      case 'standard-keeper':
        return `规范管理现状分析：

📋 **当前规范体系**
- 前端开发规范: STD-001 (React V3.2) - 评审中
- API设计规范: STD-002 (RESTful V2.1) - 已发布
- 数据库规范: STD-003 (MySQL V1.8) - 已发布
- 代码质量规范: STD-004 (TypeScript V2.0) - 草案

✅ **执行情况评估**
- 新项目规范执行率: 89%
- 历史项目改造进度: 67%
- 团队培训完成率: 95%

🎯 **改进建议**
1. **规范制定**: 建立规范版本管理和变更流程
2. **执行监督**: 设立规范检查自动化工具
3. **推广培训**: 定期组织规范解读和案例分享
4. **反馈机制**: 建立规范使用问题收集和迭代机制

需要我协助制定特定领域的技术规范吗？`;

      case 'tech-trainer':
        return `团队技能提升方案建议：

🎓 **当前团队技术水平评估**
- React/TypeScript熟练度: 中高级 (85%成员)
- 架构设计能力: 中级 (60%成员)
- 性能优化经验: 初中级 (45%成员)
- 规范意识: 高 (90%成员)

📚 **培训计划建议**
**Q1重点** - React18新特性
- 并发渲染机制理解
- Suspense和Transition实战
- 性能优化新模式

**Q2重点** - 架构设计能力
- 微服务设计模式
- 系统扩展性规划
- 技术选型方法论

🎯 **学习方式设计**
1. **理论学习**: 每周技术分享 (1.5h)
2. **实战演练**: 月度技术挑战项目
3. **交流讨论**: 双周架构设计review
4. **外部学习**: 推荐优质技术课程和会议

需要我为特定技术领域设计详细的培训方案吗？`;

      default:
        return `你好！我是${agent.name}，很高兴为你服务。请告诉我你需要什么帮助，我会基于我的专业知识为你提供支持。`;
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-green-50/30 via-blue-50/30 to-purple-50/30 backdrop-blur-sm">
      {/* 技术代码流背景动画 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.3 }}
        >
          <defs>
            <radialGradient id="TechGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="28s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#10B98100" />
            </radialGradient>
            <radialGradient id="TechGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="19s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#05966900" />
            </radialGradient>
            <radialGradient id="TechGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
              <animate attributeName="fx" dur="23s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#34D39900" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#TechGradient1)">
            <animate attributeName="x" dur="18s" values="25%;0%;25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="20s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="15s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#TechGradient2)">
            <animate attributeName="x" dur="21s" values="-25%;0%;-25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="24s" values="25%;-25%;25%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="-360 50 50"
              dur="18s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#TechGradient3)">
            <animate attributeName="x" dur="25s" values="0%;50%;0%" repeatCount="indefinite" />
            <animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="22s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
      
      {/* 主对话区域 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 当前智能体简化信息 */}
        <div className="bg-gradient-to-r from-white/50 to-green-50/40 backdrop-blur-sm border-b border-green-100 p-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-lg shadow-sm">
              {selectedAgent.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{selectedAgent.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded font-medium">
                  {selectedAgent.model}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">在线</span>
              </div>
            </div>
          </div>
        </div>

        {/* 消息列表区域 - 优化滚动 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${message.role === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg rounded-br-md shadow-md'
                  : 'bg-white/95 border border-gray-200 rounded-lg rounded-bl-md shadow-md'
                  } p-3`}>
                  {message.role === 'user' ? (
                    <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{message.content}</pre>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-3 border-b pb-1">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2 mt-4">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-medium text-gray-700 mb-2 mt-3">{children}</h3>,
                          p: ({children}) => <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="ml-1">{children}</li>,
                          code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 text-gray-700 mb-2">{children}</blockquote>,
                          strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/95 border border-gray-200 rounded-lg rounded-bl-md p-3 shadow-md">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">思考中</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 智能体选择器 */}
        <div className="border-t border-gray-200/50 bg-white/50 p-3 flex-shrink-0 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs font-medium text-gray-600">选择智能体:</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {technicalAgents.map((agent) => {
              const IconComponent = agent.icon;
              const isActive = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-sm">{agent.avatar}</span>
                  <IconComponent className="w-3 h-3" />
                  <span className="whitespace-nowrap">{agent.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 输入区域 - 统一品牌域风格 */}
        <div className="bg-white/20 backdrop-blur-md p-4 flex-shrink-0 relative z-20 border-t border-gray-100/30">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm" style={{
            border: '1px solid rgba(148, 163, 184, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          }}>

            {/* 智能体头像 */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl text-lg" style={{
              background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
            }}>
              {selectedAgent.avatar}
            </div>

            {/* 文件上传按钮 */}
            <input
              type="file"
              id="tech-file-upload"
              multiple
              onChange={(e) => handleFileUpload && handleFileUpload(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="tech-file-upload"
              className="flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(148, 163, 184, 0.12)'
              }}
              title="上传技术文档"
            >
              <Paperclip className="w-4 h-4 text-gray-500" />
            </label>

            {/* 输入框 */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={`向${selectedAgent.name}咨询技术问题...`}
              className="flex-1 h-11 px-4 bg-transparent border-0 focus:outline-none text-sm placeholder-gray-500 rounded-lg"
            />

            {/* 发送按钮 */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: !inputMessage.trim() || isTyping 
                  ? 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)'
                  : 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                boxShadow: !inputMessage.trim() || isTyping 
                  ? '0 2px 8px rgba(156, 163, 175, 0.25)'
                  : '0 2px 8px rgba(16, 185, 129, 0.4), 0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 品牌域智能体中心组件
const BrandAgentCenter = ({ selectedDemand }: { selectedDemand: ProductDemand | null }) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(brandAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAgentSelectorExpanded, setIsAgentSelectorExpanded] = useState(false);
  const [prdPreviewOpen, setPrdPreviewOpen] = useState(false);
  const [prdPreviewContent, setPrdPreviewContent] = useState('');

  // 文件处理函数
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now().toString(),
      agentId: selectedAgent.id
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]);
    setIsTyping(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAgentResponse(selectedAgent, inputMessage),
        timestamp: (Date.now() + 1000).toString(),
        agentId: selectedAgent.id
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  // 检测消息是否包含PRD相关内容
  const isPRDContent = (content: string) => {
    const prdKeywords = [
      '万花筒设计方案', 'PRD', '需求文档', '产品方案', '设计方案',
      '视觉设计方向', '交互流程设计', '技术实现建议',
      '用户界面', '现代化', '产品设计', '万花筒'
    ];
    return prdKeywords.some(keyword => content.includes(keyword));
  };

  // 处理PRD预览
  const handlePRDPreview = (content: string) => {
    setPrdPreviewContent(content);
    setPrdPreviewOpen(true);
  };

  // 获取智能体回复
  const getAgentResponse = (agent: AIAgent, userInput: string): string => {
    switch (agent.id) {
      case 'kaleidoscope-agent':
        return `🎨 **万花筒设计方案**

基于您的需求"${userInput}"，我为您生成以下设计建议：

**视觉设计方向**
• 现代简约风格，突出功能性和美观性
• 采用渐变色彩搭配，营造科技感
• 响应式布局，支持多端适配

**交互流程设计**
1. 用户进入页面 → 引导动画
2. 功能展示 → 交互演示
3. 操作反馈 → 结果呈现

**技术实现建议**
• 使用Framer Motion进行动画处理
• 采用CSS Grid布局系统
• 集成可视化图表库

需要我为您生成具体的原型图或详细设计规范吗？`;

      case 'project-assistant':
        return `📋 **七步成诗项目分析**

针对当前项目情况，我提供以下建议：

**当前阶段评估**
• 项目进度：${selectedDemand ? '75%' : '待选择需求'}
• 关键风险：时间节点紧张，需要加强协调
• 资源状态：开发人员充足，测试资源紧张

**下一步行动计划**
1. **立项调研**：完善需求文档
2. **原型设计**：确认设计方案
3. **开发跟踪**：每日站会同步
4. **测试上线**：提前准备测试用例

**风险预警**
⚠️ 建议关注依赖模块的进度
⚠️ 需要提前协调上线资源

有什么具体问题需要深入分析吗？`;

      case 'data-analyst':
        return `📊 **数据分析洞察**

基于您的查询"${userInput}"，以下是数据分析结果：

**关键指标趋势**
• 用户活跃度：↗️ 上升12.5%
• 转化率：↗️ 提升8.3%
• 用户留存：→ 保持稳定

**用户行为分析**
1. 高峰使用时段：9:00-11:00, 14:00-16:00
2. 主要功能偏好：搜索(45%) > 浏览(32%) > 交互(23%)
3. 平均会话时长：3分42秒

**优化建议**
• 在高峰时段推送重要功能
• 优化搜索体验，提升用户满意度
• 增加互动元素，延长用户停留时间

需要我进行更深入的数据挖掘分析吗？`;

      default:
        return `你好！我是${agent.name}，很高兴为你服务。请告诉我你需要什么帮助，我会基于我的专业知识为你提供支持。`;
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 动态云彩背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.4 }}
        >
          <defs>
            <radialGradient id="BrandGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#a855f700" />
            </radialGradient>
            <radialGradient id="BrandGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ec489900" />
            </radialGradient>
            <radialGradient id="BrandGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
              <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f9731600" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#BrandGradient1)">
            <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="17s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#BrandGradient2)">
            <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="18s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#BrandGradient3)">
            <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
            <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="19s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* 主对话区域 */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        {/* 常驻智能体显示区域 */}
        <div className="bg-gradient-to-r from-white/30 to-purple-50/30 backdrop-blur-sm border-b border-purple-100/30 p-3 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* 智能体头像 - 增强可感知性 */}
            <motion.div
              className="relative cursor-pointer group"
              onClick={() => setIsAgentSelectorExpanded(!isAgentSelectorExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 外圈脉冲动画 */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  opacity: 0.3
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* 旋转光环 */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f97316, #10b981, #3b82f6, #a855f7)',
                  padding: '2px',
                  opacity: 0.8
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* 主头像按钮 */}
              <motion.div
                className="relative w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
                }}
                whileHover={{
                  boxShadow: '0 12px 35px rgba(168, 85, 247, 0.6)',
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.3 }}
              >
                {selectedAgent.avatar}

                {/* 点击提示图标 */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                </motion.div>
              </motion.div>

              {/* 悬浮提示 */}
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
                  点击切换智能体 🎯
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* 智能体信息 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{selectedAgent.name}</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">在线</span>
              </div>
              <p className="text-sm text-gray-600">{selectedAgent.description}</p>
            </div>

            {/* 模型标识 */}
            <div className="text-right">
              <span className="inline-block bg-purple-500/10 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedAgent.model}
              </span>
            </div>
          </div>
        </div>

        {/* 消息列表区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                {selectedAgent.avatar}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 drop-shadow-sm">👋 你好！我是{selectedAgent.name}</h3>
                <p className="text-sm text-gray-800 max-w-md font-medium drop-shadow-sm">{selectedAgent.description}</p>
              </div>

              <div className="w-full max-w-md">
                {selectedAgent.id === 'kaleidoscope-agent' && <KaleidoscopeAnimation />}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setInputMessage('帮我设计一个现代化的用户界面')}
                  className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
                >
                  设计界面
                </button>
                <button
                  onClick={() => setInputMessage('分析一下我的项目进度')}
                  className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
                >
                  项目分析
                </button>
                <button
                  onClick={() => setInputMessage('帮我制定技术方案')}
                  className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
                >
                  技术方案
                </button>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg rounded-br-md shadow-md'
                    : 'bg-white/20 border border-gray-200/50 rounded-lg rounded-bl-md shadow-md backdrop-blur-sm'
                    } p-3`}>
                    {message.role === 'user' ? (
                    <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{message.content}</pre>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-3 border-b pb-1">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2 mt-4">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-medium text-gray-700 mb-2 mt-3">{children}</h3>,
                          p: ({children}) => <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="ml-1">{children}</li>,
                          code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 text-gray-700 mb-2">{children}</blockquote>,
                          strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                    <div className={`flex items-center justify-between mt-2 ${message.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                      <div className="text-xs">
                        {new Date(Number(message.timestamp)).toLocaleTimeString()}
                      </div>
                      {message.role === 'assistant' && isPRDContent(message.content) && (
                        <button
                          onClick={() => handlePRDPreview(message.content)}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-1 ml-2"
                        >
                          <Eye className="w-3 h-3" />
                          <span>预览效果</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/20 border border-gray-200/50 rounded-lg rounded-bl-md p-3 shadow-md backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">思考中</span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 文件上传预览 */}
        {uploadedFiles.length > 0 && (
          <div className="border-t border-gray-200/50 bg-gray-50/20 p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Paperclip className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">已上传文件</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/20 rounded-lg p-2 border border-gray-200/50 text-xs backdrop-blur-sm">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-3 h-3 text-white" />
                    ) : (
                      <FileText className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 max-w-20 truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* 输入区域 - 更精致无边框设计 */}
        <div className="bg-white/20 backdrop-blur-md p-3 flex-shrink-0 relative z-20 border-t border-gray-100/30">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm" style={{
            border: '1px solid rgba(148, 163, 184, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          }}>

            {/* 文件上传按钮 */}
            <input
              type="file"
              id="brand-file-upload"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="brand-file-upload"
              className="flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(148, 163, 184, 0.12)'
              }}
              title="上传文件"
            >
              <Paperclip className="w-4 h-4 text-gray-500" />
            </label>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={`向${selectedAgent.name}提问...`}
              className="flex-1 h-10 px-4 bg-transparent border-0 focus:outline-none text-sm placeholder-gray-400 font-medium"
              style={{
                color: '#1f2937'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isTyping}
              className="flex items-center justify-center w-10 h-10 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              style={{
                background: (!inputMessage.trim() && uploadedFiles.length === 0) || isTyping
                  ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: (!inputMessage.trim() && uploadedFiles.length === 0) || isTyping
                  ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                  : '0 4px 15px rgba(139, 92, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 智能体选择模态窗 */}
      <AnimatePresence>
        {isAgentSelectorExpanded && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setIsAgentSelectorExpanded(false)}
            />

            {/* 模态窗内容 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            >
              <motion.div
                className="pointer-events-auto bg-white/40 rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.25) 100%)',
                  backdropFilter: 'blur(25px) saturate(180%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  width: '500px'
                }}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                  {/* 标题区域 */}
                  <div
                    className="px-8 py-6 border-b border-gray-100/50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          <span className="text-white text-lg">✨</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">AI智能体</h3>
                          <p className="text-sm text-gray-500 mt-0.5">选择您的专属助手</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAgentSelectorExpanded(false)}
                        className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-200 group"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(229, 231, 235, 0.5)'
                        }}
                      >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* 简洁九宫格智能体选择器 */}
                  <div className="p-8">
                    {/* 当前选中的智能体 */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-4"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {selectedAgent.avatar}
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedAgent.name}</h3>
                      <p className="text-sm text-gray-500">{selectedAgent.description}</p>
                    </div>

                    {/* 智能体网格 */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                      {brandAgents.map((agent, index) => {
                        const isSelected = agent.id === selectedAgent.id;
                        return (
                          <motion.button
                            key={agent.id}
                            onClick={() => {
                              setSelectedAgent(agent);
                              setIsAgentSelectorExpanded(false);
                            }}
                            className={`
                              p-4 rounded-2xl flex flex-col items-center space-y-2 transition-all duration-200
                              ${isSelected 
                                ? 'bg-gradient-to-br from-purple-100/60 to-blue-100/60 ring-2 ring-purple-400/80 ring-offset-2 backdrop-blur-lg border border-purple-200/40' 
                                : 'bg-white/50 hover:bg-white/60 border border-gray-200/60 hover:border-gray-300/70 backdrop-blur-lg shadow-lg'
                              }
                            `}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div
                              className={`
                                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                                ${isSelected 
                                  ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg' 
                                  : 'bg-gray-100 text-gray-600'
                                }
                              `}
                            >
                              {agent.avatar}
                            </div>
                            <span className={`text-xs font-bold text-center drop-shadow-sm ${isSelected ? 'text-purple-800' : 'text-gray-900'}`}>
                              {agent.name}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRD预览模态框 */}
      <PRDPreview
        isOpen={prdPreviewOpen}
        onClose={() => setPrdPreviewOpen(false)}
        content={prdPreviewContent}
        title="万花筒PRD设计方案预览"
      />

    </div>
  );
};

export default ModuleManager; 