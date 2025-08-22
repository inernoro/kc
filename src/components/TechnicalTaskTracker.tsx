import React from 'react';
import { Activity } from 'lucide-react';
import { TechnicalStandard, TechnicalTask } from '../types/moduleTypes';

export interface TechnicalTaskTrackerProps {
  selectedStandard: TechnicalStandard | null;
  technicalTasks: TechnicalTask[];
}

const TechnicalTaskTracker: React.FC<TechnicalTaskTrackerProps> = ({ 
  selectedStandard, 
  technicalTasks = [] 
}) => {
  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-blue-50/40 to-green-50/40 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-2" />
          任务跟踪管理
        </h3>
        <p className="text-sm text-gray-600">跟踪技术任务执行进度</p>
        {selectedStandard && (
          <p className="text-xs text-blue-600 mt-1">关联规范: {selectedStandard.title}</p>
        )}
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {technicalTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                task.priority === 'P0' ? 'bg-red-100 text-red-700' :
                task.priority === 'P1' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.priority}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-600">{task.type}</span>
              <span className="text-gray-500">{task.assignee}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  task.status === '已完成' ? 'bg-green-500' :
                  task.status === '进行中' ? 'bg-blue-500' :
                  task.status === '已延期' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{task.progress}% 完成</span>
              <span className={`px-2 py-1 rounded font-medium ${
                task.status === '已完成' ? 'bg-green-100 text-green-700' :
                task.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                task.status === '已延期' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.status}
              </span>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              截止: {task.deadline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalTaskTracker;