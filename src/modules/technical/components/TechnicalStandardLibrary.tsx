import React from 'react';
import { Code } from 'lucide-react';
import { TechnicalStandard } from '../../../types/moduleTypes';
import { technicalStandards } from '../data';

const TechnicalStandardLibrary = ({ selectedStandard, onStandardSelect }: {
  selectedStandard: TechnicalStandard | null,
  onStandardSelect: (standard: TechnicalStandard) => void
}) => {
  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-green-50/40 to-blue-50/40 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Code className="w-5 h-5 text-green-600 mr-2" />
          技术规范管理库
        </h3>
        <p className="text-sm text-gray-600">制定、维护、跟踪技术规范执行情况</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {technicalStandards.map((standard) => (
          <button
            key={standard.id}
            onClick={() => onStandardSelect(standard)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedStandard?.id === standard.id
              ? 'border-green-300/60 bg-green-50/60 shadow-sm backdrop-blur-sm'
              : 'border-gray-200/60 hover:border-green-200/60 hover:bg-gray-50/60 backdrop-blur-sm'
              }`}
          >
            <h4 className="font-medium text-gray-900 text-sm mb-1">{standard.title}</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{standard.category}</span>
              <span className="text-green-600">{standard.version}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TechnicalStandardLibrary;
