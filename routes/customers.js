const express = require('express');
const router = express.Router();

// 模拟客户数据（实际项目中应该连接数据库）
const mockCustomers = [
  {
    id: '1',
    name: '李明',
    company: '茅台酒业集团',
    email: 'liming@maotai.com',
    phone: '+86 138-0013-8001',
    level: 'S',
    status: 'active',
    priority: 'high',
    region: '华东',
    totalRevenue: 1500000,
    value: 1500000,
    lastContact: '2024-01-15',
    riskLevel: 'low',
    tags: ['VIP客户', '品质优先', '节假日大户'],
    avatar: '/avatars/li.jpg',
    createdAt: '2023-03-15',
    updatedAt: '2024-01-15',
    // 扩展字段
    industry: '酒水销售',
    employees: '1000+人',
    registrationDate: '2023-03-15',
    lastOrderDate: '2024-01-10',
    totalOrders: 25,
    avgOrderValue: 60000,
    satisfactionScore: 4.9,
    renewalProbability: 95,
    recentActivities: [
      { date: '2024-01-15', type: 'call', description: '春节促销方案沟通' },
      { date: '2024-01-12', type: 'email', description: '发送新品价格表' },
      { date: '2024-01-10', type: 'order', description: '完成年货订单支付' },
      { date: '2024-01-08', type: 'meeting', description: '品鉴会邀请确认' }
    ],
    metrics: {
      monthlyRevenue: 125000,
      revenueGrowth: 18,
      usageRate: 92,
      supportTickets: 1
    }
  },
  {
    id: '2',
    name: '王小红',
    company: '五粮液销售公司',
    email: 'wangxh@wuliangye.com',
    phone: '+86 138-0013-8002',
    level: 'A',
    status: 'potential',
    priority: 'medium',
    region: '华西',
    totalRevenue: 800000,
    value: 800000,
    lastContact: '2024-01-14',
    riskLevel: 'medium',
    tags: ['潜在大客户', '价格敏感', '品质要求高'],
    avatar: '/avatars/wang.jpg',
    createdAt: '2023-06-20',
    updatedAt: '2024-01-14',
    // 扩展字段
    industry: '酒水销售',
    employees: '500-1000人',
    registrationDate: '2023-06-20',
    lastOrderDate: '2024-01-05',
    totalOrders: 15,
    avgOrderValue: 53000,
    satisfactionScore: 4.6,
    renewalProbability: 78,
    recentActivities: [
      { date: '2024-01-14', type: 'call', description: '产品咨询和报价' },
      { date: '2024-01-11', type: 'email', description: '发送产品目录' },
      { date: '2024-01-05', type: 'order', description: '试订单完成' },
      { date: '2024-01-03', type: 'meeting', description: '初次商务洽谈' }
    ],
    metrics: {
      monthlyRevenue: 66000,
      revenueGrowth: 8,
      usageRate: 75,
      supportTickets: 2
    }
  },
  {
    id: '3',
    name: '张伟',
    company: '剑南春酒厂',
    email: 'zhangwei@jiannanchun.com',
    phone: '+86 138-0013-8003',
    level: 'S',
    status: 'active',
    priority: 'high',
    region: '华西',
    totalRevenue: 650000,
    value: 650000,
    lastContact: '2024-01-13',
    riskLevel: 'low',
    tags: ['老客户', '稳定合作', '量大优惠'],
    avatar: '/avatars/zhang.jpg',
    createdAt: '2022-11-10',
    updatedAt: '2024-01-13',
    // 扩展字段
    industry: '酒水销售',
    employees: '500-1000人',
    registrationDate: '2022-11-10',
    lastOrderDate: '2024-01-08',
    totalOrders: 32,
    avgOrderValue: 20000,
    satisfactionScore: 4.7,
    renewalProbability: 88,
    recentActivities: [
      { date: '2024-01-13', type: 'call', description: '续约条件商讨' },
      { date: '2024-01-10', type: 'email', description: '合同条款确认' },
      { date: '2024-01-08', type: 'order', description: '月度订单完成' },
      { date: '2024-01-06', type: 'meeting', description: '年度合作回顾' }
    ],
    metrics: {
      monthlyRevenue: 54000,
      revenueGrowth: 12,
      usageRate: 85,
      supportTickets: 1
    }
  },
  {
    id: '4',
    name: '刘芳',
    company: '泸州老窖股份',
    email: 'liufang@lzlj.com',
    phone: '+86 138-0013-8004',
    level: 'C',
    status: 'inactive',
    priority: 'low',
    region: '华西',
    totalRevenue: 920000,
    value: 920000,
    lastContact: '2024-01-10',
    riskLevel: 'high',
    tags: ['需要关注', '沟通不畅', '价格敏感'],
    avatar: '/avatars/liu.jpg',
    createdAt: '2023-01-15',
    updatedAt: '2024-01-10',
    // 扩展字段
    industry: '酒水销售',
    employees: '1000+人',
    registrationDate: '2023-01-15',
    lastOrderDate: '2023-12-20',
    totalOrders: 8,
    avgOrderValue: 115000,
    satisfactionScore: 4.2,
    renewalProbability: 45,
    recentActivities: [
      { date: '2024-01-10', type: 'call', description: '客户关怀回访' },
      { date: '2024-01-05', type: 'email', description: '新年问候邮件' },
      { date: '2023-12-20', type: 'order', description: '年末订单' },
      { date: '2023-12-15', type: 'meeting', description: '问题反馈会议' }
    ],
    metrics: {
      monthlyRevenue: 0,
      revenueGrowth: -25,
      usageRate: 35,
      supportTickets: 5
    }
  }
];

// 获取所有客户列表
router.get('/', (req, res) => {
  try {
    const { status, level, priority, search } = req.query;
    
    let filteredCustomers = [...mockCustomers];
    
    // 状态筛选
    if (status) {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
    }
    
    // 级别筛选
    if (level) {
      filteredCustomers = filteredCustomers.filter(customer => customer.level === level);
    }
    
    // 优先级筛选
    if (priority) {
      filteredCustomers = filteredCustomers.filter(customer => customer.priority === priority);
    }
    
    // 搜索筛选
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.company.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({
      success: true,
      data: filteredCustomers,
      total: filteredCustomers.length,
      message: '客户列表获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取客户列表失败',
      code: 'FETCH_CUSTOMERS_ERROR'
    });
  }
});

// 获取单个客户详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const customer = mockCustomers.find(c => c.id === id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: '客户不存在',
        code: 'CUSTOMER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: customer,
      message: '客户详情获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取客户详情失败',
      code: 'FETCH_CUSTOMER_ERROR'
    });
  }
});

// 更新客户信息
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const customerIndex = mockCustomers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '客户不存在',
        code: 'CUSTOMER_NOT_FOUND'
      });
    }
    
    // 更新客户信息
    mockCustomers[customerIndex] = {
      ...mockCustomers[customerIndex],
      ...updateData,
      id // 确保ID不被修改
    };
    
    res.json({
      success: true,
      data: mockCustomers[customerIndex],
      message: '客户信息更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新客户信息失败',
      code: 'UPDATE_CUSTOMER_ERROR'
    });
  }
});

// 获取客户活动记录
router.get('/:id/activities', (req, res) => {
  try {
    const { id } = req.params;
    const customer = mockCustomers.find(c => c.id === id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: '客户不存在',
        code: 'CUSTOMER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: customer.recentActivities,
      message: '客户活动记录获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取客户活动记录失败',
      code: 'FETCH_ACTIVITIES_ERROR'
    });
  }
});

// 添加客户活动记录
router.post('/:id/activities', (req, res) => {
  try {
    const { id } = req.params;
    const { type, description } = req.body;
    
    const customerIndex = mockCustomers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '客户不存在',
        code: 'CUSTOMER_NOT_FOUND'
      });
    }
    
    const newActivity = {
      date: new Date().toISOString().split('T')[0],
      type,
      description
    };
    
    mockCustomers[customerIndex].recentActivities.unshift(newActivity);
    
    // 保持最近10条记录
    if (mockCustomers[customerIndex].recentActivities.length > 10) {
      mockCustomers[customerIndex].recentActivities = 
        mockCustomers[customerIndex].recentActivities.slice(0, 10);
    }
    
    res.json({
      success: true,
      data: newActivity,
      message: '客户活动记录添加成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '添加客户活动记录失败',
      code: 'ADD_ACTIVITY_ERROR'
    });
  }
});

// 导出模拟数据供其他模块使用
module.exports.mockCustomers = mockCustomers;

module.exports = router; 