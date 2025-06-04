import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, TrendingUp, Users, Package, Activity, Calendar, Target, Zap, Code, GitBranch, Bug, Star, Palette, Megaphone, Award, Eye, Layers, Monitor, Database, Smartphone, Send, AlertTriangle, CheckCircle, XCircle, RefreshCw, MessageSquare, User, Crown } from 'lucide-react';

// 使用原有的组件
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import CustomerPanel from './CustomerPanel';

// 品牌域模块
import { FeatureRoadmap } from '../modules/product';

// 定义模块配置接口
interface ModuleConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  position: 'left' | 'center' | 'right';
  props?: any;
}

interface DepartmentConfig {
  id: string;
  name: string;
  modules: ModuleConfig[];
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  topBarInfo?: {
    title: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
      icon: React.ComponentType<any>;
      trend?: 'up' | 'down' | 'stable';
    }>;
  };
}

interface ModuleManagerProps {
  currentDepartment: string;
  onCustomerSelect?: (customer: any) => void;
  selectedCustomer?: any;
}

// 在文件开头添加产品需求的类型定义
interface ProductDemand {
  id: string;
  title: string;
  source: '商户需求' | '代理伙伴' | '内部团队';
  priority: 'High' | 'Middle' | 'Low' | 'Nice to have';
  status: '待评审' | '待规划' | '已立项' | '开发中' | '已上线' | '已拒绝';
  submitter: string;
  reviewer: string;
  submitTime: string;
  reviewTime?: string;
  description: string;
  businessValue: number; // 业务价值评分
  developmentCost: number; // 开发成本评分
  customer: string;
  urgency: '紧急' | '不紧急';
  importance: '重要' | '不重要';
}

interface ProductProject {
  id: string;
  name: string;
  version: string; // 如：V2.3.6 或 T2.3.7
  versionType: '大版本' | '中版本' | '小版本';
  status: '一稿设计' | '二稿设计' | '三稿设计' | 'UI设计' | '开发中' | '测试中' | '验收中' | '已上线';
  progress: number;
  currentStage: '需求管理' | '产品规划' | '产品立项' | '开发跟踪' | '产品验收' | '上线发布' | '产品总结';
  manager: string; // 产品经理
  developer?: string; // 技术负责人
  tester?: string; // 测试负责人
  relatedSystems: string[]; // 涉及的系统/应用
  demandId?: string; // 关联的需求ID
  deadline: string;
  createTime: string;
  prototype?: {
    draft1?: string; // 一稿原型链接
    draft2?: string; // 二稿原型链接
    draft3?: string; // 三稿原型链接
  };
  reviewRecords: {
    stage: '一稿' | '二稿' | '三稿';
    reviewer: string;
    result: '通过' | '不通过' | '待评审';
    feedback: string;
    time: string;
  }[];
}

// 基础研发部相关类型定义
interface TechnicalStandard {
  id: string;
  title: string;
  category: '前端开发' | '后端API' | '数据库设计' | '架构设计' | '代码规范' | '测试标准';
  version: string;
  status: '草案' | '评审中' | '已发布' | '已废弃';
  creator: string;
  reviewer: string;
  createTime: string;
  updateTime?: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  complexity: number; // 1-10复杂度评分
  impact: string[]; // 影响的系统/项目
  downloadUrl?: string;
}

interface TechnicalReport {
  id: string;
  title: string;
  type: '周报' | '月报' | '季报' | '年报' | '专题简报' | '技术洞察';
  publishDate: string;
  author: string;
  department: string;
  summary: string;
  content: {
    highlights: string[];
    metrics: {
      label: string;
      value: string;
      trend?: 'up' | 'down' | 'stable';
    }[];
    challenges: string[];
    nextPlans: string[];
  };
  readCount: number;
  status: '草稿' | '待审核' | '已发布';
}

interface TechnicalTask {
  id: string;
  title: string;
  type: '规范制定' | '架构优化' | '技术债务' | '工具建设' | '培训分享' | '质量提升';
  assignee: string;
  reporter: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: '待开始' | '进行中' | '待评审' | '已完成' | '已延期';
  createTime: string;
  deadline: string;
  progress: number;
  description: string;
  relatedStandards: string[];
  estimatedHours: number;
  actualHours?: number;
}

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
    developer: '李技术',
    tester: '王测试',
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

const technicalReports: TechnicalReport[] = [
  {
    id: 'RPT-001',
    title: '基础研发部2024年2月技术月报',
    type: '月报',
    publishDate: '2024-03-01',
    author: '李架构师',
    department: '基础研发部',
    summary: '2月份技术规范制定、架构优化、团队建设等工作总结',
    content: {
      highlights: [
        '完成前端React组件开发规范V3.2制定',
        'API接口标准化改造覆盖率达到78%',
        '代码质量评分提升至92.5%',
        '团队技术分享会举办3场，参与人数85人'
      ],
      metrics: [
        { label: '规范文档发布', value: '3个', trend: 'up' },
        { label: '代码质量评分', value: '92.5%', trend: 'up' },
        { label: '技术债务处理', value: '8个', trend: 'down' },
        { label: '培训参与率', value: '95%', trend: 'stable' }
      ],
      challenges: [
        '老项目技术栈升级进度缓慢',
        '跨团队协作规范执行不一致',
        '部分开发人员对新规范适应需要时间'
      ],
      nextPlans: [
        '推进TypeScript代码质量规范评审',
        '启动微服务架构设计原则制定',
        '组织React18新特性技术分享',
        '建立代码质量监控仪表板'
      ]
    },
    readCount: 156,
    status: '已发布'
  },
  {
    id: 'RPT-002',
    title: 'React18技术升级专题简报',
    type: '专题简报',
    publishDate: '2024-02-15',
    author: '张技术',
    department: '基础研发部',
    summary: 'React18新特性分析及升级方案建议',
    content: {
      highlights: [
        'React18核心特性：并发渲染、自动批处理、Suspense改进',
        '现有项目升级评估：3个高优先级、5个中优先级',
        '性能提升预期：首屏加载时间减少15-20%',
        '团队培训计划：分3批次进行，预计3周完成'
      ],
      metrics: [
        { label: '适用项目数', value: '8个', trend: 'stable' },
        { label: '预期性能提升', value: '18%', trend: 'up' },
        { label: '升级工期预估', value: '6周', trend: 'stable' }
      ],
      challenges: [
        '第三方库兼容性需要逐一验证',
        '现有代码中部分模式需要重构',
        '开发团队学习成本较高'
      ],
      nextPlans: [
        '制定详细的升级时间表',
        '准备兼容性测试用例',
        '编写升级操作手册',
        '安排分阶段技术培训'
      ]
    },
    readCount: 89,
    status: '已发布'
  }
];

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

// 需求管理池组件（左侧）
// 需求管理池组件（左侧）
const DemandPool = ({ selectedDemand, onDemandSelect }: { selectedDemand: ProductDemand | null, onDemandSelect: (demand: ProductDemand) => void }) => {
  // 计算四象限数据
  const getQuadrantStats = () => {
    const stats = {
      urgent_important: productDemands.filter(d => d.urgency === '紧急' && d.importance === '重要').length,
      important_not_urgent: productDemands.filter(d => d.urgency === '不紧急' && d.importance === '重要').length,
      urgent_not_important: productDemands.filter(d => d.urgency === '紧急' && d.importance === '不重要').length,
      not_urgent_not_important: productDemands.filter(d => d.urgency === '不紧急' && d.importance === '不重要').length
    };
    return stats;
  };

  const quadrantStats = getQuadrantStats();

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">TAPD需求管理池</h3>
        <p className="text-sm text-gray-600">基于"七步成诗"法的需求全生命周期管理</p>
      </div>
      
      {/* 四象限矩阵 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2 text-slate-600" />
          紧急重要象限分析
        </h4>
        <div className="grid grid-cols-2 gap-2.5 p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-gray-200">
          {/* 重要紧急 - 改为更柔和的红色调 */}
          <div className="bg-gradient-to-br from-red-50 to-rose-100 p-2.5 rounded-md border border-red-200/60 shadow-sm">
            <div className="text-xs font-medium text-red-800 mb-1 opacity-90">重要紧急</div>
            <div className="text-lg font-bold text-red-900">{quadrantStats.urgent_important}</div>
            <div className="text-xs text-red-700 opacity-75">立即处理</div>
          </div>
          
          {/* 重要不紧急 - 改为更柔和的绿色调 */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-2.5 rounded-md border border-emerald-200/60 shadow-sm">
            <div className="text-xs font-medium text-emerald-800 mb-1 opacity-90">重要不紧急</div>
            <div className="text-lg font-bold text-emerald-900">{quadrantStats.important_not_urgent}</div>
            <div className="text-xs text-emerald-700 opacity-75">计划安排</div>
          </div>
          
          {/* 紧急不重要 - 改为更柔和的黄色调 */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-2.5 rounded-md border border-amber-200/60 shadow-sm">
            <div className="text-xs font-medium text-amber-800 mb-1 opacity-90">紧急不重要</div>
            <div className="text-lg font-bold text-amber-900">{quadrantStats.urgent_not_important}</div>
            <div className="text-xs text-amber-700 opacity-75">授权处理</div>
          </div>
          
          {/* 不重要不紧急 - 改为更柔和的灰色调 */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-2.5 rounded-md border border-slate-200/60 shadow-sm">
            <div className="text-xs font-medium text-slate-700 mb-1 opacity-90">不重要不紧急</div>
            <div className="text-lg font-bold text-slate-800">{quadrantStats.not_urgent_not_important}</div>
            <div className="text-xs text-slate-600 opacity-75">稍后处理</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {productDemands.map((demand) => (
          <button
            key={demand.id}
            onClick={() => onDemandSelect(demand)}
            className={`
              w-full text-left p-3 rounded-lg border transition-all duration-200
              ${selectedDemand?.id === demand.id 
                ? 'border-slate-300 bg-slate-50 shadow-sm' 
                : 'border-gray-200 hover:border-slate-300 hover:bg-gray-50'
              }
            `}
          >
            {/* 需求标题和优先级 */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">{demand.title}</h4>
              <span className={`
                px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0
                ${demand.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                  demand.priority === 'Middle' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  demand.priority === 'Low' ? 'bg-slate-50 text-slate-700 border border-slate-200' :
                  'bg-gray-50 text-gray-700 border border-gray-200'
                }
              `}>
                {demand.priority}
              </span>
            </div>
            
            {/* 需求状态和评审信息 */}
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  demand.status === '待评审' ? 'bg-amber-500' :
                  demand.status === '待规划' ? 'bg-slate-500' :
                  demand.status === '已立项' ? 'bg-emerald-500' :
                  demand.status === '开发中' ? 'bg-violet-500' :
                  demand.status === '已上线' ? 'bg-blue-500' : 'bg-rose-500'
                }`} />
                {demand.status}
              </span>
              <span className="text-gray-500">{demand.submitTime}</span>
            </div>

            {/* 客户和来源 */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{demand.customer}</span>
              <span className={`px-2 py-1 rounded border ${
                demand.source === '商户需求' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                demand.source === '代理伙伴' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                {demand.source}
              </span>
            </div>

            {/* 紧急重要象限 */}
            <div className="flex items-center space-x-2 text-xs">
              <span className={`px-2 py-1 rounded border ${
                demand.urgency === '紧急' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {demand.urgency}
              </span>
              <span className={`px-2 py-1 rounded border ${
                demand.importance === '重要' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {demand.importance}
              </span>
              <div className="ml-auto">
                <span className="text-gray-500">优先级:</span>
                <span className="text-emerald-600 font-medium ml-1">
                  {Math.round(demand.businessValue / demand.developmentCost * 10) / 10}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 产品立项流程组件（中间）
const ProductProjectFlow = ({ selectedDemand }: { selectedDemand: ProductDemand | null }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProductProject | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'chat'>('overview');
  
  // AI对话相关状态
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>>([]);

  // 根据选中需求找到对应项目
  const relatedProject = selectedDemand ? 
    productProjects.find(p => p.demandId === selectedDemand.id) : null;

  const displayProject = selectedProject || relatedProject;

  // 处理发送消息
  const handleSendMessage = () => {
    if (!message.trim() || !selectedDemand) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsAnalyzing(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, selectedDemand, displayProject);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsAnalyzing(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5秒随机延迟
  };

  // 生成AI响应的函数
  const generateAIResponse = (userMessage: string, demand: ProductDemand, project?: ProductProject | null): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 技术人员专用查询
    if (lowerMessage.includes('技术栈') || lowerMessage.includes('架构') || lowerMessage.includes('technology')) {
      return `技术架构建议：\n1. 前端技术：React + TypeScript + Tailwind CSS\n2. 后端技术：Node.js + Express + MongoDB\n3. 部署方案：Docker + K8s\n4. 监控方案：Prometheus + Grafana\n建议采用微服务架构，确保系统可扩展性。`;
    }
    
    if (lowerMessage.includes('数据库') || lowerMessage.includes('存储') || lowerMessage.includes('database')) {
      return `数据存储建议：\n1. 主数据库：MySQL 8.0（业务数据）\n2. 缓存层：Redis 6.0（会话缓存）\n3. 搜索引擎：Elasticsearch（日志分析）\n4. 文件存储：阿里云OSS（图片文档）\n注意：需要考虑数据一致性和备份策略。`;
    }
    
    if (lowerMessage.includes('性能') || lowerMessage.includes('优化') || lowerMessage.includes('performance')) {
      const complexity = demand.developmentCost >= 7 ? '高复杂度' : demand.developmentCost >= 4 ? '中复杂度' : '低复杂度';
      return `性能优化建议（${complexity}项目）：\n1. 接口响应时间：< 200ms\n2. 并发支持：> 1000用户\n3. 数据库优化：添加索引、分库分表\n4. 前端优化：代码分割、懒加载\n5. CDN加速：静态资源全球分发`;
    }
    
    if (lowerMessage.includes('安全') || lowerMessage.includes('权限') || lowerMessage.includes('security')) {
      return `安全防护建议：\n1. 身份认证：JWT + OAuth2.0\n2. 数据加密：AES-256 + HTTPS\n3. 接口防护：限流、防重放攻击\n4. 权限控制：RBAC角色权限模型\n5. 安全审计：操作日志完整记录`;
    }
    
    if (lowerMessage.includes('测试') || lowerMessage.includes('质量') || lowerMessage.includes('test')) {
      const testDays = Math.ceil(demand.developmentCost * 0.3);
      return `测试方案建议：\n1. 单元测试：覆盖率 > 80%\n2. 集成测试：关键业务流程\n3. 压力测试：1000并发用户\n4. 安全测试：SQL注入、XSS防护\n5. 测试周期：${testDays}个工作日\n建议采用TDD开发模式。`;
    }
    
    // 产品覆盖不全的修正建议
    if (lowerMessage.includes('覆盖') || lowerMessage.includes('完善') || lowerMessage.includes('补充')) {
      return `产品方案完善建议：\n1. 补充用户故事：明确使用场景和用户路径\n2. 完善异常流程：错误处理和边界情况\n3. 增加数据埋点：用户行为追踪方案\n4. 制定灰度策略：分阶段上线计划\n5. 准备回滚方案：风险控制措施\n建议按照"七步成诗"法补充缺失环节。`;
    }
    
    // 原有的查询保持不变
    if (lowerMessage.includes('优先级') || lowerMessage.includes('priority')) {
      const priorityScore = Math.round(demand.businessValue / demand.developmentCost * 10) / 10;
      return `📊 优先级分析报告：\n评分：${priorityScore} 分\n计算公式：业务价值(${demand.businessValue}) ÷ 开发成本(${demand.developmentCost})\n\n建议：${priorityScore > 1.5 ? '🔴 高优先级，建议立即处理' : priorityScore > 1.0 ? '🟡 中优先级，可排入下月计划' : '🟢 低优先级，建议后续排期'}\n\n根据米多产品优先级算法，该需求${priorityScore > 1.5 ? '符合High等级标准' : '建议调整业务价值或降低开发复杂度'}。`;
    }
    
    if (lowerMessage.includes('版本') || lowerMessage.includes('version')) {
      const suggestedType = demand.businessValue >= 8 ? '中版本' : '小版本';
      const versionNumber = suggestedType === '中版本' ? 'V2.X.0' : 'V2.X.X';
      return `📋 版本规划建议：\n建议版本类型：${suggestedType}\n预计版本号：${versionNumber}\n\n🔄 立项流程：\n${suggestedType === '中版本' ? 
        '1. 产品委员会版本号申请\n2. 三稿制立项评审（一稿价值确认 → 二稿结构确认 → 三稿交互确认）\n3. UI设计稿确认\n4. 技术方案评审' : 
        '1. 产品经理线下沟通确认\n2. 简化立项流程\n3. 直接进入开发排期'}\n\n⚠️ 注意：${suggestedType}需要遵循米多版本管理规范，确保不跨系统/应用。`;
    }
    
    if (lowerMessage.includes('风险') || lowerMessage.includes('risk')) {
      const riskLevel = demand.developmentCost >= 7 ? '高风险' : demand.developmentCost >= 4 ? '中风险' : '低风险';
      const riskColor = riskLevel === '高风险' ? '🔴' : riskLevel === '中风险' ? '🟡' : '🟢';
      return `${riskColor} 风险评估报告：\n风险等级：${riskLevel}\n评估依据：开发成本${demand.developmentCost}/10分\n\n🎯 风险控制措施：\n${riskLevel === '高风险' ? 
        '• 增加code review轮次\n• 提升测试覆盖率至90%\n• 制定详细回滚方案\n• 分阶段灰度发布\n• 7x24小时监控' : 
        riskLevel === '中风险' ? 
        '• 标准code review\n• 测试覆盖率80%\n• 基础监控告警\n• 正常发布流程' :
        '• 基础测试验证\n• 常规发布流程\n• 标准监控'}\n\n建议：${riskLevel === '高风险' ? '项目经理需密切跟进，每日同步进度' : '按正常流程进行即可'}。`;
    }
    
    if (lowerMessage.includes('工期') || lowerMessage.includes('时间') || lowerMessage.includes('deadline')) {
      const estimatedDays = demand.developmentCost * 2;
      const stages = [
        '需求确认：1-2天',
        `产品设计：${Math.ceil(estimatedDays * 0.2)}天`,
        `开发实现：${Math.ceil(estimatedDays * 0.6)}天`,
        `测试验收：${Math.ceil(estimatedDays * 0.2)}天`
      ];
      return `⏰ 工期预估报告：\n总工期：${estimatedDays}个工作日\n\n📅 详细排期：\n${stages.map((stage, i) => `${i + 1}. ${stage}`).join('\n')}\n\n🎯 里程碑节点：\n• 需求评审完成：第2天\n• 产品立项通过：第${Math.ceil(estimatedDays * 0.3)}天\n• 开发联调完成：第${Math.ceil(estimatedDays * 0.8)}天\n• 验收发布上线：第${estimatedDays}天\n\n⚠️ 风险缓冲：建议预留20%缓冲时间，实际交付时间${Math.ceil(estimatedDays * 1.2)}天。`;
    }
    
    // 默认智能响应
    const responses = [
      `🤖 AI分析：我已经详细分析了需求《${demand.title}》\n\n📊 基础信息：\n• 优先级：${demand.priority}\n• 客户：${demand.customer}\n• 来源：${demand.source}\n\n💡 我可以帮您分析：优先级评估、版本规划、风险分析、工期预估、技术方案、测试策略等。请告诉我您想了解哪个方面？`,
      
      `🎯 产品建议：根据米多产品研发规范分析\n\n✅ 符合产品准则：\n• 以客户为中心：解决${demand.customer}实际需求\n• 场景化设计：基于具体业务场景\n• 积木化搭建：可复用组件架构\n• 数据驱动：可量化业务价值\n\n🔍 建议深入分析：技术可行性、资源投入、上线计划。有什么具体问题吗？`,
      
      `📋 流程指导：该需求当前处于${demand.status}状态\n\n🔄 后续流程：\n1. 完善需求分析和用户故事\n2. 申请产品版本号\n3. 启动三稿制立项评审\n4. UI设计和技术方案评审\n5. 进入开发排期\n\n💬 我可以为您提供每个环节的详细指导，请问需要了解哪个环节？`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // 初始化对话（当需求切换时）
  React.useEffect(() => {
    if (selectedDemand && chatHistory.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'ai' as const,
        content: `您好！我是米多AI产品助手。我已经分析了需求《${selectedDemand.title}》，有什么关于这个需求的问题我可以帮您分析？比如：优先级评估、版本规划、风险分析、工期预估等。`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory([welcomeMessage]);
    }
  }, [selectedDemand]);

  if (!selectedDemand) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">产品立项流程</h3>
          <p className="text-sm text-gray-500">请先从左侧选择需求查看立项情况</p>
        </div>
      </div>
    );
  }

  // 七步成诗流程
  const sevenSteps = [
    { name: '需求管理', icon: Users, status: 'completed' },
    { name: '产品规划', icon: Target, status: displayProject ? 'completed' : 'current' },
    { name: '产品立项', icon: Layers, status: displayProject?.currentStage === '产品立项' ? 'current' : displayProject ? 'completed' : 'pending' },
    { name: '开发跟踪', icon: Code, status: displayProject?.currentStage === '开发跟踪' ? 'current' : displayProject?.status === '已上线' ? 'completed' : 'pending' },
    { name: '产品验收', icon: CheckCircle, status: displayProject?.currentStage === '产品验收' ? 'current' : displayProject?.status === '已上线' ? 'completed' : 'pending' },
    { name: '上线发布', icon: Zap, status: displayProject?.status === '已上线' ? 'completed' : 'pending' },
    { name: '产品总结', icon: Star, status: displayProject?.currentStage === '产品总结' ? 'current' : 'pending' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* 优化后的标签切换 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 pt-4">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-t-lg border-t-2 border-l-2 border-r-2 ${
              activeTab === 'overview'
                ? 'bg-white text-purple-600 border-purple-500 shadow-sm'
                : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/30'
            }`}
            style={{ marginBottom: '-2px' }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>立项流程</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-t-lg border-t-2 border-l-2 border-r-2 ${
              activeTab === 'chat'
                ? 'bg-white text-purple-600 border-purple-500 shadow-sm'
                : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/30'
            }`}
            style={{ marginBottom: '-2px' }}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>AI助手</span>
              {chatHistory.length > 0 && (
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {chatHistory.filter(msg => msg.type === 'user').length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
      <div className="border-b-2 border-gray-200"></div>

      {activeTab === 'overview' ? (
        <div className="flex-1 p-4 overflow-y-auto">
          {/* 需求基本信息 */}
          <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedDemand.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{selectedDemand.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">客户:</span>
                <span className="text-gray-900 ml-2 font-medium">{selectedDemand.customer}</span>
              </div>
              <div>
                <span className="text-gray-500">评审人:</span>
                <span className="text-gray-900 ml-2 font-medium">{selectedDemand.reviewer}</span>
              </div>
              <div>
                <span className="text-gray-500">业务价值:</span>
                <span className="text-green-600 font-bold ml-2">{selectedDemand.businessValue}/10</span>
              </div>
              <div>
                <span className="text-gray-500">开发成本:</span>
                <span className="text-orange-600 font-bold ml-2">{selectedDemand.developmentCost}/10</span>
              </div>
            </div>
          </div>

          {/* 七步成诗流程 */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-amber-500 mr-2" />
              七步成诗流程
            </h4>
            <div className="space-y-3">
              {sevenSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${
                      step.status === 'completed' ? 'bg-emerald-500 border-emerald-600 text-white' :
                      step.status === 'current' ? 'bg-slate-700 border-slate-800 text-white' :
                      'bg-gray-100 border-gray-200 text-gray-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium ${
                        step.status === 'completed' ? 'text-emerald-600' :
                        step.status === 'current' ? 'text-slate-700' :
                        'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                      {step.status === 'current' && (
                        <span className="ml-2 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">进行中</span>
                      )}
                      {step.status === 'completed' && (
                        <CheckCircle className="inline w-4 h-4 text-emerald-500 ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 项目详情 */}
          {displayProject && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Package className="w-5 h-5 text-slate-600 mr-2" />
                  项目详情
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">项目名称:</span>
                    <span className="text-gray-900 ml-2 font-medium">{displayProject.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">版本类型:</span>
                    <span className="text-slate-700 font-bold ml-2">{displayProject.versionType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">产品经理:</span>
                    <span className="text-gray-900 ml-2 font-medium">{displayProject.manager}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">当前阶段:</span>
                    <span className="text-slate-700 font-bold ml-2">{displayProject.currentStage}</span>
                  </div>
                </div>
                
                {/* 进度条 */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">开发进度</span>
                    <span className="text-sm font-bold text-gray-900">{displayProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-slate-600 to-slate-700 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${displayProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 立项评审记录 */}
              {displayProject.reviewRecords.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                    立项评审记录
                  </h4>
                  <div className="space-y-3">
                    {displayProject.reviewRecords.map((record, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border ${
                          record.result === '通过' ? 'bg-emerald-500 border-emerald-600 text-white' :
                          record.result === '不通过' ? 'bg-rose-500 border-rose-600 text-white' :
                          'bg-amber-500 border-amber-600 text-white'
                        }`}>
                          {record.stage.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{record.stage}立项</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                              record.result === '通过' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              record.result === '不通过' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {record.result}
                            </span>
                            <span className="text-xs text-gray-500">{record.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{record.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* AI助手头部 */}
          <div className="p-4 border-b border-white/50 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">米多AI产品助手</h3>
                <p className="text-xs text-gray-600">基于产品研发规范V2.4的智能分析</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 对话历史区域 */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4 max-w-4xl mx-auto">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    {msg.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{msg.timestamp}</span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>
                    {msg.type === 'user' && (
                      <div className="text-xs text-purple-200 mt-2 text-right font-medium">{msg.timestamp}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* AI思考中动画 */}
              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">正在分析中...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-white/50">
            <div className="max-w-4xl mx-auto">
              {/* 快捷问题分类 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="text-xs font-medium text-gray-600 flex items-center mr-2">
                    <Zap className="w-3 h-3 mr-1" />
                    快捷问题:
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-purple-600 font-medium">产品:</span>
                    {['优先级如何？', '建议什么版本？', '预计工期多久？', '有什么风险？'].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(question)}
                        className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-all duration-200 hover:scale-105"
                        disabled={isAnalyzing}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-blue-600 font-medium">技术:</span>
                    {['技术架构建议？', '性能优化方案？', '安全防护措施？', '测试策略制定？'].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(question)}
                        className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all duration-200 hover:scale-105"
                        disabled={isAnalyzing}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-green-600 font-medium">流程:</span>
                    {['如何完善方案？', '流程下一步？', '团队协作建议？', '上线计划制定？'].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(question)}
                        className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-all duration-200 hover:scale-105"
                        disabled={isAnalyzing}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 输入框 */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="问我关于需求、技术、流程的任何问题..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isAnalyzing || !message.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Crown className="w-5 h-5 text-purple-600 mr-2" />
          智能版本管理
        </h3>
        <p className="text-sm text-gray-600">AI驱动的冲突检测与风险评估</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* 冲突分析 */}
        {conflicts.length > 0 && (
          <div className="bg-white rounded-xl border border-red-200 shadow-sm">
            <div className="p-4 border-b border-red-100 bg-red-50">
              <h4 className="font-semibold text-red-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                冲突风险分析
                <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                  {conflicts.length}个冲突
                </span>
              </h4>
            </div>
            <div className="p-4 space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        conflict.severity === 'high' ? 'bg-red-500' :
                        conflict.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium text-gray-900">{conflict.type}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        雷同度: {conflict.similarity}%
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      conflict.severity === 'high' ? 'bg-red-100 text-red-700' :
                      conflict.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {conflict.severity === 'high' ? '高风险' : conflict.severity === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">冲突对象: </span>
                      <span className="text-blue-600 font-medium">{conflict.conflictWith}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">问题描述: </span>
                      <span className="text-gray-900">{conflict.description}</span>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-orange-900 font-medium mb-1">误解风险</div>
                          <div className="text-orange-800 text-xs">{conflict.misunderstanding}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-blue-900 font-medium mb-1">修正建议</div>
                          <div className="text-blue-800 text-xs">{conflict.suggestion}</div>
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
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm">
            <div className="p-4 border-b border-blue-100 bg-blue-50">
              <h4 className="font-semibold text-blue-900 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                技术影响评估
              </h4>
            </div>
            <div className="p-4 space-y-3">
              {technicalImpacts.map((impact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{impact.area}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      impact.impact === 'high' ? 'bg-red-100 text-red-700' :
                      impact.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {impact.impact === 'high' ? '高影响' : impact.impact === 'medium' ? '中影响' : '低影响'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{impact.description}</p>
                  <div className="text-xs bg-green-50 text-green-800 p-2 rounded border border-green-200">
                    💡 建议: {impact.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 业务风险评估 */}
        {businessRisks.length > 0 && (
          <div className="bg-white rounded-xl border border-yellow-200 shadow-sm">
            <div className="p-4 border-b border-yellow-100 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                业务风险评估
              </h4>
            </div>
            <div className="p-4 space-y-3">
              {businessRisks.map((risk, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{risk.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      risk.level === 'high' ? 'bg-red-100 text-red-700' :
                      risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded border border-blue-200">
                    🛡️ 缓解措施: {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 米多产品体系 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Layers className="w-5 h-5 text-purple-600 mr-2" />
              米多产品架构影响
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <div className="font-medium text-blue-900 mb-2 flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  平台层影响
                </div>
                <div className="text-sm text-blue-800">
                  对{MIDO_PRODUCT_STRUCTURE.platform}的核心数据架构产生影响
                </div>
              </div>
              
              <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                <div className="font-medium text-green-900 mb-2 flex items-center">
                  <Monitor className="w-4 h-4 mr-2" />
                  系统层影响
                </div>
                <div className="text-sm text-green-800">
                  主要影响: {MIDO_PRODUCT_STRUCTURE.systems.slice(0, 2).join('、')}
                </div>
              </div>
              
              <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                <div className="font-medium text-purple-900 mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  应用层影响
                </div>
                <div className="flex flex-wrap gap-1">
                  {MIDO_PRODUCT_STRUCTURE.applications.filter(app => 
                    selectedDemand.title.includes(app.substring(0, 2))
                  ).map((app, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-medium">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 项目版本信息（如果有关联项目） */}
        {relatedProject && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 text-green-600 mr-2" />
                关联项目信息
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">版本号:</span>
                    <span className="text-purple-600 font-bold ml-2">{relatedProject.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">版本类型:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      relatedProject.versionType === '大版本' ? 'bg-red-100 text-red-700' :
                      relatedProject.versionType === '中版本' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {relatedProject.versionType}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">当前状态:</span>
                    <span className="text-blue-600 font-medium ml-2">{relatedProject.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">预计交付:</span>
                    <span className="text-gray-900 ml-2 font-medium">{relatedProject.deadline}</span>
                  </div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">整体进度</span>
                  <span className="text-sm font-bold text-gray-900">{relatedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${relatedProject.progress}%` }}
                  />
                </div>
              </div>

              {/* 团队信息 */}
              <div className="border-t border-gray-100 pt-4">
                <div className="text-sm font-medium text-gray-900 mb-2">项目团队</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-500">产品经理:</span>
                    <span className="text-gray-900 font-medium">{relatedProject.manager}</span>
                  </div>
                  {relatedProject.developer && (
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-500">技术负责人:</span>
                      <span className="text-gray-900 font-medium">{relatedProject.developer}</span>
                    </div>
                  )}
                  {relatedProject.tester && (
                    <div className="flex items-center space-x-2">
                      <Bug className="w-4 h-4 text-green-600" />
                      <span className="text-gray-500">测试负责人:</span>
                      <span className="text-gray-900 font-medium">{relatedProject.tester}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
                    预计需要配置: 产品经理1人 + 开发工程师{Math.ceil(selectedDemand.developmentCost/3)}人 + 测试工程师1人
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
        return 'w-80 bg-white border-r border-gray-200 flex-shrink-0 h-full overflow-hidden';
      case 'center':
        return 'flex-1 flex flex-col min-w-0 h-full overflow-hidden';
      case 'right':
        return 'w-96 bg-white border-l border-gray-200 flex-shrink-0 h-full overflow-hidden';
      default:
        return '';
    }
  };

  // 真正的3D魔方翻转动效
  const flipVariants = {
    initial: {
      rotateY: -90,
      rotateX: 0,
      scale: 0.8,
      opacity: 0,
      z: -200,
    },
    enter: {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
      z: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // 自定义缓动曲线
        opacity: { duration: 0.4, delay: 0.2 },
        scale: { duration: 0.6, delay: 0.1 }
      }
    },
    exit: {
      rotateY: 90,
      rotateX: 10,
      scale: 0.7,
      opacity: 0,
      z: -300,
      transition: {
        duration: 0.6,
        ease: [0.55, 0.06, 0.68, 0.19],
        opacity: { duration: 0.3 }
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
    <div 
      className={getContainerClass()} 
      style={{ 
        perspective: '2000px',
        perspectiveOrigin: 'center center'
      }}
    >
      <AnimatePresence mode="wait">
        {!isFlipping && currentModule && (
          <motion.div
            key={`${currentModule.id}-${position}`}
            className="w-full h-full relative"
            variants={flipVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transformOrigin: 'center center'
            }}
          >
            {/* 简化背景效果，避免translateZ导致的尺寸跳跃 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl" />
            
            {/* 主要内容 */}
            <div className="relative z-10 w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
              {React.createElement(currentModule.component, {
                ...getModuleProps(currentModule.id)
              })}
            </div>

            {/* 简化光影效果，避免translateZ */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-lg pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 翻转中的简洁效果 */}
      {isFlipping && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
          {/* 简洁的背景渐变效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 animate-pulse" />
        </div>
      )}
    </div>
  );
};

// 顶部信息栏翻转容器
const FlipTopBar: React.FC<{
  currentConfig: DepartmentConfig | null;
  previousConfig: DepartmentConfig | null;
  isFlipping: boolean;
}> = ({ currentConfig, previousConfig, isFlipping }) => {
  // 与模块翻转保持一致的3D动效
  const topBarFlipVariants = {
    initial: {
      rotateX: -90,
      rotateY: 0,
      scale: 0.8,
      opacity: 0,
      z: -200,
    },
    enter: {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      z: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // 与FlipModule一致的缓动曲线
        opacity: { duration: 0.4, delay: 0.2 },
        scale: { duration: 0.6, delay: 0.1 }
      }
    },
    exit: {
      rotateX: 90,
      rotateY: 10,
      scale: 0.7,
      opacity: 0,
      z: -300,
      transition: {
        duration: 0.6,
        ease: [0.55, 0.06, 0.68, 0.19],
        opacity: { duration: 0.3 }
      }
    }
  };

  if (!currentConfig?.topBarInfo) return null;

  return (
    <div 
      className="border-b border-gray-200"
      style={{ 
        perspective: '2000px',
        perspectiveOrigin: 'center top'
      }}
    >
      <AnimatePresence mode="wait">
        {!isFlipping && currentConfig.topBarInfo && (
          <motion.div
            key={`topbar-${currentConfig.id}`}
            className="bg-white px-6 py-4 relative"
            variants={topBarFlipVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transformOrigin: 'center bottom'
            }}
          >
            {/* 简化背景效果，避免translateZ导致的尺寸跳跃 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg" />
            
            {/* 主要内容 */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{currentConfig.topBarInfo.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">{currentConfig.topBarInfo.description}</p>
                </div>
                <div className="flex items-center space-x-6">
                  {currentConfig.topBarInfo.stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <IconComponent className="w-4 h-4" style={{ color: currentConfig.theme.primary }} />
                          <span className="text-lg font-bold" style={{ color: currentConfig.theme.primary }}>
                            {stat.value}
                          </span>
                          {stat.trend === 'up' && (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 简化光影效果，避免translateZ */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 翻转中的简洁效果 */}
      {isFlipping && (
        <div className="bg-white px-6 py-4 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden min-h-[80px]">
          {/* 简洁的背景渐变效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 animate-pulse" />
        </div>
      )}
    </div>
  );
};

const ModuleManager: React.FC<ModuleManagerProps> = ({
  currentDepartment,
  onCustomerSelect,
  selectedCustomer
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousDepartment, setPreviousDepartment] = useState<string | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<ProductDemand>(productDemands[0]); // 默认选择第一个需求
  const [selectedStandard, setSelectedStandard] = useState<TechnicalStandard>(technicalStandards[0]); // 默认选择第一个规范

  // 固定的基础配置 - 不依赖于props，避免重新渲染
  const baseDepartmentConfigs: { [key: string]: DepartmentConfig } = useMemo(() => ({
    '客户成功部': {
      id: 'customer-success',
      name: '客户成功部',
      modules: [
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
          id: 'customer-panel',
          name: '客户面板',
          component: CustomerPanel,
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
          id: 'project-flow',
          name: '立项流程',
          component: ProductProjectFlow,
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
    }
  }), []); // 空依赖数组，不会重新生成

  // 动态更新props的函数
  const getModuleProps = useCallback((moduleId: string) => {
    switch (moduleId) {
      case 'customer-list':
        return { 
          onCustomerSelect: onCustomerSelect, 
          selectedCustomer: selectedCustomer 
        };
      case 'chat-area':
        return { selectedCustomer: selectedCustomer };
      case 'customer-panel':
        return { customer: selectedCustomer };
      case 'demand-pool':
        return { 
          selectedDemand: selectedDemand,
          onDemandSelect: setSelectedDemand
        };
      case 'project-flow':
        return { selectedDemand: selectedDemand };
      case 'version-management':
        return { selectedDemand: selectedDemand };
      case 'standard-library':
        return { 
          selectedStandard: selectedStandard,
          onStandardSelect: setSelectedStandard
        };
      case 'agent-center':
        return { selectedStandard: selectedStandard };
      case 'task-tracker':
        return { selectedStandard: selectedStandard };
      default:
        return {};
    }
  }, [onCustomerSelect, selectedCustomer, selectedDemand, selectedStandard]);

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
    }, 600); // 翻转时间

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
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{ backgroundColor: currentConfig.theme.background }}
    >
      {/* 模块区域 */}
      <div className="flex-1 flex overflow-hidden">
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
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-green-50 to-blue-50">
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
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              selectedStandard?.id === standard.id 
                ? 'border-green-300 bg-green-50 shadow-sm' 
                : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
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
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-blue-50 to-green-50">
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
              <span className={`px-2 py-1 rounded ${
                task.priority === 'P0' ? 'bg-red-100 text-red-700' :
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
    if (!inputMessage.trim()) return;

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
    <div className="h-full flex flex-col">
      {/* 智能体选择栏 */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 text-green-600 mr-2" />
          技术智能体中心
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {technicalAgents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-2 rounded-lg border text-left transition-all duration-200 ${
                  selectedAgent.id === agent.id
                    ? 'border-green-300 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{agent.avatar}</span>
                  <IconComponent className={`w-4 h-4 ${agent.color}`} />
                </div>
                <h4 className="font-medium text-gray-900 text-xs mb-1">{agent.name}</h4>
                <p className="text-xs text-gray-600">{agent.specialty}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 当前智能体信息 */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{selectedAgent.avatar}</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{selectedAgent.name}</h4>
              <p className="text-xs text-gray-600">{selectedAgent.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{selectedAgent.model}</span>
                <span className="text-xs text-gray-500">Temperature: {selectedAgent.temperature}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-green-600 text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-white border border-gray-200 rounded-r-lg rounded-tl-lg'
              } p-3 shadow-sm`}>
                <pre className="whitespace-pre-wrap text-sm font-sans">{message.content}</pre>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-r-lg rounded-tl-lg p-3 shadow-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`向${selectedAgent.name}提问...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleManager; 