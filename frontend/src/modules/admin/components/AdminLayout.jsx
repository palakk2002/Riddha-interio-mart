import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUser } from '../../user/data/UserContext';
import { FiMenu, FiBell, FiUser, FiLogOut, FiChevronDown, FiShield } from 'react-icons/fi';
import AdminNotifications from './AdminNotifications';
import { RBACProvider, useRBAC } from '../data/RBACContext';
import DemoRoleSwitcher from './DemoRoleSwitcher';

const AdminLayoutContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout, user } = useUser();
  const { role } = useRBAC();
  const navigate = useNavigate();
  const hasValidAdminSession = Boolean(user?.token) && user?.role === 'admin';

  useEffect(() => {
    if (!hasValidAdminSession) {
      navigate('/admin/login', { replace: true });
    }
  }, [hasValidAdminSession, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!hasValidAdminSession) {
    return null;
  }

  return (
    <div 
      className="flex h-screen w-full bg-white text-deep-espresso overflow-hidden admin-theme"
      onClick={() => {
        setShowUserMenu(false);
        setShowNotifications(false);
      }}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AdminNotifications token={user?.token} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white shadow-sm border-b border-soft-oatmeal px-4 md:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              className="lg:hidden p-2 hover:bg-soft-oatmeal rounded-lg"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-sm font-medium text-warm-sand hidden sm:block">
              Welcome back, <span className="font-bold text-deep-espresso">Admin!</span>
            </h2>
            
            {/* Demo Mode Switcher */}
            <div className="hidden lg:block ml-4">
              <DemoRoleSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-soft-oatmeal text-deep-espresso' : 'text-dusty-cocoa hover:bg-soft-oatmeal'}`}
              >
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#240046] rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal overflow-hidden z-50">
                  <div className="p-4 border-b border-soft-oatmeal flex items-center justify-between bg-soft-oatmeal/10">
                    <h3 className="font-bold text-sm">Admin Alerts</h3>
                  </div>
                  <div className="p-4 text-center text-xs text-warm-sand">No new alerts</div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-[1px] bg-soft-oatmeal mx-2"></div>
            
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                className="flex items-center gap-3 cursor-pointer group focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-tight group-hover:text-[#240046] transition-colors uppercase tracking-tight">{user?.fullName || user?.name || 'Admin'}</p>
                  <div className="flex items-center justify-end gap-1">
                    {role === 'admin' ? (
                      <span className="text-[10px] text-brand-purple font-black uppercase tracking-widest leading-none mt-0.5 flex items-center gap-1">
                        <FiShield size={10} /> Super Admin
                      </span>
                    ) : (
                      <span className="text-[10px] text-warm-sand font-black uppercase tracking-widest leading-none mt-0.5 flex items-center gap-1">
                        Assistant
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-sm transition-all overflow-hidden ${showUserMenu ? 'bg-[#240046]' : 'bg-[#240046]/80'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={20} />
                  )}
                </div>
                <FiChevronDown size={14} className={`text-dusty-cocoa transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal overflow-hidden z-50 p-2">
                  <Link 
                    to="/admin/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-deep-espresso hover:bg-soft-oatmeal/30 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiUser size={18} className="text-warm-sand" />
                    View Profile
                  </Link>
                  <div className="h-[1px] bg-soft-oatmeal my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#240046] hover:bg-purple-50 transition-colors"
                  >
                    <FiLogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <RBACProvider>
      <AdminLayoutContent />
    </RBACProvider>
  );
};

export default AdminLayout;
