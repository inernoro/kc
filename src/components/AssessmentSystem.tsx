import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  Lightbulb,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Brain,
  Heart,
  Zap,
  Eye,
  PieChart
} from 'lucide-react';

// 考核题目接口 - 重新设计为回答导向
interface AssessmentQuestion {
  id: string;
  type: 'response' | 'scenario' | 'analysis';
  category: '客户洞察力' | '问题解决力' | '沟通表达力' | '数据分析力' | '团队协作力' | '创新思维力';
  question: string;
  scenario?: string; // 情景描述
  requirements: string[]; // 回答要求
  evaluationCriteria: string[]; // 评分标准
  points: number;
  timeLimit: number; // 分钟
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

// 考核记录接口
interface AssessmentRecord {
  id: string;
  type: '月度能力评估' | '季度综合考核' | '年度述职考核' | '专项技能考核';
  date: string;
  overallScore: number;
  maxScore: number;
  duration: number; // 分钟
  status: 'completed' | 'in-progress' | 'scheduled';
  competencies: {
    [key: string]: {
      score: number;
      maxScore: number;
      level: string;
      feedback: string;
    };
  };
}

// 能力评估接口 - 重新设计核心能力
interface CoreCompetency {
  category: string;
  description: string;
  currentLevel: number;
  targetLevel: number;
  growthRate: number;
  icon: React.ComponentType<any>;
  color: string;
  keyBehaviors: string[];
}

// 重新设计考核题目 - 回答导向
const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    type: 'scenario',
    category: '客户洞察力',
    question: '客户深度需求洞察与价值挖掘',
    scenario: '某大型酒企客户反馈："你们的系统功能很全，但是感觉对我们的帮助不够明显，ROI不如预期。"',
    requirements: [
      '分析客户反馈背后的真实问题',
      '提出3个深度洞察客户需求的具体方法',
      '设计一套客户价值验证机制',
      '制定后续跟进策略'
    ],
    evaluationCriteria: [
      '问题分析的深度和准确性',
      '洞察方法的实用性和创新性',
      '价值验证机制的科学性',
      '跟进策略的可执行性'
    ],
    points: 25,
    timeLimit: 15,
    difficulty: 'advanced'
  },
  {
    id: '2',
    type: 'analysis',
    category: '数据分析力',
    question: '基于客户数据制定精准服务策略',
    scenario: '现有客户数据：月活跃度65%，功能使用率40%，续费率78%，投诉率12%',
    requirements: [
      '分析四个指标间的关联性',
      '识别客户服务的关键问题点',
      '设计数据驱动的服务优化方案',
      '预测方案实施后的效果指标'
    ],
    evaluationCriteria: [
      '数据解读的专业性',
      '问题识别的精准度',
      '方案设计的逻辑性',
      '效果预测的合理性'
    ],
    points: 25,
    timeLimit: 12,
    difficulty: 'intermediate'
  },
  {
    id: '3',
    type: 'response',
    category: '沟通表达力',
    question: '复杂问题的清晰传达与共识达成',
    scenario: '需要向技术团队传达客户的复杂定制需求，同时协调各方资源确保项目成功',
    requirements: [
      '设计一套多方沟通的标准流程',
      '列出关键信息传达的要点和方式',
      '提出冲突处理和共识达成的方法',
      '建立项目进展的反馈机制'
    ],
    evaluationCriteria: [
      '沟通流程的完整性',
      '信息传达的准确性',
      '协调方法的有效性',
      '反馈机制的实用性'
    ],
    points: 20,
    timeLimit: 10,
    difficulty: 'intermediate'
  },
  {
    id: '4',
    type: 'scenario',
    category: '问题解决力',
    question: '突发危机的快速响应与解决',
    scenario: '重要客户系统突然出现故障，影响其核心业务，客户情绪激动要求立即解决并考虑索赔',
    requirements: [
      '制定危机处理的优先级和时间轴',
      '设计客户情绪安抚和期望管理策略',
      '协调内部资源的具体行动方案',
      '建立预防类似问题的长期机制'
    ],
    evaluationCriteria: [
      '应急处理的及时性',
      '客户关系维护的技巧性',
      '资源协调的高效性',
      '预防机制的前瞻性'
    ],
    points: 30,
    timeLimit: 18,
    difficulty: 'advanced'
  }
];

// 重新设计考核记录
const assessmentRecords: AssessmentRecord[] = [
  {
    id: '1',
    type: '季度综合考核',
    date: '2024-01-15',
    overallScore: 88,
    maxScore: 100,
    duration: 120,
    status: 'completed',
    competencies: {
      '客户洞察力': { score: 23, maxScore: 25, level: '优秀', feedback: '具备深度洞察客户需求的能力，建议加强行业趋势分析' },
      '问题解决力': { score: 25, maxScore: 30, level: '良好', feedback: '应急处理能力强，需提升系统性解决方案设计' },
      '沟通表达力': { score: 18, maxScore: 20, level: '优秀', feedback: '沟通技巧娴熟，建议增强跨部门协调能力' },
      '数据分析力': { score: 22, maxScore: 25, level: '良好', feedback: '数据敏感性较强，需加强预测分析能力' }
    }
  },
  {
    id: '2',
    type: '月度能力评估',
    date: '2024-02-20',
    overallScore: 92,
    maxScore: 100,
    duration: 90,
    status: 'completed',
    competencies: {
      '客户洞察力': { score: 24, maxScore: 25, level: '优秀', feedback: '客户需求把握精准，持续保持优势' },
      '团队协作力': { score: 23, maxScore: 25, level: '优秀', feedback: '团队配合默契，领导力逐步显现' },
      '创新思维力': { score: 22, maxScore: 25, level: '良好', feedback: '思维活跃，建议多关注行业创新案例' },
      '沟通表达力': { score: 23, maxScore: 25, level: '优秀', feedback: '表达清晰有逻辑，影响力持续提升' }
    }
  }
];

// 重新设计核心能力模型
const coreCompetencies: CoreCompetency[] = [
  {
    category: '客户洞察力',
    description: '深度理解客户需求，挖掘潜在价值',
    currentLevel: 88,
    targetLevel: 95,
    growthRate: 12,
    icon: Eye,
    color: '#3B82F6',
    keyBehaviors: ['需求分析', '价值挖掘', '趋势预测', '关系维护']
  },
  {
    category: '问题解决力',
    description: '系统性分析并解决复杂问题',
    currentLevel: 82,
    targetLevel: 90,
    growthRate: 8,
    icon: Brain,
    color: '#8B5CF6',
    keyBehaviors: ['问题诊断', '方案设计', '资源协调', '执行跟踪']
  },
  {
    category: '沟通表达力',
    description: '清晰传达信息，建立有效协作',
    currentLevel: 90,
    targetLevel: 95,
    growthRate: 6,
    icon: MessageSquare,
    color: '#10B981',
    keyBehaviors: ['信息传达', '情感连接', '冲突化解', '共识达成']
  },
  {
    category: '数据分析力',
    description: '运用数据洞察，支持决策制定',
    currentLevel: 78,
    targetLevel: 88,
    growthRate: 15,
    icon: BarChart3,
    color: '#F59E0B',
    keyBehaviors: ['数据收集', '分析建模', '洞察提取', '决策支持']
  },
  {
    category: '团队协作力',
    description: '促进团队合作，实现共同目标',
    currentLevel: 85,
    targetLevel: 92,
    growthRate: 10,
    icon: Users,
    color: '#EF4444',
    keyBehaviors: ['团队配合', '资源共享', '协同创新', '集体成长']
  },
  {
    category: '创新思维力',
    description: '突破常规思维，创造独特价值',
    currentLevel: 75,
    targetLevel: 85,
    growthRate: 18,
    icon: Lightbulb,
    color: '#EC4899',
    keyBehaviors: ['创意构思', '方法创新', '流程优化', '价值创造']
  }
];

const AssessmentSystem: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'assessment'>('dashboard');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 120分钟
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  // 倒计时
  useEffect(() => {
    if (assessmentStarted && !assessmentCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [assessmentStarted, assessmentCompleted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResponseChange = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  // 六边形雷达图组件 - 重新设计为更小的尺寸，适合右上角
  const CompetencyRadarChart = () => {
    const size = 200;
    const center = size / 2;
    const maxRadius = size / 2 - 30;
    
    const angleStep = (2 * Math.PI) / 6;
    
    const getPoint = (index: number, radius: number) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y };
    };

    // 创建网格线
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    const gridLines = gridLevels.map(level => {
      const points = coreCompetencies.map((_, index) => {
        const point = getPoint(index, maxRadius * level);
        return `${point.x},${point.y}`;
      }).join(' ');
      return (
        <polygon
          key={level}
          points={points}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity={0.5}
        />
      );
    });

    // 当前能力多边形
    const currentPoints = coreCompetencies.map((competency, index) => {
      const radius = (competency.currentLevel / 100) * maxRadius;
      const point = getPoint(index, radius);
      return `${point.x},${point.y}`;
    }).join(' ');

    // 目标能力多边形
    const targetPoints = coreCompetencies.map((competency, index) => {
      const radius = (competency.targetLevel / 100) * maxRadius;
      const point = getPoint(index, radius);
      return `${point.x},${point.y}`;
    }).join(' ');

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="drop-shadow-sm">
          {/* 网格 */}
          {gridLines}
          
          {/* 轴线 */}
          {coreCompetencies.map((_, index) => {
            const endPoint = getPoint(index, maxRadius);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={endPoint.x}
                y2={endPoint.y}
                stroke="#d1d5db"
                strokeWidth="1"
                opacity={0.6}
              />
            );
          })}
          
          {/* 目标能力区域 */}
          <polygon
            points={targetPoints}
            fill="rgba(59, 130, 246, 0.08)"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity={0.8}
          />
          
          {/* 当前能力区域 */}
          <polygon
            points={currentPoints}
            fill="rgba(16, 185, 129, 0.15)"
            stroke="#10B981"
            strokeWidth="3"
          />
          
          {/* 能力点 */}
          {coreCompetencies.map((competency, index) => {
            const radius = (competency.currentLevel / 100) * maxRadius;
            const point = getPoint(index, radius);
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#10B981"
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        
        {/* 能力标签 - 更紧凑的设计 */}
        <div className="absolute inset-0">
          {coreCompetencies.map((competency, index) => {
            const labelPoint = getPoint(index, maxRadius + 20);
            const IconComponent = competency.icon;
            return (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${labelPoint.x}px`,
                  top: `${labelPoint.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="flex flex-col items-center bg-white rounded-md px-1 py-0.5 shadow-sm border border-gray-100">
                  <IconComponent className="w-3 h-3 mb-0.5" style={{ color: competency.color }} />
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                    {competency.category.replace('力', '')}
                  </span>
                  <span className="text-xs font-bold" style={{ color: competency.color }}>
                    {competency.currentLevel}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 真正的左中右三栏布局 */}
      {activeView === 'dashboard' ? (
        <div className="h-full flex">
          {/* 左栏：考核管理 + 能力发展计划 */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* 考核管理导航 */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                考核管理
              </h3>
              <div className="text-sm text-gray-600 mb-4">考核计划与历史记录</div>
              
              {/* 本月考核计划 */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">本月考核计划</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded">
                    <span>事项综合考核</span>
                    <span className="text-blue-600 font-medium">进行中</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                    <span>产品知识专项考核</span>
                    <span className="text-gray-500">待开始</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-green-50 p-2 rounded">
                    <span>客户沟通能力评估</span>
                    <span className="text-green-600 font-medium">已完成</span>
                  </div>
                </div>
              </div>
              
              {/* 考核统计 */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-600">本年考试</div>
                </div>
                <div className="text-center bg-green-50 rounded p-2">
                  <div className="text-lg font-bold text-green-600">88.5</div>
                  <div className="text-xs text-gray-600">平均分</div>
                </div>
              </div>
            </div>
            
            {/* 能力发展计划 */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Target className="w-4 h-4 text-purple-600 mr-2" />
                能力发展计划
              </h4>
              <div className="text-xs text-gray-600 mb-3">将要提升的核心能力</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {coreCompetencies.map((competency, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <competency.icon className="w-4 h-4" style={{ color: competency.color }} />
                    <span className="font-medium text-gray-900 text-sm">{competency.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      competency.currentLevel >= 90 ? 'bg-green-100 text-green-700' :
                      competency.currentLevel >= 80 ? 'bg-blue-100 text-blue-700' :
                      competency.currentLevel >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {competency.currentLevel >= 90 ? '优秀' :
                       competency.currentLevel >= 80 ? '良好' :
                       competency.currentLevel >= 70 ? '一般' : '需改进'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">{competency.description}</div>
                  
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-gray-500">当前: {competency.currentLevel}%</span>
                    <span className="text-gray-500">目标: {competency.targetLevel}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${competency.currentLevel}%`,
                        backgroundColor: competency.color 
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">关键行为:</div>
                    <div className="flex flex-wrap gap-1">
                      {competency.keyBehaviors.map((behavior, idx) => (
                        <span key={idx} className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                          {behavior}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 中栏：考核进行状态（独立且扩展） */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Trophy className="w-5 h-5 text-purple-600 mr-2" />
                考核进行状态
              </h3>
              <p className="text-sm text-gray-600">当前正在进行的能力评估与考核</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <Trophy className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">季度综合考核</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  下一次季度考核将在3月15日进行，重点评估您在客户洞察、问题解决、
                  沟通表达等六大核心能力方面的表现。
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="font-semibold text-blue-900 text-lg">考核时间</div>
                    <div className="text-blue-700">2024年3月15日</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <div className="font-semibold text-green-900 text-lg">预期目标</div>
                    <div className="text-green-700">综合评分 ≥ 90</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveView('assessment')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 text-lg"
                >
                  开始模拟评估
                </button>
                
                {/* 历史考核记录 */}
                <div className="mt-12 text-left">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">近期考核记录</h4>
                  <div className="space-y-3">
                    {assessmentRecords.slice(0, 3).map((record, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{record.type}</div>
                          <div className="text-sm text-gray-600">{record.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{record.overallScore}</div>
                          <div className="text-xs text-gray-500">/{record.maxScore}分</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右栏：能力分析（包含雷达图） */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <PieChart className="w-5 h-5 text-purple-600 mr-2" />
                能力分析
              </h3>
              <div className="text-sm text-gray-600">个人能力发展报告</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* 雷达图区域 - 右上角位置 */}
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-3">能力发展趋势</h4>
                <div className="flex justify-center mb-3">
                  <CompetencyRadarChart />
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">当前</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-1 bg-blue-500 border border-dashed"></div>
                    <span className="text-gray-600">目标</span>
                  </div>
                </div>
              </div>
              
              {/* 能力发展势态 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">能力发展势态</h4>
                <div className="space-y-2">
                  {coreCompetencies.slice(0, 3).map((competency, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 text-sm">{competency.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          competency.growthRate >= 15 ? 'bg-green-100 text-green-700' :
                          competency.growthRate >= 10 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {competency.growthRate >= 15 ? '优秀' :
                           competency.growthRate >= 10 ? '良好' : '优秀'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {competency.growthRate >= 15 ? '具备深度洞察客户需求的能力，建议加强行业趋势分析' :
                         competency.growthRate >= 10 ? '应急处理能力强，需提升系统性解决方案设计' :
                         '沟通技巧娴熟，建议增强跨部门协调能力'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 最新评估结果 */}
              {assessmentRecords[0] && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    最新评估结果
                  </h4>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">综合评分</span>
                      <span className="text-xl font-bold text-blue-600">
                        {assessmentRecords[0].overallScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {assessmentRecords[0].type} • {assessmentRecords[0].date}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-amber-900 text-sm">改进建议</span>
                    </div>
                    <div className="space-y-1 text-xs text-amber-800">
                      <div>• 加强数据分析力训练</div>
                      <div>• 参与更多客户沟通实践</div>
                      <div>• 定期更新产品知识</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // 在线评估界面
        <div className="h-full flex flex-col bg-white">
          {!assessmentStarted ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <Trophy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">核心能力评估</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  本次评估将从6个维度全面考察您的核心能力。评估采用情景化答题方式，
                  重点考察您在实际工作中的思维模式、解决问题的方法和专业判断力。
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-900">考试时长</div>
                    <div className="text-sm text-blue-700">120分钟</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-green-900">题目数量</div>
                    <div className="text-sm text-green-700">{assessmentQuestions.length}道题</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setAssessmentStarted(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  开始评估
                </button>
              </div>
            </div>
          ) : (
            // 评估进行中的界面
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">能力评估进行中</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">剩余时间</span>
                      <span className={`text-sm font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">评估系统正在构建中</h4>
                  <p className="text-gray-600">
                    完整的情景化评估系统正在开发中，敬请期待！
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentSystem; 