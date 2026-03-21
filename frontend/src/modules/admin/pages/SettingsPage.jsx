import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuUser, LuMail, LuShield, LuBell, LuPalette, LuSave } from 'react-icons/lu';

const SettingsPage = () => {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-deep-espresso">System Settings</h1>
          <p className="text-warm-sand mt-1">Manage your administrator account and preferences.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-soft-oatmeal overflow-hidden">
          {/* Tabs header placeholder */}
          <div className="flex border-b border-soft-oatmeal px-6 overflow-x-auto no-scrollbar">
            {['Profile', 'Notifications', 'Security', 'Appearance'].map((tab, i) => (
              <button 
                key={tab} 
                className={`py-4 px-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${i === 0 ? 'text-dusty-cocoa border-dusty-cocoa' : 'text-warm-sand border-transparent hover:text-deep-espresso'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-8">
            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold text-deep-espresso flex items-center gap-2">
                  <LuUser className="text-warm-sand" size={20} /> Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" defaultValue="Alex Johnson" className="w-full bg-[#FDFBF9] border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                      <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={16} />
                      <input type="email" defaultValue="admin@riddha.com" className="w-full bg-[#FDFBF9] border border-soft-oatmeal rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold text-deep-espresso flex items-center gap-2">
                  <LuShield className="text-warm-sand" size={20} /> Password & Security
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-widest pl-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#FDFBF9] border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-widest pl-1">New Password</label>
                    <input type="password" placeholder="Leave blank to keep current" className="w-full bg-[#FDFBF9] border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-soft-oatmeal" />

            {/* Other preferences snippets */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 text-red-400 rounded-xl">
                    <LuBell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-deep-espresso">Email Notifications</h4>
                    <p className="text-xs text-warm-sand">Receive weekly store performance reports via email.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-warm-sand rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-400 rounded-xl">
                    <LuPalette size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-deep-espresso">Compact Layout</h4>
                    <p className="text-xs text-warm-sand">Show more items in tables by reducing row padding.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-soft-oatmeal rounded-full relative cursor-pointer transition-colors shadow-inner">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button className="flex items-center gap-2 bg-deep-espresso text-white px-8 py-3 rounded-xl font-bold hover:bg-dusty-cocoa hover:shadow-lg transition-all active:scale-95">
                <LuSave size={18} /> Save Settings
              </button>
            </div>
          </div>
        </div>

        <div className="bg-golden-glow/20 p-6 rounded-2xl border border-warm-sand/20 text-center">
          <p className="text-xs font-bold text-deep-espresso/60 uppercase tracking-widest">Store Status</p>
          <h4 className="text-xl font-display font-bold text-deep-espresso mt-1">Riddha Interio Mart is <span className="text-green-600">Live</span></h4>
          <p className="text-sm text-warm-sand mt-2 max-w-md mx-auto">Maintain your catalog regularly to ensure the best shopping experience for your customers.</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
