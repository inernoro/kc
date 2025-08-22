import React, { useState } from 'react';
import { 
  Bot, Code, Database, Monitor, Zap, Send, Paperclip, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TechnicalStandard } from '../types/moduleTypes';
import { AIAgent, ChatMessage } from '../types';

// 技术智能体定义
const technicalAgents: AIAgent[] = [
  {
    id: 'code-architect',
    name: '代码架构师',
    avatar: '🏗️',
    speciality: '系统架构设计',
    description: '专业的系统架构和代码设计专家，提供技术方案建议',
    capabilities: [
      '架构设计评审',
      '代码质量分析',
      '技术选型建议',
      '性能优化方案',
      '微服务设计'
    ],
    experience: '10年架构设计经验',
    responseStyle: '严谨且具有前瞻性',
    status: 'available',
    rating: 4.9,
    completedTasks: 234,
    category: '架构'
  },
  {
    id: 'database-expert',
    name: '数据库专家',
    avatar: '🗄️',
    speciality: '数据库优化',
    description: '数据库设计和性能优化专家，提供数据存储解决方案',
    capabilities: [
      '数据库设计规范',
      '查询性能优化',
      '索引策略制定',
      '数据迁移方案',
      '备份恢复策略'
    ],
    experience: '8年数据库管理经验',
    responseStyle: '数据驱动，注重实效',
    status: 'available',
    rating: 4.8,
    completedTasks: 189,
    category: '数据库'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps工程师',
    avatar: '⚙️',
    speciality: '运维自动化',
    description: 'DevOps和CI/CD专家，提供自动化部署和运维解决方案',
    capabilities: [
      'CI/CD流程设计',
      '容器化部署',
      '监控告警配置',
      '自动化测试',
      '基础设施代码化'
    ],
    experience: '6年DevOps经验',
    responseStyle: '实用主义，追求效率',
    status: 'available',
    rating: 4.7,
    completedTasks: 156,
    category: '运维'
  },
  {
    id: 'tech-innovator',
    name: '技术创新者',
    avatar: '🚀',
    speciality: '前沿技术探索',
    description: '关注前沿技术趋势，提供创新技术解决方案',
    capabilities: [
      '新技术调研',
      '概念验证开发',
      '技术可行性分析',
      '创新方案设计',
      '技术选型建议'
    ],
    experience: '7年技术创新经验',
    responseStyle: '富有创意，勇于尝试',
    status: 'available',
    rating: 4.6,
    completedTasks: 142,
    category: '创新'
  }
];

export interface TechnicalAgentCenterProps {
  selectedStandard: TechnicalStandard | null;
}

const TechnicalAgentCenter: React.FC<TechnicalAgentCenterProps> = ({ selectedStandard }) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(technicalAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'agent',
      content: `你好！我是${selectedAgent.name}，${selectedAgent.description}。我可以帮你：\n\n${selectedAgent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n有什么我可以帮助你的吗？`,
      timestamp: new Date(),
      agentId: selectedAgent.id
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAgentSelectorExpanded, setIsAgentSelectorExpanded] = useState(false);

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
      case 'code-architect':
        return `🏗️ **架构设计建议**

针对您的需求"${userInput}"，我提供以下架构建议：

**系统架构分析**
• 采用微服务架构，提高系统可扩展性
• 使用API网关统一管理外部访问
• 引入服务注册与发现机制

**技术选型建议**
• 后端：Spring Boot + Spring Cloud
• 数据库：MySQL主从 + Redis缓存
• 消息队列：RabbitMQ/Kafka

**性能优化策略**
• 数据库连接池优化
• 缓存策略设计
• CDN加速静态资源

需要我详细分析某个具体模块的架构设计吗？`;

      case 'database-expert':
        return `🗄️ **数据库优化方案**

基于您的询问"${userInput}"，数据库优化建议如下：

**性能分析**
• 查询响应时间：当前120ms，目标<50ms
• 索引使用率：78%，需要优化慢查询
• 连接池配置：建议调整为50-100

**优化建议**
1. 添加复合索引优化WHERE条件
2. 分库分表处理大数据量
3. 读写分离减轻主库压力

**监控指标**
• QPS监控和告警设置
• 慢查询日志分析
• 连接数实时监控

需要我帮您设计具体的索引策略吗？`;

      case 'devops-engineer':
        return `⚙️ **DevOps解决方案**

关于"${userInput}"的部署和运维建议：

**CI/CD流程**
• Git提交 → 自动构建 → 单元测试 → 部署测试环境
• 测试通过 → 预生产验证 → 生产环境发布
• 蓝绿部署确保零停机更新

**容器化方案**
• Docker镜像标准化
• Kubernetes集群管理
• 自动扩缩容配置

**监控告警**
• Prometheus + Grafana监控
• 日志聚合分析
• 故障自动恢复机制

需要我详细设计CI/CD pipeline配置吗？`;

      case 'tech-innovator':
        return `🚀 **技术创新建议**

对于"${userInput}"的创新技术方案：

**前沿技术调研**
• AI/ML集成应用可能性
• 区块链技术适用场景分析
• 边缘计算架构设计

**概念验证**
• 技术可行性评估：85%
• 开发成本预估：中等
• 预期收益：显著提升用户体验

**实施建议**
1. 小规模原型验证
2. 用户反馈收集
3. 逐步推广应用

**风险评估**
• 技术成熟度：需要持续跟进
• 团队学习成本：适中
• 投入产出比：预期良好

需要我深入分析某个具体技术的应用方案吗？`;

      default:
        return `您好！我是${agent.name}，很高兴为您服务。请告诉我您需要什么技术支持？`;
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

  // 切换智能体时重置消息
  const handleAgentChange = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setMessages([
      {
        id: Date.now().toString(),
        type: 'agent',
        content: `你好！我是${agent.name}，${agent.description}。我可以帮你：\n\n${agent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n有什么我可以帮助你的吗？`,
        timestamp: new Date(),
        agentId: agent.id
      }
    ]);
    setIsAgentSelectorExpanded(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50/30 via-blue-50/30 to-green-50/30">
      {/* 智能体选择器 */}
      <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">技术智能体中心</h3>
          <button
            onClick={() => setIsAgentSelectorExpanded(!isAgentSelectorExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isAgentSelectorExpanded ? '收起' : '选择智能体'}
          </button>
        </div>

        {/* 关联技术规范显示 */}
        {selectedStandard && (
          <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 mb-1">关联技术规范</div>
            <div className="text-sm font-medium text-green-800">{selectedStandard.title}</div>
          </div>
        )}

        {/* 当前选中的智能体 */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl">{selectedAgent.avatar}</div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{selectedAgent.name}</div>
            <div className="text-sm text-gray-600">{selectedAgent.speciality}</div>
            <div className="text-xs text-gray-500 mt-1">
              评分: {selectedAgent.rating}/5 • 完成任务: {selectedAgent.completedTasks}
            </div>
          </div>
          <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            {selectedAgent.status === 'available' ? '在线' : '忙碌'}
          </div>
        </div>

        {/* 智能体选择列表 */}
        {isAgentSelectorExpanded && (
          <div className="mt-3 space-y-2">
            {technicalAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentChange(agent)}
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
                  <div className="text-xs text-gray-500 mt-1">
                    {agent.category} • {agent.experience}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 对话区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
                placeholder={`向${selectedAgent.name}咨询技术问题...`}
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
              id="tech-file-upload"
            />
            <label
              htmlFor="tech-file-upload"
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
  );
};

export default TechnicalAgentCenter;