import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { LuSearch, LuFilter, LuEye, LuClock, LuPackage } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const initialOrders = [
  {
    id: 1,
    orderId: "ORD-S101",
    customer: "Rohan Sharma",
    total: 15499,
    status: "Pending",
    date: "2024-04-14",
  },
  {
    id: 2,
    orderId: "ORD-S102",
    customer: "Priya Patel",
    total: 2499,
    status: "Processing",
    date: "2024-04-14",
  },
  {
    id: 3,
    orderId: "ORD-S103",
    customer: "Amit Gupta",
    total: 8999,
    status: "Shipped",
    date: "2024-04-13",
  },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredOrders = initialOrders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              My Orders
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Track and manage your customer orders.
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
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Total
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-soft-oatmeal/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-deep-espresso">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          order.status === "Pending"
                            ? "text-amber-700 bg-amber-50 border-amber-700/10"
                            : order.status === "Shipped"
                              ? "text-blue-700 bg-blue-50 border-blue-700/10"
                              : "text-green-700 bg-green-50 border-green-700/10"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/seller/order/${order.id}`)}
                        className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                      >
                        <LuEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Orders;
