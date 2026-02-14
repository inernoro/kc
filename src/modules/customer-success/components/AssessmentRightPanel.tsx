import React from 'react';
import { Lightbulb, PieChart, Star } from 'lucide-react';

const AssessmentRightPanel: React.FC = () => (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <PieChart className="w-5 h-5 text-purple-600 mr-2" />
          能力分析
        </h3>
        <div className="text-sm text-gray-600">个人能力发展报告</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 雷达图区域 - 缩小尺寸 */}
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-3">能力发展趋势</h4>
          <div className="flex justify-center mb-3">
            {/* 优化的雷达图 - 修复样式问题 */}
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                {/* 雷达图背景网格 - 同心六边形 */}
                {[20, 35, 50, 65, 80].map((radius, index) => {
                  const points = Array.from({ length: 6 }, (_, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={index}
                      points={points}
                      fill="none"
                      stroke={index === 4 ? "#e2e8f0" : "#f1f5f9"}
                      strokeWidth={index === 4 ? "1" : "0.5"}
                    />
                  );
                })}

                {/* 六边形网格线 */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const x = 100 + 80 * Math.cos(angle);
                  const y = 100 + 80 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="0.5"
                    />
                  );
                })}

                {/* 当前能力数据多边形 */}
                {(() => {
                  const abilities = [88, 82, 90, 78, 85, 75]; // 客户洞察、问题解决、沟通表达、数据分析、团队协作、创新思维
                  const currentPoints = abilities.map((value, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const radius = (value / 100) * 70; // 最大半径70
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      points={currentPoints}
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                  );
                })()}

                {/* 目标能力数据多边形（虚线） */}
                {(() => {
                  const targetAbilities = [95, 90, 95, 85, 90, 85]; // 目标值
                  const targetPoints = targetAbilities.map((value, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const radius = (value / 100) * 70;
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      points={targetPoints}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4,3"
                    />
                  );
                })()}

                {/* 能力标签和数值点 */}
                {(() => {
                  const labels = ['客户洞察', '问题解决', '沟通表达', '数据分析', '团队协作', '创新思维'];
                  const values = [88, 82, 90, 78, 85, 75];
                  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

                  return labels.map((label, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const labelRadius = 110; // 增加标签距离
                    const dotRadius = (values[i] / 100) * 70;
                    const valueRadius = dotRadius + 15; // 数值标签位置在数据点外侧

                    const labelX = 100 + labelRadius * Math.cos(angle);
                    const labelY = 100 + labelRadius * Math.sin(angle);

                    const dotX = 100 + dotRadius * Math.cos(angle);
                    const dotY = 100 + dotRadius * Math.sin(angle);

                    const valueX = 100 + valueRadius * Math.cos(angle);
                    const valueY = 100 + valueRadius * Math.sin(angle);

                    return (
                      <g key={i}>
                        {/* 数据点 */}
                        <circle
                          cx={dotX}
                          cy={dotY}
                          r="4"
                          fill={colors[i]}
                          stroke="white"
                          strokeWidth="2"
                        />

                        {/* 标签背景 */}
                        <rect
                          x={labelX - 28}
                          y={labelY - 10}
                          width="56"
                          height="20"
                          rx="10"
                          fill="white"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />

                        {/* 标签文字 */}
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium"
                          fill="#374151"
                        >
                          {label}
                        </text>

                        {/* 数值标签背景 */}
                        <rect
                          x={valueX - 15}
                          y={valueY - 8}
                          width="30"
                          height="16"
                          rx="8"
                          fill={colors[i]}
                          fillOpacity="0.9"
                        />

                        {/* 数值标签 */}
                        <text
                          x={valueX}
                          y={valueY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold"
                          fill="white"
                        >
                          {values[i]}%
                        </text>
                      </g>
                    );
                  });
                })()}

                {/* 中心点 */}
                <circle
                  cx="100"
                  cy="100"
                  r="2"
                  fill="#64748b"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full opacity-20 border-2 border-green-500"></div>
              <span className="text-gray-600 font-medium">当前能力</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500 border border-dashed"></div>
              <span className="text-gray-600 font-medium">目标水平</span>
            </div>
          </div>
        </div>

        {/* 能力发展势态 - 扩展内容 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">能力发展势态</h4>
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-900 text-sm">客户洞察力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">优秀</span>
              </div>
              <div className="text-xs text-green-700 mb-2">
                具备深度洞察客户需求的能力，建议加强行业趋势分析
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 text-sm">问题解决力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">良好</span>
              </div>
              <div className="text-xs text-blue-700 mb-2">
                沟通技巧娴熟，建议增强跨部门协调能力
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-900 text-sm">沟通表达力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">优秀</span>
              </div>
              <div className="text-xs text-purple-700 mb-2">
                表达清晰有条理，继续保持并提升演讲技巧
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-purple-500" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-amber-900 text-sm">数据分析力</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700">待提升</span>
              </div>
              <div className="text-xs text-amber-700 mb-2">
                需加强数据挖掘和统计分析技能
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 月度能力变化趋势 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">月度能力变化</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="text-green-600 font-bold">+5.2%</div>
                <div className="text-gray-600">客户洞察</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-bold">+3.1%</div>
                <div className="text-gray-600">问题解决</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-bold">+2.8%</div>
                <div className="text-gray-600">沟通表达</div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-bold">+1.5%</div>
                <div className="text-gray-600">数据分析</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold">+4.2%</div>
                <div className="text-gray-600">团队协作</div>
              </div>
              <div className="text-center">
                <div className="text-pink-600 font-bold">+2.3%</div>
                <div className="text-gray-600">创新思维</div>
              </div>
            </div>
          </div>
        </div>

        {/* 同事评价摘要 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">同事评价摘要</h4>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
              <div className="text-sm font-medium text-blue-900">产品部 - 王经理</div>
              <div className="text-xs text-blue-700 mt-1">"沟通能力很强，能快速理解客户需求，提出的解决方案很有针对性。"</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
              <div className="text-sm font-medium text-green-900">技术部 - 李工程师</div>
              <div className="text-xs text-green-700 mt-1">"合作愉快，善于协调各方资源，项目推进效率很高。"</div>
            </div>
          </div>
        </div>

        {/* 最新评估结果 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            最新评估结果
          </h4>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">综合评分</span>
              <span className="text-xl font-bold text-blue-600">88</span>
            </div>
            <div className="text-xs text-gray-600 mb-2">季度综合考核 • 2024-01-15</div>
            <div className="text-xs text-gray-600">
              排名：部门第3名 / 全公司前15%
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-amber-900 text-sm">改进建议</span>
            </div>
            <div className="space-y-1 text-xs text-amber-800">
              <div>• 加强数据分析力训练，建议参与BI工具培训</div>
              <div>• 参与更多客户沟通实践，提升现场应变能力</div>
              <div>• 定期更新产品知识，关注行业发展趋势</div>
              <div>• 加强跨部门协作，提升项目统筹能力</div>
            </div>
          </div>
        </div>

        {/* 能力提升计划 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">下季度提升计划</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-900">数据分析专项培训</div>
                <div className="text-xs text-gray-600">3月15日 - 3月30日</div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">进行中</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-900">客户沟通实战演练</div>
                <div className="text-xs text-gray-600">4月1日 - 4月15日</div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">待开始</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-900">跨部门协作项目</div>
                <div className="text-xs text-gray-600">4月15日 - 5月15日</div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">计划中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
);

export default AssessmentRightPanel;
