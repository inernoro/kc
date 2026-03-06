import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Paperclip, Send } from 'lucide-react';
import { TechnicalStandard } from '../../../types/moduleTypes';
import { technicalAgents, AIAgent, ChatMessage } from '../data';

const TechnicalAgentCenter = ({ selectedStandard }: { selectedStandard: TechnicalStandard | null }) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(technicalAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好！我是${selectedAgent.name}，${selectedAgent.description}。我可以帮你：\n\n${selectedAgent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n有什么我可以帮助你的吗？`,
      timestamp: new Date().toISOString(),
      agentId: selectedAgent.id
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 文件上传处理
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // 当切换智能体时重置对话
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `你好！我是${selectedAgent.name}，${selectedAgent.description}。我可以帮你：\n\n${selectedAgent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n有什么我可以帮助你的吗？`,
        timestamp: new Date().toISOString(),
        agentId: selectedAgent.id
      }
    ]);
  }, [selectedAgent]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAgentResponse(inputMessage, selectedAgent, selectedStandard);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        agentId: selectedAgent.id
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAgentResponse = (userInput: string, agent: AIAgent, context?: TechnicalStandard | null): string => {
    switch (agent.id) {
      case 'report-generator':
        if (userInput.includes('月报') || userInput.includes('简报')) {
          return `## 基础研发部技术月报 - ${new Date().getFullYear()}年${new Date().getMonth() + 1}月

### 📊 本月技术指标概览
- **技术规范文档**: 新增3个，更新2个
- **代码质量评分**: 92.5% (↑2.1%)
- **架构债务处理**: 完成8项，进行中5项
- **团队培训参与**: 95%覆盖率

### 🎯 主要成果亮点
1. **前端React组件规范V3.2** 完成评审，即将发布
2. **API接口标准化改造** 已覆盖78%的业务模块
3. **性能优化专项** 平均响应时间减少15%
4. **代码质量工具升级** 新增TypeScript严格模式检查

### 🚧 面临的挑战
- 老项目技术栈升级进度需要加速
- 跨团队规范执行的一致性有待提升
- 新技术培训与实际项目应用的衔接

### 📋 下月工作重点
1. 推进微服务架构设计原则制定
2. 启动React18升级技术调研
3. 建立自动化代码质量监控体系
4. 组织架构设计专题培训

需要我深入分析某个具体方面吗？`;
        }
        if (userInput.includes('数据') || userInput.includes('分析')) {
          return `基于当前技术数据，我为你分析：

**代码质量趋势分析**
- 当前评分: 92.5%
- 月增长: +2.1%
- 主要提升点: TypeScript类型覆盖率从78%提升到89%

**规范执行情况**
- 前端规范执行率: 87%
- API规范执行率: 78%
- 数据库规范执行率: 91%

**建议关注点**
1. API规范执行率相对较低，需要加强推广
2. 新项目规范执行情况良好，老项目需要专项改造
3. 建议设立规范执行情况月度review机制

需要我生成详细的数据可视化建议吗？`;
        }
        return `作为简报输出助手，我可以帮你：

📊 **生成各类技术简报**
- 周报/月报/季报模板
- 技术洞察分析
- 项目进展汇报
- 风险评估报告

📈 **数据分析服务**
- KPI指标解读
- 趋势分析预测
- 对比分析报告

你希望我帮你生成什么类型的简报？请告诉我具体需求和数据范围。`;

      case 'code-reviewer':
        return `作为代码评审专家，针对你的问题：

🔍 **代码质量检查重点**
1. **安全性**: SQL注入、XSS防护、身份验证
2. **性能**: 算法复杂度、内存使用、查询优化
3. **可维护性**: 代码结构、命名规范、注释质量
4. **可测试性**: 单元测试覆盖、模块解耦

📋 **当前项目评估建议**
基于最新规范STD-001 (React组件开发规范V3.2)：
- 组件Props类型定义完整性
- Hooks使用最佳实践
- 状态管理模式一致性
- 错误边界处理

需要我针对特定代码进行深度分析吗？请提供代码片段或具体模块。`;

      case 'architecture-advisor':
        return `作为架构设计顾问，我来分析你的需求：

🏗️ **当前系统架构评估**
- **微服务拆分合理性**: 基于业务域边界
- **数据一致性策略**: 分布式事务vs最终一致性
- **扩展性设计**: 水平扩展能力评估

⚡ **技术选型建议**
考虑团队现状和业务发展：
1. **前端框架**: React18升级路径规划
2. **状态管理**: Redux Toolkit vs Zustand
3. **构建工具**: Vite vs Webpack性能对比
4. **部署策略**: 容器化vs传统部署

🎯 **下一步行动计划**
基于现有架构STD-005规范，建议优先考虑：
- API网关标准化
- 服务注册发现机制
- 监控和链路追踪

具体哪个架构模块需要我深入分析？`;

      case 'performance-optimizer':
        return `性能优化分析报告：

⚡ **当前性能指标**
- 页面加载时间: 平均2.3s (目标<2s)
- API响应时间: 平均180ms (已优化15%)
- 数据库查询: 慢查询减少到<5%

🎯 **优化建议优先级**
1. **P0级别** - 首屏加载优化
   - 代码分割和懒加载
   - 图片压缩和CDN
   - 关键渲染路径优化

2. **P1级别** - 数据库性能
   - 索引优化建议
   - 查询语句重构
   - 连接池配置调优

3. **P2级别** - 缓存策略
   - Redis缓存层设计
   - 浏览器缓存策略
   - CDN缓存配置

📊 **监控方案建议**
建议建立性能监控仪表板，包含核心指标实时追踪。

需要我针对特定性能瓶颈提供详细优化方案吗？`;

      case 'standard-keeper':
        return `规范管理现状分析：

📋 **当前规范体系**
- 前端开发规范: STD-001 (React V3.2) - 评审中
- API设计规范: STD-002 (RESTful V2.1) - 已发布
- 数据库规范: STD-003 (MySQL V1.8) - 已发布
- 代码质量规范: STD-004 (TypeScript V2.0) - 草案

✅ **执行情况评估**
- 新项目规范执行率: 89%
- 历史项目改造进度: 67%
- 团队培训完成率: 95%

🎯 **改进建议**
1. **规范制定**: 建立规范版本管理和变更流程
2. **执行监督**: 设立规范检查自动化工具
3. **推广培训**: 定期组织规范解读和案例分享
4. **反馈机制**: 建立规范使用问题收集和迭代机制

需要我协助制定特定领域的技术规范吗？`;

      case 'tech-trainer':
        return `团队技能提升方案建议：

🎓 **当前团队技术水平评估**
- React/TypeScript熟练度: 中高级 (85%成员)
- 架构设计能力: 中级 (60%成员)
- 性能优化经验: 初中级 (45%成员)
- 规范意识: 高 (90%成员)

📚 **培训计划建议**
**Q1重点** - React18新特性
- 并发渲染机制理解
- Suspense和Transition实战
- 性能优化新模式

**Q2重点** - 架构设计能力
- 微服务设计模式
- 系统扩展性规划
- 技术选型方法论

🎯 **学习方式设计**
1. **理论学习**: 每周技术分享 (1.5h)
2. **实战演练**: 月度技术挑战项目
3. **交流讨论**: 双周架构设计review
4. **外部学习**: 推荐优质技术课程和会议

需要我为特定技术领域设计详细的培训方案吗？`;

      default:
        return `你好！我是${agent.name}，很高兴为你服务。请告诉我你需要什么帮助，我会基于我的专业知识为你提供支持。`;
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-green-50/30 via-blue-50/30 to-purple-50/30 backdrop-blur-sm">
      {/* 技术代码流背景动画 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.3 }}
        >
          <defs>
            <radialGradient id="TechGradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="28s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#10B98100" />
            </radialGradient>
            <radialGradient id="TechGradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
              <animate attributeName="fx" dur="19s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#05966900" />
            </radialGradient>
            <radialGradient id="TechGradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
              <animate attributeName="fx" dur="23s" values="0%;3%;0%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#34D39900" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#TechGradient1)">
            <animate attributeName="x" dur="18s" values="25%;0%;25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="20s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="15s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#TechGradient2)">
            <animate attributeName="x" dur="21s" values="-25%;0%;-25%" repeatCount="indefinite" />
            <animate attributeName="y" dur="24s" values="25%;-25%;25%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="-360 50 50"
              dur="18s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#TechGradient3)">
            <animate attributeName="x" dur="25s" values="0%;50%;0%" repeatCount="indefinite" />
            <animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="22s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* 主对话区域 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 当前智能体简化信息 */}
        <div className="bg-gradient-to-r from-white/50 to-green-50/40 backdrop-blur-sm border-b border-green-100 p-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-lg shadow-sm">
              {selectedAgent.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{selectedAgent.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded font-medium">
                  {selectedAgent.model}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">在线</span>
              </div>
            </div>
          </div>
        </div>

        {/* 消息列表区域 - 优化滚动 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg rounded-br-md shadow-md'
                  : 'bg-white/95 border border-gray-200 rounded-lg rounded-bl-md shadow-md'
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
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/95 border border-gray-200 rounded-lg rounded-bl-md p-3 shadow-md">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">思考中</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 智能体选择器 */}
        <div className="border-t border-gray-200/50 bg-white/50 p-3 flex-shrink-0 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs font-medium text-gray-600">选择智能体:</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {technicalAgents.map((agent) => {
              const IconComponent = agent.icon;
              const isActive = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-sm">{agent.avatar}</span>
                  <IconComponent className="w-3 h-3" />
                  <span className="whitespace-nowrap">{agent.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 输入区域 - 统一品牌域风格 */}
        <div className="bg-white/20 backdrop-blur-md p-4 flex-shrink-0 relative z-20 border-t border-gray-100/30">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm" style={{
            border: '1px solid rgba(148, 163, 184, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          }}>

            {/* 智能体头像 */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl text-lg" style={{
              background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
            }}>
              {selectedAgent.avatar}
            </div>

            {/* 文件上传按钮 */}
            <input
              type="file"
              id="tech-file-upload"
              multiple
              onChange={(e) => handleFileUpload && handleFileUpload(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="tech-file-upload"
              className="flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(148, 163, 184, 0.12)'
              }}
              title="上传技术文档"
            >
              <Paperclip className="w-4 h-4 text-gray-500" />
            </label>

            {/* 输入框 */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={`向${selectedAgent.name}咨询技术问题...`}
              className="flex-1 h-11 px-4 bg-transparent border-0 focus:outline-none text-sm placeholder-gray-500 rounded-lg"
            />

            {/* 发送按钮 */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: !inputMessage.trim() || isTyping
                  ? 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)'
                  : 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                boxShadow: !inputMessage.trim() || isTyping
                  ? '0 2px 8px rgba(156, 163, 175, 0.25)'
                  : '0 2px 8px rgba(16, 185, 129, 0.4), 0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAgentCenter;
