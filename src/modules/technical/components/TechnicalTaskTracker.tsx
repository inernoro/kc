import React from 'react';
import { Activity } from 'lucide-react';
import { TechnicalStandard, TechnicalTask } from '../../../types/moduleTypes';
import { technicalTasks } from '../data';

const TechnicalTaskTracker = ({ selectedStandard }: { selectedStandard: TechnicalStandard | null }) => {
  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-blue-50/40 to-green-50/40 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-2" />
          任务跟踪管理
        </h3>
        <p className="text-sm text-gray-600">跟踪技术任务执行进度</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {technicalTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3">
            <h4 className="font-medium text-gray-900 text-sm mb-2">{task.title}</h4>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-600">{task.type}</span>
              <span className={`px-2 py-1 rounded ${task.priority === 'P0' ? 'bg-red-100 text-red-700' :
                task.priority === 'P1' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                {task.priority}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{task.progress}% 完成</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalTaskTracker;
