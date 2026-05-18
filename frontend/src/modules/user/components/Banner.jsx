import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBox, FiShield, FiTruck, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Using the generated images
import HeroBG1 from "../../../assets/hero_banner_interior.png";
import HeroBG2 from "../../../assets/hero_banner_kitchen.png";
import DealProduct from "../../../assets/pendant_light_deal.png";

const slides = [
  {
    id: 1,
    bg: HeroBG1,
    titlePart1: "Design Your Dream Space",
    titlePart2: "Best Interior Supplies",
    subtitle: "Premium Quality • Top Brands • Fast Delivery",
  },
  {
    id: 2,
    bg: HeroBG2,
    titlePart1: "Upgrade Your Culinary",
    titlePart2: "Modern Modular Kitchens",
    subtitle: "Sleek Designs • High Durability • Expert Fit",
  }
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(slideTimer);
  }, []);

  const formatTime = (n) => n.toString().padStart(2, '0');

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="py-2 md:py-4 bg-white">
      <div className="max-w-[1700px] mx-auto px-2 md:px-10">
        <div className="relative w-full h-[160px] md:h-[360px] overflow-hidden bg-gray-50 flex items-center rounded-[24px] md:rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {/* Background Image with subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-[1]" />
              <img 
                src={slides[currentSlide].bg} 
                alt="Modern Interior" 
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          <div className="w-full h-full px-6 md:px-24 relative z-10 flex flex-row items-center justify-between gap-8 text-left">
            
            {/* Left Content */}
            <div className="flex-1 max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-xl md:text-3xl lg:text-[40px] font-black text-white drop-shadow-lg leading-[1.1] tracking-tight">
                    {slides[currentSlide].titlePart1} <br />
                    <span className="text-[#FF0055] drop-shadow-none">with the {slides[currentSlide].titlePart2}</span>
                  </h1>
                  
                  <p className="mt-2 text-white/90 font-bold text-[10px] md:text-base flex items-center justify-start gap-3 tracking-wide drop-shadow-md">
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Info Stats (Hidden on small desktop) */}
              <div className="hidden xl:grid mt-4 md:mt-6 grid-cols-3 gap-4 md:gap-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <FiBox className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-[11px] md:text-sm">10,000+</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-wider">Products</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <FiShield className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-[11px] md:text-sm">Trusted by</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-wider">1L+ Customers</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <FiTruck className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-[11px] md:text-sm">Express Delivery</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-wider">in 4 Hours</span>
                  </div>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <div className="flex mt-8 md:mt-10 flex-row items-center justify-start gap-4 w-full">
                <Link 
                  to="/products" 
                  className="bg-[#189D91] text-white px-6 md:px-10 py-2.5 md:py-3 rounded-xl font-black text-xs md:text-sm flex items-center gap-2 hover:bg-[#148278] transition-all group whitespace-nowrap shadow-lg shadow-[#189D91]/20"
                >
                  Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/categories" 
                  className="bg-transparent border border-white/50 text-white px-6 md:px-10 py-2.5 md:py-3 rounded-xl font-black text-xs md:text-sm hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Explore Collections
                </Link>
              </div>
            </div>

            {/* Right Side - Today's Deal Card (Visible only on Desktop) */}
            <div className="hidden lg:block w-64 xl:w-72 shrink-0">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/95 backdrop-blur-lg p-4 md:p-5 rounded-[28px] shadow-2xl border border-white/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#FF0055] font-black text-[11px] uppercase tracking-wider">Today's Deal</h3>
                  <div className="flex items-center gap-1 font-bold text-gray-800 text-[10px] tabular-nums">
                    <span>{formatTime(timeLeft.hours)}</span>:
                    <span>{formatTime(timeLeft.minutes)}</span>:
                    <span>{formatTime(timeLeft.seconds)}</span>
                  </div>
                </div>

                <div className="relative aspect-video mb-3 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center group">
                  <img src={DealProduct} alt="Pendant Light" className="w-[60%] h-[60%] object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-gray-900 font-bold text-xs">Modern Pendant Light</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">₹2,499</span>
                    <span className="text-[10px] text-gray-400 line-through">₹3,999</span>
                    <span className="text-[9px] font-black text-[#189D91] bg-[#189D91]/10 px-2 py-0.5 rounded-full">37% OFF</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-[#FF0055] text-white py-2.5 rounded-xl font-black text-[11px] hover:bg-[#D40046] transition-all shadow-lg shadow-[#FF0055]/20 active:scale-[0.98]">
                  Shop Now
                </button>
              </motion.div>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-between px-6 pointer-events-none z-20">
            <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto border border-white/30 hover:bg-white hover:text-[#189D91] transition-all shadow-lg active:scale-90">
              <FiChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto border border-white/30 hover:bg-white hover:text-[#189D91] transition-all shadow-lg active:scale-90">
              <FiChevronRight size={24} />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-10 bg-white' : 'w-2 bg-white/40'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;


