import React from 'react';
import { 
  Crown, Package, User, Code, Bug, AlertTriangle, CheckCircle, 
  Database, Monitor, Smartphone, Layers, Zap
} from 'lucide-react';
import { ProductDemand, ProductProject } from '../types/moduleTypes';

export interface VersionManagementProps {
  selectedDemand: ProductDemand | null;
  productProjects: ProductProject[];
  MIDO_PRODUCT_STRUCTURE: {
    platform: string;
    systems: string[];
    applications: string[];
  };
}

const VersionManagement: React.FC<VersionManagementProps> = ({ 
  selectedDemand, 
  productProjects = [], 
  MIDO_PRODUCT_STRUCTURE 
}) => {
  const getConflictAnalysis = (demand: ProductDemand) => {
    const conflicts = [];

    if (demand.title.includes('智能营销')) {
      conflicts.push({
        type: '功能冲突',
        severity: 'high',
        conflictWith: 'PRD-002 会员管理T2.1.5',
        similarity: 78,
        description: '智能营销的指定门店发奖功能与会员管理的多级分销佣金功能在业务逻辑上可能重叠',
        misunderstanding: '可能混淆门店发奖与分销佣金的触发条件',
        suggestion: '建议统一奖励机制设计，避免用户困惑'
      });

      conflicts.push({
        type: '数据冲突',
        severity: 'medium',
        conflictWith: '积分商城现有积分体系',
        similarity: 65,
        description: '新增的发奖策略可能与现有积分奖励机制产生数据不一致',
        misunderstanding: '用户可能不理解积分与奖励的区别',
        suggestion: '制定统一的积分奖励标准和展示规范'
      });
    }

    if (demand.title.includes('社交云店')) {
      conflicts.push({
        type: 'UI冲突',
        severity: 'medium',
        conflictWith: '智能营销装修组件',
        similarity: 72,
        description: '店铺装修配置与智能营销的页面装修功能存在交互体验冲突',
        misunderstanding: '商户可能不知道该在哪个入口进行装修',
        suggestion: '整合装修入口，制定统一的装修流程'
      });
    }

    if (demand.title.includes('会员管理')) {
      conflicts.push({
        type: '架构冲突',
        severity: 'high',
        conflictWith: '防窜物流代理商体系',
        similarity: 85,
        description: '多级分销与防窜物流的代理商层级管理存在架构设计冲突',
        misunderstanding: '代理商角色与分销员身份可能产生混淆',
        suggestion: '重新设计用户角色体系，明确权限边界'
      });
    }

    return conflicts;
  };

  const getTechnicalImpact = (demand: ProductDemand) => {
    const impacts = [];

    if (demand.developmentCost >= 7) {
      impacts.push({
        area: '数据库设计',
        impact: 'high',
        description: '需要新增多张业务表，可能影响现有查询性能',
        suggestion: '考虑分库分表，优化索引设计'
      });

      impacts.push({
        area: '接口设计',
        impact: 'medium',
        description: '新增接口较多，需要考虑版本兼容性',
        suggestion: '采用API版本控制，确保向下兼容'
      });
    }

    if (demand.title.includes('智能营销') || demand.title.includes('会员管理')) {
      impacts.push({
        area: '缓存策略',
        impact: 'medium',
        description: '涉及用户数据频繁读写，需要优化缓存策略',
        suggestion: '使用Redis集群，分层缓存设计'
      });
    }

    return impacts;
  };

  const getBusinessRisks = (demand: ProductDemand) => {
    const risks = [];

    if (demand.urgency === '紧急' && demand.importance === '重要') {
      risks.push({
        type: '时间风险',
        level: 'high',
        description: '紧急重要需求，时间压力大，容易忽略质量把控',
        mitigation: '增加code review轮次，延长测试时间'
      });
    }

    if (demand.businessValue / demand.developmentCost < 1.2) {
      risks.push({
        type: '投入产出风险',
        level: 'medium',
        description: 'ROI较低，投入与收益不成正比',
        mitigation: '重新评估需求价值，考虑分期实现'
      });
    }

    if (demand.customer.includes('代理') || demand.source === '代理伙伴') {
      risks.push({
        type: '需求变更风险',
        level: 'medium',
        description: '代理商需求容易变化，影响开发进度',
        mitigation: '锁定需求范围，制定变更管理流程'
      });
    }

    return risks;
  };

  if (!selectedDemand) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">智能版本管理</h3>
          <p className="text-sm text-gray-500">选择需求查看详细分析</p>
        </div>
      </div>
    );
  }

  const relatedProject = productProjects.find(p => p.demandId === selectedDemand.id);
  const conflicts = getConflictAnalysis(selectedDemand);
  const technicalImpacts = getTechnicalImpact(selectedDemand);
  const businessRisks = getBusinessRisks(selectedDemand);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-purple-50 overflow-hidden">
      <div className="p-3 pb-2 flex-shrink-0 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
        <h3 className="text-xs font-semibold text-gray-800 mb-0.5 flex items-center">
          <Crown className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
          智能版本管理
        </h3>
        <p className="text-xs text-gray-400">AI驱动的冲突检测与风险评估</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-3">
          {relatedProject && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-green-50">
                <h4 className="font-medium text-slate-900 flex items-center text-xs">
                  <Package className="w-3.5 h-3.5 text-green-600 mr-1.5" />
                  关联项目信息
                </h4>
              </div>
              <div className="p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-500">版本号:</span>
                      <span className="text-purple-700 font-bold ml-1">{relatedProject.version}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">版本类型:</span>
                      <span className={`ml-1 px-1 py-0.5 rounded text-xs font-medium border ${
                        relatedProject.versionType === '大版本' ? 'bg-red-100 text-red-700 border-red-200' :
                        relatedProject.versionType === '中版本' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        {relatedProject.versionType}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-500">当前状态:</span>
                      <span className="text-blue-700 font-medium ml-1">{relatedProject.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">预计交付:</span>
                      <span className="text-slate-800 ml-1 font-medium">{relatedProject.deadline}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">整体进度</span>
                    <span className="text-xs font-medium text-gray-900">{relatedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 relative"
                      style={{ width: `${relatedProject.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"></div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <div className="text-xs font-medium text-slate-800 mb-1">项目团队</div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-purple-600" />
                      <span className="text-slate-500">产品经理:</span>
                      <span className="text-slate-800 font-medium">{relatedProject.manager}</span>
                    </div>
                    {relatedProject.developer && (
                      <div className="flex items-center space-x-1">
                        <Code className="w-3 h-3 text-blue-600" />
                        <span className="text-slate-500">技术负责人:</span>
                        <span className="text-slate-800 font-medium">{relatedProject.developer}</span>
                      </div>
                    )}
                    {relatedProject.tester && (
                      <div className="flex items-center space-x-1">
                        <Bug className="w-3 h-3 text-emerald-600" />
                        <span className="text-slate-500">测试负责人:</span>
                        <span className="text-slate-800 font-medium">{relatedProject.tester}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {conflicts.length > 0 && (
            <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
                <h4 className="font-medium text-red-900 flex items-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  冲突风险分析
                  <span className="ml-2 text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded-full font-medium">
                    {conflicts.length}个冲突
                  </span>
                </h4>
              </div>
              <div className="p-2.5 space-y-2.5">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2.5 space-y-2 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          conflict.severity === 'high' ? 'bg-red-500 shadow-red-300 shadow-sm' :
                          conflict.severity === 'medium' ? 'bg-amber-500 shadow-amber-300 shadow-sm' : 'bg-emerald-500 shadow-emerald-300 shadow-sm'
                          }`} />
                        <span className="font-medium text-gray-800 text-xs">{conflict.type}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          {conflict.similarity}%
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          conflict.severity === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                          conflict.severity === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                          {conflict.severity === 'high' ? '高风险' : conflict.severity === 'medium' ? '中风险' : '低风险'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded p-2 border-l-2 border-blue-400 shadow-sm">
                      <div className="text-xs text-slate-500 mb-0.5 font-medium">冲突对象</div>
                      <div className="text-xs text-blue-700 font-medium break-words">{conflict.conflictWith}</div>
                    </div>

                    <div className="bg-white rounded p-2 border-l-2 border-slate-300 shadow-sm">
                      <div className="text-xs text-slate-500 mb-0.5 font-medium">问题描述</div>
                      <div className="text-xs text-slate-700 leading-relaxed break-words">{conflict.description}</div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded p-2 border border-orange-200 shadow-sm">
                        <div className="flex items-start space-x-1">
                          <AlertTriangle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-orange-900 mb-0.5">误解风险</div>
                            <div className="text-xs text-orange-800 leading-relaxed break-words">{conflict.misunderstanding}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-2 border border-blue-200 shadow-sm">
                        <div className="flex items-start space-x-1">
                          <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-blue-900 mb-0.5">修正建议</div>
                            <div className="text-xs text-blue-800 leading-relaxed break-words">{conflict.suggestion}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {technicalImpacts.length > 0 && (
            <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="font-medium text-blue-900 flex items-center text-xs">
                  <Code className="w-3.5 h-3.5 mr-1.5" />
                  技术影响评估
                </h4>
              </div>
              <div className="p-2.5 space-y-2">
                {technicalImpacts.map((impact, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded p-2 space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 text-xs">{impact.area}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
                        impact.impact === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                        impact.impact === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        {impact.impact === 'high' ? '高影响' : impact.impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed break-words">{impact.description}</p>
                    <div className="text-xs bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-800 p-2 rounded border border-emerald-200 leading-relaxed shadow-sm">
                      💡 建议: {impact.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {businessRisks.length > 0 && (
            <div className="bg-white rounded-lg border border-amber-200 shadow-sm overflow-hidden">
              <div className="p-2.5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <h4 className="font-medium text-amber-900 flex items-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  业务风险评估
                </h4>
              </div>
              <div className="p-2.5 space-y-2">
                {businessRisks.map((risk, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded p-2 space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 text-xs">{risk.type}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
                        risk.level === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                        risk.level === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed break-words">{risk.description}</p>
                    <div className="text-xs bg-gradient-to-br from-sky-50 to-blue-100 text-sky-800 p-2 rounded border border-sky-200 leading-relaxed shadow-sm">
                      🛡️ 缓解措施: {risk.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50">
              <h4 className="font-medium text-slate-900 flex items-center text-xs">
                <Layers className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
                米多产品架构影响
              </h4>
            </div>
            <div className="p-2.5 space-y-1.5">
              <div className="grid grid-cols-1 gap-1.5">
                <div className="border border-blue-200 rounded p-2 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm">
                  <div className="font-medium text-blue-900 mb-0.5 flex items-center text-xs">
                    <Database className="w-3 h-3 mr-1" />
                    平台层影响
                  </div>
                  <div className="text-xs text-blue-700 leading-relaxed">
                    对{MIDO_PRODUCT_STRUCTURE.platform}的核心数据架构产生影响
                  </div>
                </div>

                <div className="border border-emerald-200 rounded p-2 bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm">
                  <div className="font-medium text-emerald-900 mb-0.5 flex items-center text-xs">
                    <Monitor className="w-3 h-3 mr-1" />
                    系统层影响
                  </div>
                  <div className="text-xs text-emerald-700 leading-relaxed">
                    主要影响: {MIDO_PRODUCT_STRUCTURE.systems.slice(0, 2).join('、')}
                  </div>
                </div>

                <div className="border border-purple-200 rounded p-2 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
                  <div className="font-medium text-purple-900 mb-0.5 flex items-center text-xs">
                    <Smartphone className="w-3 h-3 mr-1" />
                    应用层影响
                  </div>
                  <div className="text-xs text-purple-700 leading-relaxed">
                    涉及{MIDO_PRODUCT_STRUCTURE.applications.filter(app =>
                      selectedDemand.title.includes(app.substring(0, 2))
                    ).join('、')}等系统
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!relatedProject && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-purple-200 shadow-sm">
              <div className="p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI智能建议
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-900 mb-1">版本规划建议</div>
                    <div className="text-purple-800">
                      建议版本类型: <span className="font-bold">{selectedDemand.businessValue >= 8 ? '中版本' : '小版本'}</span>
                    </div>
                    <div className="text-purple-800">
                      预计版本号: <span className="font-bold">{selectedDemand.businessValue >= 8 ? 'V2.X.0' : 'V2.X.X'}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-900 mb-1">立项流程建议</div>
                    <div className="text-blue-800">
                      {selectedDemand.businessValue >= 8 ?
                        '需通过产品委员会三稿制立项评审' :
                        '可走产品经理简化立项流程'
                      }
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-green-100">
                    <div className="font-medium text-green-900 mb-1">资源配置建议</div>
                    <div className="text-green-800">
                      预计需要配置: 产品经理1人 + 开发工程师{Math.ceil(selectedDemand.developmentCost / 3)}人 + 测试工程师1人
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionManagement;