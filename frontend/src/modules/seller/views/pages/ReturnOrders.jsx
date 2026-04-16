import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { LuUndo2, LuSearch, LuFilter, LuEye } from "react-icons/lu";
import { FiAlertCircle } from "react-icons/fi";

const initialReturns = [
  {
    id: 1,
    orderId: "ORD-S105",
    customer: "Vikram Singh",
    amount: 5600,
    status: "Processing",
    date: "2024-04-12",
    reason: "Damaged Product",
  },
  {
    id: 2,
    orderId: "ORD-S107",
    customer: "Suresh Raina",
    amount: 1200,
    status: "Refunded",
    date: "2024-04-11",
    reason: "Wrong Item",
  },
];

const ReturnOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const filteredReturns = initialReturns.filter((ret) => {
    const matchesSearch = 
      ret.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              Return Orders
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Manage customer returns and refund requests.
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
          <div className="relative">
            <LuFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-espresso pointer-events-none"
              size={16}
            />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-11 pr-8 py-3 bg-white border border-soft-oatmeal rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-xs font-bold uppercase tracking-widest appearance-none cursor-pointer text-deep-espresso"
            >
              <option value="All">All Returns</option>
              <option value="Processing">Processing</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
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
                    Reason
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
                {filteredReturns.map((ret) => (
                  <tr
                    key={ret.id}
                    className="hover:bg-soft-oatmeal/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-deep-espresso">
                      {ret.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                      {ret.customer}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-warm-sand font-medium">
                        <FiAlertCircle size={14} />
                        {ret.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          ret.status === "Refunded"
                            ? "text-green-700 bg-green-50 border-green-700/10"
                            : "text-amber-700 bg-amber-50 border-amber-700/10"
                        }`}
                      >
                        {ret.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/seller/order/${ret.orderId}`)}
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

export default ReturnOrders;
