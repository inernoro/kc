import React, { useState, useEffect } from 'react';
import { 
  Send, FileText, Paperclip, X, Sparkles, Users, Trophy, Target, CheckCircle, Monitor
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentId: string;
}

interface ResumeAgent {
  id: string;
  name: string;
  avatar: string;
  speciality: string;
  description: string;
  capabilities: string[];
  experience: string;
  responseStyle: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  completedTasks: number;
  category: string;
}

interface Props {
  selectedAgent?: ResumeAgent;
  onJobInfoExtracted?: (jobInfo: any) => void;
  onCandidatesAnalyzed?: (candidates: any[]) => void;
}

// HR智能体定义 - 仿照品牌域结构
const hrAgents: ResumeAgent[] = [
  {
    id: 'kaleidoscope-hr',
    name: '万花筒智能体',
    avatar: '✨',
    speciality: '简历筛选可视化',
    description: '专业的简历筛选可视化设计助手，能够生成精美的简历匹配设计图和原型',
    capabilities: [
      '简历解析分析',
      '智能匹配排序',
      '可视化展示',
      '候选人评估',
      '招聘报告生成'
    ],
    experience: '5年HR技术经验',
    responseStyle: '专业且直观',
    status: 'available',
    rating: 4.8,
    completedTasks: 156,
    category: 'HR'
  },
  {
    id: 'talent-matcher',
    name: '人才匹配专家',
    avatar: '🎯',
    speciality: '精准人才匹配',
    description: '基于AI算法的智能人才匹配专家，提供精准的候选人推荐',
    capabilities: [
      '技能匹配分析',
      '经验评估',
      '文化适配度',
      '薪资匹配度',
      '面试建议'
    ],
    experience: '8年人才匹配经验',
    responseStyle: '精准高效',
    status: 'available',
    rating: 4.9,
    completedTasks: 203,
    category: 'HR'
  }
];

const ResumeChatArea: React.FC<Props> = ({ 
  selectedAgent = hrAgents[0],
  onJobInfoExtracted,
  onCandidatesAnalyzed
}) => {
  const [currentAgent, setCurrentAgent] = useState<ResumeAgent>(selectedAgent);
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
    const newFiles = Array.from(files).filter(file => 
      file.type === 'application/pdf' || 
      file.name.endsWith('.doc') || 
      file.name.endsWith('.docx')
    );
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 获取智能体回复 - 仿照品牌域的回复格式
  const getAgentResponse = (agent: ResumeAgent, userInput: string): string => {
    switch (agent.id) {
      case 'kaleidoscope-hr':
        return `🎯 **简历筛选结果**

基于您提供的招聘JD和${uploadedFiles.length}份简历，我为您分析如下：

**JD解析结果**
• 职位：高级前端工程师
• 技能要求：React、TypeScript、Vue.js
• 经验要求：3-5年

**简历筛选进度**
正在分析候选人匹配度，请查看右侧排名结果...

**匹配统计**
• 高匹配度候选人：3位
• 平均匹配度：85%
• 推荐面试：前2位候选人

需要我详细分析某位候选人的匹配情况吗？`;

      case 'talent-matcher':
        return `🎯 **人才匹配分析**

针对您的需求"${userInput}"，匹配结果如下：

**匹配维度分析**
• 技能匹配：90%
• 经验匹配：85%
• 地域匹配：100%
• 薪资匹配：95%

**推荐候选人**
1. 张伟 - 匹配度95%
2. 李娜 - 匹配度88%
3. 王强 - 匹配度82%

**面试建议**
建议优先安排前2位候选人面试，重点关注项目经验和团队协作能力。

需要详细的面试问题清单吗？`;

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
      agentId: currentAgent.id
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // 如果有文件，执行简历分析
    if (uploadedFiles.length > 0) {
      // 提取JD信息
      const jobInfo = {
        title: '高级前端工程师',
        company: 'XX科技有限公司',
        location: '北京',
        salaryRange: '25-35K',
        experienceRequired: '3-5年',
        requiredSkills: ['React', 'TypeScript', 'Vue.js'],
        description: currentInput
      };
      onJobInfoExtracted?.(jobInfo);

      // 生成模拟分析结果
      const analysisResults = uploadedFiles.map((file, index) => ({
        id: `candidate_${index + 1}`,
        name: file.name.replace(/\.(pdf|doc|docx)$/i, ''),
        matchScore: Math.floor(Math.random() * 30) + 70,
        fileName: file.name,
        position: '高级前端工程师',
        experience: `${Math.floor(Math.random() * 3) + 3}年`,
        education: '本科 - 计算机科学与技术',
        location: ['北京', '上海', '深圳', '杭州'][Math.floor(Math.random() * 4)],
        skills: ['React', 'TypeScript', 'Vue.js', 'Node.js', 'Python'],
        strengths: ['技术能力强', '学习能力快', '团队协作好'],
        weaknesses: ['缺少大型项目经验']
      }));
      onCandidatesAnalyzed?.(analysisResults);
    }

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: getAgentResponse(currentAgent, currentInput),
        timestamp: new Date(),
        agentId: currentAgent.id
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };


  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 ? (
        /* 简历筛选界面 - 添加顶部信息栏和背景动画 */
        <div className="h-full bg-gradient-to-br from-pink-200/60 via-orange-200/50 via-purple-200/40 to-yellow-200/30 p-4 overflow-y-auto backdrop-blur-xl relative flex flex-col">
          {/* 背景装饰动画 - 调整位置避免与主内容重叠 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                x: [0, 80, 0],
                y: [0, -60, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 left-10 w-3 h-3 bg-purple-300/20 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, -60, 0],
                y: [0, 80, 0],
                rotate: [0, -180, -360]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 right-20 w-4 h-4 bg-pink-300/15 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, 40, 0],
                y: [0, -40, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-20 left-20 w-2 h-2 bg-orange-300/20 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, -30, 0],
                y: [0, 50, 0],
                rotate: [0, 90, 180]
              }}
              transition={{ 
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-60 left-80 w-2 h-2 bg-blue-300/15 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 22,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-40 right-80 w-3 h-3 bg-green-300/18 rounded-full"
            />
            
            {/* 额外的背景动效装饰 */}
            <motion.div
              animate={{ 
                x: [0, -70, 0],
                y: [0, 60, 0],
                rotate: [0, 270, 360],
                scale: [1, 1.4, 1]
              }}
              transition={{ 
                duration: 28,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-32 right-40 w-4 h-4 bg-gradient-to-br from-purple-400/15 to-pink-400/10 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, 45, 0],
                y: [0, -70, 0],
                rotate: [0, -120, -240]
              }}
              transition={{ 
                duration: 35,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-32 left-60 w-2 h-2 bg-gradient-to-br from-orange-400/20 to-yellow-400/15 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, -25, 0],
                y: [0, 40, 0],
                scale: [1, 1.8, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-80 left-32 w-3 h-3 bg-gradient-to-br from-blue-400/12 to-indigo-400/8 rounded-full"
            />
            <motion.div
              animate={{ 
                x: [0, 35, 0],
                y: [0, -45, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 26,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-80 right-60 w-2 h-2 bg-gradient-to-br from-pink-400/18 to-rose-400/12 rounded-full"
            />
          </div>

          {/* 顶部智能体信息栏 */}
          <div className="flex items-center justify-between mb-8 bg-white/40 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-lg relative z-10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-xl">✨</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-gray-800">简历筛选智能体</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">在线</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">专业的简历筛选可视化设计助手，能够生成精美的简历匹配设计图和原型</p>
              </div>
            </div>
            <div className="text-sm font-medium text-purple-600 bg-purple-100/50 px-3 py-1 rounded-lg">
              GPT-5
            </div>
          </div>

          {/* 居中的核心动画卡片 - 调小尺寸 */}
          <div className="flex items-center justify-center flex-1 min-h-0">
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-lg ring-1 ring-white/20 w-full max-w-lg relative z-10">
              <div className="text-center">
                <div className="flex items-center justify-center mb-8">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-xl font-bold text-purple-600">简历筛选转换</h3>
                </div>

                {/* 动画区域 - 调整高度 */}
                <div className="relative h-32 flex items-center justify-center mb-8">
                  <AnimatePresence mode="wait">
                    {animationStep === 0 && (
                      <motion.div
                        key="upload-step"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center mb-2">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">上传简历</p>
                      </motion.div>
                    )}

                    {animationStep === 1 && (
                      <motion.div
                        key="analyze-step"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-xl shadow-xl flex items-center justify-center mb-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-6 h-6 text-purple-500" />
                          </motion.div>
                        </div>
                        <p className="text-sm font-medium text-purple-600">AI 分析中</p>
                      </motion.div>
                    )}

                    {animationStep === 2 && (
                      <motion.div
                        key="match-step"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl shadow-xl flex items-center justify-center mb-2">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-medium text-purple-600">生成匹配</p>
                      </motion.div>
                    )}

                    {animationStep === 3 && (
                      <motion.div
                        key="complete-step"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="relative mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl shadow-xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <CheckCircle className="w-3 h-3 text-white" />
                          </motion.div>
                        </div>
                        <p className="text-sm font-medium text-green-600 mt-1">精准排序</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-1 flex space-x-1">
                    {[0, 1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          animationStep === step ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-800 mb-4 font-semibold">专业的简历筛选可视化设计助手</p>
                
                {/* 三个功能特点 */}
                <div className="flex items-center justify-center space-x-8 text-gray-700 font-medium mb-8">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">多格式支持</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">AI 智能配置</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">精准排序</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 聊天模式 - 仿照品牌域聊天样式 */
        <div className="h-full flex flex-col bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30">
          {/* 智能体头部 */}
          <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{currentAgent.name}</div>
                <div className="text-sm text-gray-600">{currentAgent.speciality}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">在线</span>
              </div>
            </div>
          </div>

          {/* 对话区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    <span className="text-sm text-gray-500">{currentAgent.name}正在输入...</span>
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
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
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
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="向万花筒智能体提问..."
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
      )}

      {/* 底部固定输入区域 - 更透明、更窄、覆盖上层元素 */}
      {messages.length === 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl z-10">
          {uploadedFiles.length > 0 && (
            <div className="p-3 pb-0 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-1 bg-white/40 backdrop-blur rounded-lg px-2 py-1 border border-white/20 shadow-sm">
                  <Paperclip className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-gray-700 font-medium max-w-20 truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-2 p-3">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload-bottom"
            />
            <label
              htmlFor="file-upload-bottom"
              className="p-2 text-gray-400 hover:text-purple-500 cursor-pointer bg-white/30 backdrop-blur border border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/50"
            >
              <Paperclip className="w-4 h-4" />
            </label>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="向万花筒智能体提问..."
              className="flex-1 px-3 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-xl resize-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300 focus:bg-white/40 shadow-sm placeholder-gray-500 text-gray-700 transition-all duration-200 text-sm"
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
              className="p-2 bg-gradient-to-r from-purple-400/80 to-pink-400/80 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeChatArea;