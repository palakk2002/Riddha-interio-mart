import React, { useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { 
  LuArrowLeft, 
  LuPackage, 
  LuTruck, 
  LuClock, 
  LuMapPin, 
  LuUser, 
  LuMail, 
  LuPhone,
  LuCreditCard,
  LuPrinter,
  LuChevronDown
} from 'react-icons/lu';
import { FiCheckCircle } from 'react-icons/fi';

// Mock data for order details
const orderDetails = {
  1: {
    orderId: "ORD-1001",
    date: "2024-04-14",
    status: "Pending",
    customer: {
      name: "Rohan Sharma",
      email: "rohan@example.com",
      phone: "+91 98765 43210"
    },
    shippingAddress: "123, Maple Street, HSR Layout, Bangalore - 560102",
    paymentMethod: "Credit Card (Visa ending in 4242)",
    items: [
      { id: 1, name: "Luxury Italian Floor Tile", quantity: 20, price: 500, image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400" },
      { id: 2, name: "Premium Oak Hardwood", quantity: 5, price: 1099, image: "https://images.unsplash.com/photo-1581850518616-bcb8186c443e?w=400" }
    ],
    subtotal: 15495,
    shipping: 4,
    total: 15499,
    timeline: [
      { status: "Order Placed", date: "2024-04-14 10:30 AM", active: true },
      { status: "Payment Confirmed", date: "2024-04-14 10:35 AM", active: true },
      { status: "Processing", date: "2024-04-14 11:00 AM", active: true },
      { status: "Shipped", date: "", active: false },
      { status: "Out for Delivery", date: "", active: false },
      { status: "Delivered", date: "", active: false }
    ]
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const dropdownRef = useRef(null);
  
  const availableStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Use localStorage data for the live flow simulation
  const order = useMemo(() => {
    const saved = localStorage.getItem('riddha_full_orders');
    const allOrders = saved ? JSON.parse(saved) : [];
    
    // Find in localStorage first
    const found = allOrders.find(o => String(o.id) === id);
    if (found) return found;

    // Fallback to static mock data if available
    return orderDetails[id] || {
      orderId: `ORD-${id || '1000'}`,
      date: "2024-04-14",
      status: "Processing",
      customer: { name: "Guest User", email: "guest@example.com", phone: "N/A" },
      shippingAddress: "Address details not available.",
      paymentMethod: "Cash on Delivery",
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      timeline: []
    };
  }, [id]);

  useMemo(() => {
    setCurrentStatus(order.status);
  }, [order.status]);

  useMemo(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Received: 'bg-blue-100 text-blue-700 border-blue-200',
    Processed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    "Out For Delivery": 'bg-orange-100 text-orange-700 border-orange-200',
    Delivered: 'bg-green-100 text-green-700 border-green-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/orders/all')}
              className="p-3 bg-white rounded-2xl border border-soft-oatmeal text-warm-sand hover:text-deep-espresso hover:shadow-md transition-all"
            >
              <LuArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-deep-espresso">
                  {order.orderId}
                </h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-warm-sand mt-1 text-sm">
                Placed on {order.date}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-xs uppercase tracking-widest"
              >
                Order Status
                <LuChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-soft-oatmeal rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setCurrentStatus(status);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all mb-1 ${
                          currentStatus === status
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-deep-espresso hover:bg-soft-oatmeal/20'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 border border-soft-oatmeal text-deep-espresso px-5 py-2.5 rounded-xl font-bold hover:bg-soft-oatmeal/20 transition-all text-sm">
              <LuPrinter size={16} /> Print Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-soft-oatmeal overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-soft-oatmeal bg-soft-oatmeal/10 flex items-center gap-2">
                <LuPackage className="text-warm-sand" size={18} />
                <h3 className="font-bold text-deep-espresso">Ordered Items</h3>
              </div>
              <div className="divide-y divide-soft-oatmeal">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-6 group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-soft-oatmeal/20 border border-soft-oatmeal relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-deep-espresso">{item.name}</h4>
                      <p className="text-sm text-warm-sand">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-deep-espresso">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-warm-sand">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-soft-oatmeal/5 p-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-sand">Subtotal</span>
                  <span className="font-medium text-deep-espresso">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-sand">Shipping</span>
                  <span className="font-medium text-deep-espresso">₹{order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-soft-oatmeal">
                  <span className="font-bold text-deep-espresso">Total Amount</span>
                  <span className="font-black text-[var(--color-header-red)]">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-deep-espresso border-b border-soft-oatmeal pb-3">
                  <LuCreditCard className="text-warm-sand" size={18} />
                  <h3 className="font-bold">Payment Method</h3>
                </div>
                <p className="text-sm text-deep-espresso leading-relaxed">
                  {order.paymentMethod}
                </p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Paid</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-deep-espresso border-b border-soft-oatmeal pb-3">
                  <LuMapPin className="text-warm-sand" size={18} />
                  <h3 className="font-bold">Shipping Address</h3>
                </div>
                <p className="text-sm text-deep-espresso leading-relaxed italic">
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-deep-espresso">
                <LuUser className="text-warm-sand" size={18} />
                <h3 className="font-bold">Customer Info</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-soft-oatmeal/10 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-dusty-cocoa flex items-center justify-center text-white font-black">
                    {order.customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-deep-espresso text-sm">{order.customer.name}</p>
                    <p className="text-[10px] text-warm-sand uppercase font-bold tracking-widest">Customer</p>
                  </div>
                </div>
                <div className="space-y-3 px-1">
                  <div className="flex items-center gap-3 text-sm text-deep-espresso">
                    <LuMail size={16} className="text-warm-sand" />
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-deep-espresso">
                    <LuPhone size={16} className="text-warm-sand" />
                    <span>{order.customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-deep-espresso">
                <LuClock className="text-warm-sand" size={18} />
                <h3 className="font-bold">Order Timeline</h3>
              </div>
              <div className="relative space-y-8 before:absolute before:inset-0 before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-soft-oatmeal">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center z-10 ${step.active ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/20' : 'bg-soft-oatmeal text-warm-sand'}`}>
                       {step.active && idx === order.timeline.filter(t => t.active).length - 1 ? (
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                       ) : (
                         <FiCheckCircle size={12} />
                       )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${step.active ? 'text-deep-espresso' : 'text-warm-sand'}`}>{step.status}</p>
                      {step.date && <p className="text-[10px] text-warm-sand font-medium mt-0.5">{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderDetailPage;
