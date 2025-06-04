import { useState, useEffect } from 'react';

interface RenewalAlert {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  renewalDate: string;
  daysLeft: number;
  value: number;
  probability: number;
  status: 'urgent' | 'warning' | 'normal';
}

export const useRenewalTracking = () => {
  const [renewalAlerts, setRenewalAlerts] = useState<RenewalAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewalData = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        const mockData: RenewalAlert[] = [
          {
            id: '1',
            customerId: '1',
            customerName: '张明华',
            company: '明华酒业有限公司',
            renewalDate: '2024-03-15',
            daysLeft: 45,
            value: 250000,
            probability: 85,
            status: 'urgent'
          },
          {
            id: '2',
            customerId: '2',
            customerName: '李建国',
            company: '建国贸易集团',
            renewalDate: '2024-02-28',
            daysLeft: 28,
            value: 180000,
            probability: 70,
            status: 'warning'
          }
        ];
        
        setTimeout(() => {
          setRenewalAlerts(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取续约数据失败:', error);
        setLoading(false);
      }
    };

    fetchRenewalData();
  }, []);

  const updateRenewalProbability = (id: string, probability: number) => {
    setRenewalAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, probability } : alert
      )
    );
  };

  const markAsCompleted = (id: string) => {
    setRenewalAlerts(prev =>
      prev.filter(alert => alert.id !== id)
    );
  };

  return {
    renewalAlerts,
    loading,
    updateRenewalProbability,
    markAsCompleted
  };
}; 