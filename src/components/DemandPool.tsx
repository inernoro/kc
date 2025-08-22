import React from 'react';
import { Target } from 'lucide-react';
import { ProductDemand } from '../types/moduleTypes';

export interface DemandPoolProps {
  selectedDemand: ProductDemand | null;
  onDemandSelect: (demand: ProductDemand) => void;
  productDemands: ProductDemand[];
}

const DemandPool: React.FC<DemandPoolProps> = ({ selectedDemand, onDemandSelect, productDemands = [] }) => {
  const getQuadrantStats = () => {
    const stats = {
      urgent_important: productDemands.filter(d => d.urgency === '紧急' && d.importance === '重要').length,
      important_not_urgent: productDemands.filter(d => d.urgency === '不紧急' && d.importance === '重要').length,
      urgent_not_important: productDemands.filter(d => d.urgency === '紧急' && d.importance === '不重要').length,
      not_urgent_not_important: productDemands.filter(d => d.urgency === '不紧急' && d.importance === '不重要').length
    };
    return stats;
  };

  const quadrantStats = getQuadrantStats();

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">TAPD需求管理池</h3>
        <p className="text-sm text-gray-600">基于"七步成诗"法的需求全生命周期管理</p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2 text-slate-600" />
          紧急重要象限分析
        </h4>
        <div className="grid grid-cols-2 gap-2.5 p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-gray-200">
          <div className="bg-gradient-to-br from-red-50 to-rose-100 p-2.5 rounded-md border border-red-200/60 shadow-sm">
            <div className="text-xs font-medium text-red-800 mb-1 opacity-90">重要紧急</div>
            <div className="text-lg font-bold text-red-900">{quadrantStats.urgent_important}</div>
            <div className="text-xs text-red-700 opacity-75">立即处理</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-2.5 rounded-md border border-emerald-200/60 shadow-sm">
            <div className="text-xs font-medium text-emerald-800 mb-1 opacity-90">重要不紧急</div>
            <div className="text-lg font-bold text-emerald-900">{quadrantStats.important_not_urgent}</div>
            <div className="text-xs text-emerald-700 opacity-75">计划安排</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-2.5 rounded-md border border-amber-200/60 shadow-sm">
            <div className="text-xs font-medium text-amber-800 mb-1 opacity-90">紧急不重要</div>
            <div className="text-lg font-bold text-amber-900">{quadrantStats.urgent_not_important}</div>
            <div className="text-xs text-amber-700 opacity-75">授权处理</div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-2.5 rounded-md border border-slate-200/60 shadow-sm">
            <div className="text-xs font-medium text-slate-700 mb-1 opacity-90">不重要不紧急</div>
            <div className="text-lg font-bold text-slate-800">{quadrantStats.not_urgent_not_important}</div>
            <div className="text-xs text-slate-600 opacity-75">稍后处理</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {productDemands.map((demand) => (
          <button
            key={demand.id}
            onClick={() => onDemandSelect(demand)}
            className={`
              w-full text-left p-3 rounded-lg border transition-all duration-200
              ${selectedDemand?.id === demand.id
                ? 'border-slate-300 bg-slate-50 shadow-sm'
                : 'border-gray-200 hover:border-slate-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">{demand.title}</h4>
              <span className={`
                px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0
                ${demand.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                  demand.priority === 'Middle' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    demand.priority === 'Low' ? 'bg-slate-50 text-slate-700 border border-slate-200' :
                      'bg-gray-50 text-gray-700 border border-gray-200'
                }
              `}>
                {demand.priority}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${demand.status === '待评审' ? 'bg-amber-500' :
                  demand.status === '待规划' ? 'bg-slate-500' :
                    demand.status === '已立项' ? 'bg-emerald-500' :
                      demand.status === '开发中' ? 'bg-violet-500' :
                        demand.status === '已上线' ? 'bg-blue-500' : 'bg-rose-500'
                  }`} />
                {demand.status}
              </span>
              <span className="text-gray-500">{demand.submitTime}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{demand.customer}</span>
              <span className={`px-2 py-1 rounded border ${demand.source === '商户需求' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                demand.source === '代理伙伴' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                {demand.source}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className={`px-2 py-1 rounded border ${demand.urgency === '紧急' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                {demand.urgency}
              </span>
              <span className={`px-2 py-1 rounded border ${demand.importance === '重要' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                {demand.importance}
              </span>
              <div className="ml-auto">
                <span className="text-gray-500">优先级:</span>
                <span className="text-emerald-600 font-medium ml-1">
                  {Math.round(demand.businessValue / demand.developmentCost * 10) / 10}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemandPool;