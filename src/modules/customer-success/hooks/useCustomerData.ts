import { useState, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'potential' | 'inactive';
  lastContact: string;
  value: number;
  level: number;
  priority: 'high' | 'medium' | 'low';
  phone: string;
  email: string;
  tags: string[];
  renewalDate?: string;
  satisfactionScore?: number;
}

export const useCustomerData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 模拟API调用
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // 这里会替换为实际的API调用
        const mockData: Customer[] = [
          {
            id: '1',
            name: '张明华',
            company: '明华酒业有限公司',
            status: 'active',
            lastContact: '2024-01-15',
            value: 250000,
            level: 5,
            priority: 'high',
            phone: '138-8888-8888',
            email: 'zhang@minghua.com',
            tags: ['VIP客户', '高端白酒'],
            renewalDate: '2024-03-15',
            satisfactionScore: 4.8
          },
          // 更多客户数据...
        ];
        
        setTimeout(() => {
          setCustomers(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('获取客户数据失败');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      )
    );
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  return {
    customers,
    loading,
    error,
    updateCustomer,
    addCustomer,
    deleteCustomer
  };
}; 