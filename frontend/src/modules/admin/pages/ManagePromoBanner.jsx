import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { LuSave, LuRotateCcw } from 'react-icons/lu';
import { promoBannerData } from '../data/managePromoBannerData';

const ManagePromoBanner = () => {
  const [promo, setPromo] = useState({ ...promoBannerData });
  const [saved, setSaved] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleChange = (field, value) => {
    setPromo({ ...promo, [field]: value });
    setSaved(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPromo({ ...promoBannerData });
    setSaved(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
              Promo Banner
            </h1>
            <p className="text-warm-sand mt-1 text-sm md:text-base">
              Manage the homepage promotional offer banner.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-soft-oatmeal text-deep-espresso px-5 py-2.5 rounded-xl font-bold hover:bg-soft-oatmeal/20 transition-all text-sm"
            >
              <LuRotateCcw size={16} /> Reset
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md ${
                saved
                  ? 'bg-green-500 text-white shadow-green-200'
                  : 'bg-dusty-cocoa text-white hover:bg-deep-espresso shadow-dusty-cocoa/20'
              }`}
            >
              <LuSave size={16} /> {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-soft-oatmeal shadow-sm">
          <h3 className="text-lg font-display font-bold text-deep-espresso mb-6">Promo Content</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={promo.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Turn On The Charm"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Subtitle / Offer</label>
              <input
                type="text"
                value={promo.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Min. 40% Off"
              />
            </div>

            {/* Image URL / Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Image Assets</label>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-[10px] font-black text-deep-espresso uppercase tracking-widest hover:underline"
                >
                  Upload File
                </button>
              </div>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*"
              />
              <input
                type="text"
                value={promo.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="Paste remote URL or upload..."
              />
            </div>

            {/* CTA Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">CTA Button Text</label>
              <input
                type="text"
                value={promo.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Shop Now"
              />
            </div>
          </form>
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-warm-sand">
            Live Preview
          </span>
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
        </div>

        {/* Promo Banner Preview — mirrors user OfferBanner.jsx */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row h-auto sm:h-40 md:h-64 rounded-xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-soft-oatmeal/10 bg-white"
        >
          {/* Left Content */}
          <div className="w-full sm:w-[38%] md:w-[30%] bg-white flex flex-col justify-center px-6 md:px-12 py-6 md:py-8 space-y-2 md:space-y-4">
            <h3 className="text-lg sm:text-xl md:text-3xl font-black text-deep-espresso leading-tight uppercase tracking-tight">
              {promo.title || 'Your Title'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm md:text-lg font-bold text-warm-sand uppercase tracking-widest">
                {promo.subtitle || 'Your Offer'}
              </span>
              <span className="text-sm md:text-xl">→</span>
            </div>
            {promo.ctaText && (
              <span className="inline-block w-fit px-5 py-2 bg-deep-espresso text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider cursor-default mt-1">
                {promo.ctaText}
              </span>
            )}
          </div>

          {/* Right Image */}
          <div className="w-full sm:w-[62%] md:w-[70%] relative overflow-hidden bg-soft-oatmeal/5 h-48 sm:h-full">
            <img
              src={promo.image}
              alt="Promo Banner"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Slider Dots */}
            <div className="absolute bottom-3 md:bottom-6 left-4 md:left-10 flex gap-1.5 md:gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 md:h-2 rounded-full transition-all duration-300 ${
                    i === 1 ? 'w-4 md:w-8 bg-[#FF6B35]' : 'w-1 md:w-2 bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* T&C */}
            <p className="absolute bottom-3 md:bottom-6 right-4 md:right-10 text-[7px] md:text-[10px] text-white/50 font-bold tracking-widest uppercase">
              *T&C Apply
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="bg-white p-4 rounded-xl border border-soft-oatmeal/30 flex items-center justify-between text-xs text-warm-sand">
          <p>Preview updates as you type — <span className="font-bold text-deep-espresso">no page reload needed</span></p>
          <span className="text-[10px] bg-golden-glow/30 text-deep-espresso/60 px-3 py-1 rounded-full font-bold border border-warm-sand/20">
            Frontend Preview Only
          </span>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManagePromoBanner;
