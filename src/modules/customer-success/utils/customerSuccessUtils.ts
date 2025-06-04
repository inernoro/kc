export const customerSuccessUtils = {
  // 计算客户价值等级
  calculateCustomerLevel: (value: number): number => {
    if (value >= 500000) return 5;
    if (value >= 300000) return 4;
    if (value >= 100000) return 3;
    if (value >= 50000) return 2;
    return 1;
  },

  // 获取客户状态颜色
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'potential': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  // 计算续约风险
  calculateRenewalRisk: (daysLeft: number, probability: number): 'low' | 'medium' | 'high' => {
    if (daysLeft <= 30 && probability < 70) return 'high';
    if (daysLeft <= 60 && probability < 80) return 'medium';
    return 'low';
  },

  // 格式化货币
  formatCurrency: (amount: number): string => {
    return `¥${amount.toLocaleString('zh-CN')}`;
  },

  // 计算客户生命周期价值
  calculateLifetimeValue: (monthlyValue: number, retentionRate: number): number => {
    return monthlyValue * (1 / (1 - retentionRate));
  },

  // 生成客户标签
  generateCustomerTags: (customer: any): string[] => {
    const tags: string[] = [];
    
    if (customer.value >= 300000) tags.push('VIP客户');
    if (customer.satisfactionScore >= 4.5) tags.push('高满意度');
    if (customer.level >= 4) tags.push('高价值客户');
    if (customer.priority === 'high') tags.push('高优先级');
    
    return tags;
  },

  // 客户健康评分
  calculateHealthScore: (customer: any): number => {
    let score = 0;
    
    // 基于满意度评分 (40%)
    if (customer.satisfactionScore) {
      score += (customer.satisfactionScore / 5) * 40;
    }
    
    // 基于活跃度 (30%)
    const daysSinceContact = Math.floor((new Date().getTime() - new Date(customer.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceContact <= 7) score += 30;
    else if (daysSinceContact <= 30) score += 20;
    else if (daysSinceContact <= 60) score += 10;
    
    // 基于价值等级 (20%)
    score += (customer.level / 5) * 20;
    
    // 基于续约概率 (10%)
    if (customer.renewalProbability) {
      score += (customer.renewalProbability / 100) * 10;
    }
    
    return Math.round(score);
  }
}; 