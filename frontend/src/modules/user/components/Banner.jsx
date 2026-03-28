import React from 'react';
import { motion } from 'framer-motion';
import heroMinimal from '../../../assets/hero-minimal.png';

const Banner = () => {
  return (
    <div className="relative h-[250px] md:h-[550px] w-full overflow-hidden md:rounded-[2rem] rounded-none group shadow-2xl">
      {/* Background Image - Responsive */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroMinimal}
          alt="Luxury Interior Minimal"
          className="h-full w-full object-cover text-transparent"
        />
      </div>
      
      {/* Dynamic Soft Fade Overlay (Optional for premium feel) */}
      <div className="absolute inset-0 bg-gradient-to-t from-warm-sand/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default Banner;
