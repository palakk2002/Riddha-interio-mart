import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../models/CartContext';
import { useUser } from '../../models/UserContext';
import { FiArrowLeft, FiChevronDown, FiChevronRight, FiCheckCircle, FiCreditCard, FiSmartphone, FiMonitor, FiBriefcase } from 'react-icons/fi';
import Button from '../../../../views/shared/Button';

const PaymentOption = ({ option, expandedSection, setExpandedSection, selectedMethod, setSelectedMethod }) => {
  const isExpanded = expandedSection === option.id;
  return (
    <div className="border-b border-soft-oatmeal/10 last:border-0">
      <button 
        onClick={() => setExpandedSection(isExpanded ? null : option.id)}
        className="w-full p-4 md:p-5 flex items-center justify-between hover:bg-soft-oatmeal/5 transition-colors"
      >
        <div className="flex items-center gap-3 md:gap-4">
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
            className="overflow-hidden bg-gray-50/30"
          >
            <div className="p-4 pt-0 space-y-2">
              {option.subOptions?.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={() => setSelectedMethod(sub.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === sub.id ? 'border-warm-sand bg-white shadow-sm' : 'border-transparent bg-transparent'}`}
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
                <div className="space-y-2 mt-2">
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
      
      {/* Simple selection for COD */}
      {!option.subOptions?.length && isExpanded && (
        <div className="px-5 pb-5">
           <div 
             onClick={() => setSelectedMethod(option.id)}
             className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === option.id ? 'border-warm-sand bg-warm-sand/5' : 'border-gray-100 bg-gray-50/50'}`}
           >
             <span className="text-xs font-bold text-deep-espresso">Confirm {option.title}</span>
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === option.id ? 'border-warm-sand bg-warm-sand' : 'border-gray-200'}`}>
                {selectedMethod === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { address } = useUser();
  const [expandedSection, setExpandedSection] = useState('upi');
  const [selectedMethod, setSelectedMethod] = useState('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPriceSummary, setShowPriceSummary] = useState(false);

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
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      subtitle: 'Pay when you receive',
      icon: <FiCheckCircle className="text-xl" />,
      subOptions: []
    }
  ];

  const handlePayNow = () => {
    const orderId = 'RD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newOrder = {
      id: Date.now(),
      orderId: orderId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Seller',
      customer: {
        name: address?.name || 'Guest User',
        email: 'user@example.com', // Fallback for simulation
        phone: address?.phone || 'N/A',
        address: `${address?.address}, ${address?.landmark}, ${address?.city}, ${address?.state} - ${address?.pincode}`
      },
      paymentMethod: selectedMethod === 'cod' ? 'Cash on Delivery' : `${selectedMethod.toUpperCase()} (Paid)`,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: cartTotal,
      shipping: 0,
      total: cartTotal,
      timeline: [
        { status: "Order Placed", date: new Date().toLocaleString(), active: true },
        { status: "Waiting for Seller", date: "Pending", active: true },
        { status: "Ready for Pickup", date: "", active: false },
        { status: "Out for Delivery", date: "", active: false },
        { status: "Delivered", date: "", active: false }
      ]
    };

    const existingOrders = JSON.parse(localStorage.getItem('riddha_full_orders') || '[]');
    localStorage.setItem('riddha_full_orders', JSON.stringify([newOrder, ...existingOrders]));
    localStorage.setItem('last_order_id', orderId);

    if (selectedMethod === 'cod') {
      clearCart();
      navigate('/order-success');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate('/order-success');
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-soft-oatmeal/5 pb-32"
    >
      {/* Header */}
      <div className="bg-white px-4 py-4 md:px-6 md:py-6 flex items-center gap-4 md:gap-6 border-b border-soft-oatmeal/10 relative md:sticky md:top-0 md:z-50">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
        </button>
        <h1 className="text-xl font-bold text-deep-espresso">Choose Payment Method</h1>
      </div>

      <div className="max-w-3xl mx-auto p-3 md:p-4 space-y-3 md:space-y-4">
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
        <div className="bg-white border-y border-soft-oatmeal/10 px-4 md:px-6 py-3 md:py-5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <span className="text-sm font-black text-deep-espresso">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
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
                <PaymentOption 
                  key={option.id} 
                  option={option} 
                  expandedSection={expandedSection}
                  setExpandedSection={setExpandedSection}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                />
              ))}
           </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-soft-oatmeal/20 p-4 pb-8 flex items-center justify-between shadow-[0_-20px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="flex flex-col">
          <span className="text-xl font-black text-deep-espresso font-montserrat">₹{cartTotal.toLocaleString()}</span>
          <button 
            onClick={() => setShowPriceSummary(true)}
            className="text-[10px] font-black text-warm-sand uppercase tracking-widest mt-1 text-left"
          >
            View Price Summary
          </button>
        </div>
        <Button 
          disabled={isProcessing}
          onClick={handlePayNow}
          size="lg" 
          className="px-3 md:px-12 h-10 md:h-16 rounded-lg md:rounded-xl bg-[#922724] hover:bg-[#7a201e] text-white font-black text-[10px] md:text-sm uppercase tracking-wider md:tracking-[0.2em] shadow-2xl shadow-[#922724]/20 whitespace-nowrap"
        >
          {isProcessing ? 'PROCESSING...' : (selectedMethod === 'cod' ? 'CONFIRM ORDER' : 'PAY NOW')}
        </Button>
      </div>

      {/* Price Summary Overlay */}
      <AnimatePresence>
        {showPriceSummary && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPriceSummary(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-6 z-[70] shadow-2xl"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" onClick={() => setShowPriceSummary(false)} />
              <h3 className="text-base font-black text-deep-espresso uppercase tracking-widest mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Cart Total ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Delivery Charge</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="h-px bg-gray-100 my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-deep-espresso uppercase tracking-widest">Total Amount</span>
                  <span className="text-lg font-black text-deep-espresso font-montserrat">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowPriceSummary(false)}
                className="w-full h-12 rounded-xl bg-[#922724] text-white font-black uppercase tracking-widest text-[10px] mt-6"
              >
                CLOSE
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
