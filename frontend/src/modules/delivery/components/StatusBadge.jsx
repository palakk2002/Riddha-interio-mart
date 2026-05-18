import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Accepted':
        return 'bg-slate-800 text-white border-slate-800';
      case 'Picked':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Out for Delivery':
        return 'bg-teal-50 text-[#189D91] border-teal-100';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected':
        return 'bg-slate-100 text-slate-400 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
