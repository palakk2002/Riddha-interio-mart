import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuUser, LuPhone, LuTruck, LuShieldCheck, LuMapPin, LuLogOut } from 'react-icons/lu';
import { profileData as initialProfileData } from '../data/deliveryData';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profile, setProfile] = useState(initialProfileData);

  const toggleOnline = () => {
    setProfile(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Profile</h1>
            <p className="text-warm-sand mt-2">Manage your partner account and availability.</p>
          </div>
          
          {/* Availability Toggle */}
          <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center gap-4 ${
            profile.isOnline 
              ? 'bg-green-50 border-green-100 ring-4 ring-green-500/5' 
              : 'bg-soft-oatmeal/20 border-soft-oatmeal'
          }`}>
            <div className="text-right">
              <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest">Status</p>
              <p className={`text-sm font-bold ${profile.isOnline ? 'text-green-600' : 'text-dusty-cocoa'}`}>
                {profile.isOnline ? 'Online & Active' : 'Offline'}
              </p>
            </div>
            <button 
              onClick={toggleOnline}
              className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${
                profile.isOnline ? 'bg-green-500' : 'bg-soft-oatmeal'
              }`}
            >
              <motion.div 
                animate={{ x: profile.isOnline ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal p-8 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-24 h-24 bg-warm-sand/20 rounded-full flex items-center justify-center text-warm-sand mx-auto mb-4 border-4 border-white shadow-xl">
                  <LuUser size={48} />
                </div>
                <h3 className="text-xl font-display font-bold text-deep-espresso">{profile.name}</h3>
                <p className="text-xs font-bold text-warm-sand uppercase tracking-widest mt-1">Delivery Partner</p>
                
                <div className="mt-8 pt-8 border-t border-soft-oatmeal space-y-4">
                  <div className="flex items-center gap-3 text-sm text-dusty-cocoa">
                    <LuShieldCheck size={18} className="text-warm-sand" />
                    <span className="font-medium italic">Verified Gold Member</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-soft-oatmeal/20 rounded-full blur-3xl"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-soft-oatmeal/20 text-red-500 font-bold hover:bg-red-50 transition-colors">
              <LuLogOut size={20} />
              Sign Out
            </button>
          </div>

          {/* Details & Settings */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal overflow-hidden">
              <div className="p-6 border-b border-soft-oatmeal">
                <h3 className="text-lg font-bold text-deep-espresso">Account Information</h3>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest flex items-center gap-1">
                    <LuUser size={12} /> Full Name
                  </p>
                  <p className="text-sm font-bold text-deep-espresso">{profile.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest flex items-center gap-1">
                    <LuPhone size={12} /> Contact Number
                  </p>
                  <p className="text-sm font-bold text-deep-espresso">{profile.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest flex items-center gap-1">
                    <LuTruck size={12} /> Vehicle Type
                  </p>
                  <p className="text-sm font-bold text-deep-espresso">{profile.vehicleType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest flex items-center gap-1">
                    <LuMapPin size={12} /> Primary Zone
                  </p>
                  <p className="text-sm font-bold text-deep-espresso">Jaipur Central (JKR)</p>
                </div>
              </div>
            </div>

            <div className="bg-warm-sand/5 border border-soft-oatmeal rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-warm-sand text-white rounded-xl flex items-center justify-center">
                  <LuShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-deep-espresso">Documents Verified</h4>
                  <p className="text-xs text-dusty-cocoa">All your mandatory documents are up to date.</p>
                </div>
              </div>
              <div className="space-y-3">
                {['Aadhar Card', 'Driving License', 'RC (Vehicle Registration)', 'Insurance'].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-3 bg-white border border-soft-oatmeal rounded-xl">
                    <span className="text-xs font-bold text-deep-espresso">{doc}</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">ACTIVE</span>
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
