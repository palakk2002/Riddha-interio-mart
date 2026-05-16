import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiMapPin, FiShoppingBag, FiGift, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import api from '../../../shared/utils/api';
import logo from '../../../assets/transparent_logo.png';
import warehouseImg from '../../../assets/seller_onboarding_warehouse_1778923798789.png';

const SellerSignup = () => {
  const [step, setStep] = useState('signup'); // 'signup' or 'otp'
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    shopName: '',
    shopAddress: '',
    gstNumber: '',
    panNumber: '',
    hsnNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/seller/register', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        shopName: formData.shopName,
        shopAddress: formData.shopAddress,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        hsnNumber: formData.hsnNumber,
        password: formData.password,
        referralCode: formData.referralCode
      });

      if (response.data.success) {
        setRegisteredEmail(formData.email);
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-email', {
        email: registeredEmail,
        otp
      });

      if (response.data.success) {
        navigate('/seller/login-form');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-['Outfit'] overflow-hidden">
      {/* Left Section: Branding & Visual */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex w-[40%] bg-[#FDF8F8] flex-col items-center justify-center p-16 relative overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-sm space-y-12">
          <Link to="/" className="inline-block">
            <img src={logo} alt="Logo" className="h-24 md:h-28 w-auto object-contain" />
          </Link>

          <div className="space-y-6">
            <h1 className="text-6xl font-semibold text-slate-900 leading-tight tracking-tighter">
              Join the <br />
              <span className="text-[#E36666] font-serif">Family.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Scale your interior business with India's most trusted partner network.
            </p>
          </div>

          <div className="pt-10 border-t border-slate-200">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#E36666]">
                   <FiCheckCircle size={24} />
                </div>
                <div>
                   <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Trusted By</p>
                   <p className="text-xl font-semibold text-slate-900">5000+ Sellers</p>
                </div>
             </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-60 h-60 bg-[#E36666]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#E36666]/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Right Section: Form */}
      <div className="flex-1 min-h-screen bg-white flex flex-col items-center justify-start md:justify-center p-0 md:p-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-full md:h-auto md:max-w-[650px] flex flex-col px-6 py-8 md:p-0"
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-10">
            <img src={logo} alt="Logo" className="h-24 w-auto object-contain" />
          </div>

          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
            <h2 className="text-2xl md:text-2xl font-semibold text-slate-900 tracking-tight text-center md:text-left">
              {step === 'signup' ? 'Create Account' : 'Verify Email'}
            </h2>
            <Link to="/seller/login-form" className="text-xs font-semibold uppercase tracking-widest text-[#E36666] hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100 text-red-500 text-[10px] font-semibold text-center uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          {step === 'signup' ? (
            <form onSubmit={handleSignup} className="flex-1 flex flex-col space-y-4 md:space-y-3">
              {/* Personal & Shop Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shop & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Shop Name</label>
                  <div className="relative group">
                    <FiShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="Enter shop name"
                      className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <div className="relative group">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone"
                      className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Identification (GST, PAN, HSN) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="GSTIN"
                    className="w-full px-4 py-4 md:py-2.5 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="PAN"
                    className="w-full px-4 py-4 md:py-2.5 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">HSN Number</label>
                  <input
                    type="text"
                    name="hsnNumber"
                    value={formData.hsnNumber}
                    onChange={handleChange}
                    placeholder="HSN"
                    className="w-full px-4 py-4 md:py-2.5 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1 md:space-y-0.5">
                <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Business Address</label>
                <div className="relative group">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                  <input
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    placeholder="Full Business Address"
                    className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-10 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                      {showPassword ? <FiEyeOff size={16} md:size={12} /> : <FiEye size={16} md:size={12} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Referral & Terms */}
              <div className="flex flex-col md:flex-row items-center gap-4 py-2">
                <div className="w-full md:w-1/2 space-y-1 md:space-y-0.5">
                  <label className="text-[10px] md:text-[8px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Referral (Optional)</label>
                  <div className="relative group">
                    <FiGift className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4 md:size-3" />
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      placeholder="RIDDHA-123"
                      className="w-full pl-12 pr-4 py-4 md:py-2.5 md:pl-9 rounded-xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-sm md:text-[11px] font-medium text-slate-700 transition-all"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms} 
                    onChange={(e) => setAgreeTerms(e.target.checked)} 
                    className="w-5 h-5 md:w-4 md:h-4 accent-[#E36666] rounded cursor-pointer"
                  />
                  <label className="text-[11px] md:text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-none cursor-pointer">
                    I agree to the <span className="text-slate-900 underline decoration-[#E36666]/30">Terms & Conditions</span>
                  </label>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-5 md:py-3.5 bg-[#E36666] text-white rounded-2xl md:rounded-xl font-semibold text-xs md:text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#E36666]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? 'Creating...' : (
                  <>Create Account <FiArrowLeft className="rotate-180 size-4 md:size-2.5" /></>
                )}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
               <div className="text-center space-y-2">
                  <p className="text-slate-400 font-medium">We've sent a verification code to</p>
                  <p className="text-slate-900 font-bold">{registeredEmail}</p>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex justify-center">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-4xl font-bold tracking-[0.5em] py-6 rounded-2xl bg-[#FDF8F8] border-2 border-transparent focus:border-[#E36666]/20 focus:bg-white focus:outline-none text-slate-700 transition-all"
                    required
                  />
               </div>

               <motion.button
                 whileHover={{ scale: 1.01, y: -2 }}
                 whileTap={{ scale: 0.99 }}
                 type="submit"
                 disabled={loading}
                 className="w-full py-5 bg-[#E36666] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#E36666]/20 transition-all disabled:opacity-50"
               >
                 {loading ? 'Verifying...' : 'Verify Email'}
               </motion.button>

               <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Didn't get the code? <button type="button" className="text-[#E36666] font-bold hover:underline">Resend OTP</button>
               </p>
            </form>
          )}

          <div className="mt-12 text-center">
             <Link to="/seller/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest">
                <FiArrowLeft /> Back to Login
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerSignup;
