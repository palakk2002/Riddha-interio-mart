import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LuInstagram, LuFacebook, LuYoutube, LuSmartphone, LuSend, LuCalendar
} from 'react-icons/lu';
import {
  FiHome, FiGrid, FiShoppingCart, FiUser, FiSearch, FiStar,
  FiBox, FiLayers, FiCheck, FiMail, FiPhone, FiMapPin,
  FiMenu, FiX, FiChevronRight, FiChevronDown, FiAward, FiZap, FiTool, FiArrowRight, FiSmartphone,
  FiTarget, FiEye, FiTruck, FiTag, FiSend, FiCheckCircle
} from 'react-icons/fi';
import ComingSoonHeader from "../components/ComingSoonHeader";
import Logo from "../../../assets/WhatsApp Image 2026-05-06 at 3.50.08 PM.jpeg";
import FurnitureImg from "../../../assets/furniture.jpg";
import Furniture2Img from "../../../assets/furniture2.jpg";
import LightingImg from "../../../assets/lighting.jpg";
import PaintsImg from "../../../assets/paints.jpg";
import AppliancesImg from "../../../assets/appliances.jpg";
import BathroomImg from "../../../assets/bathroom.jpg";
import Showcase1 from "../../../assets/showcase_1.png";
import Showcase2 from "../../../assets/showcase_2.png";
import Showcase3 from "../../../assets/showcase_3.png";
import Showcase4 from "../../../assets/showcase_4.png";
import Showcase5 from "../../../assets/showcase_5.png";
import Showcase6 from "../../../assets/showcase_6.png";
import Showcase7 from "../../../assets/showcase_7.png";
import Showcase8 from "../../../assets/showcase_8.png";
import AboutShowroom from "../../../assets/about_showroom.png";
import AboutDetail from "../../../assets/about_detail.png";
import HeroMain from "../../../assets/hero_main.png";

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown Logic
  useEffect(() => {
    const targetDate = new Date('June 15, 2026 00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden flex flex-col font-sans selection:bg-teal-500/30">
      {/* --- SHARED HEADER --- */}
      <ComingSoonHeader />

      {/* --- MAIN HERO SECTION --- */}
      <main className="flex-grow relative pt-6 lg:pt-10">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10 overflow-hidden">
          <div className="absolute right-[-10%] top-[10%] w-[500px]">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80" alt="Furniture" className="w-full blur-sm" />
          </div>
          <div className="absolute left-[-10%] bottom-[20%] w-[400px]">
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" alt="Plant" className="w-full blur-sm" />
          </div>
        </div>

        {/* Purple Wavy Floor Component */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] z-0 pointer-events-none">
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-[150%] bg-[#311B92]/5 blur-[100px] rounded-full"></div>
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full drop-shadow-2xl">
            <path fill="#311B92" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[600px]">

          {/* Left Content Area */}
          <div className="flex-1 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">

            {/* Logo Section */}
            <div className="flex flex-col items-center lg:items-start group">
              <div className="flex items-center gap-2">
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-[#189D91]">Riddha</span>
                <div className="relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#311B92] rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                    <LuSmartphone className="text-white text-xl md:text-2xl" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-lg md:text-xl font-black text-[#311B92] tracking-[0.2em] uppercase">Interio Mart</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-[0.2em] opacity-60">Your One-Stop Destination For</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight drop-shadow-sm">
                <span className="block text-[#311B92]">ALL INTERIOR</span>
                <span className="block text-[#D12C8D]">SOLUTIONS</span>
              </h1>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-3 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                <span>WIDE RANGE</span> <span className="text-[#189D91]">/</span> <span>BEST QUALITY</span> <span className="text-[#189D91]">/</span> <span>EXCLUSIVE DEALS</span> <span className="text-[#189D91]">/</span> <span>FAST DELIVERY</span>
              </div>
            </div>

            <div className="relative bg-gradient-to-r from-[#189D91] to-[#D12C8D] text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-xl">
              We Are Launching Soon!
            </div>

            <div className="space-y-6 w-full max-w-lg">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-[#311B92]">
                <LuCalendar size={28} className="text-[#D12C8D]" />
                <p className="text-lg md:text-2xl font-black uppercase tracking-widest">
                  Launching On <span className="text-[#D12C8D]">15<sup>TH</sup> June 2026</span>
                </p>
              </div>
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                <CountdownBox value={timeLeft.days} label="Days" />
                <CountdownBox value={timeLeft.hours} label="Hours" />
                <CountdownBox value={timeLeft.minutes} label="Minutes" />
                <CountdownBox value={timeLeft.seconds} label="Seconds" />
              </div>
            </div>

          </div>

          {/* --- SMARTPHONE MOCKUP (REPLACING EDITORIAL IMAGES) --- */}
          <div className="flex-1 relative min-h-[600px] flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-[260px] md:w-[300px] h-[540px] md:h-[610px] bg-slate-950 rounded-[3rem] border-[8px] md:border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(49,27,146,0.3)] flex flex-col overflow-hidden"
            >
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 md:h-6 bg-slate-950 rounded-full z-50 flex items-center justify-center">
                 <div className="w-1 h-1 rounded-full bg-white/10 ml-auto mr-3" />
              </div>

              {/* Screen Content */}
              <div className="flex-1 bg-white overflow-y-auto no-scrollbar relative flex flex-col">
                {/* Header Area */}
                <div className="bg-[#189D91] pt-10 pb-4 px-4 space-y-3">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[10px] font-black tracking-tight">Riddha Interio Mart</span>
                    <div className="flex gap-2">
                      <FiUser size={12} />
                      <FiShoppingCart size={12} />
                      <FiMenu size={12} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg flex items-center px-3 py-1.5 shadow-sm">
                    <FiSearch className="text-slate-300 mr-2" size={10} />
                    <span className="text-[9px] font-bold text-slate-300">Search products or brands...</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <FiMapPin size={8} />
                    <span className="text-[8px] font-bold">Delivery in <span className="text-teal-100">4 hours</span></span>
                    <FiChevronDown size={8} className="ml-auto" />
                  </div>
                </div>

                {/* Main Scroll Area */}
                <div className="flex-1 p-3 space-y-4">
                  {/* Promo Banner */}
                  <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-3 flex gap-3">
                    <div className="flex-1 space-y-1">
                       <span className="text-[6px] font-black text-[#189D91] uppercase tracking-widest">Premium Selection:</span>
                       <h4 className="text-[10px] font-black text-slate-800 leading-tight">INTERIOR OFFERS</h4>
                       <p className="text-[7px] font-bold text-slate-400">Curated by Experts</p>
                    </div>
                    <div className="w-14 h-10 rounded-lg bg-slate-200 overflow-hidden">
                       <img src={Showcase1} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Categories Row */}
                  <div className="flex justify-between px-1">
                    <PhoneCategory icon={<FiBox />} label="Furniture" color="bg-teal-500" />
                    <PhoneCategory icon={<FiZap />} label="Lighting" color="bg-[#D12C8D]" />
                    <PhoneCategory icon={<FiLayers />} label="Wall Panels" color="bg-indigo-600" />
                    <PhoneCategory icon={<FiGrid />} label="Decor" color="bg-orange-500" />
                    <PhoneCategory icon={<FiTool />} label="Hardware" color="bg-[#189D91]" />
                  </div>

                  {/* Designer Favorites Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black text-slate-800">Designer Favorites</h4>
                       <span className="text-[7px] font-black text-[#189D91] uppercase">View All</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <PhoneProductCard name="Tuak Master Bed" price="₹34,999" rating="4.7 (212)" img={Showcase2} />
                      <PhoneProductCard name="Veneer Wall Panel" price="₹3,500/sq.ft" rating="4.9 (189)" img={Showcase3} />
                      <PhoneProductCard name="Artisan Dining Set" price="₹21,099" rating="4.8 (156)" img={Showcase4} />
                      <PhoneProductCard name="Designer Bed" price="₹29,999" rating="4.6 (98)" img={Showcase5} />
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="bg-white border-t border-slate-50 flex items-center justify-between px-6 py-2 pb-4">
                  <div className="flex flex-col items-center text-[#189D91]">
                    <FiHome size={14} />
                    <span className="text-[6px] font-bold mt-1">HOME</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400">
                    <FiGrid size={14} />
                    <span className="text-[6px] font-bold mt-1 uppercase">Categories</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400">
                    <FiShoppingCart size={14} />
                    <span className="text-[6px] font-bold mt-1 uppercase">Cart</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400">
                    <FiUser size={14} />
                    <span className="text-[6px] font-bold mt-1 uppercase">Profile</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements Around Phone */}
            <motion.div
               animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 right-0 z-20 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-3"
            >
               <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <FiAward size={20} />
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Big Things</p>
                  <p className="text-xs font-black text-[#311B92] mt-1">Are On The Way!</p>
               </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- INTERIOR SHOWCASE SECTION (MATCHING USER REFERENCE) --- */}
      <section className="bg-[#F9E8E2] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-32 flex flex-col items-center text-center">
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#311B92]/40 mb-4 text-center">Curated Inspiration</h3>
           <h2 className="text-2xl md:text-5xl font-black text-[#311B92]">Transforming Visions into Reality</h2>
        </div>
        
        {/* Infinite Scrolling Carousel (Seamless Right-to-Left) */}
        <div className="relative flex overflow-hidden pb-10">
           <motion.div 
             className="flex gap-6 md:gap-10 px-4 whitespace-nowrap"
             animate={{ x: [0, "-50%"] }}
             transition={{ 
               duration: 30, 
               repeat: Infinity, 
               ease: "linear" 
             }}
           >
              {/* Ultimate Infinite Loop with 8 High-Quality Interior Images */}
              {[
                Showcase1, Showcase2, Showcase3, Showcase4,
                Showcase5, Showcase6, Showcase7, Showcase8,
                Showcase1, Showcase2, Showcase3, Showcase4,
                Showcase5, Showcase6, Showcase7, Showcase8
              ].map((img, idx) => (
                <ShowcaseCard key={idx} img={img} />
              ))}
           </motion.div>
        </div>
      </section>

      {/* --- WHO WE ARE (CLEAN OVERLAPPING LAYOUT) --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
           {/* Left Side: Overlapping Images */}
           <div className="w-full lg:w-1/2 relative min-h-[500px] flex items-center justify-center">
              {/* Background Large Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full h-full relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100"
              >
                 <img src={AboutShowroom} alt="Showroom" className="w-full h-full object-cover" />
                 <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
                   About Riddha // 01
                 </div>
              </motion.div>

              {/* Foreground Small Overlapping Image */}
              <motion.div 
                initial={{ x: -30, y: 30, opacity: 0 }}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -left-8 w-64 h-80 z-20 rounded-2xl overflow-hidden shadow-2xl border-8 border-white"
              >
                 <img src={AboutDetail} alt="Detail" className="w-full h-full object-cover" />
              </motion.div>
           </div>

           {/* Right Side: Editorial Content */}
           <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-[0.6em] text-[#189D91]">The Riddha Legacy</h4>
                 <h2 className="text-5xl md:text-7xl font-black text-[#311B92] leading-[1.1] tracking-tighter">
                   Creating A <br /> <span className="text-[#189D91]">Legacy.</span>
                 </h2>
              </div>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                We specialize in elevating your living spaces into a visual narrative that stands out. Our approach blends technical precision with raw emotional depth, bringing you the finest interior products from across the globe.
              </p>
              <div className="pt-4">
                 <button className="px-10 py-5 bg-[#311B92] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-[#311B92]/20 hover:scale-105 transition-all">
                    Inquire Now
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* --- MISSION & VISION (FROM ABOUT) --- */}
      <section className="py-24 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <MissionCard 
               icon={<FiTarget size={32} />} 
               title="Our Mission" 
               text="To revolutionize the interior supply industry in India by providing high-quality, designer-curated products with transparent pricing and exceptional service."
               color="from-[#189D91]/10 to-[#189D91]/5"
            />
            <MissionCard 
               icon={<FiEye size={32} />} 
               title="Our Vision" 
               text="To become the most trusted digital hub for interior solutions, where innovation meets elegance, making premium home styling accessible to every household."
               color="from-[#311B92]/10 to-[#311B92]/5"
            />
         </div>
      </section>

      {/* --- WHY CHOOSE US (CLEAN VERSION) --- */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#189D91]/5 blur-[150px] rounded-full"></div>
         
         <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center space-y-4 mb-20">
               <h4 className="text-xs font-black uppercase tracking-[0.5em] text-[#189D91]">The Riddha Edge</h4>
               <h2 className="text-4xl md:text-6xl font-black text-[#311B92]">Why Choose Us?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureItem icon={<FiBox />} title="Wide Range" text="Thousands of products across 20+ categories." />
               <FeatureItem icon={<FiAward />} title="Premium Quality" text="Each item is hand-picked and quality-checked." />
               <FeatureItem icon={<FiTag />} title="Affordable Pricing" text="Designer looks without the designer price tag." />
               <FeatureItem icon={<FiTruck />} title="Fast Delivery" text="Reliable shipping across all major Indian cities." />
            </div>
         </div>
      </section>

      {/* --- CONTACT SECTION (FROM CONTACT) --- */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#189D91]/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center space-y-4 mb-20">
             <h4 className="text-xs font-black uppercase tracking-[0.5em] text-[#189D91]">Let's Connect</h4>
             <h2 className="text-4xl md:text-6xl font-black text-[#311B92]">Get In <span className="text-[#D12C8D]">Touch</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Side: Info */}
            <div className="space-y-12">
               <ContactInfoCard 
                 icon={<FiMapPin />} 
                 title="Our Office" 
                 text="123 Interior Hub, Mumbai, Maharashtra 400001" 
                 link="https://maps.google.com"
               />
               <ContactInfoCard 
                 icon={<FiPhone />} 
                 title="Call Us" 
                 text="+91 98765 43210" 
                 link="tel:+919876543210"
               />
               <ContactInfoCard 
                 icon={<FiMail />} 
                 title="Email Us" 
                 text="info@riddhainterio.com" 
                 link="mailto:info@riddhainterio.com"
               />
               
               <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Stay Connected</h4>
                  <div className="flex gap-4">
                    <SocialLink icon={<LuInstagram />} />
                    <SocialLink icon={<LuFacebook />} />
                    <SocialLink icon={<LuYoutube />} />
                  </div>
               </div>
            </div>

            {/* Right Side: Form */}
            <div className="relative">
               <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-slate-50 relative z-10">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormInput label="Full Name" placeholder="John Doe" type="text" required />
                        <FormInput label="Email Address" placeholder="john@example.com" type="email" required />
                     </div>
                     <FormInput label="Subject" placeholder="General Inquiry" type="text" required />
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Message</label>
                        <textarea 
                           rows="4" 
                           placeholder="How can we help you?"
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-[#189D91] outline-none transition-colors resize-none"
                           required
                        ></textarea>
                     </div>
                     <button 
                       type="submit"
                       className="w-full py-5 bg-gradient-to-r from-[#311B92] to-[#189D91] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4"
                     >
                        Send Message <FiSend size={16} />
                     </button>
                  </form>

                  <AnimatePresence>
                     {isSubmitted && (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         className="absolute inset-0 bg-white rounded-[3rem] z-20 flex flex-col items-center justify-center p-12 text-center"
                       >
                          <div className="w-20 h-20 bg-teal-50 text-[#189D91] rounded-full flex items-center justify-center mb-6">
                             <FiCheckCircle size={40} />
                          </div>
                          <h3 className="text-2xl font-black text-[#311B92] mb-4">Message Sent!</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">We'll get back to you shortly.</p>
                       </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROPER FOOTER --- */}
      <footer className="bg-white text-slate-900 pt-20 pb-10 mt-20 relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-[#189D91]">Riddha</span>
                <span className="text-xl font-bold text-slate-400">Interio Mart</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Transforming spaces with elegance and efficiency. India's premium hub for all interior supply needs.</p>
              <div className="flex items-center gap-4">
                <SocialLink icon={<LuInstagram />} />
                <SocialLink icon={<LuFacebook />} />
                <SocialLink icon={<LuYoutube />} />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-[#189D91]">Quick Explore</h4>
              <ul className="space-y-4">
                <FooterLink to="/coming-soon/about" label="Our Story" />
                <FooterLink to="/coming-soon/services" label="Design Services" />
                <FooterLink to="/coming-soon/shop" label="Shop Online" />
                <FooterLink to="/coming-soon/categories" label="Collections" />
                <li>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-slate-500 hover:text-[#311B92] transition-colors flex items-center gap-2 group"
                  >
                    <FiChevronRight size={14} className="text-[#189D91] group-hover:translate-x-1 transition-transform" />
                    Get in Touch
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-[#189D91]">Services</h4>
              <ul className="space-y-4">
                <Link to="/coming-soon/services" className="text-sm text-slate-500 hover:text-[#311B92] transition-colors cursor-pointer">Interior Consultation</Link>
                <li className="text-sm text-slate-500 hover:text-[#311B92] transition-colors cursor-pointer">Bulk Supply Solutions</li>
                <li className="text-sm text-slate-500 hover:text-[#311B92] transition-colors cursor-pointer">Project Management</li>
                <li className="text-sm text-slate-500 hover:text-[#311B92] transition-colors cursor-pointer">Custom Furniture Design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-[#189D91]">Contact Us</h4>
              <ul className="space-y-6">
                <li className="flex gap-4"><FiMapPin className="text-[#189D91]" size={20} /><span className="text-sm text-slate-500">123 Interior Hub, Mumbai, MH 400001</span></li>
                <li className="flex gap-4"><FiPhone className="text-[#189D91]" size={20} /><span className="text-sm text-slate-500">+91 98765 43210</span></li>
                <li className="flex gap-4"><FiMail className="text-[#189D91]" size={20} /><span className="text-sm text-slate-500">info@riddhainterio.com</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">© {new Date().getFullYear()} Riddha Interio Mart. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#189D91]">Terms</Link>
              <Link to="/policies/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#189D91]">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// --- Phone Sub Components ---
const PhoneCategory = ({ icon, label, color }) => (
  <div className="flex flex-col items-center gap-1.5 shrink-0">
    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white shadow-sm`}>
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

const PhoneProductCard = ({ name, price, rating, img }) => (
  <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm space-y-1.5">
    <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="space-y-0.5">
      <h5 className="text-[8px] font-black text-slate-800 leading-none truncate">{name}</h5>
      <p className="text-[7px] font-bold text-teal-600">{price}</p>
      <div className="flex items-center gap-1">
        <FiStar size={6} className="text-yellow-400 fill-yellow-400" />
        <span className="text-[6px] font-bold text-slate-400">{rating}</span>
      </div>
    </div>
  </div>
);

const MissionCard = ({ icon, title, text, color }) => (
   <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      className={`p-10 md:p-14 rounded-[3.5rem] bg-gradient-to-br ${color} border border-white relative group transition-all duration-500 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-2xl overflow-hidden`}
   >
      {/* Decorative Blur Glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 space-y-8">
         <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-[#311B92] shadow-xl shadow-indigo-900/5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            {React.cloneElement(icon, { size: 36 })}
         </div>
         <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-[#311B92] tracking-tight">{title}</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">{text}</p>
         </div>
      </div>
   </motion.div>
);

const FeatureItem = ({ icon, title, text }) => (
  <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 transition-all duration-500 space-y-6 text-center md:text-left">
     <div className="text-[#189D91] flex justify-center md:justify-start">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
           {React.cloneElement(icon, { size: 28 })}
        </div>
     </div>
     <h4 className="text-2xl font-black text-[#311B92] tracking-tight">{title}</h4>
     <p className="text-slate-500 font-medium leading-relaxed">{text}</p>
  </div>
);

const ContactInfoCard = ({ icon, title, text, link }) => (
  <a href={link} className="flex gap-6 items-center group">
     <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#189D91] border border-slate-100 group-hover:bg-[#311B92] group-hover:text-white transition-all duration-500 shadow-sm">
        {React.cloneElement(icon, { size: 24 })}
     </div>
     <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
        <p className="text-lg font-black text-[#311B92] group-hover:text-[#189D91] transition-colors">{text}</p>
     </div>
  </a>
);

const FormInput = ({ label, placeholder, type, required }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
     <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-[#189D91] outline-none transition-colors"
        required={required}
     />
  </div>
);

// --- Global Sub Components ---
const NavHoverLink = ({ to, label }) => (
  <Link to={to} className="text-sm font-bold text-slate-700 hover:text-[#189D91] relative group transition-colors">
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#189D91] transition-all group-hover:w-full"></span>
  </Link>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="text-sm text-slate-500 hover:text-[#311B92] transition-colors flex items-center gap-2 group">
      <FiChevronRight size={14} className="text-[#189D91] group-hover:translate-x-1 transition-transform" />
      {label}
    </Link>
  </li>
);

const SocialLink = ({ icon }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#189D91] hover:text-white transition-all border border-slate-100">
    {React.cloneElement(icon, { size: 18 })}
  </a>
);

const CountdownBox = ({ value, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-full aspect-square bg-white border border-slate-100 rounded-2xl shadow-xl flex items-center justify-center">
      <span className="text-2xl md:text-4xl font-black text-[#311B92]">{String(value).padStart(2, '0')}</span>
    </div>
    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

const FeatureBadge = ({ icon, text, subtext, color }) => (
  <div className="flex items-center gap-4 group cursor-default">
    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
      {React.cloneElement(icon, { size: 24, className: 'md:w-8 md:h-8' })}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] md:text-xs font-black text-slate-800 tracking-widest uppercase leading-none">{text}</span>
      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtext}</span>
    </div>
  </div>
);

const ShowcaseCard = ({ img }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="w-48 h-72 md:w-56 md:h-80 shrink-0 bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5"
  >
    <img src={img} alt="Interior Inspiration" className="w-full h-full object-cover" />
  </motion.div>
);

export default ComingSoonPage;
