import React, { useState, useEffect } from 'react';
import { FiZap } from 'react-icons/fi';
import { getDeliveryEstimate } from '../../../shared/utils/delivery';

const ExpressDeliveryBanner = () => {
  const [pincode, setPincode] = useState(localStorage.getItem('userPincode') || '452018');

  useEffect(() => {
    const updatePincode = () => {
      const savedPincode = localStorage.getItem('userPincode');
      if (savedPincode) {
        setPincode(savedPincode === 'default' ? '452018' : savedPincode);
      }
    };

    window.addEventListener('storage', updatePincode);
    window.addEventListener('pincodeUpdated', updatePincode);

    return () => {
      window.removeEventListener('storage', updatePincode);
      window.removeEventListener('pincodeUpdated', updatePincode);
    };
  }, []);

  const estimate = getDeliveryEstimate(pincode);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-1">
      <div
        className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#F0F9F8] to-[#FDFBF9] border border-[#E2F2F1] p-3 md:p-6 flex items-center justify-between gap-4 md:gap-8"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#189D91]/5 rounded-full blur-2xl"></div>

        {/* Text Content */}
        <div className="relative z-10 space-y-1.5 flex-1 pl-1 md:pl-2">
          <div className="flex items-center gap-2">
            <div className="bg-[#189D91] p-1.5 rounded-lg text-white shadow-md shadow-[#189D91]/10 text-sm md:text-lg">
              <FiZap />
            </div>
            <h2 className="text-[15px] md:text-3xl font-display font-bold text-[#189D91] tracking-tight leading-none">
              Express Delivery in <span className="underline decoration-wavy decoration-[#D4A017]/40 underline-offset-4 text-[#D4A017]">{estimate.time}</span>
            </h2>
          </div>

          <div className="space-y-0.5">
            <p className="text-[#189D91]/80 text-[11px] md:text-lg font-semibold leading-tight">
              Order before <span className="text-[#189D91] font-bold">6 PM</span> for <span className="text-[#D4A017] font-bold">{estimate.time} delivery*</span>
            </p>
            <p className="text-[#189D91]/40 text-[9px] md:text-sm font-medium tracking-tight">
              *On select products & locations
            </p>
          </div>
        </div>

        {/* Illustration Section - Compact */}
        <div className="relative z-10 flex-shrink-0 pr-1 md:pr-4">
          <div className="relative flex items-center justify-center">
            {/* Clock - Smaller */}
            <div
              className="absolute -top-3 -right-1 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-[3px] border-[#F0F9F8]"
            >
              <svg viewBox="0 0 100 100" className="w-7 h-7 md:w-11 md:h-11 text-[#D4A017]">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 50 L50 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M50 50 L70 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
              </svg>
            </div>

            {/* Truck - Smaller */}
            <div
              className="relative"
            >
              <svg viewBox="0 0 160 100" className="w-24 min-[400px]:w-32 md:w-56 drop-shadow-xl">
                <ellipse cx="80" cy="85" rx="70" ry="10" fill="black" opacity="0.05" />
                <path d="M20 20 H110 V75 H20 Z" fill="#189D91" />
                <path d="M110 35 H150 L150 75 H110 Z" fill="#127F75" />
                <path d="M115 40 H140 L135 60 H115 Z" fill="#fff" opacity="0.2" />
                <text x="35" y="55" fill="white" fontSize="12" fontWeight="bold" opacity="0.3">EXPRESS</text>
                <circle cx="45" cy="80" r="12" fill="#333" />
                <circle cx="125" cy="80" r="12" fill="#333" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpressDeliveryBanner;
