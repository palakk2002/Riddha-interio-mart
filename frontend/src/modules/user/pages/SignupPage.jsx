import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiPhone, FiTruck, FiMapPin, FiShoppingBag, FiGift } from 'react-icons/fi';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import Button from '../../../shared/components/Button';
import LOGIN_BG from '../../../assets/login_bg_fretshop.png';
import api from '../../../shared/utils/api';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Business Details for Enterprisers
    shopName: '',
    gstNumber: '',
    taxationCode: '',
    // Legacy fields for other roles
    shopAddress: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
  });
  const [userType, setUserType] = useState('customer'); // customer or enterpriser
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getRole = () => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/seller')) return 'seller';
    if (location.pathname.startsWith('/delivery')) return 'delivery';
    return 'user';
  };

  const getLoginPath = () => {
    const role = getRole();
    if (role === 'admin') return '/admin/login';
    if (role === 'seller') return '/seller/login';
    if (role === 'delivery') return '/delivery/login';
    return '/login';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const role = getRole();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all basic fields');
      setLoading(false);
      return;
    }

    // Role-specific validation
    if (role === 'seller') {
      if (!formData.shopName || !formData.shopAddress || !formData.phone) {
        setError('Please fill in Shop Name, Address, and Phone');
        setLoading(false);
        return;
      }
    }

    if (role === 'delivery') {
      if (!formData.phone || !formData.vehicleNumber) {
        setError('Please fill in Phone and Vehicle Details');
        setLoading(false);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      // Build Payload
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      };

      if (role === 'seller') {
        payload.shopName = formData.shopName;
        payload.shopAddress = formData.shopAddress;
        payload.phone = formData.phone;
      }

      if (role === 'delivery') {
        payload.phone = formData.phone;
        payload.vehicleType = formData.vehicleType;
        payload.vehicleNumber = formData.vehicleNumber;
      }

      const response = await api.post(`/auth/${role}/register`, {
        ...payload,
        userType: role === 'user' ? userType : undefined,
        businessDetails: role === 'user' && userType === 'enterpriser' ? {
          shopName: formData.shopName,
          gstNumber: formData.gstNumber,
          taxationCode: formData.taxationCode
        } : undefined
      });

      if (response.data.success) {
        navigate(getLoginPath());
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen bg-white md:bg-deep-espresso overflow-hidden selection:bg-warm-sand selection:text-white">
      {/* Desktop Background Layer */}
      <div className="hidden md:block fixed inset-0 z-0">
        <img
          src={LOGIN_BG}
          alt="Luxury Interior"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Mobile Header Image (Only on Mobile) */}
        <div className="md:hidden relative h-[28vh] min-h-[200px] w-full overflow-hidden">
          <img
            src={LOGIN_BG}
            alt="Luxury Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg active:scale-90 transition-all z-20"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>

          {/* Curve Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="absolute bottom-[-1px] left-0 w-full h-[120%] rotate-180" preserveAspectRatio="none">
              <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,192C672,171,768,149,864,154.7C960,160,1056,192,1152,192C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Left Side: Brand Story (Desktop only) */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:bg-warm-sand transition-colors duration-500 shadow-2xl">
              <FiArrowLeft className="text-deep-espresso group-hover:text-white w-6 h-6" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em]">Back to Store</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 className="font-display text-8xl font-black leading-tight tracking-tighter">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-sand via-white italic font-serif">Family.</span>
            </motion.h1>
          </div>

          <div className="flex gap-12">
            <div className="space-y-1">
              <div className="text-2xl font-black text-warm-sand">Elite</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Partner Network</div>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
            {/* Desktop Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="hidden md:flex absolute top-10 right-10 flex items-center gap-2 group text-white/50 hover:text-white transition-all font-bold text-xs tracking-widest uppercase z-50"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-[560px] md:max-w-lg bg-white md:bg-white/10 md:backdrop-blur-3xl md:border md:border-white/20 p-4 md:p-8 rounded-[40px] md:rounded-[32px] shadow-2xl md:shadow-none relative"
            >
              <div className="relative z-10 px-2 md:px-0">
                <div className="hidden md:flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl font-black text-white italic font-serif">Sign Up</h2>
                  <div className="flex gap-3">
                    <button onClick={() => navigate(getLoginPath())} className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Log In</button>
                    <div className="w-8 h-0.5 bg-warm-sand mt-2.5"></div>
                  </div>
                </div>

                {/* Mobile Header (Visible only on mobile) */}
                <div className="md:hidden text-center space-y-1 mb-4 pt-1">
                  <h1 className="text-2xl font-display font-black text-deep-espresso tracking-tight">Create Account</h1>
                  <p className="text-gray-400 font-black text-[8px] tracking-[0.2em] uppercase">
                    Join the Riddha Family
                  </p>
                </div>

                  <div className="px-3 py-1 bg-warm-sand/10 border border-warm-sand/20 rounded-full inline-block self-start">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-warm-sand">
                      Module: {getRole().toUpperCase()}
                    </span>
                  </div>

                  {getRole() === 'admin' && (
                    <div className="flex bg-blue-50/50 md:bg-white/5 p-1 rounded-xl border border-gray-100 md:border-white/10">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, rbacRole: 'admin' })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${(formData.rbacRole || 'admin') === 'admin' ? 'bg-[#240046] md:bg-brand-purple text-white shadow-lg' : 'text-gray-400 md:text-white/40 hover:text-deep-espresso md:hover:text-white'}`}
                      >
                        Super Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, rbacRole: 'assistant' })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.rbacRole === 'assistant' ? 'bg-[#240046] md:bg-brand-purple text-white shadow-lg' : 'text-gray-400 md:text-white/40 hover:text-deep-espresso md:hover:text-white'}`}
                      >
                        Assistant
                      </button>
                    </div>
                  )}

                  {getRole() === 'user' && (
                    <div className="flex bg-blue-50/50 md:bg-white/5 p-1 rounded-xl border border-gray-100 md:border-white/10">
                      <button
                        type="button"
                        onClick={() => setUserType('customer')}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${userType === 'customer' ? 'bg-[#189D91] md:bg-warm-sand text-white shadow-lg' : 'text-gray-400 md:text-white/40 hover:text-deep-espresso md:hover:text-white'}`}
                      >
                        Individual
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('enterpriser')}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${userType === 'enterpriser' ? 'bg-[#189D91] md:bg-warm-sand text-white shadow-lg' : 'text-gray-400 md:text-white/40 hover:text-deep-espresso md:hover:text-white'}`}
                      >
                        Enterpriser
                      </button>
                    </div>
                  )}

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-3 max-h-[60vh] md:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Full Name</label>
                      <div className="relative group">
                        <FiUser className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-4 w-4" />
                        <input
                          type="text"
                          name="fullName"
                          placeholder={window.innerWidth < 768 ? "Full Name" : ""}
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full md:pl-5 pl-12 pr-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Email</label>
                      <div className="relative group">
                        <FiMail className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-4 w-4" />
                        <input
                          type="email"
                          name="email"
                          placeholder={window.innerWidth < 768 ? "Email ID" : ""}
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full md:pl-5 pl-12 pr-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enterpriser Fields */}
                  {getRole() === 'user' && userType === 'enterpriser' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="space-y-0.5">
                        <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Shop / Business Name</label>
                        <div className="relative group">
                          <FiShoppingBag className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-4 w-4" />
                          <input
                            type="text"
                            name="shopName"
                            placeholder={window.innerWidth < 768 ? "Business Name" : "e.g. Riddha Designs"}
                            value={formData.shopName}
                            onChange={handleChange}
                            className="w-full md:pl-5 pl-12 pr-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                          <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">GST Number</label>
                          <input
                            type="text"
                            name="gstNumber"
                            placeholder={window.innerWidth < 768 ? "GST Number" : "22AAAAA0000A1Z5"}
                            value={formData.gstNumber}
                            onChange={handleChange}
                            className="w-full px-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Trade/Tax Code</label>
                          <input
                            type="text"
                            name="taxationCode"
                            placeholder={window.innerWidth < 768 ? "Code (Optional)" : "Optional"}
                            value={formData.taxationCode}
                            onChange={handleChange}
                            className="w-full px-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Seller Fields */}
                  {getRole() === 'seller' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Shop Name</label>
                          <div className="relative group">
                            <FiShoppingBag className="md:hidden absolute left-6 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-5 w-5" />
                            <input type="text" name="shopName" placeholder={window.innerWidth < 768 ? "Shop Name" : ""} value={formData.shopName} onChange={handleChange} className="w-full md:pl-10 pl-16 pr-6 py-4 md:py-3.5 rounded-full md:rounded-xl bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Phone</label>
                          <div className="relative group">
                            <FiPhone className="md:hidden absolute left-6 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-5 w-5" />
                            <input type="tel" name="phone" placeholder={window.innerWidth < 768 ? "Phone Number" : ""} value={formData.phone} onChange={handleChange} className="w-full md:pl-10 pl-16 pr-6 py-4 md:py-3.5 rounded-full md:rounded-xl bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Shop Address</label>
                        <div className="relative group">
                          <FiMapPin className="md:hidden absolute left-6 top-8 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-5 w-5" />
                          <textarea name="shopAddress" placeholder={window.innerWidth < 768 ? "Shop Address" : ""} value={formData.shopAddress} onChange={handleChange} rows="2" className="w-full md:pl-10 pl-16 pr-6 py-4 md:py-3.5 rounded-3xl md:rounded-xl bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all resize-none"></textarea>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Delivery Fields */}
                  {getRole() === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div className="space-y-1">
                        <label className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Phone</label>
                        <div className="relative group">
                          <FiPhone className="md:hidden absolute left-6 top-1/2 -translate-y-1/2 text-[#189D91]/40 h-5 w-5" />
                          <input type="tel" name="phone" placeholder={window.innerWidth < 768 ? "Phone Number" : ""} value={formData.phone} onChange={handleChange} className="w-full md:pl-6 pl-16 pr-6 py-4 md:py-3.5 rounded-full md:rounded-xl bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:outline-none text-sm md:text-white font-bold transition-all" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Vehicle Type</label>
                          <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full px-6 py-4 rounded-full md:rounded-xl bg-blue-50/50 md:bg-deep-espresso border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:outline-none text-sm md:text-white font-bold transition-all appearance-none">
                            <option value="Bike">Bike</option>
                            <option value="Van">Van</option>
                            <option value="Truck">Truck</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Vehicle No.</label>
                          <input type="text" name="vehicleNumber" placeholder={window.innerWidth < 768 ? "Vehicle Number" : ""} value={formData.vehicleNumber} onChange={handleChange} className="w-full px-6 py-4 rounded-full md:rounded-xl bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:outline-none text-sm md:text-white font-bold transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-0.5 relative group">
                      <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Password</label>
                      <FiLock className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-4 w-4" />
                      <input type={showPassword ? "text" : "password"} name="password" placeholder={window.innerWidth < 768 ? "Password" : ""} value={formData.password} onChange={handleChange} className="w-full md:pl-5 pl-12 pr-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 md:text-white/40">{showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4 opacity-50" />}</button>
                    </div>
                    <div className="space-y-0.5 relative group">
                      <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Confirm</label>
                      <FiLock className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-4 w-4" />
                      <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder={window.innerWidth < 768 ? "Confirm Password" : ""} value={formData.confirmPassword} onChange={handleChange} className="w-full md:pl-5 pl-12 pr-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all" />
                    </div>
                    <div className="space-y-0.5 relative group md:col-span-2">
                      <label className="hidden md:block text-[9px] font-black uppercase tracking-widest text-white/60 ml-1">Referral Code (Optional)</label>
                      <FiGift className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 text-[#189D91]/40 group-focus-within:text-[#189D91] transition-colors h-4 w-4" />
                      <input 
                        type="text" 
                        name="referralCode" 
                        placeholder={window.innerWidth < 768 ? "Referral Code (Optional)" : "e.g. RIDDHA-123"} 
                        value={formData.referralCode || ''} 
                        onChange={handleChange} 
                        className="w-full md:pl-5 pl-12 pr-5 py-3 md:py-2.5 rounded-full md:rounded-lg bg-blue-50/50 md:bg-white/10 border-2 border-transparent md:border-white/10 focus:border-[#189D91]/20 md:focus:border-warm-sand/50 focus:bg-white md:focus:bg-white/20 focus:outline-none text-sm md:text-white font-bold transition-all" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 px-1">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="accent-[#189D91] md:accent-warm-sand h-3.5 w-3.5" />
                    <label className="text-[8px] md:text-[9px] font-bold text-gray-400 md:text-white/60 uppercase tracking-widest leading-none">I agree to the Terms & Conditions</label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 md:h-11 mt-2 rounded-full md:rounded-lg bg-[#189D91] md:bg-warm-sand hover:bg-black md:hover:bg-white text-white md:text-white md:hover:text-deep-espresso font-black text-xs md:text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#189D91]/20 transition-all active:scale-[0.98] ${loading ? 'opacity-50' : ''}`}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>

                  <p className="md:hidden text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4">
                    Already have account? <span onClick={() => navigate(getLoginPath())} className="text-[#189D91] cursor-pointer font-black border-b border-[#189D91]/30 pb-0.5 ml-1">LOG IN</span>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
