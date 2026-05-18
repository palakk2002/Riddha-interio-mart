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
  LuBadgeCheck,
  LuCheck
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
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      {/* Top Header */}
      <div className="bg-white text-slate-900 px-4 py-5 flex items-center shadow-sm border-b border-slate-100 mb-6 sticky top-0 z-20">
        <button onClick={() => window.history.back()} className="p-1 text-slate-500 hover:text-slate-900 transition-colors">
          <LuChevronRight className="rotate-180" size={24} />
        </button>
        <h1 className="text-base font-bold flex-1 text-center mr-6">Partner Profile</h1>
      </div>

      <div className="px-4 space-y-5 max-w-4xl mx-auto lg:py-2">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form 
              key="edit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSave} 
              className="space-y-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto"
            >
              <h2 className="text-base font-semibold text-slate-800 mb-4 border-b pb-3">Edit Details</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-[#2A458A] focus:bg-white px-3 py-2 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Email Address</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-[#2A458A] focus:bg-white px-3 py-2 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Phone Number</label>
                  <input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-[#2A458A] focus:bg-white px-3 py-2 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Vehicle Type</label>
                  <select value={profile.vehicleType} onChange={(e) => setProfile({...profile, vehicleType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-[#2A458A] focus:bg-white px-3 py-2 rounded-xl text-sm font-medium outline-none">
                    <option value="Bike">Bike</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Vehicle Number</label>
                  <input value={profile.vehicleNumber} onChange={(e) => setProfile({...profile, vehicleNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-[#2A458A] focus:bg-white px-3 py-2 rounded-xl text-sm font-medium outline-none uppercase" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-xs hover:bg-slate-200 w-1/3">Cancel</button>
                <button disabled={isSaving} type="submit" className="flex-1 bg-[#2A458A] text-white py-2.5 rounded-xl font-semibold text-xs shadow hover:bg-[#1f346b]">{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="view-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="space-y-5">
                {/* Section 1: Profile details */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile details</h2>
                    <button onClick={() => setIsEditing(true)} className="text-[#2A458A] text-xs font-semibold hover:underline">Edit</button>
                  </div>
                  <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                          <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=2A458A&color=fff`} alt={profile.name} className="w-full h-full object-cover" />
                        </div>
                        <label className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow shadow-slate-300 cursor-pointer hover:scale-110 transition-transform border border-slate-100">
                          <FiEdit2 size={10} className="text-[#2A458A]" />
                          <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                        </label>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">{profile.name}</h3>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{profile.email.split('@')[0]} Partner</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#2A458A]/10 text-[#2A458A] flex items-center justify-center shadow-sm">
                      <LuCheck size={12} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Profile setting */}
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Profile setting</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 hover:border-[#2A458A]/30 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#2A458A] flex items-center justify-center group-hover:bg-[#2A458A] group-hover:text-white transition-colors">
                        <LuUser size={16} />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">Profile</span>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 hover:border-[#2A458A]/30 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#2A458A] flex items-center justify-center group-hover:bg-[#2A458A] group-hover:text-white transition-colors">
                        <LuTruck size={16} />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">Vehicle</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Section 3: Vehicle info */}
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle info</h2>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#2A458A] flex items-center justify-center shrink-0">
                        <LuTruck size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{profile.vehicleType}</p>
                        <p className="text-[11px] font-medium text-slate-500">Verified Partner Vehicle</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                      <div className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#2A458A] flex items-center justify-center shrink-0">
                        <LuFileText size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm uppercase tracking-wide">{profile.vehicleNumber || 'Pending Registration'}</p>
                        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                           Status: <span className="text-[#189D91] bg-teal-50 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{profile.approvalStatus}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Training modules */}
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Training modules</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 hover:border-[#2A458A]/30 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#2A458A] flex items-center justify-center group-hover:bg-[#2A458A] group-hover:text-white transition-colors">
                        <LuActivity size={16} />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">Payout Calls</span>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 hover:border-[#2A458A]/30 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#2A458A] flex items-center justify-center group-hover:bg-[#2A458A] group-hover:text-white transition-colors">
                        <LuFileText size={16} />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">Permissions</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4 max-w-sm mx-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-rose-100 text-rose-500 font-semibold text-xs hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
          >
            <LuLogOut size={16} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;

