import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Accepted':
        return 'bg-[#001B4E]/10 text-[#001B4E] border-[#001B4E]/20';
      case 'Picked':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-[#001B4E]/5 text-[#001B4E] border-[#001B4E]/20';
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
