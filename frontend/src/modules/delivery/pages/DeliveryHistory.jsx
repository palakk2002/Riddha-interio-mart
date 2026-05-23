import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../components/PageWrapper';
import OrderCard from '../components/OrderCard';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../shared/utils/api';
import { LuPackage, LuCalendar, LuFilter, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

const DeliveryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      // Construct query string
      const params = new URLSearchParams({
        page,
        limit: 10,
        deliveryStatus: 'Delivered'
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/orders?${params.toString()}`);
      if (res.data.success) {
        // Map backend order data to OrderCard expected props
        const formattedOrders = res.data.data.map(o => ({
          id: o._id,
          status: o.deliveryStatus || o.status,
          sellerLocation: o.seller?.shopAddress || 'Central Warehouse',
          customerName: o.user?.fullName || 'Customer',
          address: o.shippingAddress ? `${o.shippingAddress.fullAddress}, ${o.shippingAddress.city}` : 'No address',
          items: o.orderItems || [],
          totalBill: o.totalPrice,
          dateTime: new Date(o.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          paymentMode: o.paymentMethod,
          phone: o.shippingAddress?.phone || o.user?.phone || ''
        }));
        setOrders(formattedOrders);
        setTotalPages(res.data.totalPages);
        setTotalResults(res.data.totalResults);
      }
    } catch (err) {
      console.error('Failed to fetch delivery history', err);
      toast.error('Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  }, [page, startDate, endDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new filter
    fetchHistory();
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Delivery History</h1>
            <p className="text-warm-sand mt-2">View your completed deliveries ({totalResults} total)</p>
          </div>
          
          <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                <LuCalendar className="text-[#189D91]" size={16} />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
                />
             </div>
             <span className="text-slate-300 font-bold">to</span>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                <LuCalendar className="text-[#189D91]" size={16} />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
                />
             </div>
             <div className="flex gap-2">
               <button 
                 type="submit"
                 className="flex items-center gap-2 px-4 py-2 bg-[#189D91] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#15877c] transition-all shadow-md"
               >
                 <LuFilter size={14} /> Filter
               </button>
               {(startDate || endDate) && (
                 <button 
                   type="button"
                   onClick={handleClearFilters}
                   className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all"
                 >
                   Clear
                 </button>
               )}
             </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {orders.length > 0 ? (
                  orders.map(order => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <OrderCard order={order} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center space-y-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm"
                  >
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-[#189D91]">
                      <LuPackage size={36} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-deep-espresso">No deliveries found</h3>
                      <p className="text-sm text-dusty-cocoa max-w-sm mx-auto mt-2">
                        You have no completed deliveries matching the current date filter.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                    page === 1 
                      ? 'bg-white text-slate-300 border border-slate-100 cursor-not-allowed' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#189D91] hover:text-[#189D91]'
                  }`}
                >
                  <LuChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-700">Page {page}</span>
                  <span className="text-sm font-medium text-slate-400">of {totalPages}</span>
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                    page === totalPages 
                      ? 'bg-white text-slate-300 border border-slate-100 cursor-not-allowed' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#189D91] hover:text-[#189D91]'
                  }`}
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default DeliveryHistory;
