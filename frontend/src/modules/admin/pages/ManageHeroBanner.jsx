import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { LuSave, LuRotateCcw } from 'react-icons/lu';
import { heroBannerData } from '../data/manageHeroBannerData';

const ManageHeroBanner = () => {
  const [banner, setBanner] = useState({ ...heroBannerData });
  const [saved, setSaved] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleChange = (field, value) => {
    setBanner({ ...banner, [field]: value });
    setSaved(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('bgImage', reader.result);
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
    setBanner({ ...heroBannerData });
    setSaved(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
              Hero Banner
            </h1>
            <p className="text-warm-sand mt-1 text-sm md:text-base">
              Manage the main homepage hero banner section.
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
          <h3 className="text-lg font-display font-bold text-deep-espresso mb-6">Banner Content</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={banner.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Elegance in Every Detail."
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Subtitle / Description</label>
              <textarea
                rows={3}
                value={banner.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm resize-none"
                placeholder="A short description shown below the title..."
              />
            </div>

            {/* Background Image URL / Upload */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Background Image</label>
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
                value={banner.bgImage}
                onChange={(e) => handleChange('bgImage', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="Paste remote URL or upload a file..."
              />
            </div>

            {/* Primary Button Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Primary Button Text</label>
              <input
                type="text"
                value={banner.primaryBtnText}
                onChange={(e) => handleChange('primaryBtnText', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Shop Collection"
              />
            </div>

            {/* Secondary Button Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Secondary Button Text</label>
              <input
                type="text"
                value={banner.secondaryBtnText}
                onChange={(e) => handleChange('secondaryBtnText', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. View Gallery"
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

        {/* Hero Banner Preview — mirrors user Banner.jsx */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[280px] md:h-[500px] w-full overflow-hidden rounded-[2rem] group shadow-2xl"
        >
          {/* Background Image */}
          <img
            src={banner.bgImage}
            alt="Hero Banner"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3B2F2F]/80 via-[#3B2F2F]/40 to-[#3B2F2F]/80 md:bg-gradient-to-r md:from-[#3B2F2F]/80 md:via-[#3B2F2F]/30 md:to-transparent flex items-center justify-center md:justify-start">
            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-full max-w-xl space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
                {/* Tag */}
                <span className="inline-block px-4 py-1.5 bg-[#BFA38A]/20 backdrop-blur-md border border-[#BFA38A]/30 text-[#BFA38A] rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase">
                  Exclusive Collection 2026
                </span>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-[1.2] md:leading-[1.1] font-display">
                  {banner.title || 'Your Banner Title'}
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-lg text-[#E0D9CF]/90 leading-relaxed font-light max-w-[95%] md:max-w-none">
                  {banner.subtitle || 'Your banner description text goes here...'}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 w-full sm:w-auto">
                  <span className="px-8 py-3 bg-[#BFA38A] text-[#3B2F2F] rounded-full font-bold text-sm shadow-2xl text-center cursor-default">
                    {banner.primaryBtnText || 'Primary Button'}
                  </span>
                  <span className="px-8 py-3 border-2 border-white text-white rounded-full font-bold text-sm text-center cursor-default hover:bg-white/10 transition-colors">
                    {banner.secondaryBtnText || 'Secondary Button'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Glass Card — Desktop */}
          <div className="absolute bottom-8 right-8 hidden md:block">
            <div className="px-6 py-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl">
              <p className="text-[#3B2F2F] font-display font-bold text-xl mb-0.5 tracking-tight">Top Rated</p>
              <p className="text-[#3B2F2F]/50 text-xs font-medium uppercase tracking-wider">Luxury Tiles & Decor</p>
            </div>
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

export default ManageHeroBanner;
