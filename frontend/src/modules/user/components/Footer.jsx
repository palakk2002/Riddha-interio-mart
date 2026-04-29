import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="hidden md:block bg-deep-espresso text-soft-oatmeal pt-12 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-2xl font-display font-black text-white tracking-tighter">
              <span className="text-warm-sand">R</span>IDDHA INTERIO
            </h3>
            <p className="text-sm leading-relaxed text-soft-oatmeal/60 font-medium">
              Transforming your living spaces into luxurious sanctuaries with premium tiles, paints, and designer furniture.
            </p>
            <div className="flex space-x-5">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5, color: '#189D91' }}
                  href="#" 
                  className="transition-colors text-soft-oatmeal/80"
                >
                  <Icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white text-xs uppercase tracking-[0.25em] font-black mb-10">Quick Links</h4>
            <ul className="space-y-5 text-sm font-medium text-soft-oatmeal/60">
              {['Home', 'All Products', 'Tiles', 'Designer Paints'].map((link, i) => (
                <li key={i}>
                  <Link to={link === 'Home' ? '/' : '/products'} className="hover:text-warm-sand hover:translate-x-2 transition-all inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white text-xs uppercase tracking-[0.25em] font-black mb-10">Contact Us</h4>
            <ul className="space-y-6 text-sm font-medium text-soft-oatmeal/60">
              <li className="flex items-start">
                <FiMapPin className="h-5 w-5 mr-4 text-warm-sand flex-shrink-0" />
                <span className="leading-relaxed">123 Interior Hub, Design Street, Mumbai, MH 400001</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="h-5 w-5 mr-4 text-warm-sand flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <FiMail className="h-5 w-5 mr-4 text-warm-sand flex-shrink-0" />
                <span>info@riddhainterio.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white text-xs uppercase tracking-[0.25em] font-black mb-10">Newsletter</h4>
            <p className="text-sm text-soft-oatmeal/60 mb-6 font-medium leading-relaxed">Subscribe to receive inspiration and exclusive offers.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 text-white rounded-full px-6 py-3 w-full focus:outline-none focus:ring-2 focus:ring-warm-sand/30 focus:bg-white/10 transition-all font-medium"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-warm-sand text-deep-espresso rounded-full py-3 font-black uppercase tracking-wider text-xs hover:bg-golden-glow transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
        
        <div className="border-t border-white/5 pt-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-soft-oatmeal/20 italic">
            © {new Date().getFullYear()} Riddha Interio Mart. Crafted for Luxury.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
