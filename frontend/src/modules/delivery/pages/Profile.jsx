import React, { useState, useCallback, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuUser, LuPhone, LuTruck, LuShieldCheck, LuMapPin, LuLogOut, LuMail, LuFileText, LuSave, LuX } from 'react-icons/lu';
import { FiEdit2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';
import { uploadImage } from '../../../shared/utils/upload';

const Profile = () => {
  const { logout, user: currentUser, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    vehicleType: "Bike",
    vehicleNumber: "",
    avatar: "",
    isOnline: false,
    approvalStatus: "Pending"
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/delivery/me');
      if (data.success && data.data) {
        setProfile({
          name: data.data.fullName || "Partner",
          phone: data.data.phone || "",
          email: data.data.email || "",
          vehicleType: data.data.vehicleType || "Bike",
          vehicleNumber: data.data.vehicleNumber || "",
          avatar: data.data.avatar || "",
          isOnline: data.data.status === 'Available',
          approvalStatus: data.data.approvalStatus
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleOnline = async () => {
    const nextStatus = profile.isOnline ? 'Offline' : 'Available';
    try {
      setProfile(prev => ({ ...prev, isOnline: !prev.isOnline }));
      await api.put('/delivery/status', { status: nextStatus });
    } catch (err) {
       console.error('Failed to update status:', err);
       // Revert UI if API fails
       setProfile(prev => ({ ...prev, isOnline: prev.isOnline }));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.put('/auth/delivery/profile', {
        fullName: profile.name,
        email: profile.email,
        phone: profile.phone,
        vehicleType: profile.vehicleType,
        vehicleNumber: profile.vehicleNumber,
        avatar: profile.avatar
      });
      if (data.success && data.data) {
        setIsEditing(false);
        setUser({ ...currentUser, name: data.data.fullName, avatar: data.data.avatar });
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
    try {
      const url = await uploadImage(file);
      setProfile(prev => ({ ...prev, avatar: url }));
      await api.put('/auth/delivery/profile', { avatar: url });
      setUser({ ...currentUser, avatar: url });
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-soft-oatmeal border-t-warm-sand rounded-full animate-spin mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-warm-sand">Syncing with Central...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-deep-espresso">My Profile</h1>
            <p className="text-[10px] text-warm-sand font-black uppercase tracking-widest">Partner ID: {currentUser?.id?.slice(-8).toUpperCase()}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <div className={`px-6 py-3 rounded-2xl border transition-all duration-500 flex items-center gap-6 ${
              profile.isOnline 
                ? 'bg-[#001B4E]/5 border-[#001B4E]/10 shadow-lg shadow-[#001B4E]/10' 
                : 'bg-white border-soft-oatmeal'
            }`}>
              <div className="text-left">
                <p className="text-[9px] font-black text-warm-sand uppercase tracking-widest">Active Status</p>
                <p className={`text-sm font-black uppercase tracking-tighter ${profile.isOnline ? 'text-[#001B4E]' : 'text-dusty-cocoa'}`}>
                  {profile.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              <button 
                onClick={toggleOnline}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                  profile.isOnline ? 'bg-[#001B4E]' : 'bg-soft-oatmeal'
                }`}
              >
                <motion.div 
                  animate={{ x: profile.isOnline ? 26 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-deep-espresso text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-dusty-cocoa transition-all shadow-xl shadow-deep-espresso/20 active:scale-95"
              >
                <FiEdit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Identity Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[32px] shadow-2xl shadow-soft-oatmeal/40 border border-soft-oatmeal p-10 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full bg-soft-oatmeal/10 rounded-full flex items-center justify-center text-warm-sand border-4 border-white shadow-2xl overflow-hidden relative">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      <LuUser size={64} className="opacity-20" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-soft-oatmeal cursor-pointer hover:bg-soft-oatmeal/20 transition-all text-deep-espresso active:scale-90">
                    <FiEdit2 size={18} />
                    <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                  </label>
                </div>
                
                <h3 className="text-2xl font-display font-bold text-deep-espresso tracking-tight">{profile.name}</h3>
                <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-warm-sand/10 rounded-full text-[10px] font-black text-warm-sand uppercase tracking-widest">
                  <LuTruck size={12} /> Partner Member
                </div>
                
                <div className="mt-10 pt-10 border-t border-soft-oatmeal/50 space-y-6">
                  <div className="flex items-center justify-between text-xs font-bold text-warm-sand uppercase tracking-widest">
                    <span>Approval Status</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] ${
                      profile.approvalStatus === 'Approved' ? 'bg-[#001B4E] text-white' : 'bg-[#001B4E] text-white'
                    }`}>
                      {profile.approvalStatus}
                    </span>
                  </div>
                  <div className="p-4 bg-[#001B4E]/5 rounded-2xl border border-[#001B4E]/10 flex items-center gap-3">
                    <LuShieldCheck className="text-[#001B4E] shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-[#001B4E] text-left leading-relaxed uppercase tracking-tighter">Identity Verified & Secured by Riddha Mart Protocol</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-soft-oatmeal/10 rounded-full blur-3xl group-hover:bg-warm-sand/5 transition-colors duration-700" />
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-[24px] bg-white border border-soft-oatmeal text-[#001B4E] font-black uppercase tracking-widest text-[10px] hover:bg-[#001B4E]/5 hover:border-[#001B4E]/20 transition-all active:scale-95 shadow-sm"
            >
              <LuLogOut size={16} />
              Sign Out Account
            </button>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[32px] shadow-2xl shadow-soft-oatmeal/40 border border-soft-oatmeal overflow-hidden">
              <div className="px-10 py-8 border-b border-soft-oatmeal flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-soft-oatmeal/10 rounded-xl flex items-center justify-center text-warm-sand">
                    <LuFileText size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-deep-espresso tracking-tight">Partner Information</h3>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="p-3 bg-soft-oatmeal/20 rounded-xl text-warm-sand hover:bg-soft-oatmeal/40 transition-all"
                    >
                      <LuX size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-10">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form 
                      key="edit-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSave} 
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand ml-1">Full Identity Name</label>
                          <div className="relative">
                            <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
                            <input 
                              value={profile.name} 
                              onChange={(e) => setProfile({...profile, name: e.target.value})} 
                              className="w-full bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white pl-12 pr-6 py-4 rounded-2xl text-sm font-bold text-deep-espresso transition-all"
                              placeholder="Your full name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand ml-1">Work Email Address</label>
                          <div className="relative">
                            <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand font-bold" size={18} />
                            <input 
                              type="email"
                              value={profile.email} 
                              onChange={(e) => setProfile({...profile, email: e.target.value})} 
                              className="w-full bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white pl-12 pr-6 py-4 rounded-2xl text-sm font-bold text-deep-espresso transition-all"
                              placeholder="email@example.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand ml-1">Contact Number</label>
                          <div className="relative">
                            <LuPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
                            <input 
                              value={profile.phone} 
                              onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                              className="w-full bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white pl-12 pr-6 py-4 rounded-2xl text-sm font-bold text-deep-espresso transition-all font-mono"
                              placeholder="+91-0000000000"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand ml-1">Vehicle Type</label>
                          <div className="relative">
                            <LuTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
                            <select 
                              value={profile.vehicleType} 
                              onChange={(e) => setProfile({...profile, vehicleType: e.target.value})} 
                              className="w-full bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white pl-12 pr-6 py-4 rounded-2xl text-sm font-bold text-deep-espresso transition-all appearance-none cursor-pointer"
                            >
                              <option value="Bike">Two Wheeler / Bike</option>
                              <option value="Van">Delivery Van</option>
                              <option value="Truck">Logistics Truck</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand ml-1">Vehicle Plate Number</label>
                          <div className="relative">
                            <LuFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
                            <input 
                              value={profile.vehicleNumber} 
                              onChange={(e) => setProfile({...profile, vehicleNumber: e.target.value})} 
                              className="w-full bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white pl-12 pr-6 py-4 rounded-2xl text-sm font-bold text-deep-espresso transition-all font-mono"
                              placeholder="RJ-14-XX-0000"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <button 
                          disabled={isSaving}
                          type="submit" 
                          className="flex-1 flex items-center justify-center gap-3 bg-deep-espresso text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-deep-espresso/20 hover:bg-[#001B4E] transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LuSave size={18} />}
                          {isSaving ? 'Processing...' : 'Sync Profile Changes'}
                        </button>
                        <button 
                          disabled={isSaving}
                          type="button" 
                          onClick={() => setIsEditing(false)} 
                          className="px-10 bg-soft-oatmeal/20 text-warm-sand rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-soft-oatmeal/40 transition-all"
                        >
                          Discard
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="details-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                      <div className="space-y-2 group">
                        <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                          <LuUser size={12} /> Full Identity
                        </p>
                        <p className="text-base font-bold text-deep-espresso group-hover:translate-x-1 transition-transform duration-300">{profile.name}</p>
                      </div>
                      <div className="space-y-2 group">
                        <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                          <LuMail size={12} /> Primary Email
                        </p>
                        <p className="text-base font-bold text-deep-espresso group-hover:translate-x-1 transition-transform duration-300 truncate">{profile.email}</p>
                      </div>
                      <div className="space-y-2 group">
                        <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                          <LuPhone size={12} /> Business Contact
                        </p>
                        <p className="text-base font-bold text-deep-espresso group-hover:translate-x-1 transition-transform duration-300 font-mono italic">{profile.phone || 'Not provided'}</p>
                      </div>
                      <div className="space-y-2 group">
                        <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                          <LuTruck size={12} /> Registered Vehicle
                        </p>
                        <p className="text-base font-bold text-deep-espresso group-hover:translate-x-1 transition-transform duration-300">{profile.vehicleType} • <span className="font-mono text-warm-sand">{profile.vehicleNumber || 'Pending'}</span></p>
                      </div>
                      <div className="space-y-2 group md:col-span-2">
                        <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                          <LuMapPin size={12} /> Operational Zone
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-base font-bold text-deep-espresso">Regional Central Logistics (West Zone)</p>
                          <span className="px-3 py-1 bg-soft-oatmeal/20 rounded-full text-[9px] font-black text-warm-sand uppercase tracking-widest">Global HQ</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-warm-sand/5 border border-soft-oatmeal rounded-[32px] p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-warm-sand text-white rounded-2xl flex items-center justify-center shadow-lg shadow-warm-sand/20">
                    <LuShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-deep-espresso tracking-tight">Compliance & Documents</h4>
                    <p className="text-xs font-medium text-dusty-cocoa uppercase tracking-widest mt-1">Verified Logistics Status</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Identity Proof', 'Drivers License', 'RC (Registration)', 'Business Insurance'].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-4 bg-white border border-soft-oatmeal rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#001B4E] animate-pulse" />
                      <span className="text-[10px] font-black text-deep-espresso uppercase tracking-widest">{doc}</span>
                    </div>
                    <span className="text-[8px] font-black text-[#001B4E] bg-[#001B4E]/5 px-2.5 py-1 rounded-full uppercase tracking-widest">Verified</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;

