import React, { useState, useEffect } from 'react';
import { 
  Bot, PieChart, FileText, Send, Sparkles, Paperclip, X, Eye, Users, Trophy, Target, CheckCircle, Monitor
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProductDemand } from '../types/moduleTypes';
import { AIAgent, ChatMessage } from '../types';

// 品牌域智能体定义
const brandAgents: AIAgent[] = [
  {
    id: 'design-agent',
    name: '产品设计智能体',
    avatar: '✨',
    speciality: '产品方案可视化',
    description: '专业的产品方案可视化设计助手，能够生成精美的设计图和原型',
    capabilities: [
      '产品原型设计',
      '视觉方案生成',
      '用户界面设计',
      '交互流程设计',
      '设计规范制定'
    ],
    experience: '5年产品设计经验',
    responseStyle: '专业且富有创意',
    status: 'available',
    rating: 4.8,
    completedTasks: 156,
    category: '设计'
  },
  {
    id: 'project-assistant',
    name: '项目管理助手',
    avatar: '📋',
    speciality: '项目协调管理',
    description: '基于"七步成诗"项目管理法的专业助手，提供项目全生命周期支持',
    capabilities: [
      '项目规划制定',
      '进度跟踪监控',
      '风险评估分析',
      '资源配置优化',
      '需求分析整理',
      '决策支持建议'
    ],
    experience: '8年项目管理经验',
    responseStyle: '系统性和逻辑性强',
    status: 'available',
    rating: 4.9,
    completedTasks: 203,
    category: '管理'
  },
  {
    id: 'data-analyst',
    name: '数据分析专家',
    avatar: '📊',
    speciality: '数据洞察与分析',
    description: '专业的数据分析和可视化专家，提供深度数据洞察',
    capabilities: [
      '数据挖掘分析',
      '用户行为洞察',
      '业务指标监控',
      '预测建模分析',
      '可视化图表设计'
    ],
    experience: '6年数据分析经验',
    responseStyle: '数据驱动，逻辑严谨',
    status: 'available',
    rating: 4.7,
    completedTasks: 178,
    category: '分析'
  }
];

export interface BrandAgentCenterProps {
  selectedDemand: ProductDemand | null;
}

const BrandAgentCenter: React.FC<BrandAgentCenterProps> = ({ selectedDemand }) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(brandAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAgentSelectorExpanded, setIsAgentSelectorExpanded] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // 万花筒动画效果
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (messages.length === 0) {
      setAnimationStep(0);
      interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 2000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [messages.length]);

  // 文件处理函数
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 获取智能体回复
  const getAgentResponse = (agent: AIAgent, userInput: string): string => {
    switch (agent.id) {
      case 'design-agent':
        return `🎨 **产品设计方案**

基于您的需求"${userInput}"，我为您生成以下设计建议：

**视觉设计方向**
• 现代简约风格，突出功能性和美观性
• 采用渐变色彩搭配，营造科技感
• 响应式布局，支持多端适配

**交互流程设计**
1. 用户进入页面 → 引导动画
2. 功能展示 → 交互演示
3. 操作反馈 → 结果呈现

**技术实现建议**
• 使用Framer Motion进行动画处理
• 采用CSS Grid布局系统
• 集成可视化图表库

需要我为您生成具体的原型图或详细设计规范吗？`;

      case 'project-assistant':
        return `📋 **七步成诗项目分析**

针对当前项目情况，我提供以下建议：

**当前阶段评估**
• 项目进度：${selectedDemand ? '已确定需求' : '待选择需求'}
• 风险等级：中等
• 资源配置：需要优化

**后续建议**
1. 明确项目里程碑
2. 制定详细开发计划
3. 建立定期评审机制

是否需要我帮您制定详细的项目计划？`;

      case 'data-analyst':
        return `📊 **数据分析报告**

基于您的询问"${userInput}"，数据分析结果如下：

**关键指标**
• 用户活跃度：85%
• 功能使用率：78%
• 满意度评分：4.3/5

**趋势分析**
• 月度增长：12%
• 留存率：稳定提升
• 转化率：需要关注

需要我深入分析某个特定指标吗？`;

      default:
        return `您好！我是${agent.name}，很高兴为您服务。请告诉我您需要什么帮助？`;
    }
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      agentId: selectedAgent.id
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]);
    setIsTyping(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: getAgentResponse(selectedAgent, inputMessage),
        timestamp: new Date(),
        agentId: selectedAgent.id
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 ? (
        /* 品牌域设计界面 - 粉色渐变背景 */
        <div className="h-full bg-gradient-to-br from-pink-200/60 via-orange-200/50 via-purple-200/40 to-yellow-200/30 p-8 overflow-y-auto backdrop-blur-xl relative">
          {/* 顶部智能体信息栏 */}
          <div className="flex items-center justify-between mb-8 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">产品设计智能体</h3>
                <p className="text-sm text-gray-600">专业的产品方案可视化设计助手，能够生成精美的设计图和原型</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">在线</span>
              </div>
            </div>
            <div className="text-sm font-medium text-purple-600 bg-purple-100/50 px-3 py-1 rounded-lg">
              GPT-5
            </div>
          </div>

          {/* 中央主要内容区域 */}
          <div className="max-w-4xl mx-auto">
            {/* 大头像和问候语 */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">👋 你好！我是产品设计智能体</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">专业的产品方案可视化设计助手，能够生成精美的设计图和原型</p>
            </div>

            {/* 主功能卡片 */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-2xl ring-1 ring-white/20 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-8">
                  <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-bold text-purple-600">产品设计转换</h3>
                </div>

                {/* 动画区域 */}
                <div className="relative h-40 flex items-center justify-center mb-8">
                  <AnimatePresence mode="wait">
                    {animationStep === 0 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-4">
                          <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-base font-medium text-gray-700">上传文档</p>
                      </motion.div>
                    )}

                    {animationStep === 1 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="w-20 h-20 bg-purple-100 rounded-3xl shadow-xl flex items-center justify-center mb-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-10 h-10 text-purple-500" />
                          </motion.div>
                        </div>
                        <p className="text-base font-medium text-purple-600">AI 分析中</p>
                      </motion.div>
                    )}

                    {animationStep === 2 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-xl flex items-center justify-center mb-4">
                          <Monitor className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-base font-medium text-purple-600">生成设计</p>
                      </motion.div>
                    )}

                    {animationStep === 3 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-400 rounded-3xl shadow-xl flex items-center justify-center mb-4">
                            <Monitor className="w-10 h-10 text-white" />
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                        <p className="text-base font-medium text-green-600">精美输出</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-4 flex space-x-3">
                    {[0, 1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          animationStep === step ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-lg text-gray-800 mb-8 font-semibold">专业的产品方案可视化设计助手</p>
                
                {/* 三个功能特点 */}
                <div className="flex items-center justify-center space-x-12 text-gray-700 font-medium mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-base">多格式支持</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-base">AI 智能设计</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    <span className="text-base">精美输出</span>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex justify-center space-x-6">
                  <button className="px-8 py-3 border border-purple-300 text-purple-600 rounded-2xl hover:bg-purple-50 transition-colors text-base font-medium">设计界面</button>
                  <button className="px-8 py-3 border border-purple-300 text-purple-600 rounded-2xl hover:bg-purple-50 transition-colors text-base font-medium">项目分析</button>
                  <button className="px-8 py-3 border border-purple-300 text-purple-600 rounded-2xl hover:bg-purple-50 transition-colors text-base font-medium">技术方案</button>
                </div>
              </div>
            </div>
          </div>

          {/* 底部固定输入区域 */}
          <div className="fixed bottom-6 left-6 right-6 bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl z-10">
            <div className="flex items-center space-x-4 p-4 max-w-4xl mx-auto">
              <button className="p-3 text-gray-400 hover:text-purple-500 cursor-pointer bg-white/30 backdrop-blur border border-white/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/50">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="向产品设计智能体提问..."
                className="flex-1 px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-300 focus:bg-white/40 shadow-sm placeholder-gray-500 text-gray-700 transition-all duration-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isTyping}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 聊天模式界面 */
        <div className="h-full flex flex-col bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30">
          {/* 智能体选择器 */}
          <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">品牌域智能体中心</h3>
              <button
                onClick={() => setIsAgentSelectorExpanded(!isAgentSelectorExpanded)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {isAgentSelectorExpanded ? '收起' : '选择智能体'}
              </button>
            </div>

            {/* 当前选中的智能体 */}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl">{selectedAgent.avatar}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{selectedAgent.name}</div>
                <div className="text-sm text-gray-600">{selectedAgent.speciality}</div>
              </div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {selectedAgent.status === 'available' ? '在线' : '忙碌'}
              </div>
            </div>

            {/* 智能体选择列表 */}
            {isAgentSelectorExpanded && (
              <div className="mt-3 space-y-2">
                {brandAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setIsAgentSelectorExpanded(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      selectedAgent.id === agent.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-xl">{agent.avatar}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-600">{agent.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 对话区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-4">{selectedAgent.avatar}</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedAgent.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{selectedAgent.description}</p>
                  <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                    <div className="text-sm font-medium text-gray-700 mb-2">核心能力</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {message.type === 'agent' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">{selectedAgent.name}正在输入...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
              {uploadedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded px-2 py-1">
                      <Paperclip className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`向${selectedAgent.name}提问...`}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="p-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <Paperclip className="w-5 h-5" />
                </label>
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isTyping}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandAgentCenter;