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
      <section className="py-20 lg:py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <motion.div 
             initial={{ x: -50, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             viewport={{ once: true }}
             className="relative rounded-[3rem] overflow-hidden shadow-2xl group"
           >
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" 
                alt="Modern Interior" 
                className="w-full aspect-[4/5] object-cover transform group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#311B92]/40 to-transparent"></div>
           </motion.div>

           <motion.div 
             initial={{ x: 50, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             viewport={{ once: true }}
             className="space-y-8"
           >
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-5xl font-black text-[#311B92]">Who We Are</h2>
                 <div className="w-20 h-1.5 bg-[#189D91] rounded-full"></div>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Riddha Interio Mart is India's upcoming one-stop destination for all things interior. From the finest furniture and designer lighting to premium wall panels and hardware, we bring together a curated collection that defines luxury and quality.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Whether you're a homeowner looking to refresh a single room or a professional designer working on a large-scale project, our platform provides the tools and products you need to bring your vision to life.
              </p>
              <div className="pt-6">
                 <Link to="/coming-soon" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-[#D12C8D] group">
                    Our Collection is Coming Soon <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </motion.div>
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
      <section className="py-24 bg-[#311B92] text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full"></div>
         
         <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center space-y-4 mb-20">
               <h4 className="text-xs font-black uppercase tracking-[0.5em] text-[#189D91]">The Riddha Edge</h4>
               <h2 className="text-4xl md:text-6xl font-black">Why Choose Us?</h2>
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
      <section className="py-20 px-8">
         <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-gradient-to-r from-[#189D91] via-[#311B92] to-[#D12C8D] rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl"
         >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 space-y-8">
               <h2 className="text-4xl md:text-6xl font-black leading-tight">Join Us in Transforming <br /> Better Living Spaces</h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                  <Link to="/coming-soon" className="px-10 py-5 bg-white text-[#311B92] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                     Get Launch Alert
                  </Link>
                  <Link to="/coming-soon/contact" className="px-10 py-5 bg-transparent border-2 border-white/40 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#311B92] transition-all">
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
   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-4">
      <div className="text-[#189D91]">
         {React.cloneElement(icon, { size: 28 })}
      </div>
      <h4 className="text-xl font-bold tracking-tight">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
   </div>
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
