import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Picked':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
