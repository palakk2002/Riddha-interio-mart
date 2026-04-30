import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiSettings, FiLogOut, FiChevronRight, FiGift, FiCopy, FiCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../data/UserContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [copied, setCopied] = React.useState(false);

  const menuItems = [
    { icon: <FiUser />, title: "My Profile", subtitle: "View and edit your personal details", link: "/profile/edit" },
    { icon: <FiPackage />, title: "My Orders", subtitle: "Track, return or buy things again", link: "/orders" },
    { icon: <FiMapPin />, title: "Saved Addresses", subtitle: "Edit addresses for orders", link: "/address" },
    { icon: <FiGift />, title: "Referral Rewards", subtitle: "Refer friends and earn credits", link: "/referral-rewards" },
    { icon: <FiSettings />, title: "Account Settings", subtitle: "Update your profile and security", link: "/profile/edit" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('RIDDHA-2026');
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center space-y-4">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Please sign in to view your profile</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-deep-espresso text-white font-black uppercase tracking-widest text-xs"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

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
            <div className="h-24 w-24 md:h-36 md:w-36 rounded-full bg-soft-oatmeal/10 flex items-center justify-center border-2 md:border-4 border-warm-sand/5 overflow-hidden shadow-xl md:shadow-2xl">
              {user.avatar ? (
                <img src={user.avatar} alt="Me" className="h-full w-full object-cover" />
              ) : (
                <FiUser className="h-10 w-10 md:h-20 md:w-20 text-deep-espresso/20" />
              )}
            </div>
            <Link to="/profile/edit" className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-soft-oatmeal/20 md:hidden">
               <FiSettings className="h-4 w-4 text-warm-sand" />
            </Link>
          </div>

          <div className="text-center md:text-left space-y-0.5 md:space-y-3">
            <h1 className="text-2xl md:text-5xl font-semibold text-deep-espresso tracking-tighter capitalize">
              {(user.fullName || user.name || '').toLowerCase()}
            </h1>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold tracking-[0.2em]">{user.email?.toLowerCase()}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 md:pt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black bg-warm-sand/10 text-warm-sand px-4 py-1.5 rounded-full border border-warm-sand/10">
                Member of Riddha
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300 pt-1.5">
                Member Since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                  <h3 className="text-sm md:text-base font-semibold text-deep-espresso tracking-tight capitalize">
                    {item.title.toLowerCase()}
                  </h3>
                  <p className="text-gray-400 text-[9px] md:text-[10px] font-bold tracking-widest leading-relaxed capitalize">
                    {item.subtitle.toLowerCase()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Referral Card Section */}
        <div className="mt-8 md:mt-16">
          <div className="bg-gradient-to-r from-[#189D91]/5 to-[#702D8B]/5 rounded-3xl p-6 md:p-10 border border-soft-oatmeal/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 md:space-y-4 text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-black text-deep-espresso tracking-tight">Refer a friend, get ₹100</h2>
              <p className="text-deep-espresso/50 text-xs md:text-sm font-bold tracking-widest uppercase">Your friends get ₹50 on their first purchase</p>
              <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FiGift className="text-[#189D91]" />
                </div>
                <p className="text-[10px] font-black text-[#189D91] uppercase tracking-[0.2em]">2 Friends Referred Successfully</p>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-soft-oatmeal/10 w-full md:w-auto">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 text-center">MY REFERRAL CODE</p>
              <div className="flex items-center gap-3">
                <div className="px-6 py-3 bg-soft-oatmeal/10 rounded-xl border-2 border-dashed border-warm-sand/30 font-black text-deep-espresso tracking-[0.2em] text-lg">
                  RIDDHA-2026
                </div>
                <button 
                  onClick={copyReferralCode}
                  className="h-14 w-14 bg-deep-espresso text-white rounded-xl flex items-center justify-center hover:bg-warm-sand transition-all active:scale-90"
                >
                  {copied ? <FiCheck className="h-6 w-6" /> : <FiCopy className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 md:mt-16 space-y-4 md:space-y-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand px-2">Support & information</h2>
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
                <span className="text-[11px] font-semibold text-deep-espresso tracking-[0.2em] capitalize">{item.title.toLowerCase()}</span>
                <FiChevronRight className="text-gray-300 group-hover:text-warm-sand transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-12 md:mt-20">
          <button 
            onClick={handleLogout}
            className="w-full md:w-auto px-16 py-4 md:py-6 bg-deep-espresso text-white font-semibold uppercase tracking-[0.3em] text-xs hover:bg-warm-sand transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group"
          >
            Logout 
            <FiLogOut className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
