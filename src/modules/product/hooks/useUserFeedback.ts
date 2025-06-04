import { useState, useEffect } from 'react';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  category: string;
  status: 'pending' | 'reviewed' | 'implemented';
  createdAt: string;
}

export const useUserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        const mockData: Feedback[] = [
          {
            id: '1',
            userId: 'user1',
            userName: '张三',
            content: '希望能增加批量操作功能',
            rating: 4,
            category: '功能建议',
            status: 'pending',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            userId: 'user2',
            userName: '李四',
            content: '界面加载速度有点慢',
            rating: 3,
            category: '性能问题',
            status: 'reviewed',
            createdAt: '2024-01-14'
          }
        ];
        
        setTimeout(() => {
          setFeedbacks(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取用户反馈失败:', error);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const updateFeedbackStatus = (id: string, status: Feedback['status']) => {
    setFeedbacks(prev =>
      prev.map(feedback =>
        feedback.id === id ? { ...feedback, status } : feedback
      )
    );
  };

  return {
    feedbacks,
    loading,
    updateFeedbackStatus
  };
}; 