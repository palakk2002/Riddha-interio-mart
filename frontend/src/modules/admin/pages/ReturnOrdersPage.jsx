import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuSearch, LuFilter, LuEye, LuUndo2 } from 'react-icons/lu';
import { FiAlertCircle } from 'react-icons/fi';

const returnOrdersData = [
  { id: 1, orderId: 'ORD-2001', customer: 'Deepak Rao', total: 4500, status: 'Processing', date: '2024-04-14', reason: 'Damaged Product' },
  { id: 2, orderId: 'ORD-2002', customer: 'Meera Nair', total: 1200, status: 'Received', date: '2024-04-13', reason: 'Wrong Item' },
  { id: 3, orderId: 'ORD-2003', customer: 'Kunal Verma', total: 850, status: 'Refunded', date: '2024-04-12', reason: 'Size Issue' },
];

const ReturnOrdersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [returns, setReturns] = useState(returnOrdersData);

  const filteredReturns = returns.filter(ret => 
    ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Return Orders</h1>
            <p className="text-warm-sand text-sm md:text-base">Manage customer returns and refund requests.</p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
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
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Return Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Reason</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-800/10 flex items-center justify-center text-red-800">
                          <LuUndo2 size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-deep-espresso">{ret.orderId}</p>
                          <p className="text-[10px] text-warm-sand uppercase tracking-wider font-bold">Return Request</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-deep-espresso">
                      {ret.customer}
                    </td>
                    <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                      ₹{ret.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-warm-sand font-medium">
                        <FiAlertCircle size={14} />
                        {ret.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        ret.status === 'Refunded' 
                        ? 'text-green-700 bg-green-50 border-green-700/10' 
                        : 'text-amber-700 bg-amber-50 border-amber-700/10'
                      }`}>
                        {ret.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/admin/orders/view/${ret.id}`)}
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

export default ReturnOrdersPage;
