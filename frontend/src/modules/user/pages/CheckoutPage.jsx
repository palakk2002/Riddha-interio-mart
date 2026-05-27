import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../data/CartContext';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiMapPin, FiShoppingBag, FiTruck, FiInfo, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../../../shared/components/Button';
import CouponSelector from '../components/CouponSelector';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, pricingBreakdown, loading: cartLoading } = useCart();
  const { address, isLoggedIn, fetchAddresses, loading: userLoading } = useUser();
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchAddresses();
    
    // Reset coupon session storage on checkout load
    sessionStorage.removeItem('applied_coupon');
  }, [isLoggedIn, fetchAddresses, navigate]);

  // Handle coupon lifecycle
  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem('applied_coupon');
    toast.success('Coupon removed.');
  };

  // Pricing calculations adjusted for coupon
  const subtotal = pricingBreakdown?.subtotal || 0;
  const gstAmount = pricingBreakdown?.taxAmount || 0;
  const deliveryCharges = pricingBreakdown?.shippingPrice || 0;
  const baseDiscount = pricingBreakdown?.discountAmount || 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalDiscount = baseDiscount + couponDiscount;
  const grandTotal = Math.max(0, subtotal - baseDiscount + deliveryCharges - couponDiscount);

  const handleProceedToPayment = () => {
    if (!address) {
      toast.error('Please add a shipping address first.');
      return;
    }

    // Address verification checks
    if (!address.fullName || !address.mobileNumber || !address.fullAddress || !address.pincode || !address.city) {
      toast.error('Your shipping address has incomplete details. Please edit it.');
      return;
    }

    if (address.mobileNumber.length !== 10) {
      toast.error('Please configure a valid 10-digit mobile number in your address.');
      return;
    }

    if (address.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode.');
      return;
    }

    // Store applied coupon data in session storage for PaymentPage
    if (appliedCoupon) {
      sessionStorage.setItem('applied_coupon', JSON.stringify(appliedCoupon));
    }

    toast.success('Address and items verified! Proceeding to Payment.');
    navigate('/payment');
  };

  const isLoading = cartLoading || userLoading;

  if (cart.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 bg-[#189D91]/5 rounded-full flex items-center justify-center mb-6 border border-[#189D91]/10">
          <FiShoppingBag className="text-3xl text-[#189D91]/55" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Checkout is empty</h2>
        <p className="text-gray-400 mb-8 text-xs font-semibold">Your cart is empty. Fill it to proceed!</p>
        <button 
          onClick={() => navigate('/products')} 
          className="px-10 py-3.5 bg-[#189D91] hover:bg-[#14847a] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#189D91]/15 hover:shadow-lg active:scale-[0.98]"
        >
          Catalog
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white md:bg-[#FAFAFA] min-h-screen pb-32"
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/cart')} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
          </button>
          <div>
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">STEP 1 OF 3</div>
            <h1 className="text-2xl font-display font-bold text-deep-espresso">Checkout Summary</h1>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-10 mb-10 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3 bg-[#189D91]/10 px-5 py-2 rounded-full border border-[#189D91]/20">
            <span className="w-6 h-6 rounded-full bg-[#189D91] text-white flex items-center justify-center text-xs font-bold">1</span>
            <span className="text-sm font-bold text-[#189D91]">Checkout Summary</span>
          </div>
          <div className="flex items-center gap-3 opacity-60">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">2</span>
            <span className="text-sm font-semibold text-gray-600">Payment Selection</span>
          </div>
          <div className="flex items-center gap-3 opacity-60">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">3</span>
            <span className="text-sm font-semibold text-gray-600">Order Placed</span>
          </div>
        </div>

        {isLoading ? (
          /* Elegant Loading Skeleton */
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-7 space-y-6">
              <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
              <div className="h-56 bg-gray-100 rounded-3xl animate-pulse" />
              <div className="h-44 bg-gray-100 rounded-3xl animate-pulse" />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Delivery Address & Cart Items */}
            <div className="col-span-12 md:col-span-7 space-y-6">
              
              {/* Delivery Address Section */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#189D91]/10 flex items-center justify-center text-[#189D91]">
                      <FiMapPin className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Shipping Address</h2>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">WHERE WE DELIVER YOUR LUXURY PIECES</p>
                    </div>
                  </div>
                  {address && (
                    <button
                      onClick={() => navigate('/address')}
                      className="text-[10px] font-black text-[#189D91] hover:text-black uppercase tracking-widest border-b border-[#189D91]/20 pb-0.5"
                    >
                      EDIT ADDRESS
                    </button>
                  )}
                </div>

                {address ? (
                  <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                      Selected
                    </div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-wide">{address.fullName}</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-2 max-w-md">
                      {address.fullAddress}, {address.landmark && `${address.landmark}, `}
                      {address.city}, {address.pincode}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold tracking-wider mt-3 uppercase">
                      PHONE: <span className="text-gray-800 font-black">+91 {address.mobileNumber}</span>
                    </p>
                  </div>
                ) : (
                  <div 
                    onClick={() => navigate('/address')}
                    className="p-6 border-2 border-dashed border-gray-200 hover:border-[#189D91]/30 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group transition-all bg-slate-50/50 hover:bg-[#189D91]/5"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#189D91]/10 group-hover:text-[#189D91] transition-all mb-3">
                      <FiPlusCircle size={22} />
                    </div>
                    <span className="text-xs font-black text-gray-800 uppercase tracking-widest group-hover:text-[#189D91] transition-colors">Add Shipping Address</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">NO DELIVERY ADDRESS DETECTED YET</p>
                  </div>
                )}
              </div>

              {/* Coupon Code Section */}
              <CouponSelector 
                cartItems={cart}
                onCouponApplied={handleCouponApplied}
                appliedCoupon={appliedCoupon}
                onCouponRemoved={handleCouponRemoved}
              />

              {/* Order Items Review */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#189D91]/10 flex items-center justify-center text-[#189D91]">
                    <FiShoppingBag className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Review Ordered Items</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">CHECK YOUR ITEMS BEFORE PROCEEDING</p>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item._id || item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-[64px] h-[64px] rounded-xl object-cover bg-gray-50 border border-gray-100" />
                      <div className="flex-1">
                        <h4 className="text-xs font-black text-gray-800 line-clamp-1 uppercase tracking-wide">{item.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-[11px] text-gray-400 font-bold uppercase">Qty: <span className="text-gray-900 font-black">{item.quantity}</span></p>
                          <span className="text-xs font-black text-gray-900">₹{item.price?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Breakdown & CTA */}
            <div className="col-span-12 md:col-span-5">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6 sticky top-24">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Checkout Summary</h2>
                
                <div className="space-y-4 border-b border-gray-100 pb-5">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-black">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Inclusive GST</span>
                    <span className="text-gray-900 font-black">₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className="text-[#189D91] font-black tracking-wider">
                      {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                    </span>
                  </div>
                  {baseDiscount > 0 && (
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Product Discount</span>
                      <span className="text-emerald-600 font-black">-₹{baseDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between text-xs font-bold text-emerald-600 uppercase tracking-wider overflow-hidden"
                      >
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span className="font-black">-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">GRAND TOTAL</span>
                    <span className="text-2xl font-extrabold text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#189D91] font-bold text-[10px] uppercase tracking-wider">
                    <FiTruck /> Express Delivery
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full h-16 rounded-2xl bg-[#189D91] hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#189D91]/25 flex items-center justify-center gap-3 transition-all"
                  >
                    PROCEED TO PAYMENT
                  </Button>
                  
                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-gray-100 rounded-xl">
                    <FiInfo className="text-[#189D91] shrink-0 mt-0.5" size={15} />
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                      White-Glove packaging and standard insurance is included automatically for all luxury collection purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
