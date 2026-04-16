import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiSettings, FiLogOut, FiChevronRight, FiEdit2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    memberSince: "March 2024",
    avatar: null // Placeholder for profile image
  };

  const menuItems = [
    { icon: <FiUser />, title: "My Profile", subtitle: "View and edit your personal details", link: "/profile/edit" },
    { icon: <FiPackage />, title: "My Orders", subtitle: "Track, return or buy things again", link: "/orders" },
    { icon: <FiMapPin />, title: "Saved Addresses", subtitle: "Edit addresses for orders", link: "/address" },
    { icon: <FiSettings />, title: "Account Settings", subtitle: "Update your profile and security", link: "/profile/edit" },
  ];

  const handleLogout = () => {
    // Clear user session/token here if needed
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-white pb-32"
    >
      {/* Header / Profile Info */}
      <div className="bg-white border-b border-soft-oatmeal/10 pt-4 pb-4 md:pt-16 md:pb-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-12">
          <div className="relative group">
            <div className="h-20 w-20 md:h-36 md:w-36 rounded-full bg-soft-oatmeal/10 flex items-center justify-center border-2 md:border-4 border-warm-sand/5 overflow-hidden shadow-xl md:shadow-2xl">
              <FiUser className="h-10 w-10 md:h-20 md:w-20 text-deep-espresso/20" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-0.5 md:space-y-3">
            <h1 className="text-2xl md:text-5xl font-black text-deep-espresso tracking-tighter uppercase">{user.name}</h1>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 md:pt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black bg-warm-sand/10 text-warm-sand px-4 py-1.5 rounded-full border border-warm-sand/10">
                Premium Member
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300 pt-1.5">
                Member Since {user.memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-soft-oatmeal/10">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.link}
              className="group p-4 md:p-6 border-r border-b border-soft-oatmeal/10 hover:bg-soft-oatmeal/5 transition-all duration-500"
            >
              <div className="flex flex-row items-center gap-4 md:flex-col md:items-start md:gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center text-warm-sand group-hover:scale-110 transition-transform duration-500">
                  {React.cloneElement(item.icon, { size: 20 })}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-black text-deep-espresso uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed">{item.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-8 md:mt-16 space-y-4 md:space-y-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand px-2">Support & Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-soft-oatmeal/10">
            {[
              { title: "Contact Support", link: "/contact" },
              { title: "Privacy Policy", link: "/policies/refund" },
              { title: "Terms of Service", link: "/terms" },
              { title: "Cancellation Policy", link: "/policies/cancellation" },
            ].map((item, i) => (
              <Link 
                key={i} 
                to={item.link}
                className="flex items-center justify-between p-4 border-r border-b border-soft-oatmeal/10 hover:bg-soft-oatmeal/5 transition-colors group"
              >
                <span className="text-[11px] font-black text-deep-espresso uppercase tracking-[0.2em]">{item.title}</span>
                <FiChevronRight className="text-gray-300 group-hover:text-warm-sand transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-12 md:mt-20">
          <button 
            onClick={handleLogout}
            className="w-full md:w-auto px-16 py-4 md:py-6 bg-deep-espresso text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-warm-sand transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group"
          >
            LOGOUT 
            <FiLogOut className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
