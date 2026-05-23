import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../data/CartContext';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiSmartphone, FiCreditCard, FiSearch, FiUser, FiShoppingCart, FiMenu, FiMapPin, FiCheck, FiGlobe, FiGift, FiX } from 'react-icons/fi';
import Button from '../../../shared/components/Button';
import api from '../../../shared/utils/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { address, user } = useUser();
  const [selectedSection, setSelectedSection] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [codEligibility, setCodEligibility] = useState({ eligible: false, loading: true, reason: '' });

  React.useEffect(() => {
    const checkEligibility = async () => {
      try {
        const payload = {
          orderItems: cart.map(item => ({
            product: item._id || item.id,
            name: item.name,
            quantity: item.quantity
          })),
          pincode: address?.pincode
        };
        const { data } = await api.post('/orders/cod-eligibility', payload);
        if (data.success) {
          setCodEligibility({
            eligible: data.eligible,
            loading: false,
            reason: data.reason
          });
        }
      } catch (err) {
        console.error('Failed to check COD eligibility:', err);
        setCodEligibility({
          eligible: false,
          loading: false,
          reason: 'Failed to verify Cash On Delivery eligibility.'
        });
      }
    };

    if (cart && cart.length > 0 && address?.pincode) {
      checkEligibility();
    } else {
      setCodEligibility({
        eligible: false,
        loading: false,
        reason: 'Please select a delivery address first.'
      });
    }
  }, [cart, address]);

  const handlePayNow = () => {
    if (selectedSection === 'cod') {
      handleCodPayment();
    } else {
      handleOnlinePayment();
    }
  };

  const handleCodPayment = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: Array.isArray(item.images) ? item.images[0] : item.image,
          price: item.price,
          product: item._id || item.id,
          seller: item.seller
        })),
        shippingAddress: {
          fullName: address.fullName,
          mobileNumber: address.mobileNumber,
          pincode: address.pincode,
          city: address.city,
          fullAddress: address.fullAddress,
          landmark: address.landmark
        },
        paymentMethod: 'COD',
        itemsPrice: cartTotal,
        shippingPrice: 0,
        totalPrice: cartTotal,
        businessDetails: user?.businessDetails
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        const orderIds = response.data.data.map(order => order._id);
        localStorage.setItem('last_order_ids', JSON.stringify(orderIds));

        setTimeout(() => {
          setIsProcessing(false);
          clearCart();
          navigate('/order-success');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to place COD order:', err);
      setIsProcessing(false);
      alert(err.response?.data?.message || 'Failed to place Cash On Delivery order. Please try again.');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => { resolve(true); };
      script.onerror = () => { resolve(false); };
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    setIsProcessing(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // Prepare order data for backend
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: Array.isArray(item.images) ? item.images[0] : item.image,
          price: item.price,
          product: item._id || item.id,
          seller: item.seller // Pass the seller ID from the product data
        })),
        shippingAddress: {
          fullName: address.fullName,
          mobileNumber: address.mobileNumber,
          pincode: address.pincode,
          city: address.city,
          fullAddress: address.fullAddress,
          landmark: address.landmark
        },
        paymentMethod: 'Online',
        itemsPrice: cartTotal,
        shippingPrice: 0,
        totalPrice: cartTotal,
        businessDetails: user?.businessDetails
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success && response.data.razorpayOrder) {
        const { razorpayOrder, data: createdOrders } = response.data;
        const orderIds = createdOrders.map(order => order._id);
        
        // Get razorpay key from backend
        const configRes = await api.get('/config/razorpay');
        const rzpKey = configRes.data.key;
        
        const options = {
          key: rzpKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Riddha Interio Mart',
          description: 'Purchase Payment',
          order_id: razorpayOrder.id,
          handler: async function (res) {
            try {
              setIsProcessing(true);
              const verifyRes = await api.post('/orders/verify-payment', {
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature
              });
              
              if (verifyRes.data.success) {
                localStorage.setItem('last_order_ids', JSON.stringify(orderIds));
                clearCart();
                navigate('/order-success');
              }
            } catch (err) {
              console.error('Payment verification failed:', err);
              alert('Payment verification failed. Please contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: address?.fullName || user?.fullName,
            email: user?.email,
            contact: address?.mobileNumber
          },
          theme: {
            color: '#189D91'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
      } else {
        alert('Failed to initialize payment gateway.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      setIsProcessing(false);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F8F8] pb-32"
    >


      <div className="max-w-xl mx-auto p-3 md:p-4 space-y-4 md:space-y-6">
        <div className="flex items-center gap-4 py-2 md:py-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <FiArrowLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-display font-bold text-gray-800">Choose Payment Method</h1>
        </div>

        {/* Delivering To Section */}
        <div className="space-y-4">
          <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">DELIVERING TO</p>
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-black text-gray-900 uppercase tracking-wide">{address?.fullName || user?.fullName || 'USER'}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1 leading-relaxed">
                  {address?.fullAddress}, {address?.landmark && `${address.landmark}, `}
                  {address?.city}, {address?.pincode}
                </p>
              </div>
              <button onClick={() => navigate('/address')} className="text-[10px] font-black text-[#189D91] uppercase tracking-widest">EDIT</button>
            </div>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-800">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
            <FiChevronDown className="text-gray-400" />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">TOTAL</span>
            <span className="text-lg font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Referral Reward Info */}
        <div className="bg-[#F0F9F8] border border-[#189D91]/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-8 w-8 bg-[#189D91]/10 rounded-full flex items-center justify-center text-[#189D91]">
             <FiGift size={16} />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-tight">
            Referral reward will be applied after your first order. 
            <span className="ml-1 text-[#189D91]">Earn ₹100 for every friend!</span>
          </p>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">PAYMENT OPTIONS</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Online Payment (Razorpay) Section */}
            <div className="border-b border-gray-50">
              <button
                onClick={() => setSelectedSection(selectedSection === 'online' ? null : 'online')}
                className="w-full flex items-center justify-between p-4 md:p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-10 rounded-lg bg-[#189D91]/10 flex items-center justify-center border border-[#189D91]/20">
                    <FiCreditCard className="text-[#189D91]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">PAY ONLINE (RAZORPAY)</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">UPI, CARDS, NETBANKING, WALLETS</p>
                  </div>
                </div>
                {selectedSection === 'online' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>

              <AnimatePresence>
                {selectedSection === 'online' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-gray-50/30 px-4 md:px-5 pb-4 md:pb-5 space-y-2 md:space-y-3"
                  >
                    <div className="p-4 bg-white border-2 border-[#189D91] rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#189D91]/10 flex items-center justify-center">
                        <FiGlobe className="text-[#189D91]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">Secure Online Payment</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">You will be redirected to Razorpay to complete your purchase securely.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cash On Delivery Section */}
            <div>
              <button
                onClick={() => setSelectedSection(selectedSection === 'cod' ? null : 'cod')}
                className="w-full flex items-center justify-between p-4 md:p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-10 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                    <FiCheck className="text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">CASH ON DELIVERY (COD)</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">PAY WITH CASH ON DELIVERY</p>
                  </div>
                </div>
                {selectedSection === 'cod' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>

              <AnimatePresence>
                {selectedSection === 'cod' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-gray-50/30 px-4 md:px-5 pb-4 md:pb-5 space-y-2 md:space-y-3"
                  >
                    {codEligibility.loading ? (
                      <div className="p-4 flex items-center justify-center gap-3">
                        <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Checking Eligibility...</span>
                      </div>
                    ) : codEligibility.eligible ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <FiCheck size={16} />
                          <span className="text-xs font-black uppercase tracking-wider">Eligible for COD</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide leading-relaxed">
                          Your address and cart items are fully eligible for Cash On Delivery!
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-rose-700">
                          <FiX size={16} />
                          <span className="text-xs font-black uppercase tracking-wider">Ineligible for COD</span>
                        </div>
                        <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide leading-relaxed">
                          {codEligibility.reason}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:p-6 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <div>
          <span className="text-xl font-black text-gray-900 block leading-none">₹{cartTotal.toLocaleString()}</span>
          <button className="text-[9px] font-black text-[#189D91] uppercase tracking-widest mt-2 border-b border-[#189D91]/20">VIEW PRICE SUMMARY</button>
        </div>
        <button
          onClick={handlePayNow}
          disabled={selectedSection === 'cod' && (!codEligibility.eligible || codEligibility.loading)}
          className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
            selectedSection === 'cod'
              ? (!codEligibility.eligible || codEligibility.loading)
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-100'
              : 'bg-[#702D8B] text-white hover:opacity-90'
          }`}
        >
          {selectedSection === 'cod' ? 'PLACE COD ORDER' : 'PAY NOW'}
        </button>
      </div>

      {/* Processing Loader Overlay */}
      {isProcessing && selectedSection === 'cod' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full mx-4">
            <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest text-center">Placing COD Order</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">Please do not refresh or close this tab</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentPage;
