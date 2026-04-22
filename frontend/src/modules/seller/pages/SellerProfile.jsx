import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../components/PageWrapper';
import { FiUser, FiShoppingBag, FiStar, FiSettings, FiLogOut, FiEdit2, FiMail, FiPhone, FiCheckCircle, FiTrash2, FiSave, FiMapPin, FiCreditCard } from 'react-icons/fi';
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
    businessName: "",
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
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
        setProfileData({
          businessName: data.data.shopName || "New Store",
          fullName: data.data.fullName || "Seller",
          email: data.data.email || "",
          phone: data.data.phone || "",
          avatar: data.data.avatar || "",
          shopAddress: data.data.shopAddress || "",
          gstNumber: data.data.gstNumber || "",
          panNumber: data.data.panNumber || "",
          tier: data.data.isVerified ? "Premium Seller" : "Standard Seller",
          rating: 4.8, 
          joinDate: data.data.createdAt ? new Date(data.data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"
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
        shopName: profileData.businessName,
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
      alert(err.response?.data?.error || 'Failed to update profile');
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-red-800/10 border-t-red-800 rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-soft-oatmeal border border-soft-oatmeal/50 relative"
        >
          {/* Cover Accent */}
          <div className="h-32 bg-gradient-to-r from-red-900 to-red-700" />
          
          <div className="px-8 pb-12 -mt-16 flex flex-col md:flex-row items-end gap-8">
            <div className="relative">
              <div className="h-40 w-40 rounded-[40px] bg-white p-2 shadow-2xl">
                <div className="h-full w-full rounded-[32px] overflow-hidden bg-soft-oatmeal flex items-center justify-center relative">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Store" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={64} className="text-red-800/20" />
                  )}
                  {isSaving && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <label className="absolute bottom-2 right-2 h-12 w-12 bg-white text-red-800 rounded-2xl flex items-center justify-center shadow-xl border border-soft-oatmeal cursor-pointer hover:bg-red-800 hover:text-white transition-all active:scale-90">
                <FiCamera className="text-xl" />
                <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
              </label>
            </div>

            <div className="flex-1 pb-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${profileData.tier === 'Premium Seller' ? 'bg-orange-500 text-white' : 'bg-red-800 text-white'}`}>
                  {profileData.tier}
                </span>
                <span className="flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-yellow-500/10">
                  <FiStar size={12} fill="currentColor" /> {profileData.rating} Rating
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-deep-espresso tracking-tight">{profileData.businessName}</h1>
              <p className="text-red-800 font-bold text-sm mt-2 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-3">
                <FiUser size={14} /> {profileData.fullName}
              </p>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="mb-4 px-8 py-4 rounded-2xl bg-soft-oatmeal/20 text-red-800 font-black uppercase tracking-widest text-[10px] hover:bg-red-800 hover:text-white transition-all border border-red-800/10"
            >
              {isEditing ? 'Discard Changes' : 'Manage Profile'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-10 rounded-[40px] border border-soft-oatmeal shadow-sm"
                >
                  <h3 className="text-xl font-bold text-deep-espresso mb-8 flex items-center gap-3">
                    <FiEdit2 className="text-red-800" /> Evolution of Identity
                  </h3>
                  <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">Shop Essence</label>
                         <input 
                           type="text" 
                           value={profileData.businessName}
                           onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                           placeholder="Ex: Golden Threads"
                           className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">Owner's Name</label>
                         <input 
                           type="text" 
                           value={profileData.fullName}
                           onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                           placeholder="Full Name"
                           className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none"
                         />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">Email Conduit</label>
                         <input 
                           type="email" 
                           value={profileData.email}
                           onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                           placeholder="Email"
                           className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">Primary Contact</label>
                         <input 
                           type="tel" 
                           value={profileData.phone}
                           onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                           placeholder="Phone"
                           className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none"
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">Physical Foundation (Address)</label>
                       <textarea 
                         value={profileData.shopAddress}
                         onChange={(e) => setProfileData({...profileData, shopAddress: e.target.value})}
                         placeholder="Store Address"
                         className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none h-32 resize-none"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">GST-IN Credentials</label>
                         <input 
                           type="text" 
                           value={profileData.gstNumber}
                           onChange={(e) => setProfileData({...profileData, gstNumber: e.target.value})}
                           placeholder="GST Code"
                           className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-red-800 ml-2">Personal Taxation (PAN)</label>
                         <input 
                           type="text" 
                           value={profileData.panNumber}
                           onChange={(e) => setProfileData({...profileData, panNumber: e.target.value})}
                           placeholder="PAN Card Number"
                           className="w-full bg-soft-oatmeal/10 border-2 border-transparent focus:border-red-800 focus:bg-white rounded-2xl px-6 py-4 font-bold text-deep-espresso transition-all outline-none"
                         />
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="submit" 
                         disabled={isSaving}
                         className="flex-1 py-5 bg-red-800 text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-red-800/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                       >
                         {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave className="text-xl" />}
                         {isSaving ? 'Processing Evolution...' : 'Commit Profile Updates'}
                       </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-white p-10 rounded-[40px] border border-soft-oatmeal shadow-sm flex flex-col justify-between group hover:border-red-800/20 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-red-800 text-white flex items-center justify-center shadow-2xl shadow-red-800/20">
                           <FiShoppingBag size={28} />
                        </div>
                        <div className="mt-8">
                           <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Established</p>
                           <p className="text-2xl font-black text-deep-espresso">{profileData.joinDate}</p>
                        </div>
                     </div>
                     <div className="bg-white p-10 rounded-[40px] border border-soft-oatmeal shadow-sm flex flex-col justify-between group hover:border-red-800/20 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-deep-espresso text-white flex items-center justify-center shadow-2xl shadow-deep-espresso/20">
                           <FiShoppingBag size={28} />
                        </div>
                        <div className="mt-8">
                           <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Seller Tier</p>
                           <p className="text-2xl font-black text-deep-espresso">{profileData.tier.split(' ')[0]}</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-12 rounded-[48px] border border-soft-oatmeal shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                      <FiShoppingBag size={200} className="text-red-800" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-deep-espresso mb-10 flex items-center gap-4">
                      <div className="w-2 h-8 bg-red-800 rounded-full" /> Business Identity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                       {[
                         { label: 'Merchant Email', value: profileData.email, icon: <FiMail /> },
                         { label: 'Secure Phone', value: profileData.phone, icon: <FiPhone /> },
                         { label: 'Global GST-IN', value: profileData.gstNumber, icon: <FiCheckCircle /> },
                         { label: 'Permanent Account', value: profileData.panNumber, icon: <FiCreditCard /> },
                         { label: 'Physical HQ', value: profileData.shopAddress, icon: <FiMapPin />, full: true },
                       ].map((field, i) => (
                         <div key={i} className={`${field.full ? 'md:col-span-2' : ''} space-y-2`}>
                            <p className="text-[10px] font-black text-red-800 uppercase tracking-widest flex items-center gap-2">
                              {field.icon} {field.label}
                            </p>
                            <p className="text-lg font-bold text-deep-espresso break-words">
                              {field.value || 'Credentials Required'}
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
            <div className="bg-white p-10 rounded-[40px] border border-soft-oatmeal shadow-sm">
               <h3 className="text-xl font-bold text-deep-espresso mb-8">Evolution Actions</h3>
               <div className="space-y-4">
                  <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-5 rounded-2xl bg-soft-oatmeal/10 hover:bg-red-800 hover:text-white transition-all font-bold group">
                     <div className="flex items-center gap-4">
                        <FiSettings className="group-hover:rotate-90 transition-transform" />
                        <span className="text-sm uppercase tracking-widest font-black">Meta Settings</span>
                     </div>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-4 p-6 rounded-[24px] bg-red-50 text-red-900 hover:bg-red-900 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] mt-8 shadow-xl shadow-red-900/5"
                  >
                     <FiLogOut /> Abandon Store Session
                  </button>
               </div>
            </div>

            <div className="bg-red-900/5 p-10 rounded-[40px] border border-red-900/10">
               <h3 className="text-lg font-black text-red-900 uppercase tracking-widest mb-4">Merchant Support</h3>
               <p className="text-xs text-red-900/60 font-bold leading-relaxed mb-8 uppercase tracking-tighter">Our high-priority specialists are available 24/7 to ensure your storefront maintains its prestige status.</p>
               <button className="w-full py-4 bg-red-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Contact Liaison</button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SellerProfile;

