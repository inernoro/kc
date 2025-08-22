import React, { useState, useEffect } from 'react';
import { 
  User, 
  Target,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  DollarSign,
  Trophy
} from 'lucide-react';

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
  jobMatchDetails?: {
    skillsMatch: {
      matched: string[];
      missing: string[];
      bonus: string[];
      score: number;
    };
    experienceMatch: {
      required: string;
      actual: string;
      score: number;
    };
    locationMatch: {
      required: string;
      actual: string;
      score: number;
    };
    salaryMatch: {
      expected: string;
      offered: string;
      score: number;
    };
    recommendationReason: string;
  };
}

// 招聘信息类型
interface JobRequirement {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  experienceRequired: string;
  requiredSkills: string[];
  description: string;
}

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
    location: '北京',
    jobMatchDetails: {
      skillsMatch: {
        matched: ['React', 'TypeScript'],
        missing: ['Vue.js'],
        bonus: ['Node.js', 'Python'],
        score: 90
      },
      experienceMatch: {
        required: '3-5年',
        actual: '5年',
        score: 100
      },
      locationMatch: {
        required: '北京',
        actual: '北京',
        score: 100
      },
      salaryMatch: {
        expected: '25-30K',
        offered: '25-35K',
        score: 95
      },
      recommendationReason: '技能匹配度极高，经验完全符合，地理位置匹配'
    }
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

interface Props {
  jobRequirement?: JobRequirement;
  candidates?: CandidateMatch[];
}

const ResumeRanking: React.FC<Props> = ({ 
  jobRequirement = {
    title: '高级前端工程师',
    company: 'XX科技有限公司',
    location: '北京',
    salaryRange: '25-35K',
    experienceRequired: '3-5年',
    requiredSkills: ['React', 'TypeScript', 'Vue.js'],
    description: '负责前端架构设计和开发'
  },
  candidates: propCandidates = mockCandidates 
}) => {
  const [candidates, setCandidates] = useState<CandidateMatch[]>(propCandidates);
  const [sortBy, setSortBy] = useState<'matchScore' | 'experience' | 'name'>('matchScore');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  // 当prop的candidates变化时更新本地状态
  useEffect(() => {
    setCandidates(propCandidates);
  }, [propCandidates]);

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
    <div className="h-full bg-gradient-to-br from-orange-50/60 via-red-50/40 to-pink-50/50 backdrop-blur-sm flex flex-col">
      {/* 招聘信息头部 - 压缩版本 */}
      <div className="p-4 border-b border-orange-200/30 bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-md">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {jobRequirement.title}
            </h3>
            <p className="text-xs text-gray-600">{jobRequirement.company}</p>
          </div>
          <div className="text-right">
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              招聘中
            </div>
          </div>
        </div>
        
        {/* 职位详情卡片 - 压缩版本 */}
        <div className="bg-white/70 rounded-lg p-3 border border-orange-100/50 shadow-sm">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-center">
              <div className="flex items-center justify-center text-orange-600 mb-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium">地点</span>
              </div>
              <p className="text-xs text-gray-700">{jobRequirement.location}</p>
            </div>
            <div className="text-center border-x border-gray-200/50">
              <div className="flex items-center justify-center text-orange-600 mb-1">
                <DollarSign className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium">薪资</span>
              </div>
              <p className="text-xs text-gray-700">{jobRequirement.salaryRange}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-orange-600 mb-1">
                <Target className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium">经验</span>
              </div>
              <p className="text-xs text-gray-700">{jobRequirement.experienceRequired}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200/50 pt-2">
            <h4 className="text-xs font-semibold text-gray-800 mb-2">技能要求</h4>
            <div className="flex flex-wrap gap-1">
              {jobRequirement.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full border border-orange-200/50 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 候选人列表头部 - 压缩版本 */}
      <div className="p-4 border-b border-orange-200/30 bg-gradient-to-r from-white/60 to-orange-50/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-3 h-3 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">优选候选人</h4>
              <p className="text-xs text-gray-600">智能匹配结果</p>
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs border border-orange-200 rounded-lg px-2 py-1 bg-white/80 focus:ring-1 focus:ring-orange-100 focus:border-orange-300 transition-all"
          >
            <option value="matchScore">按匹配度</option>
            <option value="experience">按经验</option>
            <option value="name">按姓名</option>
          </select>
        </div>
        
        {/* 统计信息 - 压缩版本 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/70 rounded-lg p-2 text-center border border-orange-100/50">
            <div className="text-sm font-bold text-gray-900">{candidates.length}</div>
            <div className="text-xs text-gray-600">总数</div>
          </div>
          <div className="bg-white/70 rounded-lg p-2 text-center border border-orange-100/50">
            <div className="text-sm font-bold text-green-600">{candidates.filter(c => c.matchScore >= 85).length}</div>
            <div className="text-xs text-gray-600">高匹配</div>
          </div>
          <div className="bg-white/70 rounded-lg p-2 text-center border border-orange-100/50">
            <div className="text-sm font-bold text-orange-600">{Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)}%</div>
            <div className="text-xs text-gray-600">平均分</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {sortedCandidates.map((candidate, index) => (
          <div
            key={candidate.id}
            className="bg-white/90 rounded-xl border border-orange-100/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm overflow-hidden group relative"
          >
            {/* 排名角标 */}
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                  'bg-gradient-to-br from-orange-400 to-orange-500'
                }`}>
                  {index + 1}
                </div>
              </div>
            )}

            {/* 候选人基本信息 - 压缩版本 */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{candidate.name}</h4>
                    <p className="text-xs text-gray-600">{candidate.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    candidate.matchScore >= 90 ? 'text-green-600' :
                    candidate.matchScore >= 80 ? 'text-blue-600' :
                    candidate.matchScore >= 70 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {candidate.matchScore}%
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    candidate.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                    candidate.matchScore >= 80 ? 'bg-blue-100 text-blue-700' :
                    candidate.matchScore >= 70 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {candidate.matchScore >= 90 ? '优秀' :
                     candidate.matchScore >= 80 ? '良好' :
                     candidate.matchScore >= 70 ? '一般' : '待考虑'}
                  </div>
                </div>
              </div>
              
              {/* 基本信息标签 - 压缩版本 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <Target className="w-3 h-3 text-gray-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">{candidate.experience}</div>
                  <div className="text-xs text-gray-500">经验</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <Award className="w-3 h-3 text-gray-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">{candidate.education.split(' - ')[0]}</div>
                  <div className="text-xs text-gray-500">学历</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <MapPin className="w-3 h-3 text-gray-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">{candidate.location}</div>
                  <div className="text-xs text-gray-500">地点</div>
                </div>
              </div>
            </div>

            {/* 详细匹配分析 */}
            {candidate.jobMatchDetails && (
              <div className="p-4 space-y-3">
                {/* 技能匹配 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">技能匹配</span>
                    <span className={`text-sm font-bold ${
                      candidate.jobMatchDetails.skillsMatch.score >= 80 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {candidate.jobMatchDetails.skillsMatch.score}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    {candidate.jobMatchDetails.skillsMatch.matched.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">✓ 匹配:</span>
                        {candidate.jobMatchDetails.skillsMatch.matched.map((skill, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {candidate.jobMatchDetails.skillsMatch.missing.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">✗ 缺失:</span>
                        {candidate.jobMatchDetails.skillsMatch.missing.map((skill, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {candidate.jobMatchDetails.skillsMatch.bonus.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">+ 额外:</span>
                        {candidate.jobMatchDetails.skillsMatch.bonus.map((skill, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 其他匹配维度 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* 经验匹配 */}
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">经验匹配</span>
                      <span className={`text-xs font-bold ${
                        candidate.jobMatchDetails.experienceMatch.score >= 80 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {candidate.jobMatchDetails.experienceMatch.score}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">
                      需要: {candidate.jobMatchDetails.experienceMatch.required}
                    </p>
                    <p className="text-xs text-gray-700">
                      实际: {candidate.jobMatchDetails.experienceMatch.actual}
                    </p>
                  </div>

                  {/* 地点匹配 */}
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">地点匹配</span>
                      <span className={`text-xs font-bold ${
                        candidate.jobMatchDetails.locationMatch.score >= 80 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {candidate.jobMatchDetails.locationMatch.score}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">
                      {candidate.jobMatchDetails.locationMatch.required} → {candidate.jobMatchDetails.locationMatch.actual}
                    </p>
                  </div>
                </div>

                {/* 推荐理由 */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-2">
                  <p className="text-xs text-blue-700">
                    <strong>推荐理由:</strong> {candidate.jobMatchDetails.recommendationReason}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeRanking;