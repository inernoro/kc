const express = require('express');
const router = express.Router();

// 模拟分析数据
const mockAnalytics = {
  globalMetrics: {
    todayCustomers: 12,
    monthlyRevenue: 2350000,
    monthlyTarget: 3000000,
    revenueGrowth: 15.8,
    remainingTarget: 650000,
    customerSatisfaction: 4.6,
    renewalRate: 87.5
  },
  renewalReminders: [
    { customer: '茅台酒业集团', amount: '150万', dueDate: '2024-02-15', priority: 'high' },
    { customer: '五粮液销售公司', amount: '80万', dueDate: '2024-02-20', priority: 'medium' },
    { customer: '剑南春酒厂', amount: '65万', dueDate: '2024-02-25', priority: 'medium' },
    { customer: '泸州老窖股份', amount: '92万', dueDate: '2024-03-01', priority: 'low' }
  ],
  salesTrends: {
    monthly: [
      { month: '2023-08', revenue: 1800000, customers: 45, orders: 120 },
      { month: '2023-09', revenue: 2100000, customers: 52, orders: 135 },
      { month: '2023-10', revenue: 2400000, customers: 58, orders: 148 },
      { month: '2023-11', revenue: 2200000, customers: 55, orders: 142 },
      { month: '2023-12', revenue: 2800000, customers: 62, orders: 165 },
      { month: '2024-01', revenue: 2350000, customers: 59, orders: 156 }
    ],
    quarterly: [
      { quarter: '2023-Q3', revenue: 6300000, growth: 12.5 },
      { quarter: '2023-Q4', revenue: 7200000, growth: 14.3 },
      { quarter: '2024-Q1', revenue: 2350000, growth: 15.8 }
    ]
  },
  customerSegmentation: {
    byLevel: {
      'S': { count: 8, revenue: 1200000, percentage: 51.1 },
      'A': { count: 15, revenue: 800000, percentage: 34.0 },
      'B': { count: 22, revenue: 280000, percentage: 11.9 },
      'C': { count: 14, revenue: 70000, percentage: 3.0 }
    },
    byStatus: {
      'active': { count: 35, percentage: 59.3 },
      'potential': { count: 18, percentage: 30.5 },
      'inactive': { count: 6, percentage: 10.2 }
    },
    byIndustry: {
      '白酒': { count: 28, revenue: 1580000 },
      '红酒': { count: 18, revenue: 520000 },
      '啤酒': { count: 13, revenue: 250000 }
    }
  },
  productPerformance: {
    topProducts: [
      { name: '茅台飞天', sales: 580000, growth: 18.5, margin: 35.2 },
      { name: '五粮液1618', sales: 420000, growth: 12.3, margin: 28.7 },
      { name: '剑南春水晶剑', sales: 350000, growth: 8.9, margin: 25.1 },
      { name: '泸州老窖特曲', sales: 280000, growth: 15.2, margin: 22.8 }
    ],
    seasonalTrends: {
      '春节': { demand: 'high', growth: 45.2 },
      '中秋': { demand: 'high', growth: 38.7 },
      '国庆': { demand: 'medium', growth: 22.1 },
      '夏季': { demand: 'low', growth: -15.3 }
    }
  },
  riskAnalysis: {
    highRiskCustomers: [
      { id: '4', name: '泸州老窖股份', riskScore: 85, reasons: ['沟通不畅', '订单下降', '付款延迟'] },
      { id: '7', name: '某地方经销商', riskScore: 72, reasons: ['市场竞争', '库存积压'] }
    ],
    churnPrediction: {
      next30Days: 2,
      next60Days: 4,
      next90Days: 7
    }
  }
};

// 获取全局指标
router.get('/metrics', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockAnalytics.globalMetrics,
      message: '全局指标获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取全局指标失败',
      code: 'FETCH_METRICS_ERROR'
    });
  }
});

// 获取续约提醒
router.get('/renewals', (req, res) => {
  try {
    const { priority, limit } = req.query;
    
    let renewals = [...mockAnalytics.renewalReminders];
    
    // 优先级筛选
    if (priority) {
      renewals = renewals.filter(renewal => renewal.priority === priority);
    }
    
    // 限制数量
    if (limit) {
      renewals = renewals.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      data: renewals,
      total: renewals.length,
      message: '续约提醒获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取续约提醒失败',
      code: 'FETCH_RENEWALS_ERROR'
    });
  }
});

// 获取销售趋势
router.get('/sales-trends', (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    const data = period === 'quarterly' 
      ? mockAnalytics.salesTrends.quarterly 
      : mockAnalytics.salesTrends.monthly;
    
    res.json({
      success: true,
      data: {
        period,
        trends: data
      },
      message: '销售趋势获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取销售趋势失败',
      code: 'FETCH_SALES_TRENDS_ERROR'
    });
  }
});

// 获取客户细分数据
router.get('/customer-segmentation', (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let data = mockAnalytics.customerSegmentation;
    
    if (type !== 'all' && data[type]) {
      data = { [type]: data[type] };
    }
    
    res.json({
      success: true,
      data,
      message: '客户细分数据获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取客户细分数据失败',
      code: 'FETCH_SEGMENTATION_ERROR'
    });
  }
});

// 获取产品表现数据
router.get('/product-performance', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockAnalytics.productPerformance,
      message: '产品表现数据获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取产品表现数据失败',
      code: 'FETCH_PRODUCT_PERFORMANCE_ERROR'
    });
  }
});

// 获取风险分析
router.get('/risk-analysis', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockAnalytics.riskAnalysis,
      message: '风险分析数据获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取风险分析数据失败',
      code: 'FETCH_RISK_ANALYSIS_ERROR'
    });
  }
});

// 生成客户报告
router.post('/reports/customer/:customerId', (req, res) => {
  try {
    const { customerId } = req.params;
    const { reportType = 'comprehensive', dateRange } = req.body;
    
    // 模拟报告生成
    const report = {
      id: `report_${Date.now()}`,
      customerId,
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      sections: {
        summary: {
          title: '客户概览',
          data: {
            totalRevenue: 1500000,
            orderCount: 25,
            avgOrderValue: 60000,
            satisfactionScore: 4.9
          }
        },
        trends: {
          title: '趋势分析',
          data: {
            revenueGrowth: 18.5,
            orderFrequency: 'monthly',
            seasonalPattern: 'strong_holiday_peaks'
          }
        },
        recommendations: {
          title: '建议措施',
          data: [
            '继续保持高质量服务',
            '推荐节假日促销套餐',
            '考虑VIP专属产品线',
            '定期举办品鉴活动'
          ]
        }
      }
    };
    
    res.json({
      success: true,
      data: report,
      message: '客户报告生成成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '生成客户报告失败',
      code: 'GENERATE_REPORT_ERROR'
    });
  }
});

// 获取实时数据
router.get('/realtime', (req, res) => {
  try {
    const realtimeData = {
      timestamp: new Date().toISOString(),
      activeUsers: Math.floor(Math.random() * 50) + 20,
      todayOrders: Math.floor(Math.random() * 10) + 5,
      todayRevenue: Math.floor(Math.random() * 100000) + 50000,
      systemLoad: Math.random() * 0.8 + 0.1,
      responseTime: Math.floor(Math.random() * 200) + 100,
      alerts: [
        {
          type: 'warning',
          message: '客户"泸州老窖股份"超过7天未联系',
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    res.json({
      success: true,
      data: realtimeData,
      message: '实时数据获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取实时数据失败',
      code: 'FETCH_REALTIME_ERROR'
    });
  }
});

// 导出数据
router.post('/export', (req, res) => {
  try {
    const { dataType, format = 'json', dateRange } = req.body;
    
    // 模拟数据导出
    const exportData = {
      exportId: `export_${Date.now()}`,
      dataType,
      format,
      dateRange,
      status: 'processing',
      estimatedTime: '2-3分钟',
      downloadUrl: null // 实际项目中会生成下载链接
    };
    
    // 模拟异步处理
    setTimeout(() => {
      exportData.status = 'completed';
      exportData.downloadUrl = `/api/analytics/download/${exportData.exportId}`;
    }, 2000);
    
    res.json({
      success: true,
      data: exportData,
      message: '数据导出任务已创建'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建导出任务失败',
      code: 'CREATE_EXPORT_ERROR'
    });
  }
});

// 获取导出状态
router.get('/export/:exportId', (req, res) => {
  try {
    const { exportId } = req.params;
    
    // 模拟导出状态查询
    const exportStatus = {
      exportId,
      status: 'completed',
      progress: 100,
      downloadUrl: `/api/analytics/download/${exportId}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24小时后过期
    };
    
    res.json({
      success: true,
      data: exportStatus,
      message: '导出状态获取成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取导出状态失败',
      code: 'FETCH_EXPORT_STATUS_ERROR'
    });
  }
});

module.exports = router; 