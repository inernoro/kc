import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Star,
  Plus,
  Edit3,
  Save,
  X,
  Briefcase
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

interface Props {
  onAgentSelect?: (agent: ResumeAgent) => void;
}

const ResumeAgentSidebar: React.FC<Props> = ({ onAgentSelect }) => {
  const [selectedAgent, setSelectedAgent] = useState<ResumeAgent>(resumeAgents[0]);
  const [agents, setAgents] = useState<ResumeAgent[]>(resumeAgents);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    avatar: '🤖',
    speciality: '',
    description: '',
    capabilities: '',
    experience: '',
    responseStyle: '',
    status: 'available' as const,
    rating: 4.5,
    completedTasks: 0,
    category: '自定义'
  });

  // 处理智能体选择
  const handleAgentSelect = (agent: ResumeAgent) => {
    setSelectedAgent(agent);
    onAgentSelect?.(agent);
  };


  // 创建新智能体
  const handleCreateAgent = () => {
    if (newAgent.name && newAgent.speciality) {
      const agent: ResumeAgent = {
        id: `custom_${Date.now()}`,
        name: newAgent.name!,
        avatar: newAgent.avatar!,
        speciality: newAgent.speciality!,
        description: newAgent.description!,
        capabilities: newAgent.capabilities.split(',').map(s => s.trim()),
        experience: newAgent.experience!,
        responseStyle: newAgent.responseStyle!,
        status: 'available',
        rating: 4.5,
        completedTasks: 0,
        category: '自定义'
      };
      
      setAgents(prev => [...prev, agent]);
      setIsCreatingAgent(false);
      setNewAgent({
        name: '',
        avatar: '🤖',
        speciality: '',
        description: '',
        capabilities: '',
        experience: '',
        responseStyle: '',
        status: 'available' as const,
        rating: 4.5,
        completedTasks: 0,
        category: '自定义'
      });
    }
  };

  return (
    <div className="h-full bg-white/80 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">HR智能体</h3>
          <button
            onClick={() => setIsCreatingAgent(true)}
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
            title="新增智能体"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600">选择或创建智能体助手</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 新增智能体表单 */}
        {isCreatingAgent && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-blue-900">新增智能体</h4>
              <button
                onClick={() => setIsCreatingAgent(false)}
                className="text-blue-400 hover:text-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="智能体名称"
              value={newAgent.name}
              onChange={(e) => setNewAgent(prev => ({...prev, name: e.target.value}))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
            <input
              type="text"
              placeholder="专业领域"
              value={newAgent.speciality}
              onChange={(e) => setNewAgent(prev => ({...prev, speciality: e.target.value}))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
            <textarea
              placeholder="智能体描述"
              value={newAgent.description}
              onChange={(e) => setNewAgent(prev => ({...prev, description: e.target.value}))}
              className="w-full px-2 py-1 text-sm border rounded h-16 resize-none"
            />
            <input
              type="text"
              placeholder="核心能力 (用逗号分隔)"
              value={newAgent.capabilities}
              onChange={(e) => setNewAgent(prev => ({...prev, capabilities: e.target.value}))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
            <button
              onClick={handleCreateAgent}
              className="w-full py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              <Save className="w-3 h-3 inline mr-1" />
              保存智能体
            </button>
          </div>
        )}

        {/* 智能体列表 - 优化样式 */}
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            onClick={() => handleAgentSelect(agent)}
            className={`relative group cursor-pointer transition-all duration-500 ${
              selectedAgent.id === agent.id
                ? 'scale-105'
                : 'hover:scale-102'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className={`
              relative p-4 rounded-2xl transition-all duration-300 backdrop-blur-sm
              ${selectedAgent.id === agent.id
                ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white shadow-2xl border-0'
                : 'bg-white/90 hover:bg-white hover:shadow-lg border border-gray-200/50 hover:border-orange-300/50'
              }
            `}>
              {/* 选中状态的装饰元素 */}
              {selectedAgent.id === agent.id && (
                <>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-60 animate-pulse" />
                </>
              )}
              
              <div className="flex items-start space-x-3 relative z-10">
                <div className={`
                  text-2xl transition-transform duration-300 
                  ${selectedAgent.id === agent.id ? 'scale-110 animate-bounce' : 'group-hover:scale-110'}
                `}>
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold text-sm transition-colors duration-300 ${
                      selectedAgent.id === agent.id ? 'text-white' : 'text-gray-900 group-hover:text-orange-600'
                    }`}>
                      {agent.name}
                    </h4>
                    {agent.category === '自定义' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedAgent.id === agent.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        自定义
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                    selectedAgent.id === agent.id ? 'text-orange-100' : 'text-gray-600 group-hover:text-gray-700'
                  }`}>
                    {agent.speciality}
                  </p>
                  
                  {/* 评级和任务数 */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className={`w-3 h-3 transition-colors duration-300 ${
                          selectedAgent.id === agent.id ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-500 fill-yellow-500'
                        }`} />
                        <span className={`text-xs font-medium transition-colors duration-300 ${
                          selectedAgent.id === agent.id ? 'text-white' : 'text-gray-600'
                        }`}>
                          {agent.rating}
                        </span>
                      </div>
                      <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                        selectedAgent.id === agent.id ? 'bg-white/50' : 'bg-gray-400'
                      }`} />
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedAgent.id === agent.id ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {agent.completedTasks}+ 任务
                      </span>
                    </div>
                    
                    {/* 状态指示器 */}
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        selectedAgent.id === agent.id 
                          ? 'bg-green-300 animate-pulse' 
                          : agent.status === 'available' 
                            ? 'bg-green-500' 
                            : 'bg-gray-400'
                      }`} />
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedAgent.id === agent.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        {agent.status === 'available' ? '在线' : '离线'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ResumeAgentSidebar;