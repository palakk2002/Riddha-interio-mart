import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPieChart, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPackage, 
  FiArrowUp, 
  FiArrowDown, 
  FiCreditCard,
  FiShoppingBag,
  FiDownload
} from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const SalesReport = () => {
  const [filter, setFilter] = useState('Weekly');

  const handleExport = () => {
    window.print();
  };

  // Mock Data for Seller Performance
  const sellerStats = [
    { label: 'Net Payout', value: '₹84,500', sub: 'Ready to Transfer', icon: FiCreditCard, color: 'text-warm-sand bg-warm-sand/10' },
    { label: 'Total Sales', value: '₹1,24,000', sub: '+12% from last period', icon: FiDollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Orders Shipped', value: '42', sub: '100% Success Rate', icon: FiPackage, color: 'text-blue-600 bg-blue-50' },
    { label: 'Return Rate', value: '1.2%', sub: 'Healthy performance', icon: FiTrendingUp, color: 'text-purple-600 bg-purple-50' }
  ];

  const recentTransactions = [
    { id: '#6541', product: 'Premium Velvet Sofa', amount: '₹42,000', commission: '₹4,200', net: '₹37,800', date: '24 Apr' },
    { id: '#6538', product: 'Minimalist Floor Lamp', amount: '₹8,500', commission: '₹850', net: '₹7,650', date: '22 Apr' },
    { id: '#6535', product: 'Marble Dining Table', amount: '₹65,000', commission: '₹6,500', net: '₹58,500', date: '20 Apr' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-deep-espresso tracking-tighter uppercase italic">
              Revenue <span className="text-warm-sand">Center</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Track your earnings and business performance metrics.</p>
          </div>
          <Button 
            onClick={handleExport}
            className="h-14 px-8 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-warm-sand/20"
          >
            <FiDownload /> Export Tax Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sellerStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-xl mb-6`}>
                <stat.icon />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-deep-espresso tracking-tight mb-2">{stat.value}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart Mockup */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-10">
               <h3 className="text-lg font-black text-deep-espresso uppercase tracking-tight">Sales Trend</h3>
               <select 
                 className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500"
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
               >
                 <option>Weekly</option>
                 <option>Monthly</option>
               </select>
             </div>

             <div className="h-56 flex items-end gap-3 px-2">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="w-full bg-gray-50 rounded-lg relative overflow-hidden h-full">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         className="absolute bottom-0 left-0 right-0 bg-warm-sand/20 group-hover:bg-warm-sand transition-colors"
                       />
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <h3 className="text-lg font-black text-deep-espresso uppercase tracking-tight mb-10">Recent Transactions</h3>
             <div className="space-y-6">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                         <FiShoppingBag />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-deep-espresso uppercase">{tx.product}</p>
                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{tx.id} • {tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-green-600">+{tx.net}</p>
                       <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Fees: {tx.commission}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 text-[9px] font-black text-warm-sand uppercase tracking-widest hover:text-deep-espresso transition-colors">
               View All Transactions
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
