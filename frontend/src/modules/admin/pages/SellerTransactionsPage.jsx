import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  LuSearch,
  LuArrowUpRight,
  LuArrowDownLeft,
} from "react-icons/lu";
import { FiDownload, FiDollarSign } from "react-icons/fi";
import api from "../../../shared/utils/api";
import * as XLSX from 'xlsx';
import { toast } from "react-hot-toast";

const SellerTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/auth/admin/payments/sellers');
        if (data.success) {
          setTransactions(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch seller transactions:', err);
        toast.error('Failed to fetch seller transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shopName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const exportToExcel = () => {
    if (transactions.length === 0) {
      toast.error('No transactions available to export.');
      return;
    }
    const dataToExport = transactions.map(t => ({
      'Transaction ID': t.id ? `#TXN-00${t.id}` : '#TXN-N/A',
      'Seller Name': t.sellerName,
      'Shop Name': t.shopName,
      'Type': t.type,
      'Amount (₹)': t.amount,
      'Commission (₹)': t.commission,
      'Status': t.status,
      'Date': t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seller Payouts");
    XLSX.writeFile(wb, `Seller_Payouts_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Report exported successfully!');
  };

  const totalPayout = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              Seller Transactions
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Monitor payouts and financial adjustments for all sellers.
            </p>
          </div>
          <button 
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 active:scale-95 text-sm"
          >
            <FiDownload size={18} />
            Export Report
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-warm-sand font-bold uppercase tracking-wider">
                Total Payouts
              </p>
              <h4 className="text-xl font-black text-deep-espresso">
                ₹{totalPayout.toLocaleString()}
              </h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-warm-sand font-bold uppercase tracking-wider">
                Total Commission (10%)
              </p>
              <h4 className="text-xl font-black text-deep-espresso">₹{totalCommission.toLocaleString()}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-warm-sand font-bold uppercase tracking-wider">
                Transactions
              </p>
              <h4 className="text-xl font-black text-deep-espresso">{transactions.length}</h4>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
          <div className="relative flex-grow">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by seller or shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm font-bold"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-auto border border-soft-oatmeal text-deep-espresso px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-white cursor-pointer focus:outline-none hover:bg-soft-oatmeal/20 transition-all"
            >
              <option value="All">All Types</option>
              <option value="Payout">Payout</option>
              <option value="Refund">Refund</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Seller & Shop
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="h-16 bg-gray-50/50 px-6"></td>
                    </tr>
                  ))
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-soft-oatmeal/5 transition-colors group"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-deep-espresso/60">
                        {t.id ? `#TXN-00${t.id}` : '#TXN-N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-deep-espresso text-sm">
                            {t.sellerName}
                          </p>
                          <p className="text-[10px] text-warm-sand uppercase tracking-wider font-bold">
                            {t.shopName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold ${t.type === "Payout" ? "text-green-600" : "text-red-600"}`}
                        >
                          {t.type === "Payout" ? (
                            <LuArrowUpRight size={14} />
                          ) : (
                            <LuArrowDownLeft size={14} />
                          )}
                          {t.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            t.status === "Completed"
                              ? "text-green-700 bg-green-50 border-green-700/10"
                              : "text-amber-700 bg-amber-50 border-amber-700/10"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-deep-espresso/70 font-bold uppercase">
                        {t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-bold">
                      No transactions found.
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

export default SellerTransactionsPage;
