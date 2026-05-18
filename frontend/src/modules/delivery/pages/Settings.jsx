import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuBell, LuUser, LuShieldCheck, LuGlobe, LuMoon, LuSun, LuChevronRight, LuMapPin, LuPhone, LuMail } from 'react-icons/lu';
import { motion } from 'framer-motion';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    paymentAlerts: true,
    promotions: false,
    emailNotifications: true,
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: LuUser,
      items: [
        { label: 'Edit Profile', description: 'Update your personal information', action: 'edit' },
        { label: 'Change Password', description: 'Secure your account', action: 'password' },
        { label: 'Vehicle Details', description: 'Update your vehicle information', action: 'vehicle' },
      ]
    },
    {
      title: 'Notifications',
      icon: LuBell,
      items: [
        { label: 'Order Alerts', description: 'Get notified for new orders', toggle: 'orderAlerts' },
        { label: 'Payment Alerts', description: 'Get notified for payments', toggle: 'paymentAlerts' },
        { label: 'Promotions', description: 'Receive promotional offers', toggle: 'promotions' },
        { label: 'Email Notifications', description: 'Receive email updates', toggle: 'emailNotifications' },
      ]
    },
    {
      title: 'Preferences',
      icon: LuGlobe,
      items: [
        { label: 'Language', description: 'English', value: language },
        { label: 'Theme', description: theme === 'light' ? 'Light Mode' : 'Dark Mode', value: theme },
      ]
    },
    {
      title: 'Security',
      icon: LuShieldCheck,
      items: [
        { label: 'Two-Factor Authentication', description: 'Add extra security', action: '2fa' },
        { label: 'Login History', description: 'View recent logins', action: 'history' },
      ]
    }
  ];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto space-y-4 pb-12">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Customize your account preferences.</p>
        </div>

        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="w-8 h-8 bg-teal-50 text-[#189D91] rounded-lg flex items-center justify-center">
                <section.icon size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (item.action === 'edit' || item.action === 'vehicle') navigate('/delivery/profile');
                  }}
                  className={`px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors ${item.action ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                    <p className="text-[10px] font-medium text-slate-500">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.toggle !== undefined ? (
                      <button
                        onClick={() => toggleNotification(item.toggle)}
                        className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${
                          notifications[item.toggle] ? 'bg-[#189D91]' : 'bg-slate-200'
                        }`}
                      >
                        <motion.div
                          animate={{ x: notifications[item.toggle] ? 18 : 2 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    ) : item.value ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-xs font-medium">{item.description}</span>
                        {item.label === 'Theme' && (
                          <button
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center hover:bg-[#189D91] hover:text-white transition-colors"
                          >
                            {theme === 'light' ? <LuMoon size={14} /> : <LuSun size={14} />}
                          </button>
                        )}
                      </div>
                    ) : (
                      <LuChevronRight size={16} className="text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Delete Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-rose-50 rounded-xl border border-rose-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-rose-600">Delete Account</h3>
              <p className="text-[10px] font-medium text-rose-500 mt-0.5">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-colors">
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
