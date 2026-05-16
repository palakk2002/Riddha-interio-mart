import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  ChevronRight, 
  FileText, 
  Zap, 
  Shield, 
  ExternalLink,
  LifeBuoy,
  PlayCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        { q: "How do I list my first product?", a: "Navigate to the 'Add Product' section in your sidebar. Fill in the product details, upload high-quality images, and set your pricing. Once submitted, our team will review it within 24 hours." },
        { q: "What are the document requirements?", a: "You need a valid GSTIN, PAN Card, and a bank account in the business name to start selling on Riddha Mart." }
      ]
    },
    {
      category: "Orders & Shipping",
      questions: [
        { q: "How do I process an order?", a: "Go to the 'Orders' tab. New orders will appear under 'Pending'. Click 'Process' to confirm the order and prepare it for pickup." },
        { q: "Who handles the delivery?", a: "Riddha Mart provides a dedicated delivery network. You can assign our delivery partners directly from your dashboard." }
      ]
    },
    {
      category: "Payments & Wallet",
      questions: [
        { q: "When do I get my payments?", a: "Payments are settled into your wallet within 7 days of successful order delivery. You can withdraw funds directly to your bank account." },
        { q: "Are there any hidden fees?", a: "We believe in transparency. Our fee structure includes a flat commission based on the product category plus a small delivery facilitation fee." }
      ]
    }
  ];

  const contactChannels = [
    { title: "Chat with Us", detail: "Avg response: 5 mins", icon: <MessageCircle size={24} />, color: "bg-blue-50 text-blue-600" },
    { title: "Email Support", detail: "support@riddhamart.com", icon: <Mail size={24} />, color: "bg-purple-50 text-purple-600" },
    { title: "Call Hotline", detail: "+91 1800-RIDDHA", icon: <Phone size={24} />, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* Hero Section - Search & Welcome (Clean White Design) */}
        <div className="relative bg-white rounded-[2.5rem] p-8 md:p-16 overflow-hidden text-center border border-slate-100 shadow-xl shadow-slate-200/40">
           <div className="absolute top-0 right-0 w-96 h-96 bg-seller-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
                 <LifeBuoy size={14} className="text-seller-primary" /> Seller Support Center
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
                 How can we help you <br />
                 <span className="text-[#E36666]">grow your business?</span>
              </h1>
              
              <div className="relative max-w-xl mx-auto mt-10 group">
                 <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-seller-primary transition-colors">
                    <Search size={20} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Search for articles, guides, or FAQs..."
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-seller-primary/20 focus:bg-white transition-all text-sm font-medium shadow-sm"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {contactChannels.map((channel, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center gap-4 group cursor-pointer"
             >
                <div className={`w-16 h-16 rounded-2xl ${channel.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                   {channel.icon}
                </div>
                <div>
                   <h3 className="text-lg font-semibold text-slate-900">{channel.title}</h3>
                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">{channel.detail}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* Left: FAQs */}
           <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-seller-primary rounded-full" />
                    Frequently Asked Questions
                 </h2>
                 <button className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest hover:text-seller-primary transition-colors">View All FAQs</button>
              </div>

              <div className="space-y-8">
                 {faqs.map((cat, idx) => (
                   <div key={idx} className="space-y-4">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">{cat.category}</h4>
                      <div className="grid grid-cols-1 gap-4">
                         {cat.questions.map((item, i) => (
                           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                 <p className="text-sm font-semibold text-slate-900 group-hover:text-seller-primary transition-colors">{item.q}</p>
                                 <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.a}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Right: Resources & Guides */}
           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Book size={20} className="text-seller-primary" /> Quick Resources
                 </h3>
                 <div className="space-y-3">
                    {[
                      { label: "Seller Handbook", icon: <FileText size={16} />, color: "text-blue-600" },
                      { label: "Video Tutorials", icon: <PlayCircle size={16} />, color: "text-rose-600" },
                      { label: "Policies & Terms", icon: <Shield size={16} />, color: "text-emerald-600" },
                      { label: "Growth Secrets", icon: <Zap size={16} />, color: "text-amber-600" },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                         <div className="flex items-center gap-3">
                            <span className={item.color}>{item.icon}</span>
                            <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                         </div>
                         <ExternalLink size={14} className="text-slate-300 group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                 </div>
              </div>

              {/* Newsletter/Update Card - Professional White Design */}
              <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 relative overflow-hidden group border border-slate-100 shadow-xl shadow-slate-200/40">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-seller-primary/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                 <h4 className="text-lg font-semibold mb-2 relative z-10">Stay Updated!</h4>
                 <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-6 relative z-10 leading-relaxed">
                    Get latest platform updates and seller tips directly in your inbox.
                 </p>
                 <div className="relative z-10">
                    <input 
                      type="email" 
                      placeholder="Email address"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs placeholder-slate-400 focus:outline-none focus:bg-white transition-all mb-3 text-slate-700"
                    />
                    <button className="w-full py-3 bg-[#E36666] text-white rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-[#D45555] transition-all shadow-lg shadow-[#E36666]/20">Subscribe</button>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default HelpCenter;
