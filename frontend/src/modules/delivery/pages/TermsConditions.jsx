import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  LuShield, 
  LuFileText, 
  LuScale, 
  LuSearch, 
  LuBookOpen, 
  LuArrowRight, 
  LuShieldCheck, 
  LuTrendingUp, 
  LuCircleHelp 
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const TermsConditions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const tabs = [
    { id: 'all', name: 'All Terms', icon: LuBookOpen },
    { id: 'earnings', name: 'Payments & Fares', icon: LuTrendingUp },
    { id: 'conduct', name: 'Partner Code of Conduct', icon: LuShield },
    { id: 'safety', name: 'Safety & Compliance', icon: LuShieldCheck },
  ];

  const termsList = [
    {
      category: 'earnings',
      title: '1. Base Fare & Delivery Earnings',
      icon: LuTrendingUp,
      shortDesc: 'How your standard delivery payouts and earnings are calculated.',
      content: `Your base fare is determined dynamically by the straight-line distance between pickup and delivery drop-off location, current fuel charges, and local base tariffs. 
      Additional surge pay may apply during peak order hours, high-demand weather conditions, or extreme traffic zones. Partners receive detailed breakdowns of all delivery payouts directly inside the "My Earnings" panel upon order completion.`,
    },
    {
      category: 'earnings',
      title: '2. Surge Payouts and Incentives',
      icon: LuShieldCheck,
      shortDesc: 'Conditions for extra delivery bonuses and surge incentives.',
      content: `Weekly incentives, streak bonuses, and peak hour surge multipliers are subject to completing a minimum acceptance rate of 90% of dispatched orders during the active period. 
      Manipulating location tracking, spoofing coordinates, or intentionally delaying order handovers to accumulate waiting fees will lead to immediate forfeiture of all accumulated bonuses and potential system suspension.`,
    },
    {
      category: 'conduct',
      title: '3. Order Acceptance & Dispatch Policy',
      icon: LuScale,
      shortDesc: 'Guidelines for order acceptances, cancellations, and timelines.',
      content: `Once a delivery order is accepted, you are expected to proceed directly to the partner vendor location. Delivery partners must maintain a minimum lifetime acceptance rate of 80% to remain active on the platform. 
      Unreasonable delay in transit or multiple unexcused customer cancellations after picking up inventory will trigger automatic algorithmic review, and may require security re-verification.`,
    },
    {
      category: 'conduct',
      title: '4. Professional Standard & Customer Conduct',
      icon: LuShield,
      shortDesc: 'Platform expectations for customer interactions and support.',
      content: `Riddha Delivery partners are the brand representatives of the platform. You agree to interact with store managers, merchants, and clients in a highly courteous and professional manner. 
      Using abusive, threatening, or offensive language, sharing private customer contact numbers outside delivery operations, or returning items without valid reason violates the partner code of conduct and triggers permanent account deactivation.`,
    },
    {
      category: 'safety',
      title: '5. Document Validation & Updates',
      icon: LuFileText,
      shortDesc: 'Ensuring your DL, RC, Aadhar, and vehicle credentials are valid.',
      content: `You agree to keep all registration documents, including your Driving License (DL), Registration Certificate (RC), Aadhar Card, Pollution Certificate (PUC), and Vehicle Insurance, updated at all times. 
      The platform will periodically scan these documents. Expired credentials must be renewed and re-uploaded within 5 business days of expiration. Failure to update records will cause your delivery dispatch module to automatically lock.`,
    },
    {
      category: 'safety',
      title: '6. Vehicle Safety & Compliance',
      icon: LuShieldCheck,
      shortDesc: 'Standards for transport maintenance and legal safety.',
      content: `You must verify that the vehicle used for delivery services matches the vehicle listed in your profile. The vehicle must comply with all local emission, environmental, and transport laws. 
      While operating under active dispatch, delivery partners are fully responsible for obeying state traffic regulations, wearing helmets (for bikes), wearing seat belts (for vans/trucks), and keeping items secured in specialized carrier bags.`,
    }
  ];

  const filteredTerms = termsList.filter(term => {
    const matchesTab = activeTab === 'all' || term.category === activeTab;
    const matchesSearch = term.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          term.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8 px-2 md:px-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso flex items-center gap-3">
              <LuScale className="text-[#2A458A]" /> Terms & Conditions
            </h1>
            <p className="text-slate-500 mt-2 text-sm">Review the legal guidelines, payout frameworks, and code of conduct for Riddha Delivery partners.</p>
          </div>
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search terms or policies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 focus:border-[#2A458A] focus:outline-none text-sm transition-all shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedIndex(null);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#2A458A] text-white shadow-md shadow-[#2A458A]/10' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon size={14} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Terms Accordion (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((term, index) => {
                  const Icon = term.icon;
                  const isExpanded = expandedIndex === index;
                  
                  return (
                    <motion.div
                      key={term.title}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isExpanded 
                          ? 'border-[#2A458A] shadow-md shadow-[#2A458A]/5' 
                          : 'border-slate-100 shadow-sm hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="w-full text-left p-5 flex items-start gap-4 focus:outline-none"
                      >
                        <div className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                          isExpanded ? 'bg-[#2A458A]/10 text-[#2A458A]' : 'bg-slate-50 text-slate-500'
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className={`font-bold text-sm md:text-base leading-snug transition-colors ${
                            isExpanded ? 'text-[#2A458A]' : 'text-slate-800'
                          }`}>
                            {term.title}
                          </h3>
                          <p className="text-slate-400 text-xs mt-1 font-normal line-clamp-1">{term.shortDesc}</p>
                        </div>
                        <div className="self-center">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            term.category === 'earnings' ? 'bg-teal-50 text-teal-700' :
                            term.category === 'conduct' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {term.category}
                          </span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-6 pt-1 pl-[60px] border-t border-slate-50">
                              <p className="text-slate-600 text-sm leading-relaxed font-normal whitespace-pre-line">
                                {term.content}
                              </p>
                              <div className="mt-4 flex items-center gap-2 text-xs text-[#2A458A] font-semibold">
                                <span>Binding Clause verified</span>
                                <LuShieldCheck size={14} className="text-emerald-500" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <LuCircleHelp size={48} className="mx-auto text-slate-300 mb-4 animate-pulse" />
                  <p className="text-slate-600 font-semibold text-lg">No terms matched your search.</p>
                  <p className="text-slate-400 text-xs mt-2">Try clearing your filters or testing other keywords!</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Legal Quick Cards (Right 1 column) */}
          <div className="space-y-6">
            {/* Quick Agreement Notice */}
            <div className="bg-gradient-to-br from-[#2A458A] to-[#1e3264] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <LuShield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Agreement Consent</h4>
                  <p className="text-[10px] text-white/70">Updated May 2026</p>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-normal">
                By logging in and performing active delivery dispatches, you legally consent to the latest platform policies, dynamic incentive structures, and safety codes outlined herein.
              </p>
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white/70">Legal Consent Status:</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px]">Active</span>
              </div>
            </div>

            {/* Platform Help Center */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <h4 className="font-bold text-slate-800 text-sm mb-4">Support & Clarifications</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                    <LuBookOpen size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Need Clarification?</h5>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">Please check our Help Center for detailed FAQs or submit an inquiry to our legal desk.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                    <LuFileText size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Printable Version</h5>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">Partners can request signed legal copies from local regional offices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default TermsConditions;
