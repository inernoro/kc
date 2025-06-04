export const productUtils = {
  // 计算功能优先级分数
  calculatePriorityScore: (votes: number, estimatedUsers: number, complexity: number): number => {
    const voteWeight = votes * 0.3;
    const userWeight = (estimatedUsers / 1000) * 0.5;
    const complexityWeight = (10 - complexity) * 0.2;
    return Math.round(voteWeight + userWeight + complexityWeight);
  },

  // 获取功能状态颜色
  getFeatureStatusColor: (status: string): string => {
    switch (status) {
      case 'planning': return 'text-gray-600 bg-gray-100';
      case 'development': return 'text-blue-600 bg-blue-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      case 'released': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  // 格式化用户数量
  formatUserCount: (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  },

  // 计算功能完成度
  calculateCompletionRate: (features: any[]): number => {
    if (features.length === 0) return 0;
    const completedFeatures = features.filter(f => f.status === 'released').length;
    return Math.round((completedFeatures / features.length) * 100);
  },

  // 生成功能标签
  generateFeatureTags: (feature: any): string[] => {
    const tags: string[] = [];
    
    if (feature.priority === 'high') tags.push('高优先级');
    if (feature.estimatedUsers > 10000) tags.push('高影响');
    if (feature.votes > 100) tags.push('热门需求');
    if (feature.status === 'development') tags.push('开发中');
    
    return tags;
  },

  // 计算用户满意度趋势
  calculateSatisfactionTrend: (feedbacks: any[]): 'up' | 'down' | 'stable' => {
    if (feedbacks.length < 2) return 'stable';
    
    const recent = feedbacks.slice(0, Math.floor(feedbacks.length / 2));
    const older = feedbacks.slice(Math.floor(feedbacks.length / 2));
    
    const recentAvg = recent.reduce((sum, f) => sum + f.rating, 0) / recent.length;
    const olderAvg = older.reduce((sum, f) => sum + f.rating, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    if (diff > 0.2) return 'up';
    if (diff < -0.2) return 'down';
    return 'stable';
  },

  // 分析功能使用情况
  analyzeFeatureUsage: (analytics: any): { mostUsed: string[], leastUsed: string[] } => {
    // 模拟分析逻辑
    return {
      mostUsed: ['搜索功能', '用户管理', '数据导出'],
      leastUsed: ['高级筛选', '批量操作', '自定义报表']
    };
  }
}; 