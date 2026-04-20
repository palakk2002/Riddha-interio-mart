import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuTruck, 
  LuUser, 
  LuPackage, 
  LuSearch, 
  LuChevronRight, 
  LuClock, 
  LuCircleCheck, 
  LuInfo,
  LuMapPin,
  LuPhone,
  LuBriefcase,
  LuCircleAlert
} from 'react-icons/lu';
import api from '../../../shared/utils/api';
// import { toast } from 'react-hot-toast'; 

const toast = {
  success: (msg) => window.alert('Success: ' + msg),
  error: (msg) => window.alert('Error: ' + msg)
};

const AssignDeliveryPage = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, partnersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/delivery')
      ]);

      if (ordersRes.data.success) {
        // Filter orders that need delivery assignment
        const pendingOrders = ordersRes.data.data.filter(order => 
          (order.status === 'Processing' || order.status === 'Pending') && 
          (!order.deliveryBoy || order.deliveryStatus === 'None' || order.deliveryStatus === 'Rejected')
        );
        setOrders(pendingOrders);
      }

      if (partnersRes.data.success) {
        // Filter approved and ready partners
        const availablePartners = partnersRes.data.data.filter(p => 
          p.approvalStatus === 'Approved' && (p.isOnline !== false)
        );
        setPartners(availablePartners);
      }
    } catch (err) {
      console.error('Failed to fetch assignment data:', err);
      toast.error('Failed to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (partnerId) => {
    if (!selectedOrder) return;
    
    try {
      setAssigning(true);
      const response = await api.put(`/orders/${selectedOrder._id}/assign-delivery`, {
        deliveryBoyId: partnerId
      });

      if (response.data.success) {
        toast.success(`Order assigned to ${partners.find(p => p._id === partnerId)?.fullName}`);
        setSelectedOrder(null);
        fetchData();
      }
    } catch (err) {
      console.error('Assignment failed:', err);
      toast.error(err.response?.data?.error || 'Failed to assign delivery partner');
    } finally {
      setAssigning(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#FDFBF9] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-deep-espresso rounded-2xl flex items-center justify-center text-white shadow-xl shadow-deep-espresso/20">
              <LuTruck size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-deep-espresso tracking-tight uppercase italic">
              Delivery <span className="text-warm-sand">Assignment</span>
            </h1>
          </div>
          <p className="text-dusty-cocoa font-bold text-xs uppercase tracking-[0.2em] ml-13">
            Hand-off orders to your premium delivery fleet
          </p>
        </div>

        <div className="relative group max-w-md w-full md:w-80">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dusty-cocoa group-focus-within:text-warm-sand transition-colors" />
          <input 
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-soft-oatmeal rounded-2xl py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Orders List */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-espresso/30">Pending Assignments</h3>
             <span className="bg-warm-sand/10 text-warm-sand px-3 py-1 rounded-full text-[10px] font-black">{filteredOrders.length} Orders</span>
          </div>

          {loading ? (
            <div className="space-y-4">
               {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-soft-oatmeal" />)}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[2rem] border-2 border-dashed border-soft-oatmeal p-16 text-center">
               <LuCircleCheck size={48} className="mx-auto text-emerald-500/20 mb-4" />
               <h3 className="font-display font-bold text-deep-espresso text-xl italic mb-1">Queue Cleared</h3>
               <p className="text-warm-sand text-[10px] uppercase font-black tracking-widest">All orders have been assigned to partners.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  layout
                  onClick={() => setSelectedOrder(order)}
                  className={`group relative bg-white rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                    selectedOrder?._id === order._id 
                      ? 'border-deep-espresso shadow-2xl ring-4 ring-deep-espresso/5' 
                      : 'border-soft-oatmeal hover:border-warm-sand/50 shadow-sm'
                  }`}
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-soft-oatmeal/20 rounded-2xl flex items-center justify-center text-warm-sand group-hover:scale-110 transition-transform">
                          <LuPackage size={28} />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black text-warm-sand uppercase tracking-tighter">Order #{order._id.slice(-6)}</span>
                             <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.status === 'Processing' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {order.status}
                             </span>
                          </div>
                          <h4 className="font-display font-bold text-deep-espresso text-lg leading-tight">{order.shippingAddress.fullName}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                             <LuMapPin size={12} className="text-dusty-cocoa" />
                             <span className="text-[10px] font-bold text-dusty-cocoa truncate max-w-[200px]">{order.shippingAddress.city}, {order.shippingAddress.pincode}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-soft-oatmeal/50">
                       <div className="text-right">
                          <p className="text-[9px] font-black text-dusty-cocoa uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-xl font-black text-deep-espresso tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
                       </div>
                       <LuChevronRight size={20} className={`transition-transform duration-300 ${selectedOrder?._id === order._id ? 'rotate-90 text-deep-espresso' : 'text-soft-oatmeal group-hover:translate-x-1'}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Assignment Side Panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-espresso/30 px-2">Select Delivery Partner</h3>
            
            {!selectedOrder ? (
              <div className="bg-deep-espresso rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                 {/* Decorative background */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-warm-sand/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                 
                 <LuCircleAlert size={48} className="mx-auto text-warm-sand/40 mb-6" />
                 <h4 className="font-display font-bold text-2xl italic mb-3">No Order Selected</h4>
                 <p className="text-white/50 text-sm font-medium tracking-wide">Select a pending order from the left to start assigning a professional partner from your network.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border-2 border-deep-espresso p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                 <div className="pb-6 border-b border-soft-oatmeal">
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="text-xl font-display font-black text-deep-espresso uppercase italic">Assigning <span className="text-warm-sand">Lounge</span></h4>
                       <button onClick={() => setSelectedOrder(null)} className="text-dusty-cocoa hover:text-red-500 transition-colors">
                          <LuBriefcase size={20} />
                       </button>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-deep-espresso/50">Destination</span>
                       <span className="text-xs font-bold text-deep-espresso tracking-tight">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.pincode}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {partners.length === 0 ? (
                       <div className="text-center py-10 italic text-dusty-cocoa text-sm">
                          No partners are currently available or online.
                       </div>
                    ) : (
                      partners.map((partner) => (
                        <button
                          key={partner._id}
                          disabled={assigning}
                          onClick={() => handleAssign(partner._id)}
                          className="w-full group flex items-center justify-between p-4 rounded-2xl border border-soft-oatmeal hover:border-warm-sand hover:bg-warm-sand/5 transition-all duration-300 text-left disabled:opacity-50"
                        >
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-soft-oatmeal/20 rounded-xl flex items-center justify-center text-warm-sand group-hover:bg-warm-sand group-hover:text-white transition-all">
                                <LuUser size={20} />
                             </div>
                             <div>
                                <h5 className="text-sm font-bold text-deep-espresso">{partner.fullName}</h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <div className={`w-1.5 h-1.5 rounded-full ${partner.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                   <span className="text-[9px] font-black uppercase text-dusty-cocoa">{partner.vehicleType} Specialist</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[9px] font-black uppercase text-warm-sand">Select Partner</span>
                             <LuChevronRight size={14} className="text-warm-sand" />
                          </div>
                        </button>
                      ))
                    )}
                 </div>

                 <div className="pt-4 text-center">
                    <p className="text-[9px] font-bold text-dusty-cocoa uppercase tracking-[0.2em]">Riddha Interio Logistics Protocol v2.1</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDeliveryPage;
