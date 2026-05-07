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
    <section className="py-2 md:py-8 bg-white">
      <div className="max-w-[1600px] mx-auto px-2 md:px-8">
        <div className="relative w-full h-[180px] md:h-[360px] overflow-hidden bg-[#E0F2F1] md:bg-gray-50 flex items-center rounded-[24px] md:rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background Image with Overlay */}
              <img 
                src={slides[currentSlide].bg} 
                alt="Modern Interior" 
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          <div className="w-full h-full px-6 md:px-20 relative z-10 flex flex-row items-center justify-between gap-4 md:gap-8 text-left">
            
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-[15px] md:text-3xl lg:text-[40px] font-black text-[#004D40] md:text-gray-900 leading-tight uppercase">
                    {slides[currentSlide].titlePart1} <br />
                    <span className="text-[#702D8B] md:text-[#FF0055]">{slides[currentSlide].titlePart2}</span>
                  </h1>
                  
                  <p className="mt-1.5 text-gray-500 md:text-[#189D91] font-bold text-[9px] md:text-lg flex items-center justify-start gap-2 uppercase tracking-widest">
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Info Stats (Hidden on mobile) */}
              <div className="hidden md:grid mt-6 grid-cols-3 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2F1] flex items-center justify-center text-[#189D91]">
                    <FiBox size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-[12px]">10,000+</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Products</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#FF0055]">
                    <FiShield size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-[12px]">Trusted</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">1L+ Users</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-[#F57C00]">
                    <FiTruck size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-[12px]">Express</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">4 Hour Delivery</span>
                  </div>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              {/* CTA Buttons - Hidden on Mobile to match screenshot */}
              <div className="hidden md:flex mt-6 md:mt-10 flex-row items-center justify-start gap-3 w-full">
                <Link 
                  to="/products" 
                  className="bg-[#004D40] text-white px-5 md:px-8 py-3 md:py-3.5 rounded-xl font-black text-[11px] md:text-xs flex items-center gap-2 hover:bg-[#003d33] transition-all group whitespace-nowrap"
                >
                  Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/categories" 
                  className="border-2 border-gray-200 text-gray-700 px-5 md:px-8 py-3 md:py-3.5 rounded-xl font-black text-[11px] md:text-xs hover:border-[#189D91] hover:text-[#189D91] transition-all whitespace-nowrap"
                >
                  Explore
                </Link>
              </div>
            </div>


            {/* Right Content - Today's Deal (Ultra Compact) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:block w-[180px] bg-white rounded-[20px] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 relative"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#FF0055] font-black text-[8px] uppercase tracking-wider italic">Today's Deal</span>
                <div className="flex items-center gap-1 text-gray-500 font-mono text-[9px] font-bold">
                  <span>{formatTime(timeLeft.hours)}</span>:
                  <span>{formatTime(timeLeft.minutes)}</span>:
                  <span>{formatTime(timeLeft.seconds)}</span>
                </div>
              </div>

              <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden mb-2 group">
                <img 
                  src={DealProduct} 
                  alt="Deal Product" 
                  className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500" 
                />
              </div>

              <div className="space-y-0.5">
                <h3 className="font-black text-gray-900 text-[10px] leading-tight truncate uppercase">Modern Pendant Light</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12px] font-black text-gray-900">₹2,499</span>
                  <span className="text-[8px] text-gray-400 line-through font-bold">₹3,999</span>
                </div>
              </div>

              <button className="w-full mt-2 bg-[#FF0055] text-white py-2 rounded-lg font-black text-[8px] hover:bg-[#D81B60] transition-all active:scale-95 uppercase tracking-wider">
                Shop Now
              </button>
            </motion.div>

          </div>

          {/* Manual Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-between px-6 pointer-events-none">
            <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-gray-800 pointer-events-auto border border-white/10 hover:bg-white transition-all shadow-md active:scale-90">
              <FiChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-gray-800 pointer-events-auto border border-white/10 hover:bg-white transition-all shadow-md active:scale-90">
              <FiChevronRight size={20} />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-[#004D40]' : 'w-2 bg-gray-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;


