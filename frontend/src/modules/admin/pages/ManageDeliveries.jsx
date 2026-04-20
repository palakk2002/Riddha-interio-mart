import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuTruck, LuUser, LuMail, LuPhone, LuCalendar, LuCheck, LuX, LuInfo, LuMapPin, LuBriefcase } from 'react-icons/lu';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const ManageDeliveries = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved, Rejected

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/delivery');
      if (data.success) {
        setPartners(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
      setError('Failed to connect to backend. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.put(`/delivery/${id}/approve`, { approvalStatus: status });
      if (data.success) {
        // Update local state
        setPartners(prev => prev.map(p => p._id === id ? { ...p, approvalStatus: status } : p));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredPartners = partners.filter(p => {
    if (filter === 'All') return true;
    return p.approvalStatus === filter;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Rejected: 'bg-red-100 text-red-700 border-red-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warm-sand rounded-2xl flex items-center justify-center text-deep-espresso shadow-lg shadow-warm-sand/20">
              <LuTruck size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-deep-espresso tracking-tight uppercase italic">
              Logistics <span className="text-warm-sand">Network</span>
            </h1>
          </div>
          <p className="text-dusty-cocoa font-bold text-xs uppercase tracking-[0.2em] ml-13">
            Manage and approve delivery partners for your fleet
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-soft-oatmeal flex gap-1 shadow-sm overflow-x-auto no-scrollbar">
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === tab 
                  ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/20' 
                  : 'text-warm-sand hover:bg-soft-oatmeal/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-soft-oatmeal shadow-sm" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-12 text-center">
            <h3 className="text-xl font-display font-black text-red-800 italic mb-2">Connection Error</h3>
            <p className="text-red-600 text-sm font-bold uppercase tracking-widest mb-6">{error}</p>
            <button 
              onClick={fetchPartners}
              className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Retry Connection
            </button>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-soft-oatmeal p-20 text-center">
          <div className="w-20 h-20 bg-soft-oatmeal/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuTruck size={40} className="text-warm-sand/40" />
          </div>
          <h3 className="text-2xl font-display font-black text-deep-espresso italic mb-2">No Partners Found</h3>
          <p className="text-warm-sand font-bold text-xs uppercase tracking-widest">
            There are no delivery partners matching your current filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPartners.map((partner) => (
              <motion.div
                key={partner._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] border border-soft-oatmeal p-6 shadow-sm hover:shadow-2xl hover:border-warm-sand/30 transition-all duration-500 relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-soft-oatmeal/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-warm-sand/10 transition-colors duration-500"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-soft-oatmeal to-white rounded-2xl border border-soft-oatmeal flex items-center justify-center text-warm-sand group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                          <LuUser size={28} />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center p-0.5 ${
                          partner.status === 'Available' ? 'bg-emerald-500' : 'bg-warm-sand/30'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-deep-espresso leading-tight">{partner.fullName}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <LuBriefcase size={12} className="text-warm-sand" />
                          <span className="text-[10px] font-black uppercase text-warm-sand tracking-tighter">{partner.vehicleType}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={partner.approvalStatus} />
                  </div>

                  {/* Info List */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-dusty-cocoa group-hover:text-deep-espresso transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-soft-oatmeal/30 flex items-center justify-center shrink-0">
                        <LuMail size={14} />
                      </div>
                      <span className="text-xs font-bold truncate">{partner.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-dusty-cocoa group-hover:text-deep-espresso transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-soft-oatmeal/30 flex items-center justify-center shrink-0">
                        <LuPhone size={14} />
                      </div>
                      <span className="text-xs font-bold">{partner.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-dusty-cocoa group-hover:text-deep-espresso transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-soft-oatmeal/30 flex items-center justify-center shrink-0">
                        <LuTruck size={14} />
                      </div>
                      <span className="text-xs font-bold">{partner.vehicleNumber || 'No plate added yet'}</span>
                    </div>
                  </div>

                  {/* Footer / Actions */}
                  <div className="mt-auto pt-6 border-t border-soft-oatmeal/50 flex items-center justify-between gap-4">
                    {partner.approvalStatus === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(partner._id, 'Rejected')}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                        >
                          <LuX size={14} /> Reject
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(partner._id, 'Approved')}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-deep-espresso text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-deep-espresso/10 grow-[1.5]"
                        >
                          <LuCheck size={14} /> Approve
                        </button>
                      </>
                    ) : (
                      <div className="w-full bg-soft-oatmeal/10 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Decision Made</span>
                          <span className="text-[11px] font-black text-deep-espresso uppercase tracking-widest italic">{partner.approvalStatus}</span>
                        </div>
                        <button 
                          onClick={() => handleStatusUpdate(partner._id, 'Pending')}
                          className="text-[10px] font-black underline uppercase tracking-widest text-warm-sand hover:text-deep-espresso"
                        >
                          Reconsider
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageDeliveries;
