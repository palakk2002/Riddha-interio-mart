import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiSettings, FiLogOut, FiChevronRight, FiEdit2, FiShield, FiMail, FiPhone } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../user/data/UserContext';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { logout, user: currentUser } = useUser();
  
  const adminInfo = {
    name: currentUser?.name || "Alex Johnson",
    email: currentUser?.email || "admin@riddhainterio.com",
    role: "Super Admin",
    phone: "+91 99887 76655",
    assignedSince: "January 2024",
    department: "Executive Management"
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-soft-oatmeal overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-warm-sand/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-dusty-cocoa/10 flex items-center justify-center border-2 border-soft-oatmeal group relative overflow-hidden">
             <FiUser className="h-16 w-16 text-dusty-cocoa/30" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
               <FiEdit2 className="text-white h-6 w-6" />
             </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <span className="px-3 py-1 bg-deep-espresso text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                <FiShield size={12} /> {adminInfo.role}
              </span>
              <span className="px-3 py-1 bg-warm-sand/10 text-warm-sand text-[10px] font-black uppercase tracking-widest rounded-full border border-warm-sand/20">
                Authorized Personnel
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-deep-espresso">{adminInfo.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-dusty-cocoa text-sm">
               <div className="flex items-center gap-2 font-medium">
                 <FiMail className="text-warm-sand" /> {adminInfo.email}
               </div>
               <div className="flex items-center gap-2 font-medium">
                 <FiPhone className="text-warm-sand" /> {adminInfo.phone}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-soft-oatmeal">
            <h2 className="text-lg font-bold text-deep-espresso mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-warm-sand rounded-full"></span>
              Administrative Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Department</p>
                 <p className="font-bold text-deep-espresso">{adminInfo.department}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Employee Status</p>
                 <p className="font-bold text-deep-espresso">Full-Time (Active)</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Assigned Since</p>
                 <p className="font-bold text-deep-espresso">{adminInfo.assignedSince}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Security Clearance</p>
                 <p className="font-bold text-deep-espresso text-green-600">Level 5 (Master Access)</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-soft-oatmeal">
             <h2 className="text-lg font-bold text-deep-espresso mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-dusty-cocoa rounded-full"></span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Edit Info', icon: <FiEdit2 />, color: 'bg-warm-sand' },
                { label: 'Settings', icon: <FiSettings />, color: 'bg-deep-espresso' },
                { label: 'Logout', icon: <FiLogOut />, color: 'bg-red-500', action: handleLogout },
              ].map((btn, i) => (
                <button 
                  key={i}
                  onClick={btn.action}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-soft-oatmeal hover:border-warm-sand/30 hover:bg-soft-oatmeal/10 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${btn.color} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    {btn.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-deep-espresso">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-soft-oatmeal h-fit">
          <h2 className="text-lg font-bold text-deep-espresso mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { type: 'Update', msg: 'Updated hero banner', time: '12m ago' },
              { type: 'Catalog', msg: 'Added 4 new categories', time: '2h ago' },
              { type: 'Login', msg: 'Login from New Delhi, IN', time: '5h ago' },
              { type: 'Security', msg: 'Password changed', time: '2d ago' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 h-auto bg-soft-oatmeal rounded-full flex-shrink-0"></div>
                <div>
                   <p className="text-xs font-bold text-deep-espresso">{activity.msg}</p>
                   <p className="text-[10px] text-warm-sand font-bold uppercase tracking-widest mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
