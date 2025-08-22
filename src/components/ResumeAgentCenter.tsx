import React, { useState, useEffect } from 'react';
import { 
  User, 
  Upload, 
  FileText, 
  Search, 
  TrendingUp, 
  Award, 
  Star, 
  Send, 
  MessageSquare,
  Target,
  Brain,
  Users,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

// 简历智能体定义
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

// 聊天消息类型
interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
}

// 候选人匹配数据类型
interface CandidateMatch {
  id: string;
  name: string;
  position: string;
  experience: string;
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  education: string;
  location: string;
  avatar?: string;
}

// 简历智能体数据
const resumeAgents: ResumeAgent[] = [
  {
    id: 'resume-analyzer',
    name: '简历分析师',
    avatar: '🔍',
    speciality: '简历解析与评估',
    description: '专业的简历分析专家，能够快速解析简历内容，提取关键信息，评估候选人能力匹配度',
    capabilities: [
      '简历信息提取',
      '技能匹配分析',
      '经验评估',
      '教育背景分析',
      '职业发展轨迹分析'
    ],
    experience: '处理过10万+份简历，具有丰富的人才评估经验',
    responseStyle: '专业严谨，数据驱动',
    status: 'available',
    rating: 4.9,
    completedTasks: 2847,
    category: '分析评估'
  },
  {
    id: 'talent-matcher',
    name: '人才匹配专家',
    avatar: '🎯',
    speciality: '岗位匹配与推荐',
    description: '基于岗位需求和候选人能力，进行精准匹配，提供个性化的人才推荐建议',
    capabilities: [
      '岗位需求分析',
      '候选人匹配度计算',
      '推荐算法优化',
      '面试建议提供',
      '薪酬评估参考'
    ],
    experience: '成功匹配5000+个职位，匹配成功率85%',
    responseStyle: '精准高效，注重细节',
    status: 'available',
    rating: 4.8,
    completedTasks: 1923,
    category: '匹配推荐'
  },
  {
    id: 'career-advisor',
    name: '职业发展顾问',
    avatar: '📈',
    speciality: '职业规划与发展建议',
    description: '为候选人提供职业发展建议，分析职业轨迹，预测发展潜力',
    capabilities: [
      '职业路径分析',
      '发展潜力评估',
      '技能提升建议',
      '行业趋势分析',
      '薪酬发展预测'
    ],
    experience: '指导3000+人才职业发展，平均薪酬提升35%',
    responseStyle: '耐心细致，前瞻性强',
    status: 'available',
    rating: 4.7,
    completedTasks: 1456,
    category: '职业规划'
  }
];

// 模拟候选人匹配数据
const mockCandidates: CandidateMatch[] = [
  {
    id: '1',
    name: '张伟',
    position: '高级前端工程师',
    experience: '5年',
    matchScore: 95,
    strengths: ['React专家', 'TypeScript精通', '项目管理经验丰富'],
    weaknesses: ['缺少大型系统架构经验'],
    skills: ['React', 'TypeScript', 'Vue.js', 'Node.js', 'Python'],
    education: '本科 - 计算机科学与技术',
    location: '北京'
  },
  {
    id: '2',
    name: '李娜',
    position: '产品经理',
    experience: '4年',
    matchScore: 88,
    strengths: ['用户体验设计', '数据分析能力强', '跨部门协作'],
    weaknesses: ['技术背景相对薄弱'],
    skills: ['产品设计', '用户研究', 'SQL', 'Python', 'Figma'],
    education: '硕士 - 工商管理',
    location: '上海'
  },
  {
    id: '3',
    name: '王强',
    position: '全栈工程师',
    experience: '6年',
    matchScore: 82,
    strengths: ['全栈开发能力', '学习能力强', '团队合作'],
    weaknesses: ['前端技术栈更新较慢'],
    skills: ['Java', 'Spring', 'React', 'MySQL', 'Docker'],
    education: '本科 - 软件工程',
    location: '深圳'
  },
  {
    id: '4',
    name: '陈丽',
    position: 'UI/UX设计师',
    experience: '3年',
    matchScore: 79,
    strengths: ['视觉设计能力强', '用户体验敏感', '创新思维'],
    weaknesses: ['前端实现能力有限'],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Principle', 'HTML/CSS'],
    education: '本科 - 视觉传达设计',
    location: '杭州'
  },
  {
    id: '5',
    name: '刘明',
    position: '后端工程师',
    experience: '4年',
    matchScore: 76,
    strengths: ['服务器架构', '数据库优化', '性能调优'],
    weaknesses: ['缺少微服务架构经验'],
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
    education: '本科 - 计算机科学与技术',
    location: '成都'
  }
];

const ResumeAgentCenter: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<ResumeAgent>(resumeAgents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [candidates, setCandidates] = useState<CandidateMatch[]>(mockCandidates);
  const [sortBy, setSortBy] = useState<'matchScore' | 'experience' | 'name'>('matchScore');

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      content: `你好！我是${selectedAgent.name}，${selectedAgent.description}。请上传简历文件或描述你的招聘需求，我将为你提供专业的分析和建议。`,
      timestamp: new Date(),
      agentId: selectedAgent.id
    };
    setMessages([welcomeMessage]);
  }, [selectedAgent]);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // 添加系统消息
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `已上传 ${files.length} 个文件：${files.map(f => f.name).join(', ')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);

    // 模拟智能体分析
    setTimeout(() => {
      const analysisMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: generateAnalysisResponse(files),
        timestamp: new Date(),
        agentId: selectedAgent.id
      };
      setMessages(prev => [...prev, analysisMessage]);
    }, 2000);
  };

  // 生成分析响应
  const generateAnalysisResponse = (files: File[]) => {
    switch (selectedAgent.id) {
      case 'resume-analyzer':
        return `📋 **简历分析完成**

我已经分析了 ${files.length} 份简历，以下是关键发现：

**候选人概览：**
- 总计 ${candidates.length} 位候选人
- 平均匹配度：${Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)}%
- 高匹配度候选人（90%+）：${candidates.filter(c => c.matchScore >= 90).length} 位

**技能分布分析：**
- 前端技术：React, Vue.js, TypeScript
- 后端技术：Java, Python, Node.js
- 数据库：MySQL, Redis
- 其他：Docker, 微服务架构

**建议关注的候选人：**
1. **${candidates[0].name}** - 匹配度 ${candidates[0].matchScore}%，${candidates[0].strengths.join('、')}
2. **${candidates[1].name}** - 匹配度 ${candidates[1].matchScore}%，${candidates[1].strengths.join('、')}

是否需要我进一步分析特定候选人或提供面试建议？`;

      case 'talent-matcher':
        return `🎯 **人才匹配分析**

基于您上传的简历和岗位需求，我为您匹配了最合适的候选人：

**TOP 3 推荐：**
1. **${candidates[0].name}** (匹配度: ${candidates[0].matchScore}%)
   - 💪 优势：${candidates[0].strengths.join('、')}
   - ⚠️ 注意：${candidates[0].weaknesses.join('、')}

2. **${candidates[1].name}** (匹配度: ${candidates[1].matchScore}%)
   - 💪 优势：${candidates[1].strengths.join('、')}
   - ⚠️ 注意：${candidates[1].weaknesses.join('、')}

3. **${candidates[2].name}** (匹配度: ${candidates[2].matchScore}%)
   - 💪 优势：${candidates[2].strengths.join('、')}
   - ⚠️ 注意：${candidates[2].weaknesses.join('、')}

**面试建议：**
- 重点考察候选人的实际项目经验
- 询问技术难点的解决方案
- 评估团队协作和沟通能力

需要我为特定候选人制定详细的面试计划吗？`;

      case 'career-advisor':
        return `📈 **职业发展分析**

我已经分析了候选人的职业发展轨迹：

**整体评估：**
- 技术成长曲线：大多数候选人呈现稳定上升趋势
- 职业稳定性：平均工作年限 ${Math.round(candidates.reduce((sum, c) => sum + parseInt(c.experience), 0) / candidates.length)} 年
- 学历分布：本科 ${candidates.filter(c => c.education.includes('本科')).length} 人，硕士 ${candidates.filter(c => c.education.includes('硕士')).length} 人

**发展潜力排名：**
${candidates.slice(0, 3).map((c, i) => `${i + 1}. **${c.name}** - ${c.position}
   发展潜力：⭐⭐⭐⭐${i === 0 ? '⭐' : ''}
   建议薪酬范围：${15 + (5 - i) * 3}-${25 + (5 - i) * 5}K`).join('\n\n')}

**职业规划建议：**
- 技术型候选人：建议向架构师或技术管理方向发展
- 产品型候选人：可考虑向产品总监或创业方向发展
- 设计型候选人：可向设计总监或用户体验专家发展

需要我为某位候选人制定详细的职业发展规划吗？`;

      default:
        return '简历分析完成，右侧已更新候选人匹配结果。';
    }
  };

  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟智能体响应
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: generateResponse(inputMessage),
        timestamp: new Date(),
        agentId: selectedAgent.id
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // 生成响应
  const generateResponse = (input: string) => {
    if (input.includes('面试') || input.includes('问题')) {
      return `💼 **面试建议**

基于候选人的背景，我建议以下面试问题：

**技术能力评估：**
1. 请介绍一个你认为最有挑战性的项目
2. 如何处理高并发场景下的性能优化？
3. 团队协作中遇到的最大困难是什么？

**文化适配性：**
1. 你如何看待加班和工作生活平衡？
2. 在快速迭代的环境中如何保证代码质量？

**发展潜力：**
1. 未来3年的职业规划是什么？
2. 学习新技术的方式和频率如何？`;
    }

    if (input.includes('薪酬') || input.includes('待遇')) {
      return `💰 **薪酬建议**

基于市场调研和候选人能力：

**推荐薪酬范围：**
- ${candidates[0].name}：20-28K (匹配度${candidates[0].matchScore}%)
- ${candidates[1].name}：18-25K (匹配度${candidates[1].matchScore}%)
- ${candidates[2].name}：16-22K (匹配度${candidates[2].matchScore}%)

**薪酬结构建议：**
- 基本工资：70%
- 绩效奖金：20%
- 期权/股票：10%

**其他福利考虑：**
- 弹性工作时间
- 远程工作政策
- 学习培训预算
- 健康保险`;
    }

    return `我理解您的问题。作为${selectedAgent.name}，我可以为您提供专业的${selectedAgent.speciality}服务。请告诉我更多具体需求，我将为您提供详细的分析和建议。`;
  };

  // 排序候选人
  const sortedCandidates = [...candidates].sort((a, b) => {
    switch (sortBy) {
      case 'matchScore':
        return b.matchScore - a.matchScore;
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <>
      {/* 左侧智能体区域 */}
      <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col">
        <div className="p-4 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">简历智能体</h3>
          <p className="text-sm text-gray-600">选择专业智能体助手</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {resumeAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedAgent.id === agent.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{agent.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium ${selectedAgent.id === agent.id ? 'text-white' : 'text-gray-900'}`}>
                    {agent.name}
                  </h4>
                  <p className={`text-sm mt-1 ${selectedAgent.id === agent.id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {agent.speciality}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className={`w-3 h-3 ${selectedAgent.id === agent.id ? 'text-yellow-300' : 'text-yellow-400'}`} fill="currentColor" />
                      <span className={`text-xs ${selectedAgent.id === agent.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {agent.rating}
                      </span>
                    </div>
                    <span className={`text-xs ${selectedAgent.id === agent.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {agent.completedTasks}+ 任务
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 文件上传区域 */}
        <div className="p-4 border-t border-gray-200/50">
          <label className="block">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer text-center">
              <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <p className="text-sm text-gray-600">上传简历文件</p>
              <p className="text-xs text-gray-500">支持 PDF, DOC, DOCX</p>
            </div>
          </label>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {uploadedFiles.slice(-3).map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <FileText className="w-3 h-3 text-blue-500" />
                  <span className="truncate text-gray-600">{file.name}</span>
                </div>
              ))}
              {uploadedFiles.length > 3 && (
                <p className="text-xs text-gray-500">+{uploadedFiles.length - 3} 个文件</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 中间聊天区域 */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        <div className="p-4 border-b border-gray-200/50 bg-white/80">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedAgent.avatar}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedAgent.name}</h3>
              <p className="text-sm text-gray-600">{selectedAgent.speciality}</p>
            </div>
            <div className="ml-auto flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-500">在线</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-600 text-sm'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, index) => (
                    <div key={index}>
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong>{line.slice(2, -2)}</strong>
                      ) : line.startsWith('- ') ? (
                        <div className="ml-4">• {line.slice(2)}</div>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200/50 bg-white/80">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入您的问题或需求..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 右侧人员匹配度排序区域 */}
      <div className="w-96 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex flex-col">
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">候选人匹配</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="matchScore">按匹配度</option>
              <option value="experience">按经验</option>
              <option value="name">按姓名</option>
            </select>
          </div>
          <p className="text-sm text-gray-600">共 {candidates.length} 位候选人</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    candidate.matchScore >= 90 ? 'text-green-600' :
                    candidate.matchScore >= 80 ? 'text-blue-600' :
                    candidate.matchScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {candidate.matchScore}%
                  </div>
                  <div className="text-xs text-gray-500">匹配度</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">经验: {candidate.experience}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{candidate.education}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">核心优势</div>
                <div className="flex flex-wrap gap-1">
                  {candidate.strengths.slice(0, 2).map((strength, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">技能标签</div>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{candidate.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {candidate.weaknesses.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">需要关注</div>
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    {candidate.weaknesses[0]}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResumeAgentCenter;