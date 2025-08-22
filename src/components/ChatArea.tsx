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

  // 客户成功部demo响应生成器
  const getCustomerSuccessResponse = (userInput: string, customer: Customer | null): string => {
    const customerName = customer?.name || '客户';
    const companyName = customer?.company || '贵公司';
    
    // 根据输入内容的关键词生成不同类型的响应
    if (userInput.includes('续费') || userInput.includes('合同') || userInput.includes('价格')) {
      return `## 📋 续费方案建议

感谢您咨询${customerName}的续费事宜！根据${companyName}的使用情况，我为您准备了以下续费建议：

### 🎯 续费优势分析
• **使用频率**：过去一年${companyName}的系统使用率达到**92%**
• **功能依赖**：核心业务模块使用率高，替换成本大
• **数据积累**：已积累大量业务数据，迁移风险较高

### 💰 续费方案推荐
1. **标准续费** - 维持现有功能，优惠15%
2. **升级续费** - 新增高级功能，整体优惠20%
3. **长期合作** - 签署3年协议，享受25%优惠

### 🚀 增值服务
• 专属客户成功经理一对一服务
• 优先技术支持和培训
• 新功能抢先体验权

**建议下周安排详细的续费沟通会议，我来协助您制定最优方案！**`;
    }
    
    if (userInput.includes('功能') || userInput.includes('需求') || userInput.includes('开发')) {
      return `## 🔧 功能需求分析

针对您提到的功能需求，我来帮您分析一下实现方案：

### 📊 需求评估
• **业务价值**：高 - 能够显著提升${companyName}的操作效率
• **开发复杂度**：中等 - 预计需要2-3个开发周期
• **优先级建议**：建议纳入下个版本规划

### 🛠️ 技术实现方案
1. **前端改进**：优化用户界面，提升操作便捷性
2. **后端逻辑**：增强数据处理能力，支持更多业务场景  
3. **数据库优化**：确保新功能的性能和稳定性

### 📅 项目规划
• **需求确认**：1-2周
• **设计开发**：4-6周  
• **测试上线**：2-3周

我会协调产品和技术团队，为您提供详细的需求评估报告和开发排期！`;
    }
    
    if (userInput.includes('问题') || userInput.includes('故障') || userInput.includes('错误')) {
      return `## 🚨 问题解决方案

我来帮您快速定位和解决这个问题：

### 🔍 问题诊断
根据您的描述，初步判断可能的原因：
• **系统负载**：当前时段用户访问量较大
• **网络环境**：${companyName}的网络连接可能存在波动
• **浏览器缓存**：本地缓存数据可能需要清理

### ⚡ 即时解决方案
1. **立即操作**：清理浏览器缓存并重新登录
2. **网络检查**：确认网络连接稳定性
3. **替代方案**：使用移动端或其他设备尝试访问

### 🛡️ 预防措施
• 建议在非高峰期进行重要操作
• 定期清理浏览器数据
• 保持系统和浏览器版本更新

**如果问题仍未解决，我会立即联系技术团队为您提供专门支持！**

需要我现在就联系技术支持为您处理吗？`;
    }
    
    if (userInput.includes('培训') || userInput.includes('学习') || userInput.includes('操作')) {
      return `## 🎓 培训服务方案

很高兴为${companyName}提供专业的系统培训服务！

### 📚 培训内容设计
**基础操作培训**
• 系统登录和界面导航
• 核心功能模块使用
• 常用操作流程演示

**高级功能培训**  
• 数据分析和报表生成
• 自定义设置和配置
• 高效操作技巧分享

### 👥 培训方式
• **现场培训**：派遣专业讲师到贵公司
• **在线培训**：远程视频培训，灵活安排
• **录制课程**：提供培训视频，随时学习

### 📅 培训安排
• **培训时长**：2-4小时（可分多次进行）
• **参训人数**：建议10-15人为一组
• **培训资料**：提供操作手册和培训证书

**我来为您安排最适合的培训方案，确保团队能够熟练使用系统！**`;
    }
    
    // 默认响应
    return `## 👋 客户成功服务

您好${customerName}！我是您的专属客户成功经理，很高兴为您服务。

### 🌟 关于您的问题："${userInput}"

我理解您的需求，让我为${companyName}提供专业的解决方案：

### 📊 当前服务状态
• **系统运行状态**：正常 ✅
• **服务响应时间**：< 2秒 ⚡
• **本月支持工单**：3个已解决，1个处理中

### 🎯 建议的后续步骤
1. **详细需求沟通**：安排30分钟的深度沟通
2. **方案定制**：基于您的具体情况制定解决方案  
3. **实施跟进**：全程协助确保效果达预期

### 📞 联系方式
• **微信**：随时在线沟通
• **电话**：400-xxx-xxxx  
• **邮箱**：support@mido.com

**我会持续关注您的使用体验，确保${companyName}从我们的产品中获得最大价值！**`;
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const currentInput = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    // 确保输入框立即清空 - 避免React批处理导致的竞争条件
    setInputValue('');
    setIsTyping(true);

    // 然后添加用户消息
    setMessages(prev => [...prev, userMessage]);

    // 模拟AI处理时间，使用demo响应
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getCustomerSuccessResponse(currentInput, selectedCustomer),
        timestamp: new Date(),
        suggestions: generateSuggestions(currentInput)
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  }, [inputValue, isTyping, selectedCustomer]);  const generateSuggestions = (input: string) => {
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

      {/* 输入区域 - 统一品牌域风格 */}
      <div className="bg-white/20 backdrop-blur-md p-4 flex-shrink-0 relative z-20 border-t border-gray-100/30">
        <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm" style={{
          border: '1px solid rgba(148, 163, 184, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        }}>

          {/* 客户头像/用户图标 */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
          }}>
            <User className="w-5 h-5 text-white" />
          </div>

          {/* 文件上传按钮 */}
          <label
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

          {/* 语音按钮 */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(148, 163, 184, 0.12)'
            }}
            title="语音输入"
          >
            <Mic className="w-4 h-4 text-gray-500" />
          </button>

          {/* 输入框 */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="输入您的问题或需求..."
            className="flex-1 h-11 px-4 bg-transparent border-0 focus:outline-none text-sm placeholder-gray-500 rounded-lg"
            style={{ minHeight: '44px' }}
          />

          {/* 发送按钮 */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: !inputValue.trim() || isTyping 
                ? 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)'
                : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              boxShadow: !inputValue.trim() || isTyping 
                ? '0 2px 8px rgba(156, 163, 175, 0.25)'
                : '0 2px 8px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)'
            }}
          >
            <Send className="w-5 h-5 text-white" />
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