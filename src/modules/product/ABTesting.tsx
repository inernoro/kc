import React from 'react';
import { TestTube } from 'lucide-react';

const ABTesting: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <TestTube className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">A/B 测试</h3>
        <p className="text-sm text-gray-500">功能和界面的对比测试</p>
      </div>
    </div>
  );
};

export default ABTesting; 