import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiCheck, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import Button from '../../../shared/components/Button';
import { useUser } from '../data/UserContext';
import api from '../../../shared/utils/api';
import { uploadImage } from '../../../shared/utils/upload';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: ""
  });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.fullName || currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        avatar: currentUser.avatar || ""
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.put('/auth/user/profile', {
        fullName: profile.name,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar
      });
      if (data.success && data.data) {
        setUser({ 
          ...currentUser, 
          fullName: data.data.fullName, 
          email: data.data.email, 
          phone: data.data.phone, 
          avatar: data.data.avatar 
        });
        navigate('/profile');
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
      setIsSaving(true);
      const url = await uploadImage(file);
      setProfile(prev => ({ ...prev, avatar: url }));
      setIsSaving(false);
    } catch (err) {
      console.error('Upload failed:', err);
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pb-32"
    >
      {/* Header */}
      <div className="px-4 py-3 md:px-6 md:py-6 bg-white flex items-center gap-6 border-b border-soft-oatmeal/10 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="hover:bg-soft-oatmeal/20 p-2 rounded-full transition-colors">
          <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
        </button>
        <h1 className="text-xl font-bold text-deep-espresso">Edit Profile</h1>
      </div>

      <div className="px-4 py-2 md:p-12 max-w-2xl mx-auto space-y-8 md:space-y-16 mt-4 md:mt-12">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="h-28 w-28 md:h-44 md:w-44 rounded-full bg-soft-oatmeal/10 flex items-center justify-center border-4 border-white shadow-2xl shadow-soft-oatmeal overflow-hidden relative">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <FiUser className="h-12 w-12 md:h-20 md:w-20 text-deep-espresso/10" />
              )}
              {isSaving && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute bottom-2 right-2 h-10 w-10 md:h-12 md:w-12 bg-deep-espresso text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer hover:bg-warm-sand transition-colors active:scale-90">
              <FiCamera className="h-4 w-4 md:h-5 md:w-5" />
              <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </label>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand">Aesthetics Matter</p>
            <p className="text-xs text-gray-400 font-medium tracking-tight">JPG or PNG. Max size of 800K</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          <div className="space-y-6 md:space-y-10">
            <div className="space-y-2 md:space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand ml-2">Personal Identity</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-oatmeal/20 rounded-xl flex items-center justify-center text-warm-sand">
                  <FiUser size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Your Full Name"
                  className="w-full pl-20 pr-8 py-5 md:py-6 rounded-[24px] border-2 border-transparent bg-soft-oatmeal/5 focus:border-warm-sand focus:bg-white focus:outline-none font-bold text-deep-espresso transition-all shadow-sm focus:shadow-xl focus:shadow-warm-sand/5"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 md:space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand ml-2">Digital Connection</label>
              <div className="relative">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-oatmeal/20 rounded-xl flex items-center justify-center text-warm-sand">
                  <FiMail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Email Address"
                  className="w-full pl-20 pr-8 py-5 md:py-6 rounded-[24px] border-2 border-transparent bg-soft-oatmeal/5 focus:border-warm-sand focus:bg-white focus:outline-none font-bold text-deep-espresso transition-all shadow-sm focus:shadow-xl focus:shadow-warm-sand/5"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 md:space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand ml-2">Secure Link (Phone)</label>
              <div className="relative">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-oatmeal/20 rounded-xl flex items-center justify-center text-warm-sand">
                  <FiPhone size={18} />
                </div>
                <input 
                  type="tel" 
                  placeholder="+91 00000 00000"
                  className="w-full pl-20 pr-8 py-5 md:py-6 rounded-[24px] border-2 border-transparent bg-soft-oatmeal/5 focus:border-warm-sand focus:bg-white focus:outline-none font-bold text-deep-espresso transition-all shadow-sm focus:shadow-xl focus:shadow-warm-sand/5"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              disabled={isSaving}
              type="submit"
              size="lg" 
              className="w-full h-18 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-warm-sand/40 flex items-center justify-center gap-6 active:scale-95 transition-all"
            >
              {isSaving ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiCheck className="text-xl" />
              )}
              {isSaving ? 'Processing Evolution...' : 'Commit Profile Updates'}
            </Button>
            
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="w-full mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-warm-sand transition-colors"
            >
              Abandon Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfile;

