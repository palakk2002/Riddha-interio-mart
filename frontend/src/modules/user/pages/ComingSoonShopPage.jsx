import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowLeft, FiShoppingCart, FiSearch, FiFilter, 
  FiHeart, FiStar, FiZap, FiArrowRight, FiInstagram, FiTwitter, FiLinkedin 
} from 'react-icons/fi';
import ComingSoonHeader from '../components/ComingSoonHeader';
import Logo from "../../../assets/WhatsApp Image 2026-05-06 at 3.50.08 PM.jpeg";

const ComingSoonShopPage = () => {
  const products = [
    { name: "Teak Master Bed", category: "Furniture", price: "₹34,999", img: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=400&q=80" },
    { name: "Crystal Chandelier", category: "Lighting", price: "₹12,499", img: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&q=80" },
    { name: "Velvet Accent Chair", category: "Furniture", price: "₹8,999", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
    { name: "Modern Floor Lamp", category: "Lighting", price: "₹4,299", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
    { name: "Veneer Wall Panel", category: "Wall Panels", price: "₹2,499", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400&q=80" },
    { name: "Marble Dining Table", category: "Furniture", price: "₹45,999", img: "https://images.unsplash.com/photo-1615064646657-dd44f77c8e74?w=400&q=80" },
    { name: "Sleek Kitchen Cabinet", category: "Modular Kitchen", price: "₹18,000", img: "https://images.unsplash.com/photo-1556912177-f1319777174b?w=400&q=80" },
    { name: "Industrial Pendant", category: "Lighting", price: "₹2,199", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80" }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* --- SHARED HEADER --- */}
      <ComingSoonHeader />

      {/* --- HERO SECTION --- */}
      <section className="py-20 lg:py-28 text-center px-6 bg-slate-50 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 border-8 border-[#311B92] rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 border-8 border-[#189D91] rounded-[4rem] rotate-12"></div>
         </div>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-10 space-y-6 max-w-4xl mx-auto"
         >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
               <FiZap className="text-orange-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Opening June 2025</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-[#311B92] leading-[0.9] tracking-tighter">
              Our <span className="text-[#189D91]">Shop</span> is <br /> <span className="text-[#D12C8D]">Coming Soon</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto pt-4">
              We are digitizing over 10,000+ premium interior products. Get ready for a world-class shopping experience.
            </p>
         </motion.div>
      </section>

      {/* --- SHOP FILTERS (DUMMY) --- */}
      <section className="max-w-7xl mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100">
         <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="text-slate-900 border-b-2 border-[#189D91] pb-1">All Products</span>
            <span className="hover:text-[#311B92] cursor-pointer">Furniture</span>
            <span className="hover:text-[#311B92] cursor-pointer">Lighting</span>
            <span className="hover:text-[#311B92] cursor-pointer">Decor</span>
         </div>
         <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl text-slate-400">
            <FiFilter />
            <span className="text-xs font-black uppercase tracking-widest">Filter & Sort</span>
         </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="py-16 max-w-7xl mx-auto px-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, index) => (
              <ProductTeaserCard key={index} {...product} index={index} />
            ))}
         </div>
      </section>

      {/* --- EXCLUSIVE OFFER BANNER --- */}
      <section className="py-20 px-8">
         <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto bg-[#311B92] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12"
         >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="space-y-6 text-center lg:text-left z-10">
               <h4 className="text-xs font-black uppercase tracking-[0.5em] text-[#189D91]">Launch Special</h4>
               <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Get Flat 20% OFF <br /> On Your First Order</h2>
               <p className="text-white/60 font-medium text-lg">Join our waitlist today and receive an exclusive discount code on launch day.</p>
               <div className="pt-4 flex justify-center lg:justify-start">
                  <button className="px-10 py-5 bg-[#D12C8D] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#D12C8D]/20">
                     Join Waitlist Now
                  </button>
               </div>
            </div>

            <div className="relative z-10 hidden lg:block">
               <div className="w-80 h-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] rotate-12 flex items-center justify-center">
                  <FiArrowRight size={80} className="text-white/40 -rotate-45" />
               </div>
            </div>
         </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-slate-100 bg-white">
         <div className="max-w-7xl mx-auto px-8 flex flex-col items-center space-y-10">
            <img src={Logo} alt="Riddha Interio" className="h-14 opacity-80" />
            <p className="text-center text-slate-500 font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">
              Premium Quality Products for Premium Lifestyles.
            </p>
            <div className="flex gap-8">
               <SocialIcon icon={<FiInstagram />} />
               <SocialIcon icon={<FiTwitter />} />
               <SocialIcon icon={<FiLinkedin />} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
               © {new Date().getFullYear()} RIDDHA INTERIO MART. ALL RIGHTS RESERVED.
            </p>
         </div>
      </footer>

    </div>
  );
};

// --- Sub Components ---

const ProductTeaserCard = ({ name, category, price, img, index }) => (
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ delay: index * 0.1 }}
     className="group"
   >
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-sm border border-slate-100">
         <img src={img} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
         <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-[#D12C8D]">
            Coming Soon
         </div>
         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="p-4 bg-white rounded-full shadow-xl hover:scale-110 transition-all">
               <FiHeart className="text-[#D12C8D]" />
            </button>
         </div>
      </div>
      <div className="space-y-1">
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{category}</p>
         <h3 className="text-lg font-black text-[#311B92] leading-tight">{name}</h3>
         <div className="flex items-center justify-between pt-2">
            <p className="text-xl font-bold text-[#189D91]">{price}</p>
            <div className="flex gap-0.5">
               {[...Array(5)].map((_, i) => <FiStar key={i} size={10} className="text-yellow-400 fill-yellow-400" />)}
            </div>
         </div>
         <button className="w-full mt-4 py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#311B92] hover:text-white transition-all">
            Launch Alert
         </button>
      </div>
   </motion.div>
);

const SocialIcon = ({ icon }) => (
   <a href="#" className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#311B92] hover:text-white hover:border-[#311B92] transition-all">
      {icon}
   </a>
);

export default ComingSoonShopPage;
