import React, { useState } from 'react';
import { ChevronDown, Bot, Sparkles, Zap } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  provider: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

const models: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: '最先进的语言模型，适合复杂任务',
    icon: Sparkles,
    provider: 'OpenAI'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '快速响应，成本效益高',
    icon: Zap,
    provider: 'OpenAI'
  },
  {
    id: 'claude-3',
    name: 'Claude-3',
    description: '优秀的分析和推理能力',
    icon: Bot,
    provider: 'Anthropic'
  }
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedModelData = models.find(model => model.id === selectedModel) || models[0];
  const Icon = selectedModelData.icon;

  return (
    <div className={`relative ${className || ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Icon className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">{selectedModelData.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {models.map((model) => {
              const ModelIcon = model.icon;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedModel === model.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <ModelIcon className={`w-5 h-5 mt-0.5 ${
                    selectedModel === model.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        selectedModel === model.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {model.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{model.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ModelSelector; 