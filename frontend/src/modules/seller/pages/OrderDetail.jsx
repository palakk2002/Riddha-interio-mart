import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuArrowLeft, 
  LuPackage, 
  LuTruck, 
  LuClock, 
  LuPrinter,
  LuDownload,
  LuChevronRight
} from 'react-icons/lu';
import { FiCheckCircle, FiBox, FiSmartphone } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchOrderDetail = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 border-4 border-slate-100 border-t-seller-primary rounded-full animate-spin mb-4" />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Order Details...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-slate-400 font-bold uppercase tracking-widest">Order not found</p>
          <button onClick={() => navigate('/seller/orders')} className="mt-4 text-seller-primary font-black text-xs underline uppercase">Return to Orders</button>
        </div>
      </PageWrapper>
    );
  }

  const steps = [
    { label: 'Order', status: 'Pending', icon: FiBox, date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) },
    { label: 'Processing', status: 'Processing', icon: LuClock, date: order.processingAt ? new Date(order.processingAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending' },
    { label: 'Packed', status: 'Packed', icon: LuPackage, date: order.packedAt ? new Date(order.packedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending' },
    { label: 'Shipped', status: 'Shipped', icon: LuTruck, date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending' },
    { label: 'Delivered', status: 'Delivered', icon: FiCheckCircle, date: order.deliveredAt ? `Updated ${new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}` : 'Pending' },
  ];

  const currentStepIdx = steps.findIndex(s => s.status === order.status);

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/seller/orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mb-2"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-all">
            <LuArrowLeft size={16} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Orders</span>
        </button>

        {/* Main Order Details Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-2xl font-bold text-slate-900 mb-10">Order Details</h1>

            {/* Header Info */}
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">Order #{order._id.slice(-10).toUpperCase()}</h2>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 border-b border-slate-50 pb-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Order Date</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Customer</p>
                  <p className="text-sm font-bold text-slate-800">{order.shippingAddress?.fullName || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payment Method</p>
                  <p className="text-sm font-bold text-slate-800 capitalize">{order.paymentMethod} Payment</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount</p>
                  <p className="text-xl font-bold text-slate-900">₹{order.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Product Items */}
              <div className="py-4 space-y-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">Crystal Light</p>
                      <p className="text-xs font-bold text-slate-600 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Stepper */}
              <div className="pt-12 pb-16">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-0">
                    <div 
                      className="h-full bg-seller-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="flex justify-between relative z-10">
                    {steps.map((step, idx) => {
                      const isActive = idx <= currentStepIdx;
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md ${
                            isActive ? 'bg-seller-primary text-white scale-110' : 'bg-white text-slate-300'
                          }`}>
                            <StepIcon size={18} />
                          </div>
                          <div className="text-center">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.label}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                              {step.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
                <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all">
                  <LuPrinter size={16} />
                  Print Invoice
                </button>
                <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all">
                  <LuDownload size={16} />
                  Download Label
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderDetail;
