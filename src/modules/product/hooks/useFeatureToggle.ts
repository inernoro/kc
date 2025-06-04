import { useState, useEffect } from 'react';

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export const useFeatureToggle = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        const mockData: FeatureFlag[] = [
          {
            id: 'ai-recommendations',
            name: 'AI推荐系统',
            enabled: true,
            description: '基于机器学习的个性化推荐'
          },
          {
            id: 'dark-mode',
            name: '深色模式',
            enabled: false,
            description: '界面深色主题支持'
          }
        ];
        
        setTimeout(() => {
          setFeatures(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取功能开关失败:', error);
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const toggleFeature = (id: string) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
      )
    );
  };

  return {
    features,
    loading,
    toggleFeature
  };
}; 