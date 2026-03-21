import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowLeft, FiShoppingBag, FiTruck } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const CheckoutPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-soft-oatmeal/5 flex flex-col items-center justify-center px-4 py-20"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl text-center border border-soft-oatmeal/20"
      >
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center">
            <FiCheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-deep-espresso mb-4">Order Confirmed!</h1>
        <p className="text-deep-espresso/40 font-medium mb-10 leading-relaxed text-sm">
          Your luxury elements have been secured. Our concierge team is now preparing your white-glove delivery experience.
        </p>

        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 p-4 bg-soft-oatmeal/5 rounded-2xl border border-soft-oatmeal/10">
            <FiTruck className="h-5 w-5 text-warm-sand" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Estimated Delivery</p>
              <p className="text-xs font-bold text-deep-espresso">3-5 Business Days</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-soft-oatmeal/5 rounded-2xl border border-soft-oatmeal/10">
            <FiShoppingBag className="h-5 w-5 text-warm-sand" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Order Reference</p>
              <p className="text-xs font-bold text-deep-espresso">#RD-{Math.floor(Math.random() * 900000) + 100000}</p>
            </div>
          </div>
        </div>

        <Link to="/products">
          <Button size="lg" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-warm-sand/20 group">
            <FiArrowLeft className="mr-3 transform group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Button>
        </Link>
      </motion.div>
      
      <p className="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Thank you for choosing Riddha Interio</p>
    </motion.div>
  );
};

export default CheckoutPage;
