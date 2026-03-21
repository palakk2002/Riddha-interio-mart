import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-deep-espresso/40 mb-3 ml-4">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full px-6 py-4 bg-soft-oatmeal/10 border border-soft-oatmeal/20 rounded-2xl
            focus:ring-4 focus:ring-warm-sand/10 focus:border-warm-sand focus:bg-white outline-none
            transition-all duration-500 placeholder:text-gray-300 font-medium text-sm
            ${error ? 'border-red-500 focus:ring-red-500/10' : ''}
          `}
          {...props}
        />
        <div className="absolute inset-0 rounded-2xl border border-warm-sand opacity-0 group-focus-within:opacity-10 pointer-events-none transition-opacity duration-500"></div>
      </div>
      {error && <p className="mt-2 text-xs text-red-500 ml-4 font-bold">{error}</p>}
    </div>
  );
};

export default Input;
