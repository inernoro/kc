import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Bot, User, Lightbulb, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Customer } from '../types/customer';
import KnowledgeSelector from './KnowledgeSelector';
import { aiAPI } from '../services/api'; // 使用统一的API服务

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      const knowledgeTypeMap: { [key: string]: string } = {
        'general': '通用知识库',
        'product': '产品知识库', 
        'customer': '客户知识库',
        'sales': '销售知识库',
        'solution': '解决方案',
        'technical': '技术知识库'
      };
      
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: `您好！我是米多智库AI助手，当前已连接${knowledgeTypeMap[selectedKnowledge]}。我可以帮您查询客户信息、分析客户需求、提供解决方案建议等。请问有什么可以帮助您的吗？`,
        timestamp: new Date(),
        suggestions: ['查询客户档案', '一键群发消息', '分析客户需求', '生成解决方案', '查看历史记录']
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedKnowledge]); // 当选择的知识库改变时更新欢迎消息

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 根据选择的知识库类型调用对应的API
      let response;
      if (selectedKnowledge === 'general' || selectedKnowledge === 'product') {
        // 使用知识库搜索API
        response = await aiAPI.searchKnowledge({
          query: inputValue.trim(),
          knowledgeType: selectedKnowledge,
          customerId: selectedCustomer?.id
        });
      } else {
        // 使用普通对话API
        response = await aiAPI.chat({
          message: inputValue.trim(),
          conversationId,
          knowledgeBase: selectedKnowledge,
          customerId: selectedCustomer?.id
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.reply || response.answer || '抱歉，我暂时无法回答这个问题。',
        timestamp: new Date(),
        suggestions: generateSuggestions(inputValue.trim())
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('AI对话出错:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，服务出现了问题，请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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
    <div className="h-full flex flex-col">
      {/* 聊天头部 */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
              在线
            </span>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
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
        
        {/* AI正在输入指示器 */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-sm text-gray-500 ml-2">AI正在思考...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 建议快捷回复 */}
        {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center space-x-1"
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
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
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
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="flex-shrink-0 w-11 h-11 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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