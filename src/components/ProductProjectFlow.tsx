import React, { useState, useCallback } from 'react';
import { 
  Layers, Bot, User, Target, Lightbulb, Code, CheckCircle, Rocket, Star,
  Image, FileText, Paperclip, Send
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProductDemand, ProductProject } from '../types/moduleTypes';

export interface ProductProjectFlowProps {
  selectedDemand: ProductDemand | null;
  productProjects: ProductProject[];
}

const ProductProjectFlow: React.FC<ProductProjectFlowProps> = ({ selectedDemand, productProjects = [] }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('process');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const relatedProject = selectedDemand ? productProjects.find(p => p.demandId === selectedDemand.id) : null;

  const sevenStepsPoetry = [
    {
      id: '需求管理',
      name: '需求管理',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: '收集整理客户需求，明确项目目标'
    },
    {
      id: '产品规划',
      name: '产品规划',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: '制定产品方案，设计用户体验'
    },
    {
      id: '产品立项',
      name: '产品立项',
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: '项目评审通过，正式启动开发'
    },
    {
      id: '开发跟踪',
      name: '开发跟踪',
      icon: Code,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: '监控开发进度，确保质量交付'
    },
    {
      id: '产品验收',
      name: '产品验收',
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      description: '功能测试验收，确认交付标准'
    },
    {
      id: '上线发布',
      name: '上线发布',
      icon: Rocket,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: '正式上线部署，用户开始使用'
    },
    {
      id: '产品总结',
      name: '产品总结',
      icon: Star,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: '项目复盘总结，沉淀最佳实践'
    }
  ];

  const getStepStatus = (stepId: string) => {
    if (!relatedProject) return 'pending';
    const currentIndex = sevenStepsPoetry.findIndex(s => s.id === relatedProject.currentStage);
    const stepIndex = sevenStepsPoetry.findIndex(s => s.id === stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || 
      file.type === 'application/pdf' ||
      file.type.includes('document') ||
      file.type.includes('text/')
    );
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || !selectedDemand) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || '上传了文件',
      files: uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage, selectedDemand, relatedProject),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
    setUploadedFiles([]);
  };

  const generateAIResponse = (userMessage: string, demand: ProductDemand, project?: ProductProject | null): string => {
    if (!project) {
      return `基于需求「${demand.title}」，我建议首先进行详细的技术可行性分析。这个需求的业务价值评分为${demand.businessValue}/10，开发成本为${demand.developmentCost}/10。

建议的项目规划：
1. **需求分析阶段**（3-5天）：深入理解${demand.customer}的具体需求
2. **技术方案设计**（5-7天）：制定详细的技术实现方案
3. **资源评估**（2-3天）：评估所需的人力和时间成本
4. **立项决策**：基于以上分析决定是否立项

您希望我详细分析哪个方面？`;
    }

    const currentStage = project.currentStage;
    const progress = project.progress;

    switch (currentStage) {
      case '需求管理':
        return `当前项目「${project.name}」正处于需求管理阶段。

📋 **阶段重点**：
- 需求收集完整性：已完成客户访谈和需求文档整理
- 需求优先级排序：按业务价值和紧急程度分类
- 可行性初步评估：技术团队已确认方案可行

✅ **已完成**：
- 客户需求调研（${demand.customer}）
- 竞品分析和市场调研
- 需求文档撰写和评审

🎯 **下一步**：进入产品规划阶段，制定详细的产品路线图`;

      case '产品规划':
        return `项目「${project.name}」产品规划进展顺利，当前进度${progress}%。

🎨 **设计方案**：
- 用户体验流程设计已完成
- 功能模块架构设计中
- 界面原型设计进行中

📊 **关键指标**：
- 预期用户满意度：>95%
- 功能完整度目标：100%
- 性能指标：响应时间<200ms

🚀 **即将启动**：产品立项评审会议，预计3个工作日内完成`;

      default:
        return `项目「${project.name}」当前状态：${currentStage}，进度${progress}%。请告诉我您希望了解的具体信息，我会为您提供详细的分析和建议。`;
    }
  };

  const tabs = [
    {
      id: 'process',
      name: '立项流程',
      icon: Layers,
      description: '七步成诗项目管理流程'
    },
    {
      id: 'ai-assistant',
      name: 'AI助手',
      icon: Bot,
      description: '智能项目助手对话'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-gray-100 bg-gray-50/50">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title={tab.description}
              >
                <IconComponent className="w-3 h-3" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {selectedDemand ? (
          <>
            {activeTab === 'process' && (
              <>
                {relatedProject && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900">{relatedProject.currentStage}</span>
                        <span className="text-blue-600 font-medium">{relatedProject.progress}%</span>
                        <span className="text-gray-600">{relatedProject.manager}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${selectedDemand.priority === 'High' ? 'bg-red-100 text-red-700' :
                        selectedDemand.priority === 'Middle' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {selectedDemand.priority}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-gray-900">🎋 七步成诗流程</h4>
                    <div className="text-xs text-gray-500">传统项目管理哲学</div>
                  </div>

                  <div className="mb-6">
                    <div className="relative mb-2">
                      <div className="flex justify-between items-start">
                        {sevenStepsPoetry.map((step, index) => {
                          const status = getStepStatus(step.id);
                          const IconComponent = step.icon;
                          
                          return (
                            <div key={step.id} className="flex flex-col items-center relative z-20">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${
                                status === 'completed' 
                                  ? 'bg-emerald-500 border-emerald-400 text-white scale-110' 
                                  : status === 'current'
                                  ? 'bg-blue-500 border-blue-400 text-white scale-125 animate-pulse'
                                  : 'bg-white border-gray-300 text-gray-400'
                              }`}>
                                {status === 'completed' ? (
                                  <CheckCircle className="w-2.5 h-2.5" />
                                ) : status === 'current' ? (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                ) : (
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                              
                              <div className={`text-xs mt-2 text-center max-w-16 leading-tight transition-all duration-300 ${
                                status === 'completed' ? 'text-emerald-700 font-semibold' : 
                                status === 'current' ? 'text-blue-700 font-semibold scale-105' : 
                                'text-gray-500 font-medium'
                              }`}>
                                {step.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="absolute top-2 left-2 right-2 h-0.5 bg-gray-200 z-0" style={{ transform: 'translateY(-50%)' }}>
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-600 transition-all duration-700 ease-out"
                          style={{ 
                            width: `${Math.max(0, (sevenStepsPoetry.findIndex(s => s.id === (relatedProject?.currentStage || '需求管理')) / (sevenStepsPoetry.length - 1)) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {sevenStepsPoetry.map((step, index) => {
                      const status = getStepStatus(step.id);
                      const IconComponent = step.icon;

                      return (
                        <div key={step.id} className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md ${
                          status === 'current' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm scale-[1.02]' : 
                          status === 'completed' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm' :
                          'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center px-4 py-3">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                status === 'current' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 animate-pulse' : 
                                'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                              }`}>
                                {status === 'completed' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : status === 'current' ? (
                                  <IconComponent className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs font-bold">{index + 1}</span>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className={`font-medium transition-all duration-300 ${
                                  status === 'completed' ? 'text-emerald-900' : 
                                  status === 'current' ? 'text-blue-900 text-base' : 
                                  'text-gray-700 group-hover:text-gray-900'
                                }`}>
                                  {step.name}
                                </div>
                                <div className={`text-xs mt-0.5 transition-all duration-300 ${
                                  status === 'completed' ? 'text-emerald-600' :
                                  status === 'current' ? 'text-blue-600' :
                                  'text-gray-500'
                                }`}>
                                  {step.description}
                                </div>
                              </div>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                              status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                              status === 'current' ? 'bg-blue-100 text-blue-700 border border-blue-200 animate-pulse' :
                              'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              {status === 'completed' ? '✅ 已完成' : 
                               status === 'current' ? '🚀 进行中' : '⏳ 待开始'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'ai-assistant' && (
              <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-blue-50/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">AI助手</h4>
                      <p className="text-xs text-gray-500">七步成诗法</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700">在线</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-6">
                      <Bot className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-xs">开始提问吧！我会基于七步成诗法为您提供项目建议</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        <div className={`max-w-[75%] rounded-lg p-3 ${message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                          }`}>
                          {message.type === 'user' ? (
                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          ) : (
                            <div className="markdown-content">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({children}) => <h1 className="text-base font-bold text-gray-900 mb-2 border-b pb-1">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-sm font-semibold text-gray-800 mb-1 mt-2">{children}</h2>,
                                  h3: ({children}) => <h3 className="text-sm font-medium text-gray-700 mb-1 mt-2">{children}</h3>,
                                  p: ({children}) => <p className="text-sm text-gray-700 leading-relaxed mb-1">{children}</p>,
                                  ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-1 space-y-0.5">{children}</ul>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                          <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.timestamp}
                          </div>
                        </div>
                        {message.type === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-white border-t border-gray-200 rounded-b-lg">
                  <div className="border-t border-gray-200/50 bg-white/95 p-3 flex-shrink-0">
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-sm shadow-sm">
                        🤖
                      </div>

                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="询问项目相关问题..."
                        className="flex-1 h-9 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                      />

                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">选择需求开始项目管理</h4>
              <p className="text-sm">从左侧选择一个需求，查看对应的七步成诗项目流程</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductProjectFlow;