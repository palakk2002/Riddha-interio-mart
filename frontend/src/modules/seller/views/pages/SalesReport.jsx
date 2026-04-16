import React from "react";
import PageWrapper from "../components/PageWrapper";
import {
  LuTrendingUp,
  LuShoppingCart,
  LuPackage,
  LuArrowUpRight,
} from "react-icons/lu";
import { FiBarChart2 } from "react-icons/fi";

const SalesReport = () => {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              Sales Report
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Detailed analytics of your sales performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm">
            <p className="text-xs text-warm-sand font-bold uppercase tracking-wider mb-1">
              Weekly Sales
            </p>
            <h4 className="text-2xl font-black text-deep-espresso">₹45,200</h4>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-bold">
              <LuArrowUpRight size={14} /> +12% vs last week
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm">
            <p className="text-xs text-warm-sand font-bold uppercase tracking-wider mb-1">
              Total Orders
            </p>
            <h4 className="text-2xl font-black text-deep-espresso">128</h4>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-bold">
              <LuArrowUpRight size={14} /> +5% vs last week
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm">
            <p className="text-xs text-warm-sand font-bold uppercase tracking-wider mb-1">
              Avg. Order Value
            </p>
            <h4 className="text-2xl font-black text-deep-espresso">₹3,531</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm">
            <p className="text-xs text-warm-sand font-bold uppercase tracking-wider mb-1">
              Best Selling Category
            </p>
            <h4 className="text-2xl font-black text-deep-espresso">
              Furniture
            </h4>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-soft-oatmeal shadow-md flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="w-16 h-16 rounded-full bg-soft-oatmeal/30 flex items-center justify-center text-warm-sand mb-4">
            <FiBarChart2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-deep-espresso">
            Sales Analytics Chart
          </h3>
          <p className="text-warm-sand max-w-xs mt-2">
            Visual representation of your sales data will be displayed here.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SalesReport;
