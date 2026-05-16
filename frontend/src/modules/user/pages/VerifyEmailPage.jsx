import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';
import api from '../../../shared/utils/api';
import { useUser } from '../data/UserContext';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUser();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // We expect email to be passed in navigation state
  const email = location.state?.email;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full">
          <p className="text-gray-500 mb-4">No email provided.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-email', { email, otp });
      if (response.data.success) {
        const { token, user } = response.data;
        login({ ...user, token });
        navigate('/cart');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      alert('OTP Resent!');
    } catch (err) {
      alert('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-deep-espresso mb-2">Verify Email</h2>
          <p className="text-sm text-gray-500">We sent an OTP to <br/><span className="font-bold text-gray-800">{email}</span></p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-500 text-xs font-bold text-center rounded-lg border border-red-100 uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center tracking-[0.5em] text-2xl py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-[#189D91]/50 focus:bg-white focus:outline-none font-bold transition-all"
            required
          />

          <Button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-[#189D91] hover:bg-black text-white font-black text-sm uppercase tracking-widest shadow-lg">
            {loading ? 'Verifying...' : 'Verify & Login'}
          </Button>
        </form>

        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-8">
          Didn't receive it? <button onClick={handleResend} className="text-[#189D91] hover:text-black transition-colors underline decoration-[#189D91]/30">Resend</button>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
