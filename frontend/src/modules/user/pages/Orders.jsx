import React from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Orders = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 space-y-4"
        >
          <div className="flex items-center gap-3 text-warm-sand mb-2">
            <FiPackage className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">My Orders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-deep-espresso">
            Your Orders
          </h1>
          <p className="text-deep-espresso/50 text-lg font-light leading-relaxed max-w-2xl">
            Track and manage all your past and current orders in one place.
          </p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center justify-center py-20 bg-white border border-soft-oatmeal/30 rounded-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-golden-glow/50 flex items-center justify-center mb-6">
            <FiShoppingBag className="h-8 w-8 text-warm-sand" />
          </div>
          <h3 className="text-xl font-display font-bold text-deep-espresso mb-2">No orders yet</h3>
          <p className="text-deep-espresso/50 text-sm font-medium mb-8 text-center max-w-sm">
            When you place your first order, it will appear here. Start exploring our premium collections!
          </p>
          <Link
            to="/products"
            className="bg-warm-sand text-white rounded-full px-8 py-3 font-bold uppercase tracking-wider text-xs hover:bg-dusty-cocoa transition-colors"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Orders;
