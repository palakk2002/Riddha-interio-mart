import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  User, 
  ShoppingBag, 
  Star, 
  Settings, 
  LogOut, 
  Pencil, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Trash2, 
  Save, 
  MapPin, 
  CreditCard, 
  Camera,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Store,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';
import { uploadImage } from '../../../shared/utils/upload';
import { motion, AnimatePresence } from 'framer-motion';

const SellerProfile = () => {
  const navigate = useNavigate();
  const { logout, user: currentUser, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    shopName: currentUser?.shopName || "",
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    avatar: currentUser?.avatar || "",
    shopAddress: "",
    gstNumber: "",
    panNumber: "",
    tier: "Standard Seller",
    rating: 0,
    joinDate: "N/A"
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/seller/me');
      if (data.success && data.data) {
        const s = data.data;
        setProfileData({
          shopName: s.shopName || "",
          fullName: s.fullName || "",
          email: s.email || "",
          phone: s.phone || "",
          avatar: s.avatar || "",
          shopAddress: s.shopAddress || "",
          gstNumber: s.gstNumber || "",
          panNumber: s.panNumber || "",
          tier: s.isVerified ? "Premium Seller" : "Standard Seller",
          rating: 4.8, 
          joinDate: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"
        });
      }
    } catch (err) {
      console.error('Failed to fetch seller profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.put('/auth/seller/profile', {
        fullName: profileData.fullName,
        email: profileData.email,
        shopName: profileData.shopName,
        shopAddress: profileData.shopAddress,
        phone: profileData.phone,
        avatar: profileData.avatar,
        gstNumber: profileData.gstNumber,
        panNumber: profileData.panNumber
      });
      if (data.success && data.data) {
        setIsEditing(false);
        setUser({ 
          ...currentUser, 
          fullName: data.data.fullName, 
          avatar: data.data.avatar, 
          shopName: data.data.shopName 
        });
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const url = await uploadImage(file);
      setProfileData(prev => ({ ...prev, avatar: url }));
      const { data } = await api.put('/auth/seller/profile', { avatar: url });
      if (data.success) {
        setUser({ ...currentUser, avatar: url });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="py-24 text-center space-y-4">
           <div className="w-12 h-12 border-4 border-seller-light border-t-seller-primary rounded-full animate-spin mx-auto"></div>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Profile...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 relative"
        >
          {/* Cover Area */}
          <div className="h-40 bg-slate-900 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-seller-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-60"></div>
          </div>
          
          <div className="px-10 pb-10 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative group">
                  <div className="h-40 w-40 rounded-[2.5rem] bg-white p-2 shadow-xl ring-4 ring-white/10 group-hover:ring-seller-primary/20 transition-all duration-500">
                    <div className="h-full w-full rounded-[2rem] overflow-hidden bg-slate-100 flex items-center justify-center relative">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Shop Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <Store size={48} className="text-slate-300" />
                      )}
                      {isSaving && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-seller-light border-t-seller-primary rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="absolute bottom-2 right-2 h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-seller-primary hover:scale-110 transition-all duration-300">
                    <Camera size={18} />
                    <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                  </label>
                </div>

                <div className="text-center md:text-left space-y-2 pb-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${profileData.tier === 'Premium Seller' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                      {profileData.tier}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-seller-light/30 text-seller-primary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-seller-primary/10">
                      <Star size={12} className="fill-current" /> {profileData.rating} Rating
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{profileData.shopName}</h1>
                  <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <User size={16} className="text-slate-400" /> {profileData.fullName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                 <button 
                   onClick={() => setIsEditing(!isEditing)}
                   className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all border ${isEditing ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-seller-primary text-white border-seller-primary shadow-lg shadow-seller-primary/20 hover:bg-seller-dark'}`}
                 >
                   {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                 </button>
                 <div className="flex items-center justify-center md:justify-end gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} /> Joined {profileData.joinDate}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info / Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  key="edit-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8"
                >
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                     <div className="w-10 h-10 bg-seller-light/40 rounded-xl flex items-center justify-center text-seller-primary">
                        <Pencil size={20} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight">Personal & Business Info</h3>
                  </div>
                  
                  <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Shop Name</label>
                        <input 
                           type="text" 
                           value={profileData.shopName}
                           onChange={(e) => setProfileData({...profileData, shopName: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Owner's Full Name</label>
                        <input 
                           type="text" 
                           value={profileData.fullName}
                           onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
                        <input 
                           type="email" 
                           value={profileData.email}
                           onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Phone Number</label>
                        <input 
                           type="tel" 
                           value={profileData.phone}
                           onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Store Address</label>
                        <textarea 
                           value={profileData.shopAddress}
                           onChange={(e) => setProfileData({...profileData, shopAddress: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none h-32 resize-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">GSTIN Number</label>
                        <input 
                           type="text" 
                           value={profileData.gstNumber}
                           onChange={(e) => setProfileData({...profileData, gstNumber: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">PAN Card Number</label>
                        <input 
                           type="text" 
                           value={profileData.panNumber}
                           onChange={(e) => setProfileData({...profileData, panNumber: e.target.value})}
                           className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-seller-primary/10 transition-all outline-none"
                        />
                     </div>
                     <div className="md:col-span-2 pt-4">
                        <button 
                           type="submit" 
                           disabled={isSaving}
                           className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                        >
                           {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                           {isSaving ? 'Saving Changes...' : 'Update Information'}
                        </button>
                     </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="view-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-seller-primary/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10 shrink-0">
                           <ShoppingBag size={26} />
                        </div>
                        <div className="mt-8">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sales</p>
                           <h4 className="text-2xl font-bold text-slate-900 tracking-tight">₹1.2M+</h4>
                        </div>
                     </div>
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-seller-primary/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-seller-primary text-white flex items-center justify-center shadow-lg shadow-seller-primary/20 shrink-0">
                           <ShieldCheck size={26} />
                        </div>
                        <div className="mt-8">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identity Status</p>
                           <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Verified</h4>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-seller-primary rounded-full" />
                        Business Profile Details
                     </h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        {[
                          { label: 'Merchant Email', value: profileData.email, icon: <Mail size={18} /> },
                          { label: 'Contact Phone', value: profileData.phone, icon: <Phone size={18} /> },
                          { label: 'Registered GSTIN', value: profileData.gstNumber, icon: <CheckCircle2 size={18} /> },
                          { label: 'PAN Identity', value: profileData.panNumber, icon: <CreditCard size={18} /> },
                          { label: 'Primary Warehouse', value: profileData.shopAddress, icon: <MapPin size={18} />, full: true },
                        ].map((field, i) => (
                          <div key={i} className={`${field.full ? 'md:col-span-2' : ''} space-y-1.5`}>
                             <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                {field.icon} {field.label}
                             </div>
                             <p className="text-base font-bold text-slate-900 leading-relaxed">
                                {field.value || 'Not provided'}
                             </p>
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
               <h3 className="text-lg font-bold text-slate-900 mb-2">Merchant Tools</h3>
               <div className="space-y-3">
                  {[
                    { label: 'Store Analytics', icon: <BarChart3 size={18} />, path: '/seller/reports/sales' },
                    { label: 'Wallet & Payouts', icon: <CreditCard size={18} />, path: '/seller/wallet' },
                    { label: 'Account Settings', icon: <Settings size={18} />, path: '/seller/settings' },
                  ].map((tool, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(tool.path)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
                    >
                       <div className="flex items-center gap-4">
                          <div className="text-slate-400 group-hover:text-seller-primary transition-colors">
                             {tool.icon}
                          </div>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{tool.label}</span>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
               </div>
               
               <button 
                 onClick={() => logout()}
                 className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest mt-4"
               >
                  <LogOut size={18} /> Sign Out
               </button>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-seller-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-seller-primary/40 transition-colors"></div>
               <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-seller-primary">
                     <ShieldCheck size={26} />
                  </div>
                  <h4 className="text-xl font-bold tracking-tight">Need Assistance?</h4>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">Our merchant support specialists are here to help you grow your business 24/7.</p>
                  <button className="w-full py-4 bg-seller-primary rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-seller-primary/20 hover:bg-seller-dark transition-all">
                     Contact Support
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
