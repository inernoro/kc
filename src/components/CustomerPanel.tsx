import React from 'react';
import { 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Target
} from 'lucide-react';

interface CustomerPanelProps {
  customer: any;
}

const CustomerPanel: React.FC<CustomerPanelProps> = ({ customer }) => {
  if (!customer) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">选择客户</h3>
          <p className="text-gray-500">从左侧列表选择一个客户以查看详细信息</p>
        </div>
      </div>
    );
  }

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'S': 
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse';
      case 'A': 
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md';
      case 'B': 
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'C': 
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default: 
        return 'bg-gray-400 text-white';
    }
  };

  const mockCustomerDetails = {
    ...customer,
    phone: '+86 138-0013-8000',
    email: 'contact@company.com',
    industry: '酒水销售',
    employees: '100-500人',
    registrationDate: '2023-03-15',
    lastOrderDate: '2024-01-10',
    totalOrders: 12,
    avgOrderValue: 25000,
    satisfactionScore: 4.5,
    renewalProbability: 85,
    riskLevel: 'low',
    tags: ['VIP客户', '品质优先', '节假日大户'],
    recentActivities: [
      { date: '2024-01-15', type: 'call', description: '春节促销方案沟通' },
      { date: '2024-01-12', type: 'email', description: '发送新品价格表' },
      { date: '2024-01-10', type: 'order', description: '完成年货订单支付' },
      { date: '2024-01-08', type: 'meeting', description: '品鉴会邀请确认' }
    ],
    metrics: {
      monthlyRevenue: 15000,
      revenueGrowth: 12,
      usageRate: 78,
      supportTickets: 3
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'order': return <DollarSign className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 客户基本信息 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{mockCustomerDetails.name}</h2>
              <p className="text-gray-600">{mockCustomerDetails.company}</p>
            </div>
            {/* 客户级别徽章 */}
            {mockCustomerDetails.level && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getLevelStyle(mockCustomerDetails.level)}`}>
                {mockCustomerDetails.level}
              </div>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(mockCustomerDetails.riskLevel)}`}>
            {mockCustomerDetails.riskLevel === 'low' ? '低风险' : 
             mockCustomerDetails.riskLevel === 'medium' ? '中风险' : '高风险'}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{mockCustomerDetails.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{mockCustomerDetails.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>注册时间：{mockCustomerDetails.registrationDate}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {mockCustomerDetails.tags.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 关键指标 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">关键指标</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">客户价值</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900">¥{mockCustomerDetails.value.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">满意度</span>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{mockCustomerDetails.satisfactionScore}/5.0</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">续约概率</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{mockCustomerDetails.renewalProbability}%</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">使用率</span>
              <BarChart3 className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{mockCustomerDetails.metrics.usageRate}%</p>
          </div>
        </div>
      </div>

      {/* 收入趋势 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">收入分析</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">月度收入</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">¥{mockCustomerDetails.metrics.monthlyRevenue.toLocaleString()}</span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{mockCustomerDetails.metrics.revenueGrowth}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">总订单数</span>
            <span className="font-semibold">{mockCustomerDetails.totalOrders}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">平均订单价值</span>
            <span className="font-semibold">¥{mockCustomerDetails.avgOrderValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
        <div className="space-y-3">
          {mockCustomerDetails.recentActivities.map((activity: any, index: number) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 智能建议 */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI建议</h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">续约提醒</p>
                <p className="text-xs text-blue-700">该客户合同将在30天后到期，建议主动联系讨论续约事宜</p>
              </div>
            </div>
          </div>
          
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">库存关注</p>
                  <p className="text-xs text-yellow-700">春节临近，建议提前备货，关注热销产品库存</p>
                </div>
              </div>
            </div>
          
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">增值机会</p>
                  <p className="text-xs text-green-700">可推荐礼盒装产品和定制化包装服务</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPanel; 