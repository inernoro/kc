import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Download, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PRDPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title?: string;
}

const PRDPreview: React.FC<PRDPreviewProps> = ({ isOpen, onClose, content, title = "产品需求文档预览" }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [kaleidoscopeRotation, setKaleidoscopeRotation] = useState(0);
  const [designProgress, setDesignProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 万花筒旋转动画
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setKaleidoscopeRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isOpen]);

  // 启动演变动画
  useEffect(() => {
    if (!isOpen) return;
    
    const startAnimation = () => {
      setIsPlaying(true);
      setAnimationStep(0);
      setDesignProgress(0);
      
      setTimeout(() => {
        setAnimationStep(1);
        
        const prdAnalysisTimer = setTimeout(() => {
          setDesignProgress(20);
          
          setTimeout(() => {
            setAnimationStep(2);
            
            let progress = 20;
            const wireframeInterval = setInterval(() => {
              progress += 3;
              setDesignProgress(progress);
              
              if (progress >= 50) {
                clearInterval(wireframeInterval);
                
                setTimeout(() => {
                  setAnimationStep(3);
                  
                  const visualInterval = setInterval(() => {
                    progress += 3;
                    setDesignProgress(progress);
                    
                    if (progress >= 100) {
                      clearInterval(visualInterval);
                      setIsPlaying(false);
                    }
                  }, 100);
                }, 500);
              }
            }, 100);
          }, 1000);
        }, 2000);
      }, 1000);
    };

    const timer = setTimeout(startAnimation, 500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // 重置动画
  const resetAnimation = () => {
    setIsPlaying(false);
    setAnimationStep(0);
    setDesignProgress(0);
    
    setTimeout(() => {
      setIsPlaying(true);
      setAnimationStep(0);
      setDesignProgress(0);
      
      setTimeout(() => {
        setAnimationStep(1);
        
        const prdAnalysisTimer = setTimeout(() => {
          setDesignProgress(20);
          
          setTimeout(() => {
            setAnimationStep(2);
            
            let progress = 20;
            const wireframeInterval = setInterval(() => {
              progress += 3;
              setDesignProgress(progress);
              
              if (progress >= 50) {
                clearInterval(wireframeInterval);
                
                setTimeout(() => {
                  setAnimationStep(3);
                  
                  const visualInterval = setInterval(() => {
                    progress += 3;
                    setDesignProgress(progress);
                    
                    if (progress >= 100) {
                      clearInterval(visualInterval);
                      setIsPlaying(false);
                    }
                  }, 100);
                }, 500);
              }
            }, 100);
          }, 1000);
        }, 2000);
      }, 1000);
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 bg-white rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <p className="text-purple-100 text-sm">AI生成的产品方案可视化</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <motion.div
                      animate={{ rotate: kaleidoscopeRotation * 2 }}
                      className="mr-2"
                    >
                      <Eye className="w-5 h-5 text-purple-600" />
                    </motion.div>
                    AI设计生成过程
                  </h2>
                  
                  <div className="flex items-center space-x-4">
                    {[
                      { step: 1, label: 'PRD分析', active: animationStep >= 1 },
                      { step: 2, label: '线框生成', active: animationStep >= 2 },
                      { step: 3, label: '视觉设计', active: animationStep >= 3 }
                    ].map((item) => (
                      <motion.div
                        key={item.step}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                          item.active 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                        animate={{
                          scale: item.active ? 1.05 : 1,
                          backgroundColor: item.active ? '#f3e8ff' : '#f3f4f6'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className={`w-2 h-2 rounded-full ${
                            item.active ? 'bg-purple-500' : 'bg-gray-400'
                          }`}
                          animate={{
                            scale: item.active ? [1, 1.3, 1] : 1
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: item.active ? Infinity : 0
                          }}
                        />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  onClick={resetAnimation}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full grid grid-cols-2 gap-0">
                <motion.div 
                  className="bg-gray-50 p-8 border-r border-gray-200 overflow-y-auto"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="max-w-2xl">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-6 flex items-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      产品需求文档 (PRD)
                    </motion.h3>
                    
                    <motion.div
                      className={`p-6 rounded-lg border transition-all duration-500 ${
                        animationStep >= 1
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-white border-gray-200'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: animationStep >= 1 ? 1.02 : 1
                      }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="markdown-content">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">{children}</h3>,
                            p: ({children}) => <p className="text-sm text-gray-700 leading-relaxed mb-3">{children}</p>,
                            ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-3 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside text-sm text-gray-700 mb-3 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="ml-2">{children}</li>,
                            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                            pre: ({children}) => <pre className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto mb-3">{children}</pre>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 text-gray-700 mb-3">{children}</blockquote>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      </div>
                      
                      {animationStep >= 1 && (
                        <motion.div
                          className="mt-4 flex items-center space-x-2 text-blue-600 pt-3 border-t border-blue-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="text-xs font-medium">AI正在分析文档内容...</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white p-8 overflow-y-auto"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 mb-6 flex items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      animate={{ rotate: kaleidoscopeRotation }}
                      className="mr-3"
                    >
                      ✨
                    </motion.div>
                    设计生成过程
                  </motion.h3>
                  
                  <div className="relative h-[500px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden group">
                    {animationStep < 2 && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <motion.div
                            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <h4 className="text-lg font-medium text-gray-700 mb-2">
                            {animationStep === 0 ? "准备开始..." : "分析PRD内容..."}
                          </h4>
                          <p className="text-sm text-gray-500">AI正在理解您的产品需求</p>
                        </div>
                      </motion.div>
                    )}

                    {animationStep >= 2 && (
                      <motion.div
                        className="absolute inset-0 p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-full h-full border-2 border-gray-400 rounded-lg relative bg-white">
                          <motion.div
                            className="h-10 border-b border-gray-300 bg-gray-50 flex items-center px-3"
                            initial={{ width: 0 }}
                            animate={{ width: designProgress >= 25 ? '100%' : 0 }}
                            transition={{ duration: 0.8 }}
                          />
                          
                          <div className="p-3 space-y-2">
                            <motion.div
                              className="h-8 border border-gray-300 rounded"
                              initial={{ width: 0 }}
                              animate={{ width: designProgress >= 35 ? '100%' : 0 }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                            />
                            
                            <div className="space-y-1 pt-1">
                              {[0, 1, 2, 3, 4].map((index) => (
                                <motion.div
                                  key={index}
                                  className="h-10 border border-gray-200 rounded"
                                  initial={{ scale: 0, x: -10 }}
                                  animate={{ 
                                    scale: designProgress >= 44 + index ? 1 : 0,
                                    x: designProgress >= 44 + index ? 0 : -10
                                  }}
                                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {animationStep >= 3 && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ 
                          opacity: designProgress >= 60 ? 1 : 0,
                          scale: designProgress >= 60 ? 1 : 1.05
                        }}
                        transition={{ 
                          duration: 2, 
                          ease: "easeOut",
                          opacity: { delay: 0.5 }
                        }}
                      >
                        <div className="w-full h-full rounded-lg overflow-hidden relative bg-white">
                          <motion.div
                            className="h-10 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-3"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ 
                              y: designProgress >= 65 ? 0 : -50,
                              opacity: designProgress >= 65 ? 1 : 0
                            }}
                            transition={{ duration: 0.8 }}
                          >
                            <span className="text-white font-medium text-sm">万花筒查询系统</span>
                          </motion.div>
                          
                          <div className="p-3 bg-gray-50 space-y-2">
                            <motion.div
                              className="h-8 bg-white border border-gray-200 rounded flex items-center px-2 shadow-sm"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: designProgress >= 70 ? 1 : 0,
                                opacity: designProgress >= 70 ? 1 : 0
                              }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            >
                              <span className="text-gray-500 text-xs">搜索产品、功能或服务...</span>
                            </motion.div>
                            
                            <div className="space-y-1 pt-1">
                              {[
                                { title: '万花筒视觉设计系统', desc: '基于AI的现代化设计方案生成平台', icon: '🎨' },
                                { title: '智能查询搜索引擎', desc: '支持多条件筛选的高效检索系统', icon: '🔍' },
                                { title: '用户体验优化方案', desc: '提升产品交互体验的综合解决方案', icon: '💡' },
                                { title: '数据分析报表系统', desc: '多维度数据可视化分析平台', icon: '📊' },
                                { title: '移动端适配优化', desc: '响应式设计与移动端体验优化', icon: '📱' }
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  className="bg-white border border-gray-200 rounded p-2 hover:shadow-sm transition-all cursor-pointer"
                                  initial={{ scale: 0, x: -10 }}
                                  animate={{ 
                                    scale: designProgress >= 76 + index ? 1 : 0,
                                    x: designProgress >= 76 + index ? 0 : -10
                                  }}
                                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                >
                                  <div className="flex items-center space-x-2 text-xs">
                                    <span>{item.icon}</span>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                                      <p className="text-gray-500">{item.desc}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="absolute bottom-3 left-3 right-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2 }}
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {animationStep === 1 ? "分析PRD内容" : 
                             animationStep === 2 ? "生成线框图" : 
                             animationStep >= 3 ? "生成视觉设计" : "准备开始"}
                          </span>
                          <motion.span 
                            className="text-sm font-bold text-indigo-600 min-w-[3rem] text-right"
                            key={designProgress}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {Math.min(Math.round(designProgress), 100)}%
                          </motion.span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(designProgress, 100)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PRDPreview;