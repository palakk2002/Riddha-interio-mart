import React, { useState, useCallback, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  LuUser, 
  LuPhone, 
  LuTruck, 
  LuShieldCheck, 
  LuMapPin, 
  LuLogOut, 
  LuMail, 
  LuFileText, 
  LuSave, 
  LuX,
  LuActivity,
  LuExternalLink,
  LuChevronRight,
  LuBadgeCheck
} from 'react-icons/lu';
import { FiEdit2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';
import { uploadImage } from '../../../shared/utils/upload';
import { toast } from 'react-hot-toast';

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
    const loadingToast = toast.loading(`Switching Signal: ${nextStatus}`);
    try {
      setProfile(prev => ({ ...prev, isOnline: !prev.isOnline }));
      await api.put('/delivery/status', { status: nextStatus });
      toast.success(`Signal Synchronized: ${nextStatus}`, { id: loadingToast });
    } catch (err) {
       setProfile(prev => ({ ...prev, isOnline: prev.isOnline }));
       toast.error('Signal Sync Failure', { id: loadingToast });
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const loadingToast = toast.loading('Synchronizing Profile Matrix...');
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
        toast.success('Matrix Synchronized', { id: loadingToast });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Sync Failure', { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const loadingToast = toast.loading('Uploading Biometric Asset...');
    try {
      const url = await uploadImage(file);
      setProfile(prev => ({ ...prev, avatar: url }));
      await api.put('/auth/delivery/profile', { avatar: url });
      setUser({ ...currentUser, avatar: url });
      toast.success('Asset Verified', { id: loadingToast });
    } catch (err) {
      toast.error('Asset Upload Failed', { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-40">
           <LuActivity className="text-[#D63384] animate-pulse mb-4" size={48} />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Identity Protocol...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
        
        {/* Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 bg-[#D63384] rounded-full"></div>
                <div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">Partner <span className="text-[#D63384]">Protocol</span></h1>
                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-1">Registry ID: {currentUser?.id?.slice(-12).toUpperCase()}</p>
                </div>
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Real-time Signal Toggle */}
            <div className={`px-8 py-4 rounded-3xl border transition-all duration-500 flex items-center gap-8 ${
              profile.isOnline 
                ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20' 
                : 'bg-white border-slate-100 shadow-sm'
            }`}>
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Signal State</p>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${profile.isOnline ? 'bg-[#D63384] animate-pulse' : 'bg-slate-300'}`}></div>
                   <p className={`text-xs font-black uppercase tracking-widest ${profile.isOnline ? 'text-white' : 'text-slate-400'}`}>
                     {profile.isOnline ? 'Transmitting' : 'Dormant'}
                   </p>
                </div>
              </div>
              <button 
                onClick={toggleOnline}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  profile.isOnline ? 'bg-[#D63384]' : 'bg-slate-100'
                }`}
              >
                <motion.div 
                  animate={{ x: profile.isOnline ? 30 : 4 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-3 bg-[#D63384] text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-[#B6256B] transition-all shadow-xl shadow-pink-500/20 active:scale-95"
              >
                <FiEdit2 size={16} />
                Modify Protocol
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Identity Core */}
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-[#111827] rounded-[3rem] p-10 text-center relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#D63384]/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                <div className="relative w-40 h-40 mx-auto mb-8 group">
                  <div className="w-full h-full bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-600 border-8 border-slate-900 shadow-2xl overflow-hidden relative">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Me" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <LuUser size={80} className="opacity-20" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <LuActivity className="text-white animate-pulse" size={32} />
                    </div>
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-4 bg-[#D63384] text-white rounded-2xl shadow-2xl cursor-pointer hover:scale-110 transition-all active:scale-90">
                    <FiEdit2 size={20} />
                    <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                  </label>
                </div>
                
                <h3 className="text-3xl font-black text-white tracking-tight uppercase italic">{profile.name}</h3>
                <div className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-white/5 rounded-full text-[10px] font-black text-[#D63384] uppercase tracking-[0.2em] border border-white/5">
                  <LuBadgeCheck size={14} /> Certified Operative
                </div>
                
                <div className="mt-12 pt-12 border-t border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Node</span>
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                      {profile.approvalStatus}
                    </span>
                  </div>
                  <div className="p-5 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-[#D63384]/10 flex items-center justify-center text-[#D63384]">
                       <LuShieldCheck size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight mb-1">Riddha Security</p>
                       <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">Biometric link established with central logistics grid.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-4 py-6 rounded-[2.5rem] bg-white border border-slate-100 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95 shadow-sm"
            >
              <LuLogOut size={18} />
              Terminate Session
            </button>
          </div>

          {/* Details Registry */}
          <div className="xl:col-span-8 space-y-10">
            <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D63384] shadow-md">
                    <LuFileText size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Registry <span className="text-[#D63384]">Information</span></h3>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                  >
                    <LuX size={24} />
                  </button>
                )}
              </div>

              <div className="p-12">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form 
                      key="edit-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSave} 
                      className="space-y-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Operative Name</label>
                          <div className="relative group">
                            <LuUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D63384] transition-colors" size={20} />
                            <input 
                              value={profile.name} 
                              onChange={(e) => setProfile({...profile, name: e.target.value})} 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#D63384]/20 focus:bg-white pl-14 pr-8 py-5 rounded-[1.5rem] text-sm font-black text-slate-900 transition-all outline-none"
                              placeholder="Full Identity Name"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Communication Link</label>
                          <div className="relative group">
                            <LuMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D63384] transition-colors" size={20} />
                            <input 
                              type="email"
                              value={profile.email} 
                              onChange={(e) => setProfile({...profile, email: e.target.value})} 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#D63384]/20 focus:bg-white pl-14 pr-8 py-5 rounded-[1.5rem] text-sm font-black text-slate-900 transition-all outline-none"
                              placeholder="operative@riddha.mart"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Direct Contact</label>
                          <div className="relative group">
                            <LuPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D63384] transition-colors" size={20} />
                            <input 
                              value={profile.phone} 
                              onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#D63384]/20 focus:bg-white pl-14 pr-8 py-5 rounded-[1.5rem] text-sm font-black text-slate-900 transition-all outline-none italic"
                              placeholder="+91-0000-000-000"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Deployment Vehicle</label>
                          <div className="relative group">
                            <LuTruck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D63384] transition-colors" size={20} />
                            <select 
                              value={profile.vehicleType} 
                              onChange={(e) => setProfile({...profile, vehicleType: e.target.value})} 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#D63384]/20 focus:bg-white pl-14 pr-8 py-5 rounded-[1.5rem] text-sm font-black text-slate-900 transition-all outline-none appearance-none cursor-pointer"
                            >
                              <option value="Bike">Two-Wheeler Matrix</option>
                              <option value="Van">Delivery Van System</option>
                              <option value="Truck">Heavy Logistics Truck</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Vehicle Asset ID</label>
                          <div className="relative group">
                            <LuFileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D63384] transition-colors" size={20} />
                            <input 
                              value={profile.vehicleNumber} 
                              onChange={(e) => setProfile({...profile, vehicleNumber: e.target.value})} 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#D63384]/20 focus:bg-white pl-14 pr-8 py-5 rounded-[1.5rem] text-sm font-black text-slate-900 transition-all outline-none uppercase italic"
                              placeholder="RJ-XX-0000-ALPHA"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 pt-6">
                        <button 
                          disabled={isSaving}
                          type="submit" 
                          className="flex-1 flex items-center justify-center gap-4 bg-[#D63384] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-pink-500/20 hover:bg-[#B6256B] transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LuSave size={20} />}
                          Sync Registry Changes
                        </button>
                        <button 
                          disabled={isSaving}
                          type="button" 
                          onClick={() => setIsEditing(false)} 
                          className="px-12 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
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
                      className="grid grid-cols-1 md:grid-cols-2 gap-16"
                    >
                      <div className="space-y-3 group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <LuUser size={14} className="text-[#D63384]" /> Operative Alias
                        </p>
                        <p className="text-xl font-black text-slate-900 group-hover:translate-x-2 transition-transform duration-500 uppercase italic tracking-tight">{profile.name}</p>
                      </div>
                      <div className="space-y-3 group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <LuMail size={14} className="text-[#D63384]" /> Core Communication
                        </p>
                        <p className="text-xl font-black text-slate-900 group-hover:translate-x-2 transition-transform duration-500 truncate lowercase">{profile.email}</p>
                      </div>
                      <div className="space-y-3 group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <LuPhone size={14} className="text-[#D63384]" /> Mission Contact
                        </p>
                        <p className="text-xl font-black text-slate-900 group-hover:translate-x-2 transition-transform duration-500 italic tracking-tighter">{profile.phone || 'Registry Missing'}</p>
                      </div>
                      <div className="space-y-3 group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <LuTruck size={14} className="text-[#D63384]" /> Deployment Asset
                        </p>
                        <p className="text-xl font-black text-slate-900 group-hover:translate-x-2 transition-transform duration-500">
                          {profile.vehicleType} <span className="text-slate-300 font-normal mx-2">/</span> <span className="text-[#D63384] italic uppercase">{profile.vehicleNumber || 'Pending ID'}</span>
                        </p>
                      </div>
                      <div className="space-y-4 group md:col-span-2 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <LuMapPin size={14} className="text-[#D63384]" /> Strategic Deployment Sector
                        </p>
                        <div className="flex items-center justify-between">
                           <p className="text-xl font-black text-slate-900 uppercase italic">Central Logistics Grid <span className="text-[#D63384]">Delta-9</span></p>
                           <button className="p-3 bg-white rounded-xl text-slate-400 hover:text-[#D63384] transition-all shadow-sm">
                              <LuExternalLink size={20} />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Compliance Matrix */}
            <div className="bg-[#111827] rounded-[3.5rem] p-12 space-y-10 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D63384]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#D63384] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40">
                    <LuShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-white tracking-tight uppercase italic">Compliance <span className="text-[#D63384]">Matrix</span></h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Verified Asset Registry</p>
                  </div>
                </div>
                <div className="hidden md:block">
                   <div className="flex -space-x-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-[#111827] bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                           {i + 1}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {[
                  { label: 'Identity Proof', icon: LuUser },
                  { label: 'Drivers License', icon: LuFileText },
                  { label: 'RC Registration', icon: LuTruck },
                  { label: 'Business Insurance', icon: LuShieldCheck }
                ].map((doc) => (
                  <div key={doc.label} className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-[#D63384] transition-colors">
                        <doc.icon size={20} />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{doc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <LuBadgeCheck className="text-emerald-500" size={16} />
                       <LuChevronRight className="text-slate-600 group-hover:text-white transition-colors" size={14} />
                    </div>
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

