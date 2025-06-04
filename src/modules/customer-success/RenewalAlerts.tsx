import React from 'react';
import { AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react';

const RenewalAlerts: React.FC = () => {
  const renewalAlerts = [
    {
      id: '1',
      customerName: '张明华',
      company: '明华酒业有限公司',
      renewalDate: '2024-03-15',
      daysLeft: 45,
      value: 250000,
      probability: 85,
      status: 'urgent'
    },
    {
      id: '2',
      customerName: '李建国',
      company: '建国贸易集团',
      renewalDate: '2024-02-28',
      daysLeft: 28,
      value: 180000,
      probability: 70,
      status: 'warning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">续约提醒</h2>
      <div className="space-y-4">
        {renewalAlerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{alert.customerName}</h3>
                <p className="text-sm text-gray-600">{alert.company}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    续约日期: {alert.renewalDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    剩余 {alert.daysLeft} 天
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    价值: ¥{alert.value.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    成功率: {alert.probability}%
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                {alert.status === 'urgent' ? '紧急' : alert.status === 'warning' ? '警告' : '正常'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenewalAlerts; 