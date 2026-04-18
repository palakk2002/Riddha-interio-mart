import React from 'react';
import { motion } from 'framer-motion';
import { FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Cancellation Window',
    content: 'Orders can be cancelled within 24 hours of placement, provided the item has not been shipped. Once an order has been dispatched, cancellation requests cannot be processed.',
  },
  {
    title: '2. How to Cancel',
    content: 'To cancel an order, navigate to "My Orders" and select the order you wish to cancel. Alternatively, reach out to our support team at info@riddhainterio.com with your order ID.',
  },
  {
    title: '3. Custom & Made-to-Order Items',
    content: 'Custom furniture, cut-to-size tiles, and specially mixed paints are non-cancellable once production has begun. Please review your selections carefully before confirming.',
  },
  {
    title: '4. Refund on Cancellation',
    content: 'If your cancellation request is approved, the refund will be initiated within 3–5 business days. The amount will be credited to your original payment method.',
  },
];

const Cancellation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-4"
        >
          <div className="flex items-center gap-3 text-warm-sand mb-2">
            <FiXCircle className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Policies</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-deep-espresso">
            Cancellation Policy
          </h1>
          <p className="text-deep-espresso/50 text-base font-light leading-relaxed">
            Please review our cancellation terms before placing your order.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="bg-white border border-soft-oatmeal/30 rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-lg font-display font-bold text-deep-espresso mb-3">{section.title}</h3>
              <p className="text-deep-espresso/60 text-sm font-medium leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Back Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap gap-4 text-sm"
        >
          <Link to="/policies/returns" className="text-warm-sand font-bold hover:text-dusty-cocoa transition-colors">Returns Policy →</Link>
          <Link to="/policies/refund" className="text-warm-sand font-bold hover:text-dusty-cocoa transition-colors">Refund Policy →</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cancellation;
