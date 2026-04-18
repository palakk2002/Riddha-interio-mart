import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { LuSave, LuRotateCcw, LuUpload, LuArrowLeft } from 'react-icons/lu';
import { promoBannerData } from '../../models/managePromoBannerData';

const ManagePromoBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [banner, setBanner] = useState({
    id: null,
    title: '',
    subtitle: '',
    image: '',
    ctaText: 'Shop Now',
    order: 0,
    isActive: true,
  });
  
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      try {
        const savedData = localStorage.getItem('admin_promo_banners');
        const banners = savedData ? JSON.parse(savedData) : [];
        const existingBanner = banners.find(b => b.id === parseInt(id));
        if (existingBanner) {
          setBanner(existingBanner);
        } else {
          setSaveError('Banner not found.');
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
        setBanner({ ...banner, image: reader.result });
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    try {
      const savedData = localStorage.getItem('admin_promo_banners');
      let banners = savedData ? JSON.parse(savedData) : [];

      if (isEditMode) {
        banners = banners.map(b => b.id === parseInt(id) ? { ...banner, id: parseInt(id) } : b);
      } else {
        const newBanner = {
          ...banner,
          id: Date.now(),
        };
        banners = [...banners, newBanner];
      }

      localStorage.setItem('admin_promo_banners', JSON.stringify(banners));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        navigate('/admin/manage-promo');
      }, 1000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError('Storage limit reached! Please use a smaller image.');
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      const savedData = localStorage.getItem('admin_promo_banners');
      const banners = savedData ? JSON.parse(savedData) : [];
      const existingBanner = banners.find(b => b.id === parseInt(id));
      if (existingBanner) {
        setBanner(existingBanner);
      }
    } else {
      setBanner({
        id: null,
        title: '',
        subtitle: '',
        image: '',
        ctaText: 'Shop Now',
        order: 0,
        isActive: true,
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
              onClick={() => navigate('/admin/manage-promo')}
              className="p-3 bg-white rounded-2xl border border-soft-oatmeal text-warm-sand hover:text-deep-espresso hover:shadow-md transition-all"
            >
              <LuArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
                {isEditMode ? 'Edit Promo Banner' : 'Add Promo Banner'}
              </h1>
              <p className="text-warm-sand mt-1 text-sm md:text-base">
                {isEditMode ? 'Update the promotional banner content.' : 'Create a new promotional banner.'}
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
              {saved ? 'Saved!' : isSaving ? 'Saving...' : (
                <><LuSave size={16} /> {isEditMode ? 'Update Changes' : 'Save Banner'}</>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-soft-oatmeal shadow-sm">
          <h3 className="text-lg font-display font-bold text-deep-espresso mb-6">Promo Content</h3>
          {saveError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-500">
              {saveError}
            </div>
          )}
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={banner.title}
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
                value={banner.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Min. 40% Off"
              />
            </div>

            {/* CTA Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">CTA Button Text</label>
              <input
                type="text"
                value={banner.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                placeholder="e.g. Shop Now"
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Display Order</label>
              <input
                type="number"
                value={banner.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
              />
            </div>

             {/* Status Toggle */}
             <div className="flex items-center gap-4 py-2">
              <span className="text-xs font-bold text-warm-sand uppercase tracking-wider">Status:</span>
              <button
                type="button"
                onClick={() => handleChange('isActive', !banner.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  banner.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    banner.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-bold text-deep-espresso">{banner.isActive ? 'Active' : 'Hidden'}</span>
            </div>

            {/* Image Upload */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">Banner Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="aspect-[21/9] bg-soft-oatmeal/10 border-2 border-dashed border-soft-oatmeal rounded-xl overflow-hidden relative group cursor-pointer hover:border-warm-sand/50 transition-all"
              >
                {banner.image ? (
                  <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-sand">
                    <LuUpload size={24} className="opacity-40 mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">Upload Image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change Image</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-soft-oatmeal/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-warm-sand">Live Preview</span>
            <div className="h-px flex-1 bg-soft-oatmeal/40" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row h-auto sm:h-40 md:h-64 rounded-xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-soft-oatmeal/10 bg-white"
          >
            <div className="w-full sm:w-[38%] md:w-[30%] bg-white flex flex-col justify-center px-6 md:px-12 py-6 md:py-8 space-y-2 md:space-y-4">
              <h3 className="text-lg sm:text-xl md:text-3xl font-black text-deep-espresso leading-tight uppercase tracking-tight">
                {banner.title || 'Your Title'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm md:text-lg font-bold text-warm-sand uppercase tracking-widest">
                  {banner.subtitle || 'Your Offer'}
                </span>
                <span className="text-sm md:text-xl">→</span>
              </div>
              {banner.ctaText && (
                <span className="inline-block w-fit px-5 py-2 bg-deep-espresso text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
                  {banner.ctaText}
                </span>
              )}
            </div>
            <div className="w-full sm:w-[62%] md:w-[70%] relative overflow-hidden bg-soft-oatmeal/5 h-48 sm:h-full">
              <img src={banner.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200'} alt="" className="h-full w-full object-cover" />
              <p className="absolute bottom-3 md:bottom-6 right-4 md:right-10 text-[7px] md:text-[10px] text-white/50 font-bold tracking-widest uppercase">
                *T&C Apply
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManagePromoBanner;
