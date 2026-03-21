import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LuMenu, LuBell, LuUser } from 'react-icons/lu';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#FDFBF9] text-deep-espresso overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm border-b border-soft-oatmeal px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-soft-oatmeal rounded-lg"
            >
              <LuMenu size={24} />
            </button>
            <h2 className="text-sm font-medium text-warm-sand hidden sm:block">
              Welcome back, <span className="font-bold text-deep-espresso">Admin!</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-dusty-cocoa hover:bg-soft-oatmeal rounded-full transition-colors relative">
              <LuBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-soft-oatmeal mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight">Alex Johnson</p>
                <p className="text-xs text-warm-sand">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dusty-cocoa flex items-center justify-center text-white ring-2 ring-white shadow-sm group-hover:ring-warm-sand transition-all">
                <LuUser size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
