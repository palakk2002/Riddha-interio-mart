import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import api from "../../../shared/utils/api";
import {
  LuSearch,
  LuFilter,
  LuEye,
  LuPackage,
  LuTruck,
  LuClock,
  LuClipboardList,
} from "react-icons/lu";
import { FiCheckCircle, FiXCircle, FiFlag } from "react-icons/fi";

const initialOrders = [
  {
    _id: "1",
    orderId: "ORD-1001",
    user: { fullName: "Rohan Sharma" },
    seller: { shopName: "Fresh Mart" },
    totalPrice: 15499,
    status: "Pending",
    createdAt: "2024-04-14",
  },
  {
    _id: "2",
    orderId: "ORD-1002",
    user: { fullName: "Priya Patel" },
    seller: { shopName: "Daily Groceries" },
    totalPrice: 2499,
    status: "Processing",
    createdAt: "2024-04-14",
  },
  {
    _id: "3",
    orderId: "ORD-1003",
    user: { fullName: "Amit Gupta" },
    seller: { shopName: "Premium Foods" },
    totalPrice: 8999,
    status: "Processing",
    createdAt: "2024-04-13",
  },
  {
    _id: "4",
    orderId: "ORD-1004",
    user: { fullName: "Sneha Reddy" },
    seller: { shopName: "Fresh Mart" },
    totalPrice: 12500,
    status: "Shipped",
    createdAt: "2024-04-13",
  },
  {
    _id: "5",
    orderId: "ORD-1005",
    user: { fullName: "Vikram Singh" },
    seller: { shopName: "Daily Groceries" },
    totalPrice: 5600,
    status: "Shipped",
    createdAt: "2024-04-12",
  },
  {
    _id: "6",
    orderId: "ORD-1006",
    user: { fullName: "Anjali Verma" },
    seller: { shopName: "Premium Foods" },
    totalPrice: 3200,
    status: "Delivered",
    createdAt: "2024-04-12",
  },
  {
    _id: "7",
    orderId: "ORD-1007",
    user: { fullName: "Suresh Raina" },
    seller: { shopName: "Fresh Mart" },
    totalPrice: 1200,
    status: "Cancelled",
    createdAt: "2024-04-11",
  },
];

const statusIcons = {
  Pending: LuClock,
  Received: LuClipboardList,
  Processed: LuPackage,
  Shipped: FiFlag,
  "Out For Delivery": LuTruck,
  Delivered: FiCheckCircle,
  Cancelled: FiXCircle,
};

const OrderListPage = ({ specificStatus }) => {
  const { status: urlStatus } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Normalize status for display
  const currentStatus =
    specificStatus ||
    urlStatus
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.user?.fullName || "Guest";
      const orderId = order._id || "";

      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderId.toLowerCase().includes(searchTerm.toLowerCase());

      // If viewing "All Orders" page or no specific status required
      if (currentStatus?.toLowerCase().includes('all') || !currentStatus) {
        return matchesSearch;
      }

      return (
        matchesSearch &&
        order.status?.toLowerCase() === currentStatus?.toLowerCase()
      );
    });
  }, [searchTerm, currentStatus]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              {currentStatus || "All Orders"}
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Manage and track your customer orders.
            </p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 py-3 md:py-0 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={16} />
            Filters
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Seller
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="w-10 h-10 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin mx-auto" />
                      <p className="text-[10px] font-black text-warm-sand mt-3 uppercase tracking-widest">Accessing Pipeline...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || LuClipboardList;
                    const orderDisplayId = order.orderId || (order._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : 'ORD-NEW');
                    
                    return (
                      <tr
                        key={order._id || Math.random()}
                        className="hover:bg-soft-oatmeal/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-deep-espresso">
                            {orderDisplayId}
                          </p>
                          <p className="text-[10px] text-warm-sand uppercase tracking-wider font-bold">
                            {order.paymentMethod || 'Online'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                          {order.user?.fullName || "Guest User"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                          <div className="flex flex-col">
                            <span className="font-bold">{order.seller?.shopName || order.seller?.fullName || "Mart Direct"}</span>
                            {order.sellerType === 'Admin' && <span className="text-[9px] text-red-800 font-black uppercase tracking-tighter">Admin Fulfilled</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                          ₹{order.totalPrice?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <StatusIcon size={14} className="text-warm-sand" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-deep-espresso/70">
                               {order.status || 'Pending'}
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-deep-espresso/70 font-medium">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Just now'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => order._id && navigate(`/admin/orders/view/${order._id}`)}
                            className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                          >
                            <LuEye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-soft-oatmeal/20 rounded-full flex items-center justify-center text-warm-sand/30">
                          <LuPackage size={40} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-display font-bold text-deep-espresso">No Orders Found</h3>
                          <p className="text-sm text-warm-sand max-w-xs mx-auto">There are currently no orders for the "{currentStatus || 'All'}" status in your database.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderListPage;
