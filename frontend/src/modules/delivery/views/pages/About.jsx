import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuInfo, LuHeart, LuShieldCheck, LuFileText, LuMail, LuGlobe } from 'react-icons/lu';
import { motion } from 'framer-motion';

const About = () => {
  const infoSections = [
    {
      icon: LuInfo,
      title: 'About Riddha Delivery',
      content: 'Riddha Delivery is a leading delivery partner platform that connects delivery partners with customers across India. We are committed to providing efficient, reliable, and transparent delivery services while ensuring fair compensation for our delivery partners.'
    },
    {
      icon: LuHeart,
      title: 'Our Mission',
      content: 'To empower delivery partners with flexible earning opportunities while providing customers with seamless delivery experiences. We believe in building long-term relationships based on trust and mutual growth.'
    },
    {
      icon: LuShieldCheck,
      title: 'Privacy Policy',
      content: 'We take your privacy seriously. Your personal information is protected with industry-standard encryption and is never shared with third parties without your consent. You can request your data to be deleted at any time.'
    },
    {
      icon: LuFileText,
      title: 'Terms of Service',
      content: 'By using Riddha Delivery, you agree to our terms of service. These terms outline the responsibilities of both delivery partners and the platform. Please read them carefully to understand your rights and obligations.'
    }
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">About</h1>
          <p className="text-warm-sand mt-2">Learn more about Riddha Delivery.</p>
        </div>

        {/* App Info Card */}
        <div className="bg-gradient-to-br from-deep-espresso to-warm-sand rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <LuInfo size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Riddha Delivery</h2>
              <p className="text-white/70">Version 2.0.1</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm text-white/70">Delivery Partners</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">1M+</p>
              <p className="text-sm text-white/70">Deliveries</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-white/70">Cities</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-white/70">Rating</p>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        {infoSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warm-sand/10 text-warm-sand rounded-xl flex items-center justify-center flex-shrink-0">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-deep-espresso mb-2">{section.title}</h3>
                <p className="text-dusty-cocoa leading-relaxed">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal p-6"
        >
          <h3 className="text-lg font-bold text-deep-espresso mb-4">Contact Us</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-soft-oatmeal/30 rounded-lg flex items-center justify-center">
                <LuMail size={20} className="text-warm-sand" />
              </div>
              <div>
                <p className="text-sm text-dusty-cocoa">Email</p>
                <p className="font-bold text-deep-espresso">support@riddha.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-soft-oatmeal/30 rounded-lg flex items-center justify-center">
                <LuGlobe size={20} className="text-warm-sand" />
              </div>
              <div>
                <p className="text-sm text-dusty-cocoa">Website</p>
                <p className="font-bold text-deep-espresso">www.riddha.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-soft-oatmeal">
          <p className="text-dusty-cocoa text-sm">
            © 2024 Riddha Delivery. All rights reserved.
          </p>
          <p className="text-dusty-cocoa text-xs mt-2">
            Made with <LuHeart size={12} className="inline text-red-500" /> in India
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;
