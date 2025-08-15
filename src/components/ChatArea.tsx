import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, Mic, Bot, User, Lightbulb, Copy, ThumbsUp, ThumbsDown, Users, BarChart3, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Customer } from '../types/customer';
import KnowledgeSelector from './KnowledgeSelector';
import { aiAPI } from '../services/api'; // 使用统一的API服务
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatAreaProps {
  selectedCustomer: Customer | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedCustomer }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState('general');
  const [conversationId, setConversationId] = useState<string>('');
  const [useStreamMode, setUseStreamMode] = useState<boolean>(true); // 默认使用流式模式
  const [streamingMessage, setStreamingMessage] = useState<string>(''); // 存储流式接收的消息
  const [currentTypingMessageId, setCurrentTypingMessageId] = useState<string | null>(null);
  const [typingSpeed, setTypingSpeed] = useState(80); // 打字速度，毫秒
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 欢迎万花筒动画组件 - 类似品牌域设计
  const CustomerSuccessKaleidoscope: React.FC = () => {
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-xl p-6 border border-purple-200/60 backdrop-blur-lg shadow-lg">
        <div className="text-center">
          <h4 className="font-bold text-purple-800 mb-4 flex items-center justify-center drop-shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            米多智库服务转换
          </h4>
          
          {/* 动画容器 */}
          <div className="relative h-32 flex items-center justify-center">
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
                  <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">客户查询</p>
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
                  <div className="w-16 h-16 bg-purple-100 rounded-lg shadow-lg flex items-center justify-center mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <BarChart3 className="w-8 h-8 text-purple-500" />
                    </motion.div>
                  </div>
                  <p className="text-xs text-gray-600">需求分析</p>
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
                  <div className="w-16 h-16 bg-blue-100 rounded-lg shadow-lg flex items-center justify-center mb-2">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-600">解决方案</p>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-lg flex items-center justify-center mb-2 border-2 border-purple-200">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-8 h-8 text-purple-600" />
                    </motion.div>
                  </div>
                  <p className="text-xs text-purple-600 font-medium">智能服务</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            从客户查询到需求分析，再到解决方案生成，<br/>
            一站式智能化客户成功服务体验
          </p>
        </div>
      </div>
    );
  };

  // 初始化欢迎状态 - 不再使用消息格式
  useEffect(() => {
    setMessages([]); // 清空所有消息，显示万花筒欢迎界面
  }, [selectedKnowledge]);

  // 滚动到底部 - 监听消息变化和流式消息变化
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // 打字机效果函数
  const typeWriterEffect = (messageId: string, fullText: string, callback?: () => void) => {
    setCurrentTypingMessageId(messageId);
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex <= fullText.length) {
        const currentText = fullText.substring(0, currentIndex);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: currentText }
              : msg
          )
        );
        
        currentIndex++;
        
        if (currentIndex <= fullText.length) {
          setTimeout(typeNextChar, typingSpeed);
        } else {
          setCurrentTypingMessageId(null);
          if (callback) callback();
        }
      }
    };
    
    typeNextChar();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);
    setStreamingMessage('');

    try {
      if (useStreamMode) {
        // 流式模式
        let currentStreamMessage = '';
        let streamMessageId = (Date.now() + 1).toString();
        
        // 先添加一个空的AI消息框
        const initialMessage: Message = {
          id: streamMessageId,
          type: 'ai',
          content: '',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, initialMessage]);
        
        console.log('🔥 开始流式调用，参数:', {
          message: currentInput,
          conversationId,
          knowledgeBase: selectedKnowledge,
          customerId: selectedCustomer?.id
        });
        
        await aiAPI.chatStream(
          {
            message: currentInput,
            conversationId,
            knowledgeBase: selectedKnowledge,
            customerId: selectedCustomer?.id
          },
          // onMessage回调
          (data) => {
            console.log('🔄 收到流式数据:', data);
            
            if (data.type === 'start') {
              if (data.conversationId) {
                setConversationId(data.conversationId);
              }
            } else if (data.type === 'delta' && data.content) {
              currentStreamMessage += data.content;
              console.log('📝 更新流式内容，当前长度:', currentStreamMessage.length);
              
              // 使用React 18的flushSync强制同步更新，确保立即渲染
              setMessages(prev => {
                const newMessages = prev.map(msg => 
                  msg.id === streamMessageId 
                    ? { ...msg, content: currentStreamMessage }
                    : msg
                );
                return newMessages;
              });
            } else if (data.type === 'done') {
              // 流式完成，更新最终消息和建议
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === streamMessageId 
                    ? { 
                        ...msg, 
                        content: data.fullResponse || currentStreamMessage,
                        suggestions: data.suggestions || generateSuggestions(currentInput)
                      }
                    : msg
                )
              );
              setStreamingMessage('');
            } else if (data.type === 'error') {
              console.error('流式响应错误:', data.error);
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === streamMessageId 
                    ? { ...msg, content: '## ⚠️ 服务异常\n\n抱歉，服务出现了问题，请稍后再试。\n\n**可能的解决方案：**\n- 检查网络连接\n- 稍后重试\n- 联系技术支持' }
                    : msg
                )
              );
            } else if (data.type === 'fallback') {
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === streamMessageId 
                    ? { 
                        ...msg, 
                        content: data.content,
                        suggestions: data.suggestions || generateSuggestions(currentInput)
                      }
                    : msg
                )
              );
            }
          },
          // onError回调
          (error) => {
            console.error('流式请求错误:', error);
            setMessages(prev => 
              prev.map(msg => 
                msg.id === streamMessageId 
                  ? { ...msg, content: '## ⚠️ 服务异常\n\n抱歉，服务出现了问题，请稍后再试。\n\n**可能的解决方案：**\n- 检查网络连接\n- 稍后重试\n- 联系技术支持' }
                  : msg
              )
            );
          },
          // onComplete回调
          () => {
            setIsTyping(false);
          }
        );
      } else {
        // 普通模式 - 使用打字机效果
        const response = await aiAPI.chat({
          message: currentInput,
          conversationId,
          knowledgeBase: selectedKnowledge,
          customerId: selectedCustomer?.id
        });
        
        // 检查响应数据结构
        let aiContent = '';
        if (response.data && response.data.response) {
          aiContent = response.data.response;
        } else if (response.reply) {
          aiContent = response.reply;
        } else if (response.answer) {
          aiContent = response.answer;
        } else {
          aiContent = '抱歉，我暂时无法回答这个问题。';
        }
        
        // 先创建一个空的AI消息
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
          id: aiMessageId,
          type: 'ai',
          content: '',
          timestamp: new Date(),
          suggestions: response.data?.suggestions || generateSuggestions(currentInput)
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // 开始打字机效果
        typeWriterEffect(aiMessageId, aiContent, () => {
          setIsTyping(false);
        });
        
        if (response.data?.conversationId) {
          setConversationId(response.data.conversationId);
        }
      }
    } catch (error) {
      console.error('AI对话出错:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '## ⚠️ 服务异常\n\n抱歉，服务出现了问题，请稍后再试。\n\n**可能的解决方案：**\n- 检查网络连接\n- 稍后重试\n- 联系技术支持',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setCurrentTypingMessageId(null);
    } finally {
      // 不在这里设置setIsTyping(false)，因为打字机效果会在完成时自动设置
      // 只有流式模式在出错时才需要在这里设置
    }
  };

  const generateSuggestions = (input: string) => {
    const suggestionsByKnowledge: { [key: string]: string[] } = {
      'general': [
        '酒水行业趋势分析',
        '品牌对比分析',
        '市场价格查询',
        '产品分类说明'
      ],
      'product': [
        '产品规格查询',
        '价格策略分析',
        '库存状态检查',
        '产品推荐方案'
      ],
      'customer': [
        '客户档案查询',
        '需求分析报告',
        '沟通记录整理',
        '客户满意度调研'
      ],
      'sales': [
        '销售技巧分享',
        '谈判策略建议',
        '成功案例分析',
        '销售数据统计'
      ],
      'solution': [
        '解决方案设计',
        '最佳实践分享',
        '行业案例研究',
        '定制化建议'
      ],
      'technical': [
        '技术文档查询',
        '操作指南获取',
        '故障排除帮助',
        '系统使用说明'
      ]
    };
    
    return suggestionsByKnowledge[selectedKnowledge] || suggestionsByKnowledge['general'];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30 backdrop-blur-sm">
      {/* 客户成功部紫色背景动画 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.25 }}
        >
          <defs>
            <radialGradient id="CustomerChatGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="26s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#8B5CF600" />
            </radialGradient>
            <radialGradient id="CustomerChatGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="17s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#3B82F600" />
            </radialGradient>
            <radialGradient id="CustomerChatGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
              <animate attributeName="fx" dur="21s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#EC489900" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#CustomerChatGradient1)">
            <animate attributeName="x" dur="16s" values="25%;0%;25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="18s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="13s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#CustomerChatGradient2)">
            <animate attributeName="x" dur="19s" values="-25%;0%;-25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="22s" values="25%;-25%;25%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="-360 50 50"
              dur="16s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#CustomerChatGradient3)">
            <animate attributeName="x" dur="23s" values="0%;50%;0%" repeatCount="indefinite" />
            <animate attributeName="y" dur="11s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="20s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
      {/* 聊天头部 */}
      <div className="relative z-10 p-4 border-b border-gray-200/60 bg-white/50 flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">米多智库</h3>
              <p className="text-sm text-gray-500 truncate">
                {selectedCustomer ? `正在为 ${selectedCustomer.name} 提供服务` : '准备为您提供智能客服支持'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
            <KnowledgeSelector
              selectedKnowledge={selectedKnowledge}
              onKnowledgeChange={setSelectedKnowledge}
              className="w-48"
            />
            
            {/* 流式模式切换 */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={useStreamMode}
                  onChange={(e) => setUseStreamMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span>流式输出</span>
              </label>
            </div>
            
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
              useStreamMode 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {useStreamMode ? '流式模式' : '标准模式'}
            </span>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 drop-shadow-sm">👋 欢迎使用米多智库AI助手</h3>
              <p className="text-sm text-gray-800 max-w-md font-medium drop-shadow-sm">为您提供智能化客户成功服务支持</p>
            </div>

            <div className="w-full max-w-md">
              <CustomerSuccessKaleidoscope />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleSuggestionClick('查询客户档案')}
                className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
              >
                📁 查询客户档案
              </button>
              <button
                onClick={() => handleSuggestionClick('分析客户需求')}
                className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
              >
                📊 分析客户需求
              </button>
              <button
                onClick={() => handleSuggestionClick('生成解决方案')}
                className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
              >
                💡 生成解决方案
              </button>
              <button
                onClick={() => handleSuggestionClick('查看历史记录')}
                className="px-3 py-1.5 bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 text-xs rounded-full transition-colors backdrop-blur-sm border border-purple-200/50 font-medium shadow-sm"
              >
                📅 查看历史记录
              </button>
            </div>
          </div>
        ) : (
          <>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-blue-600 text-white'
                }`}>
                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
              <div className={`rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary-500/90 text-white backdrop-blur-sm'
                  : 'bg-white/50 border border-gray-200/50 text-gray-900 backdrop-blur-sm'
                  }`}>
                {message.type === 'user' ? (
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                ) : (
                  <div className="text-sm markdown-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-2 border-b pb-1">{children}</h1>,
                        h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2 mt-3">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-medium text-gray-700 mb-1 mt-2">{children}</h3>,
                        p: ({children}) => <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="ml-1">{children}</li>,
                        code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                        pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 text-gray-700 mb-2">{children}</blockquote>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                        table: ({children}) => <table className="min-w-full border border-gray-300 mb-2">{children}</table>,
                        thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                        tbody: ({children}) => <tbody>{children}</tbody>,
                        tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                        th: ({children}) => <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 border-r border-gray-300">{children}</th>,
                        td: ({children}) => <td className="px-2 py-1 text-xs text-gray-700 border-r border-gray-300">{children}</td>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {/* 光标效果 */}
                    {useStreamMode && isTyping && message.type === 'ai' && 
                     message.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1">|</span>
                    )}
                    {!useStreamMode && message.type === 'ai' && currentTypingMessageId === message.id && (
                      <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1">|</span>
                    )}
                  </div>
                )}
                {message.type === 'ai' && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                  </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
        </>
        )}
        
        {/* AI正在输入指示器 */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/40 border border-gray-200/40 rounded-lg px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center space-x-1">
                  {useStreamMode ? (
                    <>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-sm text-gray-500 ml-2">AI正在流式回复...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span className="text-sm text-gray-500 ml-2">AI正在思考...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 建议快捷回复 */}
        {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && (
          <div className="flex flex-wrap gap-2 mt-4 relative z-10">
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100/50 text-gray-700 rounded-full hover:bg-gray-200/50 transition-colors flex items-center space-x-1 backdrop-blur-sm"
              >
                <Lightbulb className="w-3 h-3" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="relative z-10 p-4 border-t border-gray-200/40 bg-white/30 flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="输入您的问题或需求..."
                className="w-full p-3 pr-12 border border-gray-300/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 w-11 h-11 bg-primary-500/90 text-white rounded-lg hover:bg-primary-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center backdrop-blur-sm"
            style={{ minHeight: '44px' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  );
};

export default ChatArea; 