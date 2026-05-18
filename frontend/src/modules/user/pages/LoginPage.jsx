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
  
  // Theme styling based on role
  const theme = {
    primaryBtn: isDelivery ? 'bg-[#2A458A] hover:bg-[#1f346b]' : 'bg-slate-900 hover:bg-black',
    accentText: isDelivery ? 'text-[#2A458A]' : 'text-[#189D91]',
    focusBorder: isDelivery ? 'focus:border-[#2A458A] focus:ring-[#2A458A]/5' : 'focus:border-[#189D91] focus:ring-[#189D91]/5',
    iconFocus: isDelivery ? 'group-focus-within:text-[#2A458A]' : 'group-focus-within:text-[#189D91]',
    checkboxBg: isDelivery ? 'bg-[#2A458A] border-[#2A458A]' : 'bg-[#189D91] border-[#189D91]',
    ambientGlow: isDelivery ? 'bg-[#2A458A]/20' : 'bg-[#189D91]/20',
    lineGlow: isDelivery ? 'from-[#2A458A]' : 'from-[#189D91]'
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

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Section - Branding & Visuals */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#2A458A] via-[#1E3163] to-[#111A30]">
        {/* Subtle Ambient Mesh Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#189D91]/15 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#2A458A]/30 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-lg w-full p-12 text-center flex flex-col items-center"
        >
          {/* Logo Frame */}
          <div className="mb-10 w-full max-w-[280px]">
             <img 
               src={logo} 
               alt="Riddha Logo" 
               className="w-full h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)]" 
             />
          </div>

          {/* Typography Area */}
          <div className="space-y-4 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#189D91]" />
                <span className="text-[10px] font-bold text-white/95 uppercase tracking-[0.2em] leading-none">
                   Premium Quality Supply
                </span>
             </div>

             <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                India's Largest <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#B9C6E2]">Interior Supply Hub</span>
             </h2>

             <p className="text-[#B9C6E2] text-xs font-normal leading-relaxed max-w-sm mx-auto">
                Curating the finest collection of luxury interiors for over a decade.
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
          <div className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Log In</h1>
                <p className="text-sm font-medium text-slate-500 mt-1 capitalize">Access your {role} panel</p>
            </div>
            <Link to="/" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
                <FiArrowLeft size={18} />
            </Link>
          </div>

          {/* Role Selection for Admin */}
          {role === 'admin' && (
            <div className="mb-8 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 flex">
              <button
                onClick={() => setRbacRole('admin')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rbacRole === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Super Admin
              </button>
              <button
                onClick={() => setRbacRole('assistant')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rbacRole === 'assistant' ? 'bg-[#189D91] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
                className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center gap-3"
              >
                <span className="text-rose-600 text-[10px] font-bold uppercase tracking-wider text-center leading-relaxed">{error}</span>
                {unverifiedEmail && (
                  <button onClick={handleResendAndVerify} className="bg-rose-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors">
                    Verify Email
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email ID</label>
                <div className="relative group">
                  <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 ${theme.iconFocus} transition-colors`} size={18} />
                  <input
                    type="text"
                    placeholder="name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white ${theme.focusBorder} outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                    <button type="button" onClick={() => navigate('/forgot-password')} className={`text-[9px] font-black ${theme.accentText} uppercase tracking-widest hover:underline`}>Forgot?</button>
                </div>
                <div className="relative group">
                  <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 ${theme.iconFocus} transition-colors`} size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white ${theme.focusBorder} outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <button 
                type="button" 
                onClick={() => setRememberMe(!rememberMe)} 
                className="flex items-center gap-2.5 group"
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? theme.checkboxBg : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                  {rememberMe && <FiCheck className="text-white text-xs stroke-[4]" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Remember Me</span>
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl ${theme.primaryBtn} text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] mt-4`}
            >
              {loading ? 'Authenticating...' : 'Sign In Now'}
            </Button>

            {/* Social Logins */}
            {role !== 'admin' && (
              <div className="pt-8">
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative px-4 bg-white text-[9px] font-black text-slate-300 uppercase tracking-widest">Or Continue With</span>
                </div>
                <div className="flex justify-center gap-4">
                  {[FaGoogle, FaFacebookF, FaXTwitter].map((Icon, idx) => (
                    <button key={idx} type="button" className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200 transition-all hover:scale-105 active:scale-95">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {getSignupPath() && (
              <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8">
                Don't have an account? <Link to={getSignupPath()} className={`${theme.accentText} hover:underline ml-1`}>Create Account</Link>
              </p>
            )}
          </form>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.3em] italic">
                © {new Date().getFullYear()} Riddha Interio Mart. All Rights Reserved.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
