import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiTarget, FiEye, FiAward, FiTruck, FiBox, 
  FiTag, FiUsers, FiArrowLeft, FiInstagram, FiTwitter, FiLinkedin 
} from 'react-icons/fi';
import ComingSoonHeader from '../components/ComingSoonHeader';
import Logo from "../../../assets/WhatsApp Image 2026-05-06 at 3.50.08 PM.jpeg";

const ComingSoonAboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* --- SHARED HEADER --- */}
      <ComingSoonHeader />

      {/* --- HERO SECTION --- */}
      <section className="relative py-24 lg:py-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Decorative background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#189D91]/10 blur-[120px] rounded-full"></div>
           <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-[#311B92]/5 blur-[150px] rounded-full"></div>
        </div>

        <motion.div {...fadeInUp} className="relative z-10 space-y-6 max-w-4xl">
           <h4 className="text-xs font-black uppercase tracking-[0.5em] text-[#189D91]">Discover Our Vision</h4>
           <h1 className="text-5xl md:text-8xl font-black text-[#311B92] leading-[0.9] tracking-tighter">
             Building Beautiful <br /> Spaces, <span className="text-[#D12C8D]">Together.</span>
           </h1>
           <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto pt-4">
             At Riddha Interio Mart, we believe every home deserves a touch of elegance. We're on a mission to simplify interior solutions for everyone.
           </p>
        </motion.div>
      </section>

      {/* --- WHO WE ARE --- */}
      <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-2/3 bg-[#311B92]/5 blur-[120px] rounded-full -mr-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Enhanced Image Gallery */}
            <motion.div 
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative Frame */}
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-[#189D91]/30 rounded-tl-[3rem] pointer-events-none"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-[#D12C8D]/30 rounded-br-[3rem] pointer-events-none"></div>
              
              <div className="relative rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(49,27,146,0.2)] group">
                <img 
                  src="/src/assets/luxury_interior.png" 
                  alt="Luxury Modern Interior" 
                  className="w-full aspect-[4/5] object-cover transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#311B92]/60 via-transparent to-transparent opacity-60"></div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-[200px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#189D91] mb-1">Established</p>
                  <p className="text-2xl font-black text-[#311B92]">2024</p>
                  <div className="h-1 w-8 bg-[#D12C8D] mt-2 rounded-full"></div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-[#189D91]/20 to-transparent rounded-full blur-2xl"></div>
            </motion.div>

            {/* Right: Premium Content */}
            <motion.div 
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-[#189D91]">Premium Heritage</h4>
                  <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#311B92] to-[#D12C8D] leading-tight">
                    Who We Are
                  </h2>
                </div>
                <div className="w-24 h-2 bg-gradient-to-r from-[#189D91] to-[#189D91]/20 rounded-full"></div>
              </div>

              <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                <p>
                  Riddha Interio Mart is India's upcoming one-stop destination for all things interior. From the finest furniture and designer lighting to premium wall panels and hardware, we bring together a curated collection that defines luxury and quality.
                </p>
                <p>
                  Whether you're a homeowner looking to refresh a single room or a professional designer working on a large-scale project, our platform provides the tools and products you need to bring your vision to life.
                </p>
              </div>

              {/* Icon Highlights */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#189D91]/10 flex items-center justify-center text-[#189D91]">
                    <FiAward size={24} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">Certified Quality</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#311B92]/10 flex items-center justify-center text-[#311B92]">
                    <FiEye size={24} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">Design Vision</span>
                </div>
              </div>

              <div className="pt-8">
                 <Link to="/coming-soon" className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] group hover:bg-[#311B92] hover:scale-105 transition-all shadow-xl">
                    Discover More <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="py-24">
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

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-slate-50 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#311B92]/5 blur-[150px] rounded-full"></div>
         <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-[#189D91]/5 blur-[120px] rounded-full"></div>
         
         <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center space-y-4 mb-20">
               <h4 className="text-xs font-black uppercase tracking-[0.5em] text-[#189D91]">The Riddha Edge</h4>
               <h2 className="text-4xl md:text-6xl font-black text-[#311B92]">Why Choose Us?</h2>
               <div className="w-24 h-1.5 bg-gradient-to-r from-[#189D91] to-transparent rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureItem icon={<FiBox />} title="Wide Range" text="Thousands of products across 20+ categories." />
               <FeatureItem icon={<FiAward />} title="Premium Quality" text="Each item is hand-picked and quality-checked." />
               <FeatureItem icon={<FiTag />} title="Affordable Pricing" text="Designer looks without the designer price tag." />
               <FeatureItem icon={<FiTruck />} title="Fast Delivery" text="Reliable shipping across all major Indian cities." />
            </div>
         </div>
      </section>

      {/* --- OUR JOURNEY --- */}
      <section className="py-24 lg:py-32">
         <div className="max-w-4xl mx-auto px-8">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-[#311B92]">Our Journey</h2>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">How it all started</p>
            </div>

            <div className="space-y-12">
               <TimelineStep year="2024" title="The Spark" text="Riddha Interio Mart was born from a simple observation: finding high-quality interior supplies in India was fragmented and difficult." />
               <TimelineStep year="2025" title="The Build" text="Our team of designers and engineers began building a digital-first platform to connect the best manufacturers with home lovers." />
               <TimelineStep year="JUNE 2025" title="The Launch" text="We're officially opening our doors to the public, starting our mission to transform Indian homes." active />
            </div>
         </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-24 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-8">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-[#311B92]">Meet the Visionaries</h2>
               <div className="w-20 h-1.5 bg-[#D12C8D] rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <TeamCard name="Aakash Sharma" role="Founder & CEO" img="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" />
               <TeamCard name="Riya Gupta" role="Head of Design" img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" />
               <TeamCard name="Vikram Singh" role="Operations Lead" img="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" />
            </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-8 overflow-hidden">
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-6xl mx-auto bg-gradient-to-br from-[#189D91] via-[#311B92] to-[#D12C8D] rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(49,27,146,0.4)] group"
         >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
               {/* Mesh Pattern */}
               <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                     <pattern id="mesh" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                     </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mesh)" />
               </svg>
            </div>

            {/* Floating Spheres */}
            <motion.div 
               animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 blur-3xl rounded-full"
            />
            <motion.div 
               animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#189D91]/20 blur-3xl rounded-full"
            />

            <div className="relative z-10 space-y-10">
               <div className="space-y-4">
                  <motion.span 
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/20"
                  >
                     Ready to begin?
                  </motion.span>
                  <h2 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                     Join Us in Transforming <br /> 
                     <span className="text-white/80">Better Living Spaces</span>
                  </h2>
               </div>

               <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                  <Link to="/coming-soon" className="px-12 py-6 bg-white text-[#311B92] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl hover:shadow-white/20 active:scale-95">
                     Get Launch Alert
                  </Link>
                  <Link to="/coming-soon/contact" className="px-12 py-6 bg-transparent border-2 border-white/30 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#311B92] transition-all backdrop-blur-sm active:scale-95">
                     Partner With Us
                  </Link>
               </div>
            </div>
         </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-slate-100 bg-white">
         <div className="max-w-7xl mx-auto px-8 flex flex-col items-center space-y-10">
            <img src={Logo} alt="Riddha Interio" className="h-14 opacity-80" />
            <p className="text-center text-slate-500 font-medium max-w-lg leading-relaxed">
              Be part of our journey to create better living spaces. India's premium hub for all interior supply needs.
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

const MissionCard = ({ icon, title, text, color }) => (
   <motion.div 
     whileHover={{ y: -10 }}
     className={`p-12 rounded-[3rem] bg-gradient-to-br ${color} border border-white shadow-xl space-y-6 transition-all`}
   >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#311B92] shadow-sm">
         {icon}
      </div>
      <h3 className="text-2xl font-black text-[#311B92]">{title}</h3>
      <p className="text-slate-600 font-medium leading-relaxed">{text}</p>
   </motion.div>
);

const FeatureItem = ({ icon, title, text }) => (
   <motion.div 
      whileHover={{ y: -8 }}
      className="p-8 rounded-[2.5rem] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_20px_50px_-12px_rgba(49,27,146,0.12)] transition-all duration-500 space-y-6 group"
   >
      <div className="w-14 h-14 rounded-2xl bg-[#189D91]/10 flex items-center justify-center text-[#189D91] group-hover:scale-110 group-hover:bg-[#189D91] group-hover:text-white transition-all duration-500">
         {React.cloneElement(icon, { size: 28 })}
      </div>
      <div className="space-y-2">
         <h4 className="text-xl font-black text-[#311B92] tracking-tight">{title}</h4>
         <p className="text-slate-500 text-sm leading-relaxed font-medium">{text}</p>
      </div>
   </motion.div>
);

const TimelineStep = ({ year, title, text, active }) => (
   <div className="flex gap-8 items-start relative group">
      <div className="flex flex-col items-center">
         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xs transition-colors ${active ? 'bg-[#D12C8D] text-white shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:bg-[#189D91]/20'}`}>
            {year}
         </div>
         <div className="w-0.5 h-20 bg-slate-100 group-last:hidden"></div>
      </div>
      <div className="pt-2 space-y-1">
         <h4 className={`text-xl font-black ${active ? 'text-[#311B92]' : 'text-slate-700'}`}>{title}</h4>
         <p className="text-slate-500 font-medium max-w-lg leading-relaxed">{text}</p>
      </div>
   </div>
);

const TeamCard = ({ name, role, img }) => (
   <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-slate-100 space-y-6 text-center group"
   >
      <div className="aspect-square rounded-[2rem] overflow-hidden">
         <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
      </div>
      <div className="pb-4">
         <h4 className="text-xl font-black text-[#311B92]">{name}</h4>
         <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{role}</p>
      </div>
   </motion.div>
);

const SocialIcon = ({ icon }) => (
   <a href="#" className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#311B92] hover:text-white hover:border-[#311B92] transition-all">
      {icon}
   </a>
);

export default ComingSoonAboutPage;
