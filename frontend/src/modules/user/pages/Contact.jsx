import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const contactInfo = [
  { icon: FiMapPin, label: 'Visit Us', value: '123 Interior Hub, Design Street, Mumbai, MH 400001' },
  { icon: FiPhone, label: 'Call Us', value: '+91 98765 43210' },
  { icon: FiMail, label: 'Email Us', value: 'info@riddhainterio.com' },
  { icon: FiClock, label: 'Working Hours', value: 'Mon – Sat: 10 AM – 8 PM' },
];

const Contact = () => {
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
            <FiMail className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-deep-espresso">
            Contact Us
          </h1>
          <p className="text-deep-espresso/50 text-lg font-light leading-relaxed max-w-2xl">
            Have a question or need design advice? We'd love to hear from you. Reach out through any of the channels below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="bg-white border border-soft-oatmeal/30 rounded-2xl p-6 hover:shadow-lg hover:border-warm-sand/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-golden-glow/50 flex items-center justify-center mb-4">
                  <item.icon className="h-4 w-4 text-warm-sand" />
                </div>
                <h3 className="text-sm font-bold text-deep-espresso uppercase tracking-wider mb-1">{item.label}</h3>
                <p className="text-deep-espresso/60 text-sm font-medium leading-relaxed">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white border border-soft-oatmeal/30 rounded-2xl p-8"
          >
            <h2 className="text-xl font-display font-bold text-deep-espresso mb-6">Send a Message</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-deep-espresso/60 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border border-soft-oatmeal/40 rounded-xl px-5 py-3 text-sm font-medium text-deep-espresso focus:outline-none focus:ring-2 focus:ring-warm-sand/30 focus:border-warm-sand/50 transition-all bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-deep-espresso/60 font-bold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-soft-oatmeal/40 rounded-xl px-5 py-3 text-sm font-medium text-deep-espresso focus:outline-none focus:ring-2 focus:ring-warm-sand/30 focus:border-warm-sand/50 transition-all bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-deep-espresso/60 font-bold mb-2">Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full border border-soft-oatmeal/40 rounded-xl px-5 py-3 text-sm font-medium text-deep-espresso focus:outline-none focus:ring-2 focus:ring-warm-sand/30 focus:border-warm-sand/50 transition-all bg-transparent resize-none"
                />
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-warm-sand text-white rounded-full py-3.5 font-bold uppercase tracking-wider text-xs hover:bg-dusty-cocoa transition-colors"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
