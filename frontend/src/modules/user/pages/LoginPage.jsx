import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiUser, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import Button from '../../../shared/components/Button';
import LOGIN_BG from '../../../assets/login_bg_fretshop.png';
import api from '../../../shared/utils/api';
import logo from '../../../assets/transparent_logo.png';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rbacRole, setRbacRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const { login, loading, setLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const getRole = () => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/seller')) return 'seller';
    if (location.pathname.startsWith('/delivery')) return 'delivery';
    return 'user';
  };

  const role = getRole();
  const isDelivery = role === 'delivery';
  
  // Unified signature brand colors
  const theme = {
    primaryBtn: isDelivery ? 'bg-[#2A458A] hover:opacity-90' : 'bg-[var(--color-primary)] hover:opacity-90',
    accentText: isDelivery ? 'text-[#2A458A]' : 'text-[var(--color-primary)]',
    focusBorder: isDelivery ? 'focus:border-[#2A458A] focus:ring-[#2A458A]/5' : 'focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/5',
    iconFocus: isDelivery ? 'group-focus-within:text-[#2A458A]' : 'group-focus-within:text-[var(--color-primary)]',
    checkboxBg: isDelivery ? 'bg-[#2A458A] border-[#2A458A]' : 'bg-[var(--color-primary)] border-[var(--color-primary)]',
    ambientGlow: isDelivery ? 'bg-[#2A458A]/10' : 'bg-[var(--color-primary)]/10',
    lineGlow: isDelivery ? 'from-[#2A458A]' : 'from-[var(--color-primary)]'
  };

  const getSignupPath = () => {
    if (role === 'admin') return null;
    if (role === 'seller') return '/seller/signup';
    if (role === 'delivery') return '/delivery/signup';
    return '/signup';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authPath = role === 'admin' 
        ? '/auth/admin/login' 
        : role === 'seller' 
          ? '/auth/seller/login' 
          : role === 'delivery' 
            ? '/auth/delivery/login' 
            : '/auth/user/login';

      const response = await api.post(authPath, {
        email: identifier,
        password: password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        login({ ...user, token });
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'seller') navigate('/seller/dashboard');
        else if (role === 'delivery') navigate('/delivery/dashboard');
        else navigate('/cart');
      }
    } catch (err) {
      if (err.response?.data?.unverified) {
        setUnverifiedEmail(err.response.data.email);
        setError('Please verify your email to continue.');
      } else {
        setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendAndVerify = async () => {
    try {
      setLoading(true);
      await api.post('/auth/resend-otp', { email: unverifiedEmail });
      navigate('/verify-email', { state: { email: unverifiedEmail } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (role === 'user') {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center font-sans overflow-y-auto px-4 py-8">
        {/* Device wrapper for desktop, seamless on mobile */}
        <div className="w-full max-w-[420px] min-h-[820px] bg-white flex flex-col justify-between py-12 px-8 rounded-3xl md:shadow-2xl overflow-hidden relative border border-slate-100">
          
          <div className="w-full flex flex-col items-center">
            {/* Logo */}
            <div className="mt-6 mb-8 w-full max-w-[200px] flex justify-center">
              <img src={logo} alt="Interio Mega Mart" className="w-full h-auto object-contain" />
            </div>

            {error && (
              <div className="w-full mb-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-center">
                <span className="text-rose-600 text-[10px] font-bold uppercase tracking-wider leading-relaxed">{error}</span>
                {unverifiedEmail && (
                  <button onClick={handleResendAndVerify} className="block mt-2 mx-auto bg-rose-600 text-white px-4 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-rose-700">
                    Verify Email
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-5">
              {/* Phone or Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 ml-0.5">Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/85 border border-slate-200/80 rounded-xl focus:bg-white focus:border-[#189D91] outline-none transition-all text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-semibold"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-[11px] font-bold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50/85 border border-slate-200/80 rounded-xl focus:bg-white focus:border-[#189D91] outline-none transition-all text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-semibold"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between px-0.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => setRememberMe(!rememberMe)} 
                  className="flex items-center gap-2 group"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#189D91] border-[#189D91]' : 'border-slate-200 bg-white'}`}>
                    {rememberMe && <FiCheck className="text-white text-[10px] stroke-[4]" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Remember Me</span>
                </button>
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-[10px] font-bold text-[#189D91] hover:underline">Forgot?</button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8A3B8B] hover:bg-[#722b73] text-white py-3.5 rounded-full font-bold text-[14px] uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-[#8A3B8B]/10 mt-6"
              >
                {loading ? 'Authenticating...' : 'Login'}
              </button>
            </form>

            {/* Create Account */}
            <div className="mt-4 text-center">
              <Link to="/signup" className="text-[12px] font-bold text-slate-400 hover:text-slate-600 tracking-wider">
                Create Account
              </Link>
            </div>
          </div>

          {/* Social login and footer at bottom */}
          <div className="w-full mt-auto">
            {/* Or continue with divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-3 bg-white text-[10px] font-bold text-slate-350 uppercase tracking-widest">Or continue with...</span>
            </div>

            {/* Circle social login buttons */}
            <div className="flex justify-center gap-5 mb-8">
              <button type="button" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all hover:scale-105 active:scale-95 shadow-sm">
                <FaGoogle size={18} className="text-rose-500" />
              </button>
              <button type="button" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-[#1877F2] transition-all hover:scale-105 active:scale-95 shadow-sm">
                <FaFacebookF size={18} className="text-[#1877F2]" />
              </button>
            </div>

            {/* Footer Copyright */}
            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              © {new Date().getFullYear()} Riddha Interio Mart.
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Section - Branded, Bright & Clean (No Dark Colors!) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50/50 via-slate-50 to-pink-50/30 border-r border-slate-200/80">
        {/* Soft logo related gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--color-accent-pink)]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-lg w-full p-12 text-center flex flex-col items-center"
        >
          {/* Logo Frame */}
          <div className="mb-8 w-full max-w-[280px]">
             <img 
               src={logo} 
               alt="Riddha Logo" 
               className="w-full h-auto object-contain" 
             />
          </div>

          {/* Typography Area */}
          <div className="space-y-4 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/50 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider leading-none">
                   Premium Interior Mart
                </span>
             </div>

             <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-snug">
                India's Premium <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-[var(--color-primary)] font-black">Interior & Design Hub</span>
             </h2>

             <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                Curating premium architectural collection of luxury fittings and design setups.
             </p>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center bg-white relative">
        <div className="max-w-md w-full mx-auto px-8 md:px-0">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <img src={logo} alt="Riddha Logo" className="w-48 md:w-56 h-auto object-contain" />
          </div>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Log In</h1>
                <p className="text-xs font-semibold text-slate-400 mt-1 capitalize">Access your secure {role} panel</p>
            </div>
            <Link to="/" className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-100">
                <FiArrowLeft size={16} />
            </Link>
          </div>

          {/* Role Selection Switch (Compact pill toggle) */}
          {role === 'admin' && (
            <div className="mb-6 p-1 bg-slate-100 rounded-xl border border-slate-200/60 flex">
              <button
                type="button"
                onClick={() => setRbacRole('admin')}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${rbacRole === 'admin' ? 'bg-[#189D91] text-white shadow-sm shadow-[#189D91]/20' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setRbacRole('assistant')}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${rbacRole === 'assistant' ? 'bg-[#EC008C] text-white shadow-sm shadow-[#EC008C]/20' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Assistant
              </button>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex flex-col items-center gap-2"
              >
                <span className="text-rose-600 text-[10px] font-bold uppercase tracking-wider text-center leading-relaxed">{error}</span>
                {unverifiedEmail && (
                  <button onClick={handleResendAndVerify} className="bg-rose-600 text-white px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors">
                    Verify Email
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">Email Address</label>
                <div className="relative group">
                  <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-350 ${theme.iconFocus} transition-colors`} size={16} />
                  <input
                    type="text"
                    placeholder="name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.focusBorder} outline-none transition-all text-xs font-semibold text-slate-700 placeholder:text-slate-300`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                    <button type="button" onClick={() => navigate('/forgot-password')} className={`text-[9px] font-bold ${theme.accentText} uppercase tracking-wider hover:underline`}>Forgot?</button>
                </div>
                <div className="relative group">
                  <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-355 ${theme.iconFocus} transition-colors`} size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.focusBorder} outline-none transition-all text-xs font-semibold text-slate-700 placeholder:text-slate-300`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-0.5 pt-1">
              <button 
                type="button" 
                onClick={() => setRememberMe(!rememberMe)} 
                className="flex items-center gap-2 group"
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${rememberMe ? theme.checkboxBg : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                  {rememberMe && <FiCheck className="text-white text-[10px] stroke-[4]" />}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-550 transition-colors">Remember Me</span>
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg ${theme.primaryBtn} text-white font-bold text-[10px] uppercase tracking-wider transition-all active:scale-[0.98] mt-4`}
            >
              {loading ? 'Authenticating...' : 'Sign In Now'}
            </Button>

            {/* Social Logins */}
            {role !== 'admin' && (
              <div className="pt-6">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative px-3 bg-white text-[9px] font-bold text-slate-300 uppercase tracking-wider">Or Continue With</span>
                </div>
                <div className="flex justify-center gap-3">
                  {[FaGoogle, FaFacebookF, FaXTwitter].map((Icon, idx) => (
                    <button key={idx} type="button" className="w-10 h-10 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200 transition-all hover:scale-105 active:scale-95">
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {getSignupPath() && (
              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-6">
                Don't have an account? <Link to={getSignupPath()} className={`${theme.accentText} hover:underline ml-1`}>Create Account</Link>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              © {new Date().getFullYear()} Riddha Interio Mart. All Rights Reserved.
          </p>
      </div>
    </div>
  );
};

export default LoginPage;
