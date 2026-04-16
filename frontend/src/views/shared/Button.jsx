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
    primary: 'bg-deep-espresso text-white hover:bg-warm-sand hover:shadow-2xl hover:shadow-deep-espresso/20 focus:ring-deep-espresso/20',
    secondary: 'bg-warm-sand text-white hover:bg-deep-espresso hover:shadow-2xl hover:shadow-warm-sand/20 focus:ring-warm-sand/20 font-black',
    outline: 'border-2 border-deep-espresso/20 text-deep-espresso hover:border-deep-espresso hover:bg-deep-espresso hover:text-white focus:ring-deep-espresso/10',
    ghost: 'text-deep-espresso hover:bg-soft-oatmeal/50 focus:ring-soft-oatmeal/20',
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
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;
