import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiUser, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import Button from '../../../shared/components/Button';
import LOGIN_BG from '../../../assets/login_bg_fretshop.png';
import api from '../../../shared/utils/api';
import logo from '../../../assets/transparent logo.png';

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
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-slate-900">
        <img
          src={LOGIN_BG}
          alt="Luxury Interior"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-xl w-full p-8"
        >
          <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl rounded-[3.5rem] p-16 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] group">
            {/* Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#189D91]/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
                <img 
                  src={logo} 
                  alt="Riddha Logo" 
                  className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform transition-transform duration-700 group-hover:scale-[1.02]" 
                />
                
                <div className="mt-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-[#189D91] to-transparent" />
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em] leading-none italic">
                            Premium Quality Supply
                        </p>
                    </div>
                    <h2 className="text-3xl font-display font-black text-white tracking-tighter leading-tight drop-shadow-lg">
                        India's Largest <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">Interior Supply Hub</span>
                    </h2>
                    <div className="pt-2">
                        <p className="text-white/30 text-[10px] font-bold leading-relaxed max-w-[280px]">
                            Curating the finest collection of luxury interiors for over a decade.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center bg-white relative">
        <div className="max-w-md w-full mx-auto px-8 md:px-0">
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
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#189D91] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#189D91] focus:ring-4 focus:ring-[#189D91]/5 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                    <button type="button" onClick={() => navigate('/forgot-password')} className="text-[9px] font-black text-[#189D91] uppercase tracking-widest hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#189D91] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#189D91] focus:ring-4 focus:ring-[#189D91]/5 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300"
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
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#189D91] border-[#189D91]' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                  {rememberMe && <FiCheck className="text-white text-xs stroke-[4]" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Remember Me</span>
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] mt-4"
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
                Don't have an account? <Link to={getSignupPath()} className="text-[#189D91] hover:underline ml-1">Create Account</Link>
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
