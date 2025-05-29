import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import CustomerPanel from './components/CustomerPanel';
import Header from './components/Header';

const App: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentDepartment, setCurrentDepartment] = useState('客户成功部');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        currentDepartment={currentDepartment}
        onDepartmentChange={setCurrentDepartment}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧功能栏 */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <Sidebar 
            onCustomerSelect={setSelectedCustomer}
            selectedCustomer={selectedCustomer}
          />
        </div>
        
        {/* 中间对话区域 */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatArea selectedCustomer={selectedCustomer} />
        </div>
        
        {/* 右侧客户信息面板 */}
        <div className="w-96 bg-white border-l border-gray-200 flex-shrink-0">
          <CustomerPanel customer={selectedCustomer} />
        </div>
      </div>
    </div>
  );
};

export default App; 