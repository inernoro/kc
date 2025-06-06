import React, { useState } from 'react';
import { ChevronDown, BookOpen, Package, Users, Lightbulb, BarChart3, Settings } from 'lucide-react';
import styles from './KnowledgeSelector.module.css';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number; // 知识条目数量
}

interface KnowledgeSelectorProps {
  selectedKnowledge: string;
  onKnowledgeChange: (knowledgeId: string) => void;
  className?: string;
}

const knowledgeBases: KnowledgeBase[] = [
  {
    id: 'general',
    name: '通用知识库',
    description: '覆盖酒水行业基础知识、常见问题解答',
    icon: BookOpen,
    color: 'text-blue-600',
    count: 1280
  },
  {
    id: 'product',
    name: '产品知识库',
    description: '产品详情、规格参数、价格策略',
    icon: Package,
    color: 'text-green-600',
    count: 856
  },
  {
    id: 'customer',
    name: '客户知识库',
    description: '客户档案、需求分析、沟通记录',
    icon: Users,
    color: 'text-purple-600',
    count: 342
  },
  {
    id: 'sales',
    name: '销售知识库',
    description: '销售技巧、谈判策略、成功案例',
    icon: BarChart3,
    color: 'text-orange-600',
    count: 567
  },
  {
    id: 'solution',
    name: '解决方案',
    description: '行业解决方案、最佳实践分享',
    icon: Lightbulb,
    color: 'text-yellow-600',
    count: 234
  },
  {
    id: 'technical',
    name: '技术知识库',
    description: '技术文档、操作手册、故障排除',
    icon: Settings,
    color: 'text-gray-600',
    count: 189
  }
];

const KnowledgeSelector: React.FC<KnowledgeSelectorProps> = ({ 
  selectedKnowledge, 
  onKnowledgeChange, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedKnowledgeData = knowledgeBases.find(kb => kb.id === selectedKnowledge) || knowledgeBases[0];
  const Icon = selectedKnowledgeData.icon;

  return (
    <div className={`${styles.knowledgeSelector} ${className || ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.selectorButton}
      >
        <Icon className={`${styles.selectorIcon} ${selectedKnowledgeData.color}`} />
        <span className={styles.selectorText}>{selectedKnowledgeData.name}</span>
        <ChevronDown className={`${styles.selectorChevron} ${isOpen ? styles.open : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <div className={styles.dropdownHeader}>
              选择知识库类型
            </div>
            {knowledgeBases.map((kb) => {
              const KbIcon = kb.icon;
              const isSelected = selectedKnowledge === kb.id;
              return (
                <button
                  key={kb.id}
                  onClick={() => {
                    onKnowledgeChange(kb.id);
                    setIsOpen(false);
                  }}
                  className={`${styles.knowledgeItem} ${isSelected ? styles.selected : ''}`}
                >
                  <KbIcon className={`${styles.knowledgeItemIcon} ${
                    isSelected ? styles.selected : ''
                  }`} 
                  style={{ color: isSelected ? '#2563eb' : undefined }}
                  />
                  <div className={styles.knowledgeItemContent}>
                    <div className={styles.knowledgeItemHeader}>
                      <span className={`${styles.knowledgeItemTitle} ${
                        isSelected ? styles.selected : ''
                      }`}>
                        {kb.name}
                      </span>
                      <span className={styles.knowledgeItemCount}>
                        {kb.count}条
                      </span>
                    </div>
                    <p className={styles.knowledgeItemDescription}>{kb.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* 底部统计信息 */}
          <div className={styles.dropdownFooter}>
            <div className={styles.footerStats}>
              <span>总计知识条目</span>
              <span className={styles.footerStatsValue}>
                {knowledgeBases.reduce((sum, kb) => sum + kb.count, 0).toLocaleString()}条
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default KnowledgeSelector; 