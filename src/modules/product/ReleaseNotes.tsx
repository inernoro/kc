import React from 'react';
import { FileText } from 'lucide-react';

const ReleaseNotes: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">发布说明</h3>
        <p className="text-sm text-gray-500">产品更新和功能发布记录</p>
      </div>
    </div>
  );
};

export default ReleaseNotes; 