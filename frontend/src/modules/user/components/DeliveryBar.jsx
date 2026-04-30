import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

import { getDeliveryEstimate } from '../../../shared/utils/delivery';

const DeliveryBar = () => {
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const updatePincode = () => {
      const savedPincode = localStorage.getItem('userPincode');
      if (savedPincode) {
        setPincode(savedPincode === 'default' ? '452018' : savedPincode);
      }
    };

    updatePincode();
    // Listen for storage changes in the same tab
    window.addEventListener('storage', updatePincode);
    
    // Custom event to handle updates within the session
    const handlePincodeUpdate = () => updatePincode();
    window.addEventListener('pincodeUpdated', handlePincodeUpdate);

    return () => {
      window.removeEventListener('storage', updatePincode);
      window.removeEventListener('pincodeUpdated', handlePincodeUpdate);
    };
  }, []);

  const estimate = getDeliveryEstimate(pincode || '452018');

  return (
    <div className="bg-white border-b border-gray-100 py-2 px-5 flex items-center justify-between relative z-40 md:hidden">
      <div className="flex flex-col items-start">
        <span className="text-[12px] font-bold text-[#1a1a1a] leading-tight flex items-center gap-1.5">
          Delivery in <span className="text-[#D4A017]">{estimate.time}</span>
        </span>
        <button className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold mt-0.5 group">
          to <span className="text-[#D4A017]">{pincode || '452018'}</span>
          <FiChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#D4A017] transition-colors" />
        </button>
      </div>

      <button className="flex items-center gap-1.5 bg-[#189D91] text-white px-3 py-1.5 rounded-lg hover:bg-[#14847a] transition-all duration-300 shadow-sm active:scale-95 group">
        <span className="text-[10px] font-bold uppercase tracking-wider">Bulk Order</span>
        <svg className="w-3 h-3 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default DeliveryBar;
