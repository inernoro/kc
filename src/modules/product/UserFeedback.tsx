import React from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const UserFeedback: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">用户反馈</h3>
        <p className="text-sm text-gray-500">收集和分析用户意见和建议</p>
      </div>
    </div>
  );
};

export default UserFeedback; 