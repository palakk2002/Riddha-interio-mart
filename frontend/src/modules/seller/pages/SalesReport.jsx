import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  ShoppingBag,
  Download,
  Calendar,
  Filter,
  ArrowRight,
  Activity,
  ChevronRight
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const SalesReport = () => {
  const [timeRange, setTimeRange] = useState('Weekly');

  const handleExport = () => {
    window.print();
  };

  const stats = [
    { label: 'Net Revenue', value: '₹84,500', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Platform Fees', value: '₹8,450', trend: '-2.1%', isUp: false, icon: CreditCard, color: 'text-slate-600 bg-slate-50' },
    { label: 'Fulfillment', value: '42 Orders', trend: '+8.4%', isUp: true, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Conversion', value: '3.8%', trend: '+0.4%', isUp: true, icon: TrendingUp, color: 'text-seller-primary bg-seller-light/40' }
  ];

  const recentTransactions = [
    { id: '#6541', product: 'Premium Velvet Sofa', amount: '₹42,000', net: '₹37,800', date: '24 Apr', status: 'Settled' },
    { id: '#6538', product: 'Minimalist Floor Lamp', amount: '₹8,500', net: '₹7,650', date: '22 Apr', status: 'Pending' },
    { id: '#6535', product: 'Marble Dining Table', amount: '₹65,000', net: '₹58,500', date: '20 Apr', status: 'Settled' }
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Revenue Analytics</h1>
            <p className="text-sm font-medium text-slate-500">Performance insights and financial reconciliation</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Calendar size={20} />
             </button>
             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-seller-primary transition-all shadow-lg shadow-slate-900/10"
             >
               <Download size={18} /> Export Statements
             </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon size={26} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">{stat.value}</h3>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${stat.isUp ? 'text-emerald-600' : 'text-slate-400'}`}>
                 {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
                 <span className="text-slate-300 ml-1">vs period</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 md:px-0">
          {/* Revenue Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-10">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Activity size={20} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Income Projection</h3>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                   {['Weekly', 'Monthly'].map((r) => (
                      <button 
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${timeRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                      >
                         {r}
                      </button>
                   ))}
                </div>
             </div>

             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                         <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D63384" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#D63384" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                        tickFormatter={(v) => `₹${v/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#D63384" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Recent Payout List */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-10">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
                <button className="p-2 text-slate-400 hover:text-seller-primary transition-colors">
                   <Filter size={18} />
                </button>
             </div>

             <div className="space-y-6">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-seller-light/40 group-hover:text-seller-primary transition-all">
                         <ShoppingBag size={20} />
                       </div>
                       <div className="min-w-0">
                         <p className="text-sm font-bold text-slate-900 truncate group-hover:text-seller-primary transition-colors">{tx.product}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tx.id} • {tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-sm font-bold text-emerald-600">+{tx.net}</p>
                       <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border mt-1 inline-block ${tx.status === 'Settled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {tx.status}
                       </span>
                    </div>
                  </div>
                ))}
             </div>

             <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-2xl text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                Full Transaction Log <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SalesReport;
