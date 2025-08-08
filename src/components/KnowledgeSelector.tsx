import { BarChart3, BookOpen, ChevronDown, Lightbulb, Package, Settings, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 320 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedKnowledgeData = knowledgeBases.find(kb => kb.id === selectedKnowledge) || knowledgeBases[0];
  const Icon = selectedKnowledgeData.icon;

  // 计算下拉菜单位置
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 640;
      const dropdownWidth = isMobile ? 280 : 320;

      // 计算位置
      let left = rect.right - dropdownWidth; // 右对齐
      const top = rect.bottom + 4; // 按钮下方4px

      // 确保不超出左边界
      if (left < 8) {
        left = 8;
      }

      // 确保不超出右边界
      if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8;
      }

      setDropdownPosition({ top, left, width: dropdownWidth });
    }
  }, [isOpen]);

  // 监听窗口大小变化和滚动
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth <= 640;
        const dropdownWidth = isMobile ? 280 : 320;

        let left = rect.right - dropdownWidth;
        const top = rect.bottom + 4;

        if (left < 8) left = 8;
        if (left + dropdownWidth > window.innerWidth - 8) {
          left = window.innerWidth - dropdownWidth - 8;
        }

        setDropdownPosition({ top, left, width: dropdownWidth });
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.knowledgeSelector} ${className || ''}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.selectorButton}
      >
        <Icon className={`${styles.selectorIcon} ${selectedKnowledgeData.color}`} />
        <span className={styles.selectorText}>{selectedKnowledgeData.name}</span>
        <ChevronDown className={`${styles.selectorChevron} ${isOpen ? styles.open : ''}`} />
      </button>

      {/* 使用Portal将下拉菜单渲染到body下，避免被父容器的overflow限制 */}
      {isOpen && createPortal(
        <>
          {/* 遮罩层 */}
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />

          {/* 下拉菜单 */}
          <div
            className={styles.dropdown}
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 99999
            }}
          >
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
                    <KbIcon className={`${styles.knowledgeItemIcon} ${isSelected ? styles.selected : ''
                      }`}
                      style={{ color: isSelected ? '#2563eb' : undefined }}
                    />
                    <div className={styles.knowledgeItemContent}>
                      <div className={styles.knowledgeItemHeader}>
                        <span className={`${styles.knowledgeItemTitle} ${isSelected ? styles.selected : ''
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
        </>,
        document.body
      )}
    </div>
  );
};

export default KnowledgeSelector; 