import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppFloat = ({ number = "9111661100", message = "Hi Riddha Interio, I'm interested in placing a bulk order." }) => {
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 md:bottom-8 right-6 z-[999] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-shadow duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <div className="absolute -left-36 md:-left-44 top-1/2 -translate-y-1/2 bg-white text-deep-espresso text-xs md:text-sm font-medium py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-soft-oatmeal">
        Bulk Order? Chat with us!
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-t border-r border-soft-oatmeal"></div>
      </div>
      
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-[#25D366] rounded-full opacity-20"
      />
      
      <FaWhatsapp className="text-3xl md:text-4xl relative z-10" />
    </motion.a>
  );
};

export default WhatsAppFloat;
