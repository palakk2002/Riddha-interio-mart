import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../../assets/WhatsApp Image 2026-05-06 at 3.50.08 PM.jpeg";

const ComingSoonHeader = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on the main page, redirect to home with hash
      window.location.href = '/coming-soon#contact';
    }
  };

  return (
    <nav className="h-24 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100/50">
      <div className="flex items-center gap-12">
        <Link to="/coming-soon" className="hover:scale-105 transition-transform">
          <img src={Logo} alt="Riddha Interio" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <NavHoverLink to="/coming-soon/about" label="Our Story" />
          <NavHoverLink to="/coming-soon/services" label="Design Services" />
          <NavHoverLink to="/coming-soon/shop" label="Shop Online" />
          <NavHoverLink to="/coming-soon/categories" label="Collections" />
        </div>
      </div>

      <button 
        onClick={scrollToContact}
        className="hidden md:flex px-8 py-3.5 bg-[#311B92] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-900/20 hover:scale-105 transition-all active:scale-95"
      >
        Contact Us
      </button>

      {/* Mobile Menu Icon (Simplified) */}
      <div className="md:hidden">
         <Link to="/coming-soon/categories" className="p-3 bg-slate-50 rounded-xl text-[#311B92]">
            <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
         </Link>
      </div>
    </nav>
  );
};

const NavHoverLink = ({ to, label }) => (
  <Link to={to} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#311B92] relative group transition-colors">
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#189D91] transition-all group-hover:w-full"></span>
  </Link>
);

export default ComingSoonHeader;
