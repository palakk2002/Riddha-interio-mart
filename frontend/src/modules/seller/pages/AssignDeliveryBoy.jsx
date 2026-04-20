import React from "react";
import PageWrapper from "../components/PageWrapper";
import { LuSearch, LuUser, LuTruck, LuClock, LuPackage, LuCheck, LuX, LuInfo } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import api from "../../../shared/utils/api";
import { motion, AnimatePresence } from "framer-motion";

const AssignDeliveryBoy = () => {
  const [orders, setOrders] = React.useState([]);
  const [deliveryBoys, setDeliveryBoys] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, dbRes] = await Promise.all([
        api.get('/orders'),
        api.get('/delivery/available')
      ]);

      if (ordersRes.data.success) {
        // Show orders that need assignment (Processing and no deliveryBoy yet or rejected)
        const filtered = (ordersRes.data.data || []).filter(o => 
          o.status === 'Processing' && (!o.deliveryBoy || o.deliveryStatus === 'Rejected' || o.deliveryStatus === 'None')
        );
        setOrders(filtered);
      }

      if (dbRes.data.success) {
        setDeliveryBoys(dbRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch assignment data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    
    // Listen for response updates to refresh list
    const onResponse = () => fetchData();
    window.addEventListener('delivery:response_received', onResponse);
    return () => window.removeEventListener('delivery:response_received', onResponse);
  }, []);

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleAssignProcess = async (dbId) => {
    setAssigning(true);
    try {
      const { data } = await api.put(`/orders/${selectedOrder._id}/assign-delivery`, {
        deliveryBoyId: dbId
      });

      if (data.success) {
        setShowModal(false);
        fetchData();
        // Success toast/alert would be good here
      }
    } catch (err) {
      console.error('Assignment failed:', err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 tracking-tight uppercase italic">
              Delivery <span className="text-red-800">Dispatch</span>
            </h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
              Assign reliable partners for your pending shipments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ready to Dispatch</p>
              <p className="text-xl font-black text-gray-900">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-800 rounded-2xl shadow-lg shadow-red-900/20 flex items-center justify-center text-white">
              <LuTruck size={24} />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4 text-amber-800">
           <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <LuInfo size={20} />
           </div>
           <p className="text-sm font-medium">
             Sellers can only assign delivery partners to orders currently in <strong>Processing</strong> stage. Once assigned, the partner has to accept the request.
           </p>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
             <div className="w-12 h-12 border-4 border-gray-100 border-t-red-800 rounded-full animate-spin mx-auto mb-4" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning logistics network...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                <LuPackage size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900">All clear!</h3>
             <p className="text-gray-400 text-sm mt-1">There are no orders waiting for delivery assignment right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden group hover:border-red-800/20 transition-all p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-800 transition-colors">
                      <LuClock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900 tracking-tighter">₹{Number(order.totalPrice || 0).toLocaleString()}</p>
                    <p className="text-[9px] text-green-600 font-black uppercase tracking-widest">{order.orderItems.length} Items • Paid</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-800 font-black text-[10px]">
                        {String(order.shippingAddress?.fullName || "G").charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{String(order.shippingAddress?.fullName || "Guest")}</p>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest truncate">
                          <FiMapPin size={10} /> {order.shippingAddress?.fullAddress}, {order.shippingAddress?.city}
                        </p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-50 pt-6">
                   <button 
                     onClick={() => handleAssignClick(order)}
                     className="flex-1 bg-gray-900 text-white rounded-2xl py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                   >
                     <LuTruck size={16} />
                     Assign Partner
                   </button>
                   <button className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                      <LuSearch size={18} />
                   </button>
                </div>
                
                {order.deliveryStatus === 'Rejected' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600">
                    <LuX size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Previous partner rejected this request</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Assignment Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h3 className="text-xl font-display font-black text-gray-900 uppercase italic">Select <span className="text-red-800">Partner</span></h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Available delivery boys in your region</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white transition-all">
                    <LuX size={20} />
                  </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
                  {deliveryBoys.length === 0 ? (
                    <div className="text-center py-10">
                       <p className="text-sm font-bold text-gray-400">No active delivery boys found online.</p>
                    </div>
                  ) : deliveryBoys.map((boy) => (
                    <div 
                      key={boy._id}
                      className="p-5 rounded-2xl border border-gray-100 hover:border-red-800/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white relative">
                          <LuUser size={20} />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{boy.fullName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                             <LuTruck size={12} /> {boy.vehicleType} • {boy.phone}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAssignProcess(boy._id)}
                        disabled={assigning}
                        className="bg-red-800 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
                      >
                        {assigning ? 'Assigning...' : 'Assign'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Partner selection is based on real-time availability and region proximity.</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default AssignDeliveryBoy;
