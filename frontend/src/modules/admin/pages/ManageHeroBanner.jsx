import React, { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import {
  LuImagePlus,
  LuImages,
  LuLoader,
  LuPencil,
  LuRotateCcw,
  LuSave,
  LuTrash2,
} from 'react-icons/lu';
import api from '../../../shared/utils/api';
import { uploadImage } from '../../../shared/utils/upload';
import { toast } from 'react-hot-toast';

const createEmptyBanner = () => ({
  title: '',
  subtitle: '',
  bgImage: {
    src: '',
    alt: '',
    caption: '',
  },
  primaryBtnText: '',
  primaryBtnLink: '',
  secondaryBtnText: '',
  secondaryBtnLink: '',
});

const mapBannerToForm = (banner) => ({
  title: banner?.title || '',
  subtitle: banner?.subtitle || '',
  bgImage: {
    src: banner?.bgImage?.src || '',
    alt: banner?.bgImage?.alt || '',
    caption: banner?.bgImage?.caption || '',
  },
  primaryBtnText: banner?.primaryBtnText || 'Shop Collection',
  primaryBtnLink: banner?.primaryBtnLink || '/shop',
  secondaryBtnText: banner?.secondaryBtnText || 'View Gallery',
  secondaryBtnLink: banner?.secondaryBtnLink || '/gallery',
});

const buildPayload = (form) => ({
  title: form.title.trim(),
  subtitle: form.subtitle?.trim() || '',
  bgImage: {
    src: form.bgImage?.src?.trim() || '',
    alt: form.bgImage?.alt?.trim() || 'Homepage hero banner image',
    caption: form.bgImage?.caption?.trim() || '',
  },
  primaryBtnText: form.primaryBtnText?.trim() || 'Shop Collection',
  primaryBtnLink: form.primaryBtnLink?.trim() || '/shop',
  secondaryBtnText: form.secondaryBtnText?.trim() || 'View Gallery',
  secondaryBtnLink: form.secondaryBtnLink?.trim() || '/gallery',
});

const ManageHeroBanner = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [bannerForm, setBannerForm] = useState(createEmptyBanner());
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const fileInputRef = React.useRef(null);

  const totalBanners = banners.length;

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/home-banner');
      const list = Array.isArray(data?.data) ? data.data : [];
      setBanners(list);
    } catch (error) {
      console.error('Failed to fetch home banners:', error);
      toast.error('Failed to load homepage banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Flush state leaks when changing tabs
  useEffect(() => {
    resetForm();
  }, [activeTab]);

  const handleChange = (field, value) => {
    if (field.startsWith('bgImage.')) {
      const key = field.split('.')[1];
      setBannerForm((prev) => ({
        ...prev,
        bgImage: {
          ...prev.bgImage,
          [key]: value,
        },
      }));
    } else {
      setBannerForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerForm((prev) => ({
        ...prev,
        bgImage: {
          ...prev.bgImage,
          src: reader.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setBannerForm(createEmptyBanner());
    setEditingId(null);
    setImgFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveBanner = async (e) => {
    if (e) e.preventDefault();

    const payload = buildPayload(bannerForm);

    if (!payload.title) {
      toast.error('Please add a banner title.');
      return;
    }

    if (!payload.bgImage.src) {
      toast.error('Please add a background image URL or upload a file.');
      return;
    }

    const saveToast = toast.loading(editingId ? 'Updating banner...' : 'Creating banner...');

    try {
      setSubmitting(true);

      let finalImageUrl = bannerForm.bgImage.src;
      if (imgFile) {
        finalImageUrl = await uploadImage(imgFile);
      }

      const fullPayload = {
        ...payload,
        bgImage: {
          ...payload.bgImage,
          src: finalImageUrl
        }
      };

      if (editingId) {
        await api.put(`/home-banner/${editingId}`, fullPayload);
        toast.success('Banner updated successfully.', { id: saveToast });
      } else {
        await api.post('/home-banner', fullPayload);
        toast.success('Banner created successfully.', { id: saveToast });
      }

      await fetchBanners();
      resetForm();
      setActiveTab('all');
    } catch (error) {
      console.error('Failed to save banner:', error);
      toast.error(error.response?.data?.error || 'Failed to save banner.', { id: saveToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner) => {
    setBannerForm(mapBannerToForm(banner));
    setEditingId(banner._id);
    setActiveTab('create');
    toast.success(`Editing: ${banner.title.slice(0, 20)}...`);
  };

  const handleDelete = async (banner) => {
    const allowDelete = window.confirm(`Delete banner "${banner.title}"?`);
    if (!allowDelete) return;

    const deleteToast = toast.loading('Deleting banner...');
    try {
      setDeletingId(banner._id);
      await api.delete(`/home-banner/${banner._id}`);
      toast.success('Banner deleted successfully.', { id: deleteToast });
      await fetchBanners();

      if (editingId === banner._id) {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to delete banner:', error);
      toast.error(error.response?.data?.error || 'Failed to delete banner.', { id: deleteToast });
    } finally {
      setDeletingId(null);
    }
  };

  const createButtonLabel = useMemo(() => {
    if (submitting) return editingId ? 'Updating...' : 'Creating...';
    return editingId ? 'Update Banner' : 'Create Banner';
  }, [editingId, submitting]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[#240046] tracking-tight leading-none">
              Home Banner
            </h1>
            <p className="subtitle mt-2">
              Create, edit and manage multiple homepage banners.
            </p>
          </div>
          <div className="px-3 py-2 rounded-full bg-soft-oatmeal/40 border border-soft-oatmeal text-xs font-bold tracking-wider text-deep-espresso">
            Total Banners: {totalBanners}
          </div>
        </div>

        <div className="inline-flex p-1.5 rounded-2xl border border-soft-oatmeal bg-white shadow-sm w-full md:w-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'create'
                ? 'bg-deep-espresso text-white shadow-sm'
                : 'text-deep-espresso hover:bg-soft-oatmeal/30'
            }`}
          >
            <LuImagePlus size={16} />
            Create Banner
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'all'
                ? 'bg-deep-espresso text-white shadow-sm'
                : 'text-deep-espresso hover:bg-soft-oatmeal/30'
            }`}
          >
            <LuImages size={16} />
            All Banners
          </button>
        </div>

        {activeTab === 'create' && (
          <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-soft-oatmeal shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-display font-bold text-deep-espresso">
                  {editingId ? 'Edit Banner' : 'Create New Banner'}
                </h3>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 border border-soft-oatmeal text-deep-espresso px-5 py-2.5 rounded-xl font-bold hover:bg-soft-oatmeal/20 transition-all text-sm"
                  >
                    <LuRotateCcw size={16} /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBanner}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md bg-dusty-cocoa text-white hover:bg-deep-espresso disabled:opacity-60"
                  >
                    {submitting ? <LuLoader className="animate-spin" size={16} /> : <LuSave size={16} />} {createButtonLabel}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveBanner} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="e.g. Elegance in Every Detail."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={bannerForm.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm resize-none"
                    placeholder="A short description shown below the title..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Background Image</label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
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
                    value={bannerForm.bgImage?.src || ''}
                    onChange={(e) => handleChange('bgImage.src', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="Paste remote URL or upload a file..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Image Alt Text</label>
                  <input
                    type="text"
                    value={bannerForm.bgImage?.alt || ''}
                    onChange={(e) => handleChange('bgImage.alt', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="Describe the image for accessibility..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Image Caption</label>
                  <input
                    type="text"
                    value={bannerForm.bgImage?.caption || ''}
                    onChange={(e) => handleChange('bgImage.caption', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="Optional caption..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Primary Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.primaryBtnText}
                    onChange={(e) => handleChange('primaryBtnText', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="e.g. Shop Collection"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Primary Button Link</label>
                  <input
                    type="text"
                    value={bannerForm.primaryBtnLink}
                    onChange={(e) => handleChange('primaryBtnLink', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="e.g. /shop"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Secondary Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.secondaryBtnText}
                    onChange={(e) => handleChange('secondaryBtnText', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="e.g. View Gallery"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Secondary Button Link</label>
                  <input
                    type="text"
                    value={bannerForm.secondaryBtnLink}
                    onChange={(e) => handleChange('secondaryBtnLink', e.target.value)}
                    className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="e.g. /gallery"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-soft-oatmeal/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-teal">
                Live Preview
              </span>
              <div className="h-px flex-1 bg-soft-oatmeal/40" />
            </div>

            <div className="relative h-[280px] md:h-[500px] w-full overflow-hidden rounded-[2rem] group shadow-2xl bg-soft-oatmeal/20">
              {bannerForm.bgImage?.src ? (
                <img
                  src={bannerForm.bgImage.src}
                  alt={bannerForm.bgImage?.alt || 'Hero Banner'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-brand-teal">
                  No image selected
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-[#3B2F2F]/80 via-[#3B2F2F]/40 to-[#3B2F2F]/80 md:bg-gradient-to-r md:from-[#3B2F2F]/80 md:via-[#3B2F2F]/30 md:to-transparent flex items-center justify-center md:justify-start">
                <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="w-full max-w-xl space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
                    <span className="inline-block px-4 py-1.5 bg-brand-teal/20 backdrop-blur-md border border-brand-teal/30 text-brand-teal rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase">
                      Preview
                    </span>

                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-[1.2] md:leading-[1.1] font-display">
                      {bannerForm.title || 'Your Banner Title'}
                    </h1>

                    <p className="text-sm md:text-lg text-[#E0D9CF]/90 leading-relaxed font-light max-w-[95%] md:max-w-none">
                      {bannerForm.subtitle || 'Your banner description text goes here...'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 w-full sm:w-auto">
                      <span className="px-8 py-3 bg-brand-teal text-white rounded-full font-bold text-sm shadow-2xl text-center cursor-default">
                        {bannerForm.primaryBtnText || 'Primary Button'}
                      </span>
                      <span className="px-8 py-3 border-2 border-white text-white rounded-full font-bold text-sm text-center cursor-default">
                        {bannerForm.secondaryBtnText || 'Secondary Button'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-soft-oatmeal shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-[16/9] bg-slate-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-8 bg-slate-200 rounded-xl flex-1"></div>
                        <div className="h-8 bg-slate-200 rounded-xl flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : banners.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-soft-oatmeal text-center">
                <div className="w-16 h-16 bg-soft-oatmeal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuImages size={32} className="text-warm-sand opacity-40" />
                </div>
                <h3 className="text-lg font-bold text-deep-espresso mb-2">No Banners Yet</h3>
                <p className="text-warm-sand text-sm mb-6">Create a banner and it will appear here.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center gap-2 bg-deep-espresso text-white px-6 py-3 rounded-xl font-bold hover:bg-dusty-cocoa transition-all shadow-sm"
                >
                  Create First Banner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {banners.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-soft-oatmeal shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    <div className="aspect-[16/9] bg-soft-oatmeal/20 relative overflow-hidden">
                      {item.bgImage?.src ? (
                        <img
                          src={item.bgImage.src}
                          alt={item.bgImage?.alt || item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.fallback-img');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="fallback-img absolute inset-0 bg-soft-oatmeal/20 flex flex-col items-center justify-center text-warm-sand" style={{ display: item.bgImage?.src ? 'none' : 'flex' }}>
                        <LuImages size={28} className="opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Broken Link</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold text-deep-espresso line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-warm-sand line-clamp-2 min-h-8">{item.subtitle}</p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                          {item.primaryBtnText && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-650">
                              {item.primaryBtnText}
                            </span>
                          )}
                          {item.secondaryBtnText && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-650">
                              {item.secondaryBtnText}
                            </span>
                          )}
                        </div>

                        <div className="pt-2 border-t border-soft-oatmeal/60 flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl bg-soft-oatmeal/30 text-deep-espresso hover:bg-soft-oatmeal/50 transition-all border border-soft-oatmeal/50"
                          >
                            <LuPencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item._id}
                            className="flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all border border-red-200/50 disabled:opacity-60"
                          >
                            {deletingId === item._id ? <LuLoader className="animate-spin" size={13} /> : <LuTrash2 size={13} />}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ManageHeroBanner;
