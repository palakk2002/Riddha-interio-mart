import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../data/CartContext';
import { useUser } from '../data/UserContext';
import { FiArrowRight, FiShoppingBag, FiTrash2, FiClock, FiPlus, FiMinus } from 'react-icons/fi';
import Button from '../../../shared/components/Button';
import { getDeliveryEstimate } from '../../../shared/utils/delivery';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isLoggedIn, address } = useUser();
  const navigate = useNavigate();

  // Price Calculations
  const mrpValue = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const discountOnMRP = mrpValue > 1000 ? 500 : 0; // matching image example logic
  const deliveryCharges = mrpValue > 500 ? 0 : 49;
  const totalPrice = mrpValue - discountOnMRP + deliveryCharges;

  const handleAction = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!address) {
      navigate('/address');
    } else {
      navigate('/payment');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-24 h-24 bg-soft-oatmeal/10 rounded-full flex items-center justify-center mb-6">
          <FiShoppingBag className="text-4xl text-soft-oatmeal" />
        </div>
        <h2 className="text-2xl font-bold text-deep-espresso mb-2">Your cart is empty</h2>
        <p className="text-warm-sand mb-8 text-sm">Add some beautiful pieces to your collection!</p>
        <Button onClick={() => navigate('/products')} className="px-10 rounded-xl">START SHOPPING</Button>
      </div>
    );
  }

  return (
    <div className="bg-soft-oatmeal/5 min-h-screen pb-40">
      {/* Header with Title & Stepper */}
      <div className="bg-[#189D91] text-white px-6 py-4 md:py-8">
        <h1 className="text-lg md:text-2xl font-display font-bold text-white">Cart: {cart.length} items</h1>
      </div>

      {/* Main Content Area */}
      <div className="max-w-xl mx-auto mt-2 md:-mt-4 space-y-3 md:space-y-4 px-4">
        {/* Delivery Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-soft-oatmeal/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-deep-espresso">
              <FiClock className="text-lg text-emerald-500" />
              <span className="text-sm font-bold">Delivery in <span className="text-[#189D91]">{getDeliveryEstimate(address?.pincode || '560001').time}</span></span>
            </div>
          </div>
          <div className="h-px bg-soft-oatmeal/10 -mx-4 mb-4" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">DELIVERING TO</p>
              <p className="text-sm font-bold text-deep-espresso">
                {address ? `${address.pincode}, ${address.city}` : '560001, Bengaluru'}
              </p>
            </div>
            <button
              onClick={() => navigate('/address')}
              className="text-[11px] font-black text-[#189D91] uppercase tracking-wider border-b border-[#189D91]/20"
            >
              {address ? 'CHANGE' : 'ADD ADDRESS'}
            </button>
          </div>
        </div>

        {/* Multi-Step Indicator */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-soft-oatmeal/10">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#189D91] text-white flex items-center justify-center text-[10px] font-black">1</span>
            <span className="text-[11px] font-black text-[#189D91] uppercase tracking-widest">Cart</span>
          </div>
          <div className="w-8 h-px bg-gray-200" />
          <div className="flex items-center gap-3 opacity-40">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-black">2</span>
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Address</span>
          </div>
          <div className="w-8 h-px bg-gray-200" />
          <div className="flex items-center gap-3 opacity-40">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-black">3</span>
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Payment</span>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl p-3 shadow-sm border border-soft-oatmeal/10 flex gap-4 group"
              >
                <div className="w-24 h-24 bg-soft-oatmeal/5 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-deep-espresso">{item.name}</h3>
                    <p className="text-sm font-bold text-[#189D91] mt-1">₹{item.price} <span className="text-[10px] text-gray-400 font-medium italic">incl. GST</span></p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] hover:text-[#189D91] transition-colors"
                    >
                      <FiTrash2 />
                      REMOVE
                    </button>
                    <div className="flex items-center bg-soft-oatmeal/5 rounded-xl p-1 border border-soft-oatmeal/10">
                      <button
                        onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-deep-espresso"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-deep-espresso">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-deep-espresso"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Referral Code */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-soft-oatmeal/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#189D91]/5 rounded-xl flex items-center justify-center text-[#189D91]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 01-2-2V5a1 1 0 011-1h15a1 1 0 011 1v2M20 12v4a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h14z" /></svg>
            </div>
            <span className="text-sm font-bold text-deep-espresso">Use Referral code</span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter referral code"
              className="flex-1 bg-soft-oatmeal/5 border border-soft-oatmeal/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-[#189D91]/30 transition-all font-medium"
            />
            <button className="text-[11px] font-black uppercase text-[#189D91] px-2 tracking-widest">APPLY</button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal/10 overflow-hidden">
          <div className="px-6 py-4 bg-soft-oatmeal/5 border-b border-soft-oatmeal/10">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">PRICE DETAILS</h4>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-500">MRP Value</span>
              <span className="text-deep-espresso font-black">₹{mrpValue}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-500">Discount on MRP</span>
              <span className="text-emerald-500 font-black">-₹{discountOnMRP}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-500">Delivery Charges</span>
              <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">
                {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
              </span>
            </div>
            <div className="border-t border-dashed border-soft-oatmeal/20 pt-5 flex justify-between items-end">
              <div>
                <span className="text-base font-black text-deep-espresso tracking-tight">TOTAL PRICE</span>
                <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Inclusive of all taxes (GST)</p>
              </div>
              <span className="text-2xl font-black text-deep-espresso tracking-tighter">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-soft-oatmeal/10 px-4 md:px-6 py-4 md:py-6 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 max-w-xl mx-auto rounded-t-[2.5rem]">
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-deep-espresso tracking-tighter">₹{totalPrice}</span>
            <button className="text-[8px] font-black text-[#189D91] border-b border-[#189D91]/30 tracking-widest">VIEW DETAILS</button>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAction}
          className="bg-[#189D91] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[12px] uppercase tracking-[0.15em] shadow-2xl shadow-[#189D91]/30 flex items-center gap-3"
        >
          {address ? 'CHECKOUT' : 'ADD ADDRESS'}
          <div className="bg-white/20 p-1 rounded-lg">
            <FiArrowRight size={14} />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default CartPage;
