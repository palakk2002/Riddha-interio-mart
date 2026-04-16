import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiPhone, FiTruck, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import Button from '../../../shared/components/Button';
import LOGIN_BG from '../../../assets/login_bg_fretshop.png';
import api from '../../../shared/utils/api';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    shopName: '',
    shopAddress: '',
    phone: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
    password: '',
    confirmPassword: '',
  });
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
      
      const response = await api.post(`/auth/${role}/register`, payload);

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
    <div className="relative min-h-screen bg-deep-espresso overflow-hidden selection:bg-warm-sand selection:text-white">
      {/* Background Section */}
      <div className="fixed inset-0 z-0">
        <img 
          src={LOGIN_BG} 
          alt="Luxury Interior" 
          className="w-full h-full object-cover opacity-40 md:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-espresso via-deep-espresso/40 to-transparent md:bg-black/40"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
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
        <div className="flex items-center justify-center w-full lg:w-1/2 px-6 py-12">
          <motion.div className="w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] border border-white/20 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl font-black text-white italic font-serif">Sign Up</h2>
                  <div className="flex gap-4">
                    <button onClick={() => navigate(getLoginPath())} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Log In</button>
                    <div className="w-12 h-0.5 bg-warm-sand mt-3"></div>
                  </div>
                </div>

                <div className="mb-4 px-4 py-2 bg-warm-sand/10 border border-warm-sand/20 rounded-full inline-block">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand">
                    Account Type: {getRole().toUpperCase()}
                  </span>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                    </div>
                  </div>

                  {/* Seller Fields */}
                  {getRole() === 'seller' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Shop Name</label>
                          <div className="relative">
                            <FiShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand/50" />
                            <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Phone</label>
                          <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand/50" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Shop Address</label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-12 -translate-y-1/2 text-warm-sand/50" />
                          <textarea name="shopAddress" value={formData.shopAddress} onChange={handleChange} rows="2" className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all resize-none"></textarea>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Delivery Fields */}
                  {getRole() === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Vehicle Type</label>
                          <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-deep-espresso border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all appearance-none">
                            <option value="Bike">Bike</option>
                            <option value="Van">Van</option>
                            <option value="Truck">Truck</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Vehicle No.</label>
                          <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Password</label>
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-3.5 text-white/40">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Confirm</label>
                      <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 focus:border-warm-sand/50 focus:outline-none text-sm text-white transition-all" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="accent-warm-sand h-4 w-4" />
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">I agree to the Terms & Conditions</label>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-14 mt-4 bg-warm-sand hover:bg-white text-white hover:text-deep-espresso">
                    {loading ? 'Registering...' : 'Create Account'}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
