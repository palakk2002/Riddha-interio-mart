import React from 'react';
import { LuAward, LuUsers, LuStar, LuTruck, LuRotateCcw, LuFileText, LuHeadphones } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const TrustItem = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 px-4 first:pl-0 border-r border-gray-100 last:border-r-0">
    <div className="p-2 rounded-full bg-teal-50/50">
      <Icon className="w-5 h-5 text-[#189D91]" />
    </div>
    <div className="flex flex-col">
      <span className="text-[14px] font-black text-gray-900 leading-none">{title}</span>
      <span className="text-[11px] font-bold text-gray-500 mt-1">{subtitle}</span>
    </div>
  </div>
);

const TrustBar = () => {
  const trustItems = [
    { icon: LuAward, title: "500+", subtitle: "Top Brands" },
    { icon: LuUsers, title: "1L+", subtitle: "Happy Customers" },
    { icon: LuStar, title: "4.7 ★", subtitle: "Average Rating" },
    { icon: LuTruck, title: "4 Hours", subtitle: "Express Delivery" },
    { icon: LuRotateCcw, title: "10 Days", subtitle: "Easy Returns" },
    { icon: LuFileText, title: "GST Invoice", subtitle: "For All Orders" },
  ];

  return (
    <section className="py-2 bg-white overflow-hidden hidden md:block">
      <div className="max-w-[1920px] mx-auto px-4 flex gap-3">

        {/* Left Section: Trust Items */}
        <div className="flex-1 bg-teal-50/20 border border-teal-100/50 rounded-2xl p-3 flex items-center justify-between shadow-sm">
          {trustItems.map((item, idx) => (
            <TrustItem key={idx} {...item} />
          ))}
        </div>

        {/* Right Section: Help Bar */}
        <div className="bg-gradient-to-r from-[#004D40] to-[#189D91] rounded-2xl p-3 px-6 flex items-center gap-6 shadow-md border border-[#004D40]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <LuHeadphones className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none">Need Help?</span>
              <span className="text-[11px] font-bold text-white/80 mt-1">Our experts are here for you!</span>
            </div>
          </div>
          <Link 
            to="/contact" 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2 rounded-xl text-xs font-black transition-all backdrop-blur-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
