import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';
import heroBanner from '../../../assets/hero.png';
import mobileBanner from '../../../assets/banner_mobile.png';

const Banner = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative h-[320px] md:h-[600px] w-full overflow-hidden md:rounded-[2rem] rounded-none group shadow-2xl">
      {/* Background Image - Responsive */}
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroBanner}
          alt="Luxury Interior"
          className="hidden md:block h-full w-full object-cover"
        />
        {/* Mobile Image */}
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={mobileBanner}
          alt="Luxury Interior"
          className="block md:hidden h-full w-full object-cover"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-espresso/80 via-deep-espresso/40 to-deep-espresso/80 md:bg-gradient-to-r md:from-deep-espresso/80 md:via-deep-espresso/30 md:to-transparent flex items-center justify-center md:justify-start">
        <div className="max-w-7xl mx-auto px-2 md:px-8 w-full flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-xl space-y-3 md:space-y-8 flex flex-col items-center md:items-start"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-warm-sand/20 backdrop-blur-md border border-warm-sand/30 text-warm-sand rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase"
            >
              Exclusive Collection 2026
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.2] md:leading-[1.1]"
            >
              Elegance in Every <span className="text-warm-sand italic font-serif">Detail.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm md:text-xl text-soft-oatmeal/90 leading-relaxed font-light max-w-[95%] md:max-w-none"
            >
              Discover our curated selection of premium tiles, designer paints, and contemporary furniture designed for modern luxury living.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-5 pt-2 md:pt-4 w-full sm:w-auto"
            >
              <Button size={isMobile ? 'sm' : 'lg'} className="shadow-2xl rounded-full px-10 w-full sm:w-auto">Shop Collection</Button>
              <Button variant="outline" size={isMobile ? 'sm' : 'lg'} className="border-white text-white hover:bg-white hover:text-deep-espresso rounded-full px-10 w-full sm:w-auto">
                View Gallery
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12 right-12 hidden md:block"
      >
        <div className="px-8 py-5 glass rounded-3xl border-white/30 shadow-2xl backdrop-blur-xl">
          <p className="text-deep-espresso font-display font-bold text-2xl mb-1 tracking-tight">Top Rated</p>
          <p className="text-deep-espresso/50 text-sm font-medium uppercase tracking-wider">Luxury Tiles & Decor</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Banner;
