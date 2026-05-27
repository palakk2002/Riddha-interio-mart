import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGift, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../../shared/utils/api';

const CouponSelector = ({ cartItems, onCouponApplied, appliedCoupon, onCouponRemoved }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-configured luxury recommendations for premium UX representation
  const featuredCoupons = [
    { code: 'RIDDHA100', desc: 'Flat ₹100 off on premium designs', min: 1000 },
    { code: 'WELCOME10', desc: '10% off on your luxury elements collection', min: 2000 }
  ];

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCode).toUpperCase().trim();
    if (!code) {
      toast.error('Please enter a coupon code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        couponCode: code,
        orderItems: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity
        }))
      };

      const { data } = await api.post('/orders/validate-coupon', payload);

      if (data.success && data.data) {
        onCouponApplied(data.data);
        setCouponCode('');
        toast.success(`Coupon "${code}" applied successfully! Saved ₹${data.data.discountAmount}`);
      }
    } catch (err) {
      console.error('Failed to validate coupon:', err);
      const msg = err.response?.data?.message || 'Invalid or expired coupon code.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#189D91]/10 flex items-center justify-center text-[#189D91]">
          <FiGift className="text-xl" />
        </div>
        <div>
          <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-wider">Apply Promo Coupon</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">UNLOCK LUXURY OFFERS & SAVINGS</p>
        </div>
      </div>

      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FiCheck />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{appliedCoupon.code}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">SAVED ₹{appliedCoupon.discountAmount}</p>
            </div>
          </div>
          <button
            onClick={onCouponRemoved}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
            title="Remove Coupon"
          >
            <FiX size={18} />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="ENTER COUPON CODE"
              className="flex-1 px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-bold uppercase tracking-widest text-xs transition-all placeholder:text-gray-400 placeholder:normal-case"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              disabled={loading}
            />
            <button
              onClick={() => handleApplyCoupon()}
              disabled={loading || !couponCode.trim()}
              className={`px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                loading || !couponCode.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#189D91] hover:bg-black text-white shadow-lg shadow-[#189D91]/15 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'APPLY'
              )}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] text-rose-500 font-black uppercase tracking-wider pl-1"
            >
              {error}
            </motion.p>
          )}

          {/* Luxury Suggestions */}
          <div className="pt-2">
            <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <FiInfo size={12} className="text-[#189D91]" /> RECOMMENDED COUPONS
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {featuredCoupons.map((c) => (
                <div
                  key={c.code}
                  onClick={() => !loading && handleApplyCoupon(c.code)}
                  className="p-3 bg-slate-50 hover:bg-[#189D91]/5 border border-gray-100 hover:border-[#189D91]/20 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[11px] font-black text-gray-800 group-hover:text-[#189D91] transition-colors uppercase tracking-widest">{c.code}</span>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{c.desc}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#189D91] opacity-0 group-hover:opacity-100 transition-opacity">
                    APPLY &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponSelector;
