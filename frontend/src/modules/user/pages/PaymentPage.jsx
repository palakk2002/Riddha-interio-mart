import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../data/CartContext';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiChevronDown, FiChevronRight, FiCheckCircle, FiCreditCard, FiSmartphone, FiMonitor, FiBriefcase } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { address } = useUser();
  const [expandedSection, setExpandedSection] = useState('upi');
  const [selectedMethod, setSelectedMethod] = useState('gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = [
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'Google Pay, PhonePe, Paytm',
      icon: <FiSmartphone className="text-xl" />,
      subOptions: [
        { id: 'gpay', name: 'Google Pay', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
        { id: 'phonepe', name: 'PhonePe', icon: 'https://cdn.iconscout.com/icon/free/png-256/phonepe-2752139-2284950.png' },
        { id: 'paytm', name: 'Paytm', icon: 'https://cdn.iconscout.com/icon/free/png-256/paytm-226448.png' }
      ]
    },
    {
      id: 'card',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay',
      icon: <FiCreditCard className="text-xl" />,
      subOptions: [
        { id: 'new_card', name: 'Add New Card', isForm: true }
      ]
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      subtitle: 'All major banks',
      icon: <FiMonitor className="text-xl" />,
      subOptions: [
        { id: 'sbi', name: 'SBI' },
        { id: 'hdfc', name: 'HDFC' },
        { id: 'icici', name: 'ICICI' }
      ]
    }
  ];

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      const orderId = 'RD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem('last_order_id', orderId);
      navigate('/order-success');
    }, 2500);
  };

  const PaymentOption = ({ option }) => {
    const isExpanded = expandedSection === option.id;
    return (
      <div className="border-b border-soft-oatmeal/10 last:border-0">
        <button 
          onClick={() => setExpandedSection(isExpanded ? null : option.id)}
          className="w-full p-5 flex items-center justify-between hover:bg-soft-oatmeal/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`h-10 w-12 rounded-lg flex items-center justify-center border transition-all ${isExpanded ? 'bg-warm-sand/10 border-warm-sand/30 text-warm-sand' : 'bg-soft-oatmeal/10 border-soft-oatmeal/20 text-gray-400'}`}>
              {option.icon}
            </div>
            <div className="text-left">
              <p className={`text-sm font-black tracking-tight ${isExpanded ? 'text-warm-sand' : 'text-deep-espresso'}`}>{option.title}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{option.subtitle}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <FiChevronDown className="text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-50/50"
            >
              <div className="p-5 pt-0 space-y-3">
                {option.subOptions?.map((sub) => (
                  <div 
                    key={sub.id}
                    onClick={() => setSelectedMethod(sub.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === sub.id ? 'border-warm-sand bg-white shadow-sm' : 'border-transparent bg-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      {sub.icon && <img src={sub.icon} alt="" className="w-5 h-5 object-contain" />}
                      <span className="text-xs font-bold text-deep-espresso">{sub.name}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === sub.id ? 'border-warm-sand bg-warm-sand' : 'border-gray-200'}`}>
                      {selectedMethod === sub.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
                {option.id === 'card' && (
                  <div className="space-y-3 mt-2">
                    <input type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-warm-sand outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-xs outline-none" />
                      <input type="password" placeholder="CVV" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-xs outline-none" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-soft-oatmeal/5 pb-32"
    >
      {/* Header */}
      <div className="bg-white px-6 py-6 flex items-center gap-6 border-b border-soft-oatmeal/10 sticky top-0 z-50">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
        </button>
        <h1 className="text-xl font-bold text-deep-espresso">Choose Payment Method</h1>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Delivering To Section */}
        <div className="space-y-3">
          <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Delivering To</p>
          <div className="bg-white border border-soft-oatmeal/20 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-black text-deep-espresso uppercase tracking-wider">{address?.name || 'User'}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1 leading-relaxed">
                  {address?.address}, {address?.landmark && `${address.landmark}, `}
                  {address?.city}, {address?.state} - {address?.pincode}
                </p>
              </div>
              <button onClick={() => navigate('/address')} className="text-[10px] font-black text-warm-sand uppercase tracking-widest border-b border-warm-sand/30">Edit</button>
            </div>
          </div>
        </div>

        {/* Item Summary Section */}
        <div className="bg-white border-y border-soft-oatmeal/10 px-6 py-5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <span className="text-sm font-black text-deep-espresso">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
             <FiChevronDown className="text-gray-400" />
           </div>
           <div className="text-right">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block leading-none mb-1">Total</span>
             <span className="text-lg font-black text-deep-espresso font-montserrat">₹{cartTotal.toLocaleString()}</span>
           </div>
        </div>

        {/* Suggested Section */}
        <div className="space-y-4 pt-4">
           <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payment Options</h3>
           <div className="bg-white rounded-2xl overflow-hidden border border-soft-oatmeal/20">
              {paymentOptions.map(option => (
                <PaymentOption key={option.id} option={option} />
              ))}
              
              {/* Cash on Delivery */}
              <div className="p-5 flex items-center justify-between opacity-40 bg-gray-50/30">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-12 bg-soft-oatmeal/10 rounded-lg flex items-center justify-center border border-soft-oatmeal/20">
                       <FiCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-deep-espresso">Cash on Delivery</p>
                    </div>
                 </div>
                 <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center text-[7px] font-black">?</div>
              </div>
           </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-soft-oatmeal/20 p-4 pb-8 flex items-center justify-between shadow-[0_-20px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="flex flex-col">
          <span className="text-xl font-black text-deep-espresso font-montserrat">₹{cartTotal.toLocaleString()}</span>
          <button className="text-[10px] font-black text-warm-sand uppercase tracking-widest mt-1 text-left">View Price Summary</button>
        </div>
        <Button 
          disabled={isProcessing}
          onClick={handlePayNow}
          size="lg" 
          className="px-12 h-16 rounded-xl bg-[#F44336] hover:bg-[#D32F2F] text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-200"
        >
          {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
        </Button>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative w-24 h-24 mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 border-4 border-warm-sand/20 border-t-warm-sand rounded-full"
               />
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.5 }}
                 className="absolute inset-4 bg-warm-sand/10 rounded-full flex items-center justify-center"
               >
                 <FiSmartphone className="text-2xl text-warm-sand" />
               </motion.div>
            </div>
            <h2 className="text-xl font-black text-deep-espresso uppercase tracking-widest mb-2">Redirecting to {selectedMethod === 'gpay' ? 'Google Pay' : 'Payment App'}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Please do not press back or refresh the page</p>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="w-48 h-1 bg-warm-sand mt-8 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentPage;
