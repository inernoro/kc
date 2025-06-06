import React, { useState } from 'react';
import KnowledgeSelector from './KnowledgeSelector';

const KnowledgeSelectorTest: React.FC = () => {
  const [selectedKnowledge, setSelectedKnowledge] = useState('general');

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">知识库选择器测试</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">基础功能测试</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">当前选择的知识库：</p>
              <p className="text-lg font-medium text-blue-600">{selectedKnowledge}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">选择知识库：</span>
              <KnowledgeSelector
                selectedKnowledge={selectedKnowledge}
                onKnowledgeChange={setSelectedKnowledge}
                className="w-56"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">右侧边界测试</h2>
          <div className="flex justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">右侧对齐测试：</span>
              <KnowledgeSelector
                selectedKnowledge={selectedKnowledge}
                onKnowledgeChange={setSelectedKnowledge}
                className="w-48"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">
            此选择器应该从右侧展开，不会被右边界遮住
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">窄容器测试</h2>
          <div className="w-64 border-2 border-dashed border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">窄容器：</span>
              <KnowledgeSelector
                selectedKnowledge={selectedKnowledge}
                onKnowledgeChange={setSelectedKnowledge}
                className="w-40"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            在窄容器中，文本应该被截断并显示省略号
          </p>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">测试说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 点击选择器应该打开下拉菜单</li>
            <li>• 下拉菜单应该从右侧展开，避免被右边界遮住</li>
            <li>• 选择不同知识库应该更新当前选择</li>
            <li>• 文本过长时应该显示省略号</li>
            <li>• 点击外部区域应该关闭下拉菜单</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSelectorTest; 