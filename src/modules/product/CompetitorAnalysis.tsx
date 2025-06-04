import React from 'react';
import { Target } from 'lucide-react';

const CompetitorAnalysis: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <Target className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">竞争对手分析</h3>
        <p className="text-sm text-gray-500">市场竞争态势和对手分析</p>
      </div>
    </div>
  );
};

export default CompetitorAnalysis; 