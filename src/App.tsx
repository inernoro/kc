import React, { useState } from 'react';
import Header from './components/Header';
import ModuleManager from './components/ModuleManager';

const App: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentDepartment, setCurrentDepartment] = useState('客户成功部');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        currentDepartment={currentDepartment}
        onDepartmentChange={setCurrentDepartment}
      />
      <ModuleManager
        currentDepartment={currentDepartment}
        onCustomerSelect={setSelectedCustomer}
        selectedCustomer={selectedCustomer}
      />
    </div>
  );
};

export default App; 