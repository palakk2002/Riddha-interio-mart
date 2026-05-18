import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
  icon: Icon = FiInbox, 
  title = "No data found", 
  message = "There's nothing to show here right now.", 
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-3xl max-w-2xl mx-auto my-8">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 mb-6">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-black text-gray-900 font-display mb-2">{title}</h3>
      <p className="text-sm text-gray-500 font-medium mb-8 max-w-md">
        {message}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default React.memo(EmptyState);
