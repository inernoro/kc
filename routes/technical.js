const express = require('express');
const router = express.Router();

// 技术规范数据
const technicalStandards = [
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
const technicalTasks = [
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

// 技术简报数据
const technicalReports = [
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

// 获取所有技术规范
router.get('/standards', (req, res) => {
  try {
    const { category, status, priority } = req.query;
    
    let filteredStandards = [...technicalStandards];
    
    // 分类筛选
    if (category) {
      filteredStandards = filteredStandards.filter(standard => standard.category === category);
    }
    
    // 状态筛选
    if (status) {
      filteredStandards = filteredStandards.filter(standard => standard.status === status);
    }
    
    // 优先级筛选
    if (priority) {
      filteredStandards = filteredStandards.filter(standard => standard.priority === priority);
    }
    
    res.json({
      success: true,
      data: filteredStandards,
      total: filteredStandards.length,
      message: '技术规范列表获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取技术规范列表失败',
      code: 'FETCH_STANDARDS_ERROR'
    });
  }
});

// 获取单个技术规范详情
router.get('/standards/:id', (req, res) => {
  try {
    const { id } = req.params;
    const standard = technicalStandards.find(s => s.id === id);
    
    if (!standard) {
      return res.status(404).json({
        success: false,
        error: '技术规范不存在',
        code: 'STANDARD_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: standard,
      message: '技术规范详情获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取技术规范详情失败',
      code: 'FETCH_STANDARD_ERROR'
    });
  }
});

// 获取所有技术任务
router.get('/tasks', (req, res) => {
  try {
    const { type, status, priority, assignee } = req.query;
    
    let filteredTasks = [...technicalTasks];
    
    // 类型筛选
    if (type) {
      filteredTasks = filteredTasks.filter(task => task.type === type);
    }
    
    // 状态筛选
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    // 优先级筛选
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    // 负责人筛选
    if (assignee) {
      filteredTasks = filteredTasks.filter(task => task.assignee === assignee);
    }
    
    res.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length,
      message: '技术任务列表获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取技术任务列表失败',
      code: 'FETCH_TASKS_ERROR'
    });
  }
});

// 获取技术简报列表
router.get('/reports', (req, res) => {
  try {
    const { type, status, author } = req.query;
    
    let filteredReports = [...technicalReports];
    
    // 类型筛选
    if (type) {
      filteredReports = filteredReports.filter(report => report.type === type);
    }
    
    // 状态筛选
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    // 作者筛选
    if (author) {
      filteredReports = filteredReports.filter(report => report.author === author);
    }
    
    res.json({
      success: true,
      data: filteredReports,
      total: filteredReports.length,
      message: '技术简报列表获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取技术简报列表失败',
      code: 'FETCH_REPORTS_ERROR'
    });
  }
});

module.exports = router; 