import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../data/CartContext';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiSmartphone, FiCreditCard, FiSearch, FiUser, FiShoppingCart, FiMenu, FiMapPin, FiCheck } from 'react-icons/fi';
import Button from '../../../shared/components/Button';
import api from '../../../shared/utils/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { address, user } = useUser();
  const [selectedSection, setSelectedSection] = useState('upi');
  const [selectedMethod, setSelectedMethod] = useState('gpay');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = () => {
    setShowRazorpay(true);
  };

  const handleMockPayment = async () => {
    setIsProcessing(true);
    try {
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
        totalPrice: cartTotal
      };

      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        localStorage.setItem('last_order_id', response.data.data._id);
        
        setTimeout(() => {
          setIsProcessing(false);
          setShowRazorpay(false);
          clearCart();
          navigate('/order-success');
        }, 1500);
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
      {/* Brand Header */}
      <div className="bg-[#8B2323] text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-display font-black tracking-tighter uppercase italic">RIDDHA INTERIO</h1>
          <div className="flex items-center gap-5">
            <FiUser size={20} />
            <div className="relative">
              <FiShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#8B2323] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            </div>
            <FiMenu size={20} />
          </div>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search products or brands..." 
            className="w-full bg-white rounded-lg py-3 px-12 text-sm text-gray-500 placeholder-gray-400 focus:outline-none"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Delivery Status */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-1">
        <span className="text-[10px] font-bold text-gray-400">Delivery in</span>
        <span className="text-[10px] font-black text-[#8B2323]">4 hours</span>
        <span className="text-[10px] text-gray-400 ml-1 flex items-center gap-0.5">to {address?.pincode || '452018'} <FiMapPin size={8} /></span>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4 py-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <FiArrowLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-display font-bold text-gray-800">Choose Payment Method</h1>
        </div>

        {/* Delivering To Section */}
        <div className="space-y-4">
          <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">DELIVERING TO</p>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-black text-gray-900 uppercase tracking-wide">{address?.fullName || user?.fullName || 'USER'}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1 leading-relaxed">
                  {address?.fullAddress}, {address?.landmark && `${address.landmark}, `}
                  {address?.city}, {address?.pincode}
                </p>
              </div>
              <button onClick={() => navigate('/address')} className="text-[10px] font-black text-[#8B2323] uppercase tracking-widest">EDIT</button>
            </div>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="text-sm font-black text-gray-800">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
             <FiChevronDown className="text-gray-400" />
           </div>
           <div className="text-right">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">TOTAL</span>
             <span className="text-lg font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
           </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
           <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">PAYMENT OPTIONS</p>
           
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             {/* UPI Section */}
             <div className="border-b border-gray-50">
               <button 
                onClick={() => setSelectedSection(selectedSection === 'upi' ? null : 'upi')}
                className="w-full flex items-center justify-between p-5"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                     <FiSmartphone className="text-[#8B2323]" />
                   </div>
                   <div className="text-left">
                     <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">UPI</p>
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">GOOGLE PAY, PHONEPE, PAYTM</p>
                   </div>
                 </div>
                 {selectedSection === 'upi' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
               </button>

               <AnimatePresence>
                 {selectedSection === 'upi' && (
                   <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: 'auto' }} 
                    exit={{ height: 0 }} 
                    className="overflow-hidden bg-gray-50/30 px-5 pb-5 space-y-3"
                   >
                     {/* Google Pay */}
                     <div 
                      onClick={() => setSelectedMethod('gpay')}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'gpay' ? 'border-[#8B2323] bg-white' : 'border-transparent bg-transparent'}`}
                     >
                       <div className="flex items-center gap-4">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" alt="GPay" className="w-6 h-6" />
                         <span className="text-xs font-black text-gray-800">Google Pay</span>
                       </div>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'gpay' ? 'border-[#8B2323] bg-[#8B2323]' : 'border-gray-200'}`}>
                         {selectedMethod === 'gpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                       </div>
                     </div>
                     {/* PhonePe */}
                     <div 
                      onClick={() => setSelectedMethod('phonepe')}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'phonepe' ? 'border-[#8B2323] bg-white' : 'border-transparent bg-transparent'}`}
                     >
                       <div className="flex items-center gap-4">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/PhonePe_Logo.svg" alt="PhonePe" className="w-6 h-6" />
                         <span className="text-xs font-black text-gray-800">PhonePe</span>
                       </div>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'phonepe' ? 'border-[#8B2323] bg-[#8B2323]' : 'border-gray-200'}`}>
                         {selectedMethod === 'phonepe' && <div className="w-2 h-2 rounded-full bg-white" />}
                       </div>
                     </div>
                     {/* Paytm */}
                     <div 
                      onClick={() => setSelectedMethod('paytm')}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'paytm' ? 'border-[#8B2323] bg-white' : 'border-transparent bg-transparent'}`}
                     >
                       <div className="flex items-center gap-4">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="w-6 h-6" />
                         <span className="text-xs font-black text-gray-800">Paytm</span>
                       </div>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'paytm' ? 'border-[#8B2323] bg-[#8B2323]' : 'border-gray-200'}`}>
                         {selectedMethod === 'paytm' && <div className="w-2 h-2 rounded-full bg-white" />}
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             {/* Card Section */}
             <div>
               <button 
                onClick={() => setSelectedSection(selectedSection === 'card' ? null : 'card')}
                className="w-full flex items-center justify-between p-5"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                     <FiCreditCard className="text-gray-400" />
                   </div>
                   <div className="text-left">
                     <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">CREDIT / DEBIT CARD</p>
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">VISA, MASTERCARD, RUPAY</p>
                   </div>
                 </div>
                 {selectedSection === 'card' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <div>
          <span className="text-xl font-black text-gray-900 block leading-none">₹{cartTotal.toLocaleString()}</span>
          <button className="text-[9px] font-black text-[#8B2323] uppercase tracking-widest mt-2 border-b border-[#8B2323]/20">VIEW PRICE SUMMARY</button>
        </div>
        <button 
          onClick={handlePayNow}
          className="bg-black text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 transition-all"
        >
          PAY NOW
        </button>
      </div>

      {/* Razorpay Mock UI */}
      <AnimatePresence>
        {showRazorpay && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Razorpay Header */}
              <div className="bg-[#1C2541] p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-black italic">R</div>
                   <div>
                     <p className="text-[10px] font-bold text-blue-300 tracking-widest uppercase">RIDDHA INTERIO</p>
                     <p className="text-sm font-black">₹{cartTotal.toLocaleString()}</p>
                   </div>
                 </div>
                 <button onClick={() => setShowRazorpay(false)} className="text-2xl font-light opacity-50">&times;</button>
              </div>

              {/* Razorpay Body */}
              <div className="p-8 space-y-6">
                 {!isProcessing ? (
                   <>
                     <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" alt="GPay" className="w-6 h-6" />
                           </div>
                           <p className="text-xs font-black text-gray-700">Google Pay (Simulated)</p>
                        </div>
                        <FiCheck className="text-blue-500" />
                     </div>

                     <div className="space-y-4 pt-4">
                        <button 
                          onClick={handleMockPayment}
                          className="w-full py-5 bg-[#3395FF] text-white font-black text-sm rounded-xl shadow-lg shadow-blue-200 uppercase tracking-widest active:scale-[0.98] transition-all"
                        >
                          PROCEED TO PAY
                        </button>
                        <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">RELIABLE & SECURE PAYMENTS BY RAZORPAY</p>
                     </div>
                   </>
                 ) : (
                   <div className="py-20 flex flex-col items-center justify-center space-y-8">
                      <div className="relative w-20 h-20">
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                           className="absolute inset-0 border-4 border-blue-100 border-t-blue-500 rounded-full"
                         />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">Processing Payment</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Please do not refresh or close this tab</p>
                      </div>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentPage;
