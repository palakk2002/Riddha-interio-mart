import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { FiUser, FiShoppingBag, FiStar, FiSettings, FiLogOut, FiEdit2, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../user/data/UserContext';

const SellerProfile = () => {
  const navigate = useNavigate();
  const { logout, user: currentUser } = useUser();

  const sellerInfo = {
    businessName: "Elite Interiors",
    ownerName: currentUser?.name || "John Seller",
    email: currentUser?.email || "seller@riddhainterio.com",
    phone: "+91 88776 65544",
    tier: "Premium Seller",
    rating: 4.8,
    totalSales: "Rs. 1,45,000",
    joinDate: "February 2024"
  };

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-soft-oatmeal flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="h-36 w-36 rounded-full bg-red-800/10 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
               <FiUser className="h-16 w-16 text-red-800/40" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                 <FiEdit2 size={24} />
               </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
               <FiCheckCircle size={16} />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <span className="px-3 py-1 bg-red-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                {sellerInfo.tier}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/10">
                <FiStar size={10} fill="currentColor" /> {sellerInfo.rating} Rating
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-deep-espresso">{sellerInfo.businessName}</h1>
            <p className="text-dusty-cocoa font-bold text-sm mt-1 uppercase tracking-widest">{sellerInfo.ownerName}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 text-sm font-medium text-red-800">
                <div className="w-8 h-8 rounded-lg bg-soft-oatmeal/30 flex items-center justify-center"><FiMail /></div>
                {sellerInfo.email}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-red-800">
                <div className="w-8 h-8 rounded-lg bg-soft-oatmeal/30 flex items-center justify-center"><FiPhone /></div>
                {sellerInfo.phone}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Stats Cards */}
           <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              {[
                { label: 'Total Sales', value: sellerInfo.totalSales, icon: <FiShoppingBag />, color: 'bg-deep-espresso' },
                { label: 'Join Date', value: sellerInfo.joinDate, icon: <FiUser />, color: 'bg-red-800' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-soft-oatmeal shadow-sm flex flex-col justify-between">
                   <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                      {stat.icon}
                   </div>
                   <div className="mt-6">
                      <p className="text-[10px] font-black text-red-800 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-deep-espresso">{stat.value}</p>
                   </div>
                </div>
              ))}

              <div className="col-span-2 bg-white p-8 rounded-[32px] border border-soft-oatmeal shadow-sm">
                 <h2 className="text-lg font-bold text-deep-espresso mb-6">Business Information</h2>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-soft-oatmeal/50">
                       <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Business License</span>
                       <span className="text-sm font-black text-deep-espresso">Verified (GST-IN: 09AAFCR...)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-soft-oatmeal/50">
                       <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Payout Schedule</span>
                       <span className="text-sm font-black text-deep-espresso">Every Friday</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                       <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Store Status</span>
                       <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">Online</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Settings & Logout */}
           <div className="space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-soft-oatmeal shadow-sm">
                 <h2 className="text-lg font-bold text-deep-espresso mb-6">Account Actions</h2>
                 <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-soft-oatmeal/10 hover:bg-soft-oatmeal/30 transition-all font-bold group">
                       <div className="flex items-center gap-3">
                          <FiSettings className="text-red-800 group-hover:rotate-45 transition-transform" />
                          <span className="text-sm">Account Settings</span>
                       </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-soft-oatmeal/10 hover:bg-soft-oatmeal/30 transition-all font-bold group">
                       <div className="flex items-center gap-3">
                          <FiEdit2 className="text-red-800" />
                          <span className="text-sm">Edit Shop Bio</span>
                       </div>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest mt-4"
                    >
                       <FiLogOut /> Sign Out from Store
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SellerProfile;
