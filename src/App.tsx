import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModuleManager from './components/ModuleManager';
import { Customer } from './types/customer';
import './styles/sunshine-theme.css';

const App: React.FC = () => {
  // 从localStorage恢复状态，如果没有则使用默认值
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('kc-selectedCustomer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [currentDepartment, setCurrentDepartment] = useState(() => {
    try {
      const saved = localStorage.getItem('kc-currentDepartment');
      return saved || '客户成功部';
    } catch {
      return '客户成功部';
    }
  });
  
  const [customerSuccessMode, setCustomerSuccessMode] = useState<'normal' | 'assessment'>(() => {
    try {
      const saved = localStorage.getItem('kc-customerSuccessMode');
      return (saved as 'normal' | 'assessment') || 'normal';
    } catch {
      return 'normal';
    }
  });

  // 保存状态到localStorage
  useEffect(() => {
    if (selectedCustomer) {
      localStorage.setItem('kc-selectedCustomer', JSON.stringify(selectedCustomer));
    } else {
      localStorage.removeItem('kc-selectedCustomer');
    }
  }, [selectedCustomer]);

  useEffect(() => {
    localStorage.setItem('kc-currentDepartment', currentDepartment);
  }, [currentDepartment]);

  useEffect(() => {
    localStorage.setItem('kc-customerSuccessMode', customerSuccessMode);
  }, [customerSuccessMode]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        currentDepartment={currentDepartment}
        onDepartmentChange={setCurrentDepartment}
        customerSuccessMode={customerSuccessMode}
        onCustomerSuccessModeChange={setCustomerSuccessMode}
      />
      <ModuleManager
        currentDepartment={currentDepartment}
        onCustomerSelect={setSelectedCustomer}
        selectedCustomer={selectedCustomer}
        customerSuccessMode={customerSuccessMode}
      />
    </div>
  );
};

export default App; 