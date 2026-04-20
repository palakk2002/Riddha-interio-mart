import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuMapPin, LuSearch, LuTruck, LuPackage, LuCircleCheck, LuNavigation } from 'react-icons/lu';
import api from '../../../shared/utils/api';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/all');
        // Filter only active orders (Shipped or Out for Delivery)
        setOrders(res.data.data.filter(o => ['Shipped', 'Out for Delivery', 'Processing'].includes(o.status)));
      } catch (err) {
        console.error('Failed to fetch orders for tracking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-deep-espresso">Real-time <span className="text-warm-sand">Tracking</span></h1>
            <p className="text-warm-sand/60 text-sm font-medium uppercase tracking-[0.2em]">Monitor active deliveries across the network</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-sand" size={20} />
            <input 
              type="text" 
              placeholder="Track Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-soft-oatmeal rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-warm-sand/10 transition-all font-medium text-deep-espresso"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand">Connecting to GPS Network...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-soft-oatmeal p-20 text-center shadow-sm">
             <div className="w-20 h-20 bg-soft-oatmeal/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-warm-sand opacity-30">
                <LuNavigation size={40} />
             </div>
             <h3 className="text-2xl font-bold text-deep-espresso mb-3">No active shipments found</h3>
             <p className="text-warm-sand font-medium max-w-sm mx-auto">Either all orders are delivered or no orders match your tracking criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] p-8 border border-soft-oatmeal shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-red-800/10 rounded-2xl flex items-center justify-center text-red-800 group-hover:scale-110 transition-transform duration-500">
                      <LuTruck size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand mb-1">Order ID</p>
                      <h3 className="text-xl font-black text-deep-espresso">#{order.orderId || order._id.slice(-8).toUpperCase()}</h3>
                    </div>
                  </div>
                  <span className="px-5 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 border-y border-soft-oatmeal/10 py-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand/60">Customer</p>
                    <p className="font-bold text-deep-espresso">{order.user?.name || 'Guest User'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand/60">Delivery Partner</p>
                    <p className="font-bold text-deep-espresso">{order.deliveryBoy?.name || 'Not Assigned'}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-5 relative">
                    <div className="w-1 h-16 bg-red-800/10 absolute left-[11px] top-6 rounded-full" />
                    <div className="w-6 h-6 rounded-full bg-red-800 flex items-center justify-center z-10 shadow-lg shadow-red-800/20">
                      <LuNavigation size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand/80 mb-1">Destination</p>
                      <p className="text-sm font-medium text-deep-espresso/70 leading-relaxed truncate">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-deep-espresso text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-deep-espresso/10">
                    <LuMapPin size={18} />
                    View Live GPS Location
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default OrderTracking;
