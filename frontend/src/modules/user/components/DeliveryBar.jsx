import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

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

  return (
    <div className="bg-white border-b border-gray-100 py-2 px-5 flex items-center relative z-40">
      <div className="flex flex-col items-start">
        <span className="text-[12px] font-bold text-[#1a1a1a] leading-tight flex items-center gap-1.5">
          Delivery in <span className="text-[#922724]">4 hours</span>
        </span>
        <button className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold mt-0.5 group">
          to {pincode || '452018'}
          <FiChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#922724] transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryBar;
