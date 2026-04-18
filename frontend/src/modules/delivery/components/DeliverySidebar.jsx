import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuPackage, 
  LuWallet, 
  LuUser,
  LuLogOut
} from 'react-icons/lu';

import { useUser } from '../../user/data/UserContext';
import { useNavigate } from 'react-router-dom';

const DeliverySidebar = ({ isOpen, onClose }) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/delivery/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/delivery/dashboard', icon: LuLayoutDashboard },
    { name: 'Orders', path: '/delivery/orders', icon: LuPackage },
    { name: 'Earnings', path: '/delivery/earnings', icon: LuWallet },
    { name: 'Profile', path: '/delivery/profile', icon: LuUser },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-deep-espresso/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-deep-espresso border-r border-white/5 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 px-8 flex items-center border-b border-white/5">
            <Link to="/delivery/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-warm-sand rounded-lg flex items-center justify-center text-white">
                <LuPackage size={20} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">Riddha<span className="text-warm-sand">Delivery</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 group
                  ${isActive 
                    ? 'bg-red-800 text-white shadow-lg shadow-red-900/20' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                    <span className="text-white">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors group"
            >
              <LuLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DeliverySidebar;
