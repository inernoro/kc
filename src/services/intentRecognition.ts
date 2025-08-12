// 意图识别服务 - Demo版本
export interface IntentResult {
  intent: 'ui_generation' | 'data_analysis' | 'text_processing' | 'other';
  confidence: number;
  metadata?: {
    pageType?: string;
    components?: string[];
    framework?: string;
  };
}

export interface PRDContent {
  title?: string;
  description?: string;
  requirements?: string[];
  ui_elements?: string[];
  functionality?: string[];
}

// Demo意图识别函数
export function recognizeIntent(content: string | PRDContent): IntentResult {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const lowerContent = textContent.toLowerCase();

  // 检查UI生成相关关键词
  const uiKeywords = [
    '页面', '界面', '组件', 'ui', '前端', '表单', '按钮', '列表', 
    '导航', '菜单', '弹窗', '模态框', '卡片', '布局', '响应式',
    'page', 'interface', 'component', 'form', 'button', 'modal', 'layout'
  ];

  const uiScore = uiKeywords.reduce((score, keyword) => {
    const matches = (textContent.match(new RegExp(keyword, 'gi')) || []).length;
    return score + matches;
  }, 0);

  if (uiScore > 2) {
    // 识别页面类型
    let pageType = 'general';
    if (lowerContent.includes('表单') || lowerContent.includes('form')) pageType = 'form';
    else if (lowerContent.includes('列表') || lowerContent.includes('table') || lowerContent.includes('list')) pageType = 'list';
    else if (lowerContent.includes('仪表板') || lowerContent.includes('dashboard')) pageType = 'dashboard';
    else if (lowerContent.includes('详情') || lowerContent.includes('detail')) pageType = 'detail';

    // 识别可能的组件
    const components = [];
    if (lowerContent.includes('表格') || lowerContent.includes('table')) components.push('table');
    if (lowerContent.includes('表单') || lowerContent.includes('form')) components.push('form');
    if (lowerContent.includes('图表') || lowerContent.includes('chart')) components.push('chart');
    if (lowerContent.includes('按钮') || lowerContent.includes('button')) components.push('button');
    if (lowerContent.includes('导航') || lowerContent.includes('nav')) components.push('navigation');

    return {
      intent: 'ui_generation',
      confidence: Math.min(0.8 + (uiScore * 0.05), 0.95),
      metadata: {
        pageType,
        components,
        framework: 'react' // 默认使用React
      }
    };
  }

  // 其他意图的简单判断
  const dataKeywords = ['数据', '分析', '统计', 'data', 'analysis', 'chart', 'report'];
  const dataScore = dataKeywords.reduce((score, keyword) => {
    return score + (textContent.match(new RegExp(keyword, 'gi')) || []).length;
  }, 0);

  if (dataScore > 1) {
    return {
      intent: 'data_analysis',
      confidence: 0.7
    };
  }

  return {
    intent: 'other',
    confidence: 0.3
  };
}

// 解析PRD文件内容
export function parsePRDContent(content: string): PRDContent {
  const lines = content.split('\n').filter(line => line.trim());
  const result: PRDContent = {};

  let currentSection = '';
  const sections: Record<string, string[]> = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 检查是否是标题
    if (trimmedLine.startsWith('#')) {
      currentSection = trimmedLine.replace(/^#+\s*/, '').toLowerCase();
      sections[currentSection] = [];
      
      if (!result.title && trimmedLine.startsWith('# ')) {
        result.title = trimmedLine.replace('# ', '');
      }
      continue;
    }

    // 检查是否是列表项
    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine)) {
      const content = trimmedLine.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
      if (currentSection) {
        sections[currentSection] = sections[currentSection] || [];
        sections[currentSection].push(content);
      }
      continue;
    }

    // 普通文本
    if (trimmedLine && currentSection) {
      sections[currentSection] = sections[currentSection] || [];
      sections[currentSection].push(trimmedLine);
    } else if (trimmedLine && !result.description) {
      result.description = trimmedLine;
    }
  }

  // 映射到结构化数据
  result.requirements = sections['需求'] || sections['requirements'] || sections['功能需求'] || [];
  result.ui_elements = sections['界面'] || sections['ui'] || sections['页面元素'] || [];
  result.functionality = sections['功能'] || sections['功能点'] || sections['features'] || [];

  return result;
}