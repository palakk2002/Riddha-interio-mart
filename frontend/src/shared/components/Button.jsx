import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-500 rounded-full focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group';
  
  const variants = {
    primary: 'bg-[#189D91] text-white hover:bg-[#14847a] hover:shadow-lg focus:ring-[#189D91]/20',
    secondary: 'bg-warm-sand text-white hover:bg-[#189D91] hover:shadow-lg focus:ring-[#189D91]/20 font-black',
    outline: 'border-2 border-[#189D91]/20 text-[#189D91] hover:border-[#189D91] hover:bg-[#189D91] hover:text-white focus:ring-[#189D91]/10',
    ghost: 'text-[#189D91] hover:bg-[#189D91]/5 focus:ring-[#189D91]/10',
  };

  const sizes = {
    sm: 'px-6 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-12 py-5 text-sm',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
    </motion.button>
  );
};

export default React.memo(Button);
