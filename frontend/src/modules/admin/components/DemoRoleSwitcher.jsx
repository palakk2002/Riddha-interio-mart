import React, { useState } from 'react';
import { useRBAC } from '../data/RBACContext';
import { FiRefreshCcw, FiChevronDown, FiUser, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DemoRoleSwitcher = () => {
  const { role, assistants, switchRole } = useRBAC();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (newRole, assistant = null) => {
    if (newRole === 'admin') {
      switchRole('admin');
    } else if (assistant) {
      switchRole('assistant', assistant.permissions);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 shadow-sm hover:shadow-md transition-all group"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
          <FiAlertTriangle size={12} /> Test Mode: {role === 'admin' ? 'Admin' : 'Assistant'}
        </span>
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-soft-oatmeal overflow-hidden z-50 p-2"
            >
              <div className="px-4 py-3 border-b border-soft-oatmeal mb-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Demo Role</h4>
              </div>

              <button 
                onClick={() => handleSwitch('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all mb-1 ${role === 'admin' ? 'bg-deep-espresso text-white shadow-lg' : 'hover:bg-soft-oatmeal/50 text-deep-espresso font-bold'}`}
              >
                <FiShield size={16} /> Super Admin
              </button>

              <div className="h-[1px] bg-soft-oatmeal my-2 mx-2" />
              
              <div className="px-4 py-2">
                <h5 className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Saved Assistants</h5>
              </div>

              <div className="max-h-48 overflow-y-auto no-scrollbar">
                {assistants.map(assistant => (
                  <button 
                    key={assistant.id}
                    onClick={() => handleSwitch('assistant', assistant)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs hover:bg-purple-50 text-deep-espresso font-bold transition-all mb-1 text-left"
                  >
                    <FiUser size={14} className="text-warm-sand" />
                    <div>
                      <p className="leading-tight">{assistant.name}</p>
                      <p className="text-[8px] text-warm-sand font-normal">Custom Permissions</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-2 p-3 bg-amber-50/50 rounded-2xl">
                <p className="text-[8px] text-amber-700 font-bold text-center leading-relaxed">
                  Use this toggle to simulate different roles and verify RBAC restrictions in real-time.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoRoleSwitcher;
