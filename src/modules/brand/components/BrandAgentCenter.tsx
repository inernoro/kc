import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Eye,
  FileText,
  Image,
  Paperclip,
  Send,
  X
} from 'lucide-react';
import { ProductDemand } from '../../../types/moduleTypes';
import { brandAgents, AIAgent, ChatMessage } from '../data/brandAgents';
import KaleidoscopeAnimation from '../../../shared/components/KaleidoscopeAnimation';
import PRDPreview from '../../../components/PRDPreview';

const BrandAgentCenter = ({ selectedDemand }: { selectedDemand: ProductDemand | null }) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(brandAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAgentSelectorExpanded, setIsAgentSelectorExpanded] = useState(false);
  const [prdPreviewOpen, setPrdPreviewOpen] = useState(false);
  const [prdPreviewContent, setPrdPreviewContent] = useState('');

  // 文件处理函数
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now().toString() as any,
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
        role: 'assistant',
        content: getAgentResponse(selectedAgent, inputMessage),
        timestamp: (Date.now() + 1000).toString() as any,
        agentId: selectedAgent.id
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  // 检测消息是否包含PRD相关内容
  const isPRDContent = (content: string) => {
    const prdKeywords = [
      '万花筒设计方案', 'PRD', '需求文档', '产品方案', '设计方案',
      '视觉设计方向', '交互流程设计', '技术实现建议',
      '用户界面', '现代化', '产品设计', '万花筒'
    ];
    return prdKeywords.some(keyword => content.includes(keyword));
  };

  // 处理PRD预览
  const handlePRDPreview = (content: string) => {
    setPrdPreviewContent(content);
    setPrdPreviewOpen(true);
  };

  // 获取智能体回复
  const getAgentResponse = (agent: AIAgent, userInput: string): string => {
    switch (agent.id) {
      case 'kaleidoscope-agent':
        return `🎨 **万花筒设计方案**

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
• 项目进度：${selectedDemand ? '75%' : '待选择需求'}
• 关键风险：时间节点紧张，需要加强协调
• 资源状态：开发人员充足，测试资源紧张

**下一步行动计划**
1. **立项调研**：完善需求文档
2. **原型设计**：确认设计方案
3. **开发跟踪**：每日站会同步
4. **测试上线**：提前准备测试用例

**风险预警**
⚠️ 建议关注依赖模块的进度
⚠️ 需要提前协调上线资源

有什么具体问题需要深入分析吗？`;

      case 'data-analyst':
        return `📊 **数据分析洞察**

基于您的查询"${userInput}"，以下是数据分析结果：

**关键指标趋势**
• 用户活跃度：↗️ 上升12.5%
• 转化率：↗️ 提升8.3%
• 用户留存：→ 保持稳定

**用户行为分析**
1. 高峰使用时段：9:00-11:00, 14:00-16:00
2. 主要功能偏好：搜索(45%) > 浏览(32%) > 交互(23%)
3. 平均会话时长：3分42秒

**优化建议**
• 在高峰时段推送重要功能
• 优化搜索体验，提升用户满意度
• 增加互动元素，延长用户停留时间

需要我进行更深入的数据挖掘分析吗？`;

      default:
        return `你好！我是${agent.name}，很高兴为你服务。请告诉我你需要什么帮助，我会基于我的专业知识为你提供支持。`;
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 动态云彩背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.4 }}
        >
          <defs>
            <radialGradient id="BrandGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#a855f700" />
            </radialGradient>
            <radialGradient id="BrandGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ec489900" />
            </radialGradient>
            <radialGradient id="BrandGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
              <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f9731600" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#BrandGradient1)">
            <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="17s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#BrandGradient2)">
            <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="18s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#BrandGradient3)">
            <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
            <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="19s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* 主对话区域 */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        {/* 常驻智能体显示区域 */}
        <div className="bg-gradient-to-r from-white/30 to-purple-50/30 backdrop-blur-sm border-b border-purple-100/30 p-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* 智能体头像 - 增强可感知性 */}
            <motion.div
              className="relative cursor-pointer group"
              onClick={() => setIsAgentSelectorExpanded(!isAgentSelectorExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 外圈脉冲动画 */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  opacity: 0.3
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* 旋转光环 */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f97316, #10b981, #3b82f6, #a855f7)',
                  padding: '2px',
                  opacity: 0.8
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* 主头像按钮 */}
              <motion.div
                className="relative w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
                }}
                whileHover={{
                  boxShadow: '0 12px 35px rgba(168, 85, 247, 0.6)',
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.3 }}
              >
                {selectedAgent.avatar}

                {/* 点击提示图标 */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                </motion.div>
              </motion.div>

              {/* 悬浮提示 */}
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
                  点击切换智能体 🎯
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* 智能体信息 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{selectedAgent.name}</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">在线</span>
              </div>
              <p className="text-sm text-gray-600">{selectedAgent.description}</p>
            </div>

            {/* 模型标识 */}
            <div className="text-right">
              <span className="inline-block bg-purple-500/10 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedAgent.model}
              </span>
            </div>
          </div>
        </div>

        {/* 消息列表区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                {selectedAgent.avatar}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 drop-shadow-sm">👋 你好！我是{selectedAgent.name}</h3>
                <p className="text-sm text-gray-800 max-w-md font-medium drop-shadow-sm">{selectedAgent.description}</p>
              </div>

              <div className="w-full max-w-md">
                {selectedAgent.id === 'kaleidoscope-agent' && <KaleidoscopeAnimation />}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setInputMessage('帮我设计一个现代化的用户界面')}
                  className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
                >
                  设计界面
                </button>
                <button
                  onClick={() => setInputMessage('分析一下我的项目进度')}
                  className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
                >
                  项目分析
                </button>
                <button
                  onClick={() => setInputMessage('帮我制定技术方案')}
                  className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
                >
                  技术方案
                </button>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg rounded-br-md shadow-md'
                    : 'bg-white/20 border border-gray-200/50 rounded-lg rounded-bl-md shadow-md backdrop-blur-sm'
                    } p-3`}>
                    {message.role === 'user' ? (
                    <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{message.content}</pre>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-3 border-b pb-1">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2 mt-4">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-medium text-gray-700 mb-2 mt-3">{children}</h3>,
                          p: ({children}) => <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="ml-1">{children}</li>,
                          code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 text-gray-700 mb-2">{children}</blockquote>,
                          strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                    <div className={`flex items-center justify-between mt-2 ${message.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                      <div className="text-xs">
                        {new Date(Number(message.timestamp)).toLocaleTimeString()}
                      </div>
                      {message.role === 'assistant' && isPRDContent(message.content) && (
                        <button
                          onClick={() => handlePRDPreview(message.content)}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-1 ml-2"
                        >
                          <Eye className="w-3 h-3" />
                          <span>预览效果</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/20 border border-gray-200/50 rounded-lg rounded-bl-md p-3 shadow-md backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">思考中</span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 文件上传预览 */}
        {uploadedFiles.length > 0 && (
          <div className="border-t border-gray-200/50 bg-gray-50/20 p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Paperclip className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">已上传文件</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/20 rounded-lg p-2 border border-gray-200/50 text-xs backdrop-blur-sm">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-3 h-3 text-white" />
                    ) : (
                      <FileText className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 max-w-20 truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* 输入区域 - 更精致无边框设计 */}
        <div className="bg-white/20 backdrop-blur-md p-4 flex-shrink-0 relative z-20 border-t border-gray-100/30">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm" style={{
            border: '1px solid rgba(148, 163, 184, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          }}>

            {/* 文件上传按钮 */}
            <input
              type="file"
              id="brand-file-upload"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="brand-file-upload"
              className="flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(148, 163, 184, 0.12)'
              }}
              title="上传文件"
            >
              <Paperclip className="w-4 h-4 text-gray-500" />
            </label>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={`向${selectedAgent.name}提问...`}
              className="flex-1 h-10 px-4 bg-transparent border-0 focus:outline-none text-sm placeholder-gray-400 font-medium"
              style={{
                color: '#1f2937'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isTyping}
              className="flex items-center justify-center w-10 h-10 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              style={{
                background: (!inputMessage.trim() && uploadedFiles.length === 0) || isTyping
                  ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: (!inputMessage.trim() && uploadedFiles.length === 0) || isTyping
                  ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                  : '0 4px 15px rgba(139, 92, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 智能体选择模态窗 */}
      <AnimatePresence>
        {isAgentSelectorExpanded && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setIsAgentSelectorExpanded(false)}
            />

            {/* 模态窗内容 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            >
              <motion.div
                className="pointer-events-auto bg-white/40 rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.25) 100%)',
                  backdropFilter: 'blur(25px) saturate(180%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  width: '500px'
                }}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                  {/* 标题区域 */}
                  <div
                    className="px-8 py-6 border-b border-gray-100/50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          <span className="text-white text-lg">✨</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">AI智能体</h3>
                          <p className="text-sm text-gray-500 mt-0.5">选择您的专属助手</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAgentSelectorExpanded(false)}
                        className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-200 group"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(229, 231, 235, 0.5)'
                        }}
                      >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* 简洁九宫格智能体选择器 */}
                  <div className="p-8">
                    {/* 当前选中的智能体 */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-4"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {selectedAgent.avatar}
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedAgent.name}</h3>
                      <p className="text-sm text-gray-500">{selectedAgent.description}</p>
                    </div>

                    {/* 智能体网格 */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                      {brandAgents.map((agent, index) => {
                        const isSelected = agent.id === selectedAgent.id;
                        return (
                          <motion.button
                            key={agent.id}
                            onClick={() => {
                              setSelectedAgent(agent);
                              setIsAgentSelectorExpanded(false);
                            }}
                            className={`
                              p-4 rounded-2xl flex flex-col items-center space-y-2 transition-all duration-200
                              ${isSelected
                                ? 'bg-gradient-to-br from-purple-100/60 to-blue-100/60 ring-2 ring-purple-400/80 ring-offset-2 backdrop-blur-lg border border-purple-200/40'
                                : 'bg-white/50 hover:bg-white/60 border border-gray-200/60 hover:border-gray-300/70 backdrop-blur-lg shadow-lg'
                              }
                            `}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div
                              className={`
                                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                                ${isSelected
                                  ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-600'
                                }
                              `}
                            >
                              {agent.avatar}
                            </div>
                            <span className={`text-xs font-bold text-center drop-shadow-sm ${isSelected ? 'text-purple-800' : 'text-gray-900'}`}>
                              {agent.name}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRD预览模态框 */}
      <PRDPreview
        isOpen={prdPreviewOpen}
        onClose={() => setPrdPreviewOpen(false)}
        content={prdPreviewContent}
        title="万花筒PRD设计方案预览"
      />

    </div>
  );
};

export default BrandAgentCenter;
