import React, { useState, useEffect } from 'react';
import { FiMapPin, FiTruck, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PincodeModal = ({ onComplete }) => {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isServiceable, setIsServiceable] = useState(null);

  // Mock serviceable pincodes
  const serviceablePincodes = ['560001', '600001', '500001', '641001', '570001', '506001', '452018'];

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    setError('');
    setIsServiceable(null);
  };

  const checkServiceability = () => {
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    if (serviceablePincodes.includes(pincode)) {
      setIsServiceable(true);
      localStorage.setItem('userPincode', pincode);
      window.dispatchEvent(new Event('pincodeUpdated'));
      setTimeout(() => onComplete(), 1000);
    } else {
      setIsServiceable(false);
      setError('Oops! Your pincode is not serviceable');
    }
  };

  const handleDefaultPincode = () => {
    localStorage.setItem('userPincode', 'default');
    window.dispatchEvent(new Event('pincodeUpdated'));
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[28px] w-full max-w-[360px] overflow-hidden shadow-2xl relative"
      >
        {/* Header Section with Illustration */}
        <div className="bg-gradient-to-br from-[#F0F9F8] to-[#E2F2F1] p-5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 w-20 h-20 bg-[#189D91]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 bg-[#189D91]/5 rounded-full blur-3xl"></div>
            
            <motion.div 
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-32 h-20 mb-4 flex items-center justify-center"
            >
                <svg viewBox="0 0 100 60" className="w-full h-full text-[#189D91]">
                    <path fill="currentColor" opacity="0.1" d="M10,45 L90,45 L85,55 L15,55 Z" />
                    <rect x="25" y="15" width="45" height="25" rx="3" fill="currentColor" />
                    <path d="M70,25 L85,25 L85,40 L70,40 Z" fill="currentColor" opacity="0.8" />
                    <circle cx="35" cy="45" r="4" fill="#333" />
                    <circle cx="75" cy="45" r="4" fill="#333" />
                    <rect x="80" y="28" width="10" height="3" rx="1" fill="#fff" opacity="0.3" />
                </svg>
            </motion.div>

            <p className="text-[10px] font-black text-[#189D91] uppercase tracking-[0.2em] mb-1 opacity-80">Introducing</p>
            <h2 className="text-xl font-display font-bold text-[#189D91] leading-tight mb-2">
                Express Delivery in 4 Hours
            </h2>
            <p className="text-[11px] text-gray-500 max-w-[240px] font-medium leading-normal">
                Order before <span className="font-bold">5 PM</span> for <span className="text-[#189D91] font-bold text-[12px]">4 hour delivery*</span>
                <br />
                <span className="text-[9px] opacity-60">*On select pincodes & products</span>
            </p>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5">
            <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2">
                    <span className="h-[1px] w-6 bg-gray-100"></span>
                    Now serving in
                    <span className="h-[1px] w-6 bg-gray-100"></span>
                </p>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] text-gray-600 font-bold tracking-tight">
                    <span>Bengaluru</span>
                    <span className="text-gray-200">|</span>
                    <span>Chennai</span>
                    <span className="text-gray-200">|</span>
                    <span>Hyderabad</span>
                    <span className="text-gray-200">|</span>
                    <span>Mysore</span>
                    <span className="text-gray-200">|</span>
                    <span>Warangal</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className={`relative flex items-center border-2 rounded-[20px] p-4 transition-all duration-300 group ${error ? 'border-red-500 bg-red-50/50' : 'border-gray-50 bg-gray-50/50 focus-within:border-[#189D91] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#189D91]/5'}`}>
                    <FiMapPin className={`w-5 h-5 mr-3 transition-all duration-300 ${error ? 'text-red-500' : 'text-gray-300 group-focus-within:text-[#189D91]'}`} />
                    <input
                        type="text"
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={handlePincodeChange}
                        className="w-full outline-none bg-transparent text-lg font-bold tracking-[0.15em] placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-400"
                        maxLength={6}
                    />
                    <AnimatePresence>
                        {pincode.length === 6 && !isServiceable && (
                            <motion.button 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={checkServiceability}
                                className="bg-[#189D91] text-white p-2 rounded-xl hover:bg-[#127F75] transition-colors shadow-md"
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-center"
                        >
                            <p className="text-[12px] font-bold text-red-500 mb-2">{error}</p>
                        </motion.div>
                    )}

                    {isServiceable && (
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-1"
                        >
                            <p className="text-[12px] font-black text-green-600 flex items-center justify-center gap-2">
                                <FiTruck className="w-4 h-4 animate-bounce" /> FAST DELIVERY AVAILABLE
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center">
                    <button 
                        onClick={handleDefaultPincode}
                        className="text-[#189D91] text-[12px] font-bold underline underline-offset-4 hover:text-[#127F75] transition-all"
                    >
                        Continue With Default Pincode
                    </button>
                </div>

                <button
                    onClick={checkServiceability}
                    disabled={pincode.length !== 6 && !isServiceable}
                    className={`w-full py-4 rounded-[20px] text-[16px] font-black tracking-wide transition-all duration-300 transform active:scale-[0.98] mt-1 ${
                        pincode.length === 6 || isServiceable
                        ? 'bg-[#189D91] text-white hover:bg-[#127F75] shadow-xl shadow-[#189D91]/20' 
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                >
                    CONTINUE SHOPPING
                </button>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PincodeModal;
