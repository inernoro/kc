export interface ProductDemand {
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
  businessValue: number;
  developmentCost: number;
  customer: string;
  urgency: '紧急' | '不紧急';
  importance: '重要' | '不重要';
}

export interface ProductProject {
  id: string;
  name: string;
  version: string;
  versionType: '大版本' | '中版本' | '小版本';
  status: '一稿设计' | '二稿设计' | '三稿设计' | 'UI设计' | '开发中' | '测试中' | '验收中' | '已上线';
  progress: number;
  currentStage: '需求管理' | '产品规划' | '产品立项' | '开发跟踪' | '产品验收' | '上线发布' | '产品总结';
  manager: string;
  developer?: string;
  tester?: string;
  relatedSystems: string[];
  demandId?: string;
  deadline: string;
  createTime: string;
  prototype?: {
    draft1?: string;
    draft2?: string;
    draft3?: string;
  };
  reviewRecords: {
    stage: '一稿' | '二稿' | '三稿';
    reviewer: string;
    result: '通过' | '不通过' | '待评审';
    feedback: string;
    time: string;
  }[];
}

export interface TechnicalStandard {
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
  complexity: number;
  impact: string[];
  downloadUrl?: string;
}

export interface TechnicalReport {
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

export interface TechnicalTask {
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

export interface AIAgent {
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentId?: string;
}