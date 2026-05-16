import React from 'react';
import PageWrapper from '../components/PageWrapper';
import OrderCard from '../components/OrderCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuPackage, 
  LuRefreshCw, 
  LuSearch, 
  LuFilter, 
  LuActivity,
  LuLayoutGrid,
  LuZap
} from 'react-icons/lu';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const [activeTab, setActiveTab] = React.useState('my');
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useUser();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Logistics Sync Failure');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    const handleNewAssignment = () => {
      fetchOrders();
      toast.success('New Deployment Detected', { icon: '🚀' });
    };
    window.addEventListener('delivery:assigned', handleNewAssignment);
    return () => window.removeEventListener('delivery:assigned', handleNewAssignment);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading(`Updating Mission State: ${newStatus}`);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Mission State: ${newStatus} Validated`, { id: loadingToast });
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Validation Failure', { id: loadingToast });
    }
  };

  const handleDeliveryResponse = async (orderId, status) => {
    const loadingToast = toast.loading(`${status === 'Accepted' ? 'Authorizing' : 'Declining'} Deployment...`);
    try {
      const { data } = await api.put(`/orders/${orderId}/delivery-response`, { status });
      if (data.success) {
        toast.success(`Deployment ${status} Successfully`, { id: loadingToast });
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authorization Failure', { id: loadingToast });
    }
  };

  const availableOrders = orders.filter(o => 
    (o.deliveryStatus === 'None' || o.deliveryStatus === 'Rejected') && 
    o.status === 'Processing'
  );

  const myOrders = orders.filter(o => o.deliveryBoy?._id === user?._id || o.deliveryBoy === user?._id);
  const displayedOrders = activeTab === 'available' ? availableOrders : myOrders;

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
        
        {/* Operations Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#D63384] rounded-full"></div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
                Active <span className="text-[#D63384]">Deployments</span>
              </h1>
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
               <LuActivity className="text-[#D63384] animate-pulse" />
               Real-time cargo tracking & status management
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={fetchOrders}
              className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#D63384] hover:shadow-lg transition-all"
            >
              <LuRefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            
            <div className="flex p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-[0.2em] flex items-center gap-2 ${
                  activeTab === 'available' 
                    ? 'bg-slate-900 text-white shadow-xl' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mission Pool 
                <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === 'available' ? 'bg-white/20' : 'bg-slate-200'}`}>
                   {availableOrders.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-[0.2em] flex items-center gap-2 ${
                  activeTab === 'my' 
                    ? 'bg-[#D63384] text-white shadow-xl shadow-pink-500/20' 
                    : 'text-slate-500 hover:text-[#D63384]'
                }`}
              >
                My Registry
                <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === 'my' ? 'bg-white/20' : 'bg-slate-200'}`}>
                   {myOrders.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Deployment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-[2.5rem] h-[400px] animate-pulse border border-slate-100"></div>
              ))
            ) : displayedOrders.length > 0 ? (
              displayedOrders.map(order => (
                <div key={order._id}>
                  <OrderCard 
                    order={{
                      id: order._id,
                      customerName: order.shippingAddress.fullName,
                      status: order.deliveryStatus || 'None',
                      dateTime: new Date(order.createdAt).toLocaleString(),
                      address: `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}`,
                      phone: order.shippingAddress.mobileNumber,
                      sellerLocation: "Operations Hub - 1",
                      items: order.orderItems.map(item => ({
                         name: item.name,
                         quantity: item.quantity,
                         price: item.price
                      })),
                      totalBill: order.totalPrice,
                      paymentMode: order.paymentMethod
                    }} 
                    onAccept={(id) => handleDeliveryResponse(id, 'Accepted')}
                    onReject={(id) => handleDeliveryResponse(id, 'Rejected')}
                    onUpdateStatus={(id, status) => handleUpdateStatus(id, status)} 
                  />
                </div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <LuZap size={40} />
                </div>
                <div className="max-w-md mx-auto px-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase italic">Registry Empty</h3>
                  <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">
                    No active missions detected in this sector. Monitoring mission pool for incoming deployment requests...
                  </p>
                  <button 
                    onClick={fetchOrders}
                    className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                  >
                    Rescan Registry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Orders;
