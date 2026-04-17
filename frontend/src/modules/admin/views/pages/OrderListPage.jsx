import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
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
    id: 1,
    orderId: "ORD-1001",
    customer: "Rohan Sharma",
    seller: "Fresh Mart",
    total: 15499,
    status: "Pending",
    date: "2024-04-14",
  },
  {
    id: 2,
    orderId: "ORD-1002",
    customer: "Priya Patel",
    seller: "Daily Groceries",
    total: 2499,
    status: "Received",
    date: "2024-04-14",
  },
  {
    id: 3,
    orderId: "ORD-1003",
    customer: "Amit Gupta",
    seller: "Premium Foods",
    total: 8999,
    status: "Processed",
    date: "2024-04-13",
  },
  {
    id: 4,
    orderId: "ORD-1004",
    customer: "Sneha Reddy",
    seller: "Fresh Mart",
    total: 12500,
    status: "Shipped",
    date: "2024-04-13",
  },
  {
    id: 5,
    orderId: "ORD-1005",
    customer: "Vikram Singh",
    seller: "Daily Groceries",
    total: 5600,
    status: "Out For Delivery",
    date: "2024-04-12",
  },
  {
    id: 6,
    orderId: "ORD-1006",
    customer: "Anjali Verma",
    seller: "Premium Foods",
    total: 3200,
    status: "Delivered",
    date: "2024-04-12",
  },
  {
    id: 7,
    orderId: "ORD-1007",
    customer: "Suresh Raina",
    seller: "Fresh Mart",
    total: 1200,
    status: "Cancelled",
    date: "2024-04-11",
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

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('riddha_full_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Normalize status for display
  const currentStatus =
    specificStatus ||
    urlStatus
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase());

      if (currentStatus === "All Order" || !currentStatus) {
        return matchesSearch;
      }

      return (
        matchesSearch &&
        order.status.toLowerCase() === currentStatus.toLowerCase()
      );
    });
  }, [searchTerm, currentStatus, orders]);

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
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const StatusIcon =
                      statusIcons[order.status] || LuClipboardList;
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-soft-oatmeal/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-deep-espresso">
                            {order.orderId}
                          </p>
                          <p className="text-[10px] text-warm-sand uppercase tracking-wider font-bold">
                            Standard Delivery
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                          {order.seller}
                        </td>
                        <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                          ₹{order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon size={14} className="text-warm-sand" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-deep-espresso/70">
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-deep-espresso/70 font-medium">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => navigate(`/admin/orders/view/${order.id}`)}
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
                      className="px-6 py-12 text-center text-warm-sand italic"
                    >
                      No orders found for this status.
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
