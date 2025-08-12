import { AnimatePresence, motion } from 'framer-motion';
import {
  Code,
  FileText,
  Loader,
  Sparkles,
  X,
  Eye,
  Download,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { IntentResult, PRDContent, recognizeIntent, parsePRDContent } from '../services/intentRecognition';

interface UIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prdContent?: string;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  result?: any;
}

const UIGenerationModal: React.FC<UIGenerationModalProps> = ({
  isOpen,
  onClose,
  prdContent = ''
}) => {
  const [intentResult, setIntentResult] = useState<IntentResult | null>(null);
  const [parsedPRD, setParsedPRD] = useState<PRDContent | null>(null);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 初始化生成步骤
  const initializeSteps = (intent: IntentResult, prd: PRDContent) => {
    const steps: GenerationStep[] = [
      {
        id: 'analysis',
        title: '需求分析',
        description: '分析PRD内容，识别页面结构和功能需求',
        status: 'completed'
      },
      {
        id: 'design',
        title: '设计规划',
        description: '设计组件结构和页面布局',
        status: 'pending'
      },
      {
        id: 'component',
        title: '组件生成',
        description: '生成React组件代码',
        status: 'pending'
      },
      {
        id: 'styling',
        title: '样式美化',
        description: '添加样式和动画效果',
        status: 'pending'
      },
      {
        id: 'integration',
        title: '集成优化',
        description: '优化代码结构和性能',
        status: 'pending'
      }
    ];
    setGenerationSteps(steps);
  };

  // 处理PRD内容
  useEffect(() => {
    if (prdContent && isOpen) {
      const parsed = parsePRDContent(prdContent);
      const intent = recognizeIntent(parsed);
      
      setParsedPRD(parsed);
      setIntentResult(intent);
      
      if (intent.intent === 'ui_generation') {
        initializeSteps(intent, parsed);
      }
    }
  }, [prdContent, isOpen]);

  // 模拟代码生成过程
  const simulateGeneration = async () => {
    setIsGenerating(true);
    setCurrentStep(0);

    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i);
      
      // 更新当前步骤为处理中
      setGenerationSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'processing', progress: 0 } : step
      ));

      // 模拟进度
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, progress } : step
        ));
      }

      // 完成当前步骤
      setGenerationSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed', progress: 100 } : step
      ));

      // 在最后一步生成代码
      if (i === generationSteps.length - 1) {
        const code = generateSampleCode();
        setGeneratedCode(code);
      }
    }

    setIsGenerating(false);
  };

  // 生成示例代码
  const generateSampleCode = () => {
    const componentName = parsedPRD?.title?.replace(/\s+/g, '') || 'GeneratedPage';
    
    return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ${componentName}Props {
  // Add your props here
}

const ${componentName}: React.FC<${componentName}Props> = () => {
  const [loading, setLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            ${parsedPRD?.title || '生成的页面'}
          </h1>
          <p className="text-gray-600 mt-2">
            ${parsedPRD?.description || '根据PRD需求生成的页面'}
          </p>
        </div>
        
        <div className="p-6">
          {/* 根据需求生成的内容 */}
          ${parsedPRD?.requirements?.map(req => `
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">${req}</h3>
          </div>`).join('\n          ') || ''}
          
          {/* 功能区域 */}
          <div className="mt-6 flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setLoading(!loading)}
            >
              {loading ? '处理中...' : '执行操作'}
            </button>
            
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              取消
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ${componentName};`;
  };

  // 复制代码到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // 可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI页面生成器</h2>
                <p className="text-sm text-gray-600">根据PRD智能生成React组件</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* 左侧：需求信息和生成步骤 */}
            <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
              {/* 意图识别结果 */}
              {intentResult && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">识别结果</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 font-medium">
                        {intentResult.intent === 'ui_generation' ? 'UI页面生成' : '其他类型'}
                      </span>
                      <span className="text-blue-600 text-sm">
                        ({Math.round(intentResult.confidence * 100)}% 置信度)
                      </span>
                    </div>
                    {intentResult.metadata && (
                      <div className="text-sm text-blue-700">
                        <p>页面类型: {intentResult.metadata.pageType}</p>
                        {intentResult.metadata.components && (
                          <p>组件: {intentResult.metadata.components.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PRD信息 */}
              {parsedPRD && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">需求信息</h3>
                  <div className="space-y-3">
                    {parsedPRD.title && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700">标题</div>
                        <div className="text-gray-900">{parsedPRD.title}</div>
                      </div>
                    )}
                    
                    {parsedPRD.requirements && parsedPRD.requirements.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">功能需求</div>
                        <ul className="space-y-1">
                          {parsedPRD.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="text-sm text-gray-800 flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                          {parsedPRD.requirements.length > 3 && (
                            <li className="text-sm text-gray-500">
                              ...还有 {parsedPRD.requirements.length - 3} 项需求
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 生成步骤 */}
              {generationSteps.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">生成进度</h3>
                    {!isGenerating && generationSteps[0].status === 'completed' && (
                      <button
                        onClick={simulateGeneration}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        开始生成
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {generationSteps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {step.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {step.status === 'processing' && (
                            <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                          )}
                          {step.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          {step.status === 'pending' && (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{step.title}</div>
                          <div className="text-xs text-gray-600">{step.description}</div>
                          
                          {step.status === 'processing' && step.progress !== undefined && (
                            <div className="mt-1 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${step.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：代码预览 */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">生成的代码</h3>
                {generatedCode && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="复制代码"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="预览">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="下载">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {generatedCode ? (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">React组件</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">点击"开始生成"来创建React组件代码</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UIGenerationModal;