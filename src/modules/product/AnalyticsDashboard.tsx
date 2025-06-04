import React from 'react';
import { BarChart3 } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">分析仪表板</h3>
        <p className="text-sm text-gray-500">产品数据分析和指标监控</p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 