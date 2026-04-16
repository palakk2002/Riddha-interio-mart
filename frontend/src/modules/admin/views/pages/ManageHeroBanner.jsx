import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { LuSave, LuRotateCcw, LuUpload, LuArrowLeft } from 'react-icons/lu';
import { heroBannerData } from '../../models/manageHeroBannerData';

const ManageHeroBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [banner, setBanner] = useState({
    id: null,
    title: '',
    subtitle: '',
    bgImage: '',
    primaryBtnText: '',
    secondaryBtnText: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      try {
        const saved = localStorage.getItem('admin_hero_banners');
        const banners = saved ? JSON.parse(saved) : heroBannerData;
        const existingBanner = banners.find(b => b.id === parseInt(id));
        if (existingBanner) {
          setBanner(existingBanner);
        }
      } catch (err) {
        console.error('Failed to load banner:', err);
      }
    }
    setLoading(false);
  }, [id, isEditMode]);

  const handleChange = (field, value) => {
    setBanner({ ...banner, [field]: value });
    setSaved(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image too large (max 2MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner({ ...banner, bgImage: reader.result });
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    const saved = localStorage.getItem('admin_hero_banners');
    let banners = saved ? JSON.parse(saved) : heroBannerData;

    if (isEditMode) {
      banners = banners.map(b => b.id === parseInt(id) ? { ...banner, id: parseInt(id) } : b);
    } else {
      const newBanner = {
        ...banner,
        id: Date.now(),
      };
      banners = [...banners, newBanner];
    }

    try {
      localStorage.setItem('admin_hero_banners', JSON.stringify(banners));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        navigate('/admin/manage-hero');
      }, 1000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError('Storage limit reached! Please use a smaller image.');
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      const saved = localStorage.getItem('admin_hero_banners');
      const banners = saved ? JSON.parse(saved) : heroBannerData;
      const existingBanner = banners.find(b => b.id === parseInt(id));
      if (existingBanner) {
        setBanner(existingBanner);
      }
    } else {
      setBanner({
        id: null,
        title: '',
        subtitle: '',
        bgImage: '',
        primaryBtnText: '',
        secondaryBtnText: '',
      });
    }
    setSaved(false);
  };

  if (loading) return <PageWrapper><div className="flex items-center justify-center min-h-[60vh] text-warm-sand">Loading...</div></PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/manage-hero')}
              className="p-3 bg-white rounded-2xl border border-soft-oatmeal text-warm-sand hover:text-deep-espresso hover:shadow-md transition-all"
            >
              <LuArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
                {isEditMode ? 'Edit Banner' : 'Add Banner'}
              </h1>
              <p className="text-warm-sand mt-1 text-sm md:text-base">
                {isEditMode ? 'Update the hero banner content.' : 'Create a new hero banner.'}
              </p>
            </div>
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
              disabled={isSaving || saved}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md ${
                saved
                  ? 'bg-green-500 text-white shadow-green-200'
                  : isSaving
                  ? 'bg-dusty-cocoa text-white'
                  : 'bg-dusty-cocoa text-white hover:bg-deep-espresso shadow-dusty-cocoa/20'
              }`}
            >
              {saved ? (
                <>Saved!</>
              ) : isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <LuSave size={16} /> {isEditMode ? 'Update Banner' : 'Save Banner'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-soft-oatmeal shadow-sm">
          <h3 className="text-lg font-display font-bold text-deep-espresso mb-6">Banner Content</h3>
          {saveError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-500">
              {saveError}
            </div>
          )}
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

            {/* Background Image Upload */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Background Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="aspect-video bg-soft-oatmeal/10 border-2 border-dashed border-soft-oatmeal rounded-xl overflow-hidden relative group cursor-pointer hover:border-warm-sand/50 hover:bg-soft-oatmeal/20 transition-all"
              >
                {banner.bgImage ? (
                  <img
                    src={banner.bgImage}
                    alt="Banner Preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-sand p-6 text-center">
                    <div className="w-12 h-12 bg-soft-oatmeal/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-warm-sand/10 transition-colors">
                      <LuUpload size={24} className="opacity-40" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Click to Upload</p>
                    <p className="text-[9px] font-medium opacity-60 mt-1">Supports JPG, PNG, WEBP</p>
                  </div>
                )}
                {banner.bgImage && (
                  <div className="absolute inset-0 bg-deep-espresso/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Change Image</span>
                  </div>
                )}
              </div>
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

        {/* Hero Banner Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[280px] md:h-[500px] w-full overflow-hidden rounded-[2rem] group shadow-2xl"
        >
          {/* Background Image */}
          <img
            src={banner.bgImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80'}
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
