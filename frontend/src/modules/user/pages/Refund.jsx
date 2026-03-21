import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Refund Eligibility',
    content: 'Refunds are issued for approved cancellations and returns only. Items must meet the criteria outlined in our Cancellation and Returns policies.',
  },
  {
    title: '2. Refund Timeline',
    content: 'Once a cancellation or return is approved, refunds are processed within 5-7 business days. The time for the refund to appear in your account depends on your payment provider.',
  },
  {
    title: '3. Refund Method',
    content: 'Refunds are credited to the original payment method used at checkout. If you paid via UPI, net banking, or card, the amount will be returned to the same source. Cash-on-delivery refunds are processed via bank transfer.',
  },
  {
    title: '4. Partial Refunds',
    content: "In certain cases — such as partial returns from a multi-item order — a partial refund proportional to the returned item's value will be issued. Shipping charges are non-refundable unless the return is due to our error.",
  },
  {
    title: '5. Need Help?',
    content: "If your refund has not been received within the stated timeframe, please contact us at info@riddhainterio.com with your order ID and we'll look into it promptly.",
  },
];

const Refund = () => {
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
            <FiDollarSign className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Policies</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-deep-espresso">
            Refund Policy
          </h1>
          <p className="text-deep-espresso/50 text-base font-light leading-relaxed">
            Transparency is key — here is how and when refunds are processed.
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
          <Link to="/policies/cancellation" className="text-warm-sand font-bold hover:text-dusty-cocoa transition-colors">Cancellation Policy →</Link>
          <Link to="/policies/returns" className="text-warm-sand font-bold hover:text-dusty-cocoa transition-colors">Returns Policy →</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Refund;
