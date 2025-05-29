import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Bot, User, Lightbulb, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import ModelSelector from './ModelSelector';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatAreaProps {
  selectedCustomer: any;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedCustomer }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '您好！我是米多智库AI助手。我可以帮您查询客户信息、分析客户需求、提供解决方案建议等。请问有什么可以帮助您的吗？',
      timestamp: new Date(),
      suggestions: ['查询客户档案',"一杆枪群历史反馈", '分析客户需求', '生成解决方案', '查看历史记录', '查看历史反馈', '分析销售趋势', '制定促销策略']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Pro/deepseek-ai/DeepSeek-V3');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // 调用后端AI API
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          model: selectedModel,
          customerId: selectedCustomer?.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.data.response,
          timestamp: new Date(),
          suggestions: data.data.suggestions
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || 'AI服务响应异常');
      }
    } catch (error) {
      console.error('AI调用失败:', error);
      // 降级到本地回复
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(messageContent, selectedCustomer),
        timestamp: new Date(),
        suggestions: generateSuggestions(messageContent)
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (input: string, customer: any) => {
    if (customer) {
      if (input.includes('客户') || input.includes('档案')) {
        return `根据您选择的客户 ${customer.name}（${customer.company}），我为您整理了以下信息：\n\n• 客户状态：${customer.status === 'active' ? '活跃客户' : customer.status === 'potential' ? '潜在客户' : '非活跃客户'}\n• 最后联系时间：${customer.lastContact}\n• 客户价值：¥${customer.value.toLocaleString()}\n• 客户级别：${customer.level}级\n• 优先级：${customer.priority === 'high' ? '高' : customer.priority === 'medium' ? '中' : '低'}\n\n建议您重点关注该客户的订货周期和季节性需求变化。`;
      }
      if (input.includes('分析') || input.includes('需求')) {
        return `基于 ${customer.name} 的历史数据分析：\n\n• 该客户主要采购高端白酒产品\n• 节假日期间订货量增长明显\n• 对价格敏感度中等，更注重品质\n• 预计续约概率：85%\n\n建议制定针对性的促销策略和库存管理方案。`;
      }
      if (input.includes('历史') || input.includes('反馈')) {
        return `${customer.name} 的历史反馈汇总：\n\n• 产品质量满意度：4.8/5.0\n• 物流配送及时性：4.5/5.0\n• 售后服务响应：4.7/5.0\n• 价格竞争力：4.2/5.0\n\n主要建议：希望增加更多中端产品选择，优化配送时效。`;
      }
    }
    
    return '我理解您的需求。基于酒水行业客户成功部门的工作特点，我建议您：\n\n1. 关注客户的季节性采购规律\n2. 定期了解市场价格波动影响\n3. 提供个性化的产品组合建议\n4. 建立客户满意度跟踪机制\n5. 制定节假日促销策略\n\n还有什么具体问题需要我帮助解决吗？';
  };

  const generateSuggestions = (input: string) => {
    const suggestions = [
      '生成客户报告',
      '制定跟进计划',
      '查看相似案例',
      '分析市场竞争',
      '查看历史反馈',
      '制定促销方案',
      '分析销售数据',
      '客户满意度调研',
      '产品推荐策略',
      '价格优化建议'
    ];
    return suggestions.slice(0, 4); // 随机显示4个建议
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 聊天头部 */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">米多智库</h3>
              <p className="text-sm text-gray-500">
                {selectedCustomer ? `正在为 ${selectedCustomer.name} 提供服务` : '准备为您提供智能客服支持'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              className="w-48"
            />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              在线
            </span>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Lightbulb className="w-3 h-3 mr-1" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200 bg-white">
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