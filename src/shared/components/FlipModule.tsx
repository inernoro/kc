import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ModuleConfig } from '../../types';

const FlipModule: React.FC<{
  position: 'left' | 'center' | 'right';
  currentModule: ModuleConfig | null;
  previousModule: ModuleConfig | null;
  getModuleProps: (moduleId: string) => any;
  isFlipping: boolean;
}> = ({ position, currentModule, previousModule, getModuleProps, isFlipping }) => {
  const getContainerClass = () => {
    switch (position) {
      case 'left':
        return 'bg-gradient-to-br from-white to-gray-50/30 border-r border-gray-200/60 shadow-sm h-full overflow-hidden min-h-full backdrop-blur-sm';
      case 'center':
        return 'flex flex-col min-w-0 h-full bg-gray-50 px-4 min-h-full';
      case 'right':
        return 'bg-gradient-to-br from-white to-gray-50/30 border-l border-gray-200/60 shadow-sm h-full overflow-hidden min-h-full backdrop-blur-sm';
      default:
        return '';
    }
  };

  // 简单的淡入淡出 + 缩放特效 - 统一且稳定，快速切换
  const flipVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 10,
    },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
        opacity: { duration: 0.12 },
        scale: { duration: 0.15 },
        y: { duration: 0.15 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.1,
        ease: [0.4, 0.0, 0.6, 1] as any,
        opacity: { duration: 0.08 },
        scale: { duration: 0.1 },
        y: { duration: 0.1 }
      }
    }
  };

  // 翻转中的3D效果
  const flippingVariants = {
    initial: {
      rotateY: 0,
      scale: 1
    },
    flip: {
      rotateY: [0, -45, -90, -135, -180],
      rotateX: [0, 5, 10, 5, 0],
      scale: [1, 0.9, 0.8, 0.9, 1],
      transition: {
        duration: 1.2,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <div className={getContainerClass()}>
      <AnimatePresence>
        {currentModule && (
          <motion.div
            key={`${currentModule.id}-${position}`}
            className="w-full h-full relative min-h-full"
            variants={flipVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{
              minHeight: '100%',
              height: '100%'
            }}
          >
            {/* 简单的内容容器 */}
            <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm">
              {React.createElement(currentModule.component, {
                ...getModuleProps(currentModule.id)
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlipModule;
