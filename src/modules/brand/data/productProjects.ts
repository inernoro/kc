import { ProductProject } from '../../../types/moduleTypes';

// 产品项目数据（基于产品立项流程）
export const productProjects: ProductProject[] = [
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
