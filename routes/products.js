const express = require('express');
const router = express.Router();

// 产品需求数据（从前端ModuleManager.tsx迁移过来）
const productDemands = [
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

// 产品项目数据
const productProjects = [
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

// 获取所有产品需求
router.get('/demands', (req, res) => {
  try {
    const { status, priority, urgency, importance } = req.query;
    
    let filteredDemands = [...productDemands];
    
    // 状态筛选
    if (status) {
      filteredDemands = filteredDemands.filter(demand => demand.status === status);
    }
    
    // 优先级筛选
    if (priority) {
      filteredDemands = filteredDemands.filter(demand => demand.priority === priority);
    }
    
    // 紧急程度筛选
    if (urgency) {
      filteredDemands = filteredDemands.filter(demand => demand.urgency === urgency);
    }
    
    // 重要程度筛选
    if (importance) {
      filteredDemands = filteredDemands.filter(demand => demand.importance === importance);
    }
    
    res.json({
      success: true,
      data: filteredDemands,
      total: filteredDemands.length,
      message: '产品需求列表获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取产品需求列表失败',
      code: 'FETCH_DEMANDS_ERROR'
    });
  }
});

// 获取单个需求详情
router.get('/demands/:id', (req, res) => {
  try {
    const { id } = req.params;
    const demand = productDemands.find(d => d.id === id);
    
    if (!demand) {
      return res.status(404).json({
        success: false,
        error: '需求不存在',
        code: 'DEMAND_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: demand,
      message: '需求详情获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取需求详情失败',
      code: 'FETCH_DEMAND_ERROR'
    });
  }
});

// 获取所有产品项目
router.get('/projects', (req, res) => {
  try {
    const { status, currentStage, manager } = req.query;
    
    let filteredProjects = [...productProjects];
    
    // 状态筛选
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    
    // 阶段筛选
    if (currentStage) {
      filteredProjects = filteredProjects.filter(project => project.currentStage === currentStage);
    }
    
    // 产品经理筛选
    if (manager) {
      filteredProjects = filteredProjects.filter(project => project.manager === manager);
    }
    
    res.json({
      success: true,
      data: filteredProjects,
      total: filteredProjects.length,
      message: '产品项目列表获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取产品项目列表失败',
      code: 'FETCH_PROJECTS_ERROR'
    });
  }
});

// 获取单个项目详情
router.get('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = productProjects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: '项目不存在',
        code: 'PROJECT_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: project,
      message: '项目详情获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取项目详情失败',
      code: 'FETCH_PROJECT_ERROR'
    });
  }
});

// 获取四象限统计数据
router.get('/demands/stats/quadrant', (req, res) => {
  try {
    const stats = {
      urgent_important: productDemands.filter(d => d.urgency === '紧急' && d.importance === '重要').length,
      important_not_urgent: productDemands.filter(d => d.urgency === '不紧急' && d.importance === '重要').length,
      urgent_not_important: productDemands.filter(d => d.urgency === '紧急' && d.importance === '不重要').length,
      not_urgent_not_important: productDemands.filter(d => d.urgency === '不紧急' && d.importance === '不重要').length
    };
    
    res.json({
      success: true,
      data: stats,
      message: '四象限统计数据获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取四象限统计失败',
      code: 'FETCH_QUADRANT_STATS_ERROR'
    });
  }
});

module.exports = router; 