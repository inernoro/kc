import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import UIGenerationModal from './UIGenerationModal';
import { recognizeIntent } from '../services/intentRecognition';

interface PRDUploaderProps {
  onIntentRecognized?: (intent: any, content: string) => void;
}

const PRDUploader: React.FC<PRDUploaderProps> = ({ onIntentRecognized }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [intentResult, setIntentResult] = useState<any>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f => f.type === 'text/plain' || f.name.endsWith('.md') || f.name.endsWith('.txt'));
    
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const content = await file.text();
      setFileContent(content);
      
      // 进行意图识别
      const intent = recognizeIntent(content);
      setIntentResult(intent);
      
      // 如果识别为UI生成，自动弹出窗体
      if (intent.intent === 'ui_generation' && intent.confidence > 0.6) {
        setShowModal(true);
      }

      onIntentRecognized?.(intent, content);
    } catch (error) {
      console.error('文件读取失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileContent('');
    setIntentResult(null);
    setShowModal(false);
  };

  const handleManualGenerate = () => {
    if (fileContent) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">PRD文件上传</h3>
          {uploadedFile && (
            <button
              onClick={clearFile}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!uploadedFile ? (
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              拖拽PRD文件到这里
            </p>
            <p className="text-gray-600 mb-4">
              或者点击选择文件
            </p>
            <input
              type="file"
              accept=".txt,.md,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="prd-upload"
            />
            <label
              htmlFor="prd-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2" />
              选择文件
            </label>
            <p className="text-xs text-gray-500 mt-4">
              支持 .txt, .md, .doc, .docx 格式
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* 文件信息 */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                <p className="text-sm text-gray-600">
                  {Math.round(uploadedFile.size / 1024)} KB • {new Date(uploadedFile.lastModified).toLocaleString()}
                </p>
              </div>
              {isProcessing && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  <span className="text-sm">处理中...</span>
                </div>
              )}
            </div>

            {/* 意图识别结果 */}
            {intentResult && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {intentResult.intent === 'ui_generation' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      意图识别结果
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">识别类型:</span>
                        <span className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${intentResult.intent === 'ui_generation' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        `}>
                          {intentResult.intent === 'ui_generation' ? 'UI页面生成' : '其他类型'}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({Math.round(intentResult.confidence * 100)}% 置信度)
                        </span>
                      </div>

                      {intentResult.metadata && (
                        <div className="text-sm text-gray-700">
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {intentResult.metadata.pageType && (
                              <div>
                                <span className="font-medium">页面类型:</span> {intentResult.metadata.pageType}
                              </div>
                            )}
                            {intentResult.metadata.components && intentResult.metadata.components.length > 0 && (
                              <div>
                                <span className="font-medium">组件:</span> {intentResult.metadata.components.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {intentResult.intent === 'ui_generation' && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={handleManualGenerate}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          生成页面
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 文件内容预览 */}
            {fileContent && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">文件内容预览</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {fileContent.length > 500 ? `${fileContent.substring(0, 500)}...` : fileContent}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* UI生成模态框 */}
      <UIGenerationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        prdContent={fileContent}
      />
    </>
  );
};

export default PRDUploader;