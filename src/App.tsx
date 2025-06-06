import React, { useState } from 'react';
import Header from './components/Header';
import ModuleManager from './components/ModuleManager';
import './styles/sunshine-theme.css';

const App: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentDepartment, setCurrentDepartment] = useState('客户成功部');
  const [customerSuccessMode, setCustomerSuccessMode] = useState<'normal' | 'assessment'>('normal');

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