import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, FileText, Layers, Monitor, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const KaleidoscopeAnimation: React.FC = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-6 border border-purple-200/60 backdrop-blur-lg shadow-lg">
      <div className="text-center">
        <h4 className="font-bold text-purple-800 mb-4 flex items-center justify-center drop-shadow-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          万花筒设计转换
        </h4>

        {/* 动画容器 */}
        <div className="relative h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {animationStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600">上传文档</p>
              </motion.div>
            )}

            {animationStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-lg shadow-lg flex items-center justify-center mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </motion.div>
                </div>
                <p className="text-xs text-purple-600">AI 分析中</p>
              </motion.div>
            )}

            {animationStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg shadow-lg flex items-center justify-center mb-2">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-purple-600">生成设计</p>
              </motion.div>
            )}

            {animationStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg shadow-lg flex items-center justify-center mb-2">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.7, 1] }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
                <p className="text-xs text-green-600">精美页面完成</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 进度指示器 */}
          <div className="absolute bottom-0 flex space-x-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  animationStep === step ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-800 mb-2 font-semibold drop-shadow-sm">专业的产品方案可视化设计助手</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-700 font-medium">
            <span className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              多格式支持
            </span>
            <span className="flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              AI 智能设计
            </span>
            <span className="flex items-center">
              <Monitor className="w-3 h-3 mr-1" />
              精美输出
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaleidoscopeAnimation;
