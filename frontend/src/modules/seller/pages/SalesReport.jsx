import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag,
  Download,
  Calendar,
  Filter,
  ArrowRight,
  Activity,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreVertical,
  Plus,
  Database,
  ArrowUp,
  FileText,
  Star
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: 'Mon', sales: 400, revenue: 240, units: 100 },
  { name: 'Tue', sales: 500, revenue: 300, units: 120 },
  { name: 'Wed', sales: 1200, revenue: 800, units: 250 },
  { name: 'Thu', sales: 900, revenue: 600, units: 180 },
  { name: 'Fri', sales: 1500, revenue: 1100, units: 320 },
];

const pieData = [
  { name: 'Sofa', value: 400, color: '#E36666' },
  { name: 'Tables', value: 300, color: '#9333EA' },
  { name: 'Lamps', value: 200, color: '#4F46E5' },
  { name: 'Decor', value: 100, color: '#F59E0B' },
];

const bestSellers = [
  { id: 1, name: 'Anticor Dist Table', price: '₹12,500', rating: 4.7, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Velvet Soft Chair', price: '₹8,500', rating: 4.9, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=200&auto=format&fit=crop' },
];

const SalesReport = () => {
  const navigate = useNavigate();
  const [activeMetric, setActiveMetric] = useState('sales');

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pb-20 space-y-6">
        
        {/* Mobile-Style Header (Same as Img) */}
        <div className="bg-seller-primary text-white p-6 pb-12 rounded-b-[2.5rem] -mx-4 md:-mx-0 md:rounded-[2.5rem] md:mt-4 shadow-xl shadow-seller-primary/10">
           <div className="flex items-center justify-between mb-8">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-bold tracking-tight">Seller Analytics</h1>
              <div className="w-10" /> {/* Spacer */}
           </div>
           
           {/* Search / Action Bar */}
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                 <FileText size={20} className="text-white/60" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white/80">Generate data report</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                 <Plus size={16} />
              </div>
           </div>
        </div>

        {/* Analytics Content */}
        <div className="px-4 md:px-0 -mt-8 space-y-6">
           
           {/* Line Chart Section */}
           <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8">
              {/* Metric Toggles */}
              <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                 {[
                   { id: 'sales', label: 'Sales', color: 'bg-seller-primary' },
                   { id: 'revenue', label: 'Revenue', color: 'bg-purple-600' },
                   { id: 'units', label: 'Units Sold', color: 'bg-indigo-600' }
                 ].map(m => (
                   <button 
                     key={m.id}
                     onClick={() => setActiveMetric(m.id)}
                     className={`flex items-center gap-2 whitespace-nowrap transition-all ${activeMetric === m.id ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}
                   >
                      <div className={`w-2 h-2 rounded-full ${m.color}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{m.label}</span>
                   </button>
                 ))}
              </div>

              {/* Multi-Line Chart */}
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor={activeMetric === 'sales' ? '#E36666' : activeMetric === 'revenue' ? '#9333EA' : '#4F46E5'} stopOpacity={0.2}/>
                             <stop offset="95%" stopColor={activeMetric === 'sales' ? '#E36666' : activeMetric === 'revenue' ? '#9333EA' : '#4F46E5'} stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis 
                         dataKey="name" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{fontSize: 9, fontWeight: 800, fill: '#94A3B8'}} 
                         dy={10}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{fontSize: 9, fontWeight: 800, fill: '#94A3B8'}} 
                       />
                       <Tooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey={activeMetric} 
                         stroke={activeMetric === 'sales' ? '#E36666' : activeMetric === 'revenue' ? '#9333EA' : '#4F46E5'} 
                         strokeWidth={4}
                         fillOpacity={1} 
                         fill="url(#colorMain)" 
                         animationDuration={1500}
                       />
                       {/* Ghost lines for context */}
                       <Area type="monotone" dataKey="sales" stroke="#E36666" strokeWidth={2} fill="none" opacity={activeMetric === 'sales' ? 0 : 0.1} />
                       <Area type="monotone" dataKey="revenue" stroke="#9333EA" strokeWidth={2} fill="none" opacity={activeMetric === 'revenue' ? 0 : 0.1} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Category Contribution (Donut Chart) */}
           <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">Category contribution</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="w-full h-48 md:h-56 max-w-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 
                 {/* Legend Custom */}
                 <div className="grid grid-cols-2 md:grid-cols-1 gap-4 w-full md:w-auto">
                    {pieData.map((item, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-black text-slate-900 leading-none">{item.name}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">₹{item.value}k Sales</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Best Selling Products */}
           <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Best-selling products</h3>
              
              <div className="space-y-4">
                 {bestSellers.map((product) => (
                    <motion.div 
                      whileHover={{ x: 5 }}
                      key={product.id} 
                      className="flex items-center justify-between p-3 rounded-3xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                             <img src={product.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-sm font-black text-slate-900 leading-tight">{product.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total {product.price}</p>
                             <div className="flex items-center gap-1.5">
                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-slate-900">{product.rating}</span>
                             </div>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-slate-300 group-hover:text-seller-primary group-hover:translate-x-1 transition-all" />
                    </motion.div>
                 ))}
              </div>
              
              <button className="w-full py-4 bg-seller-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-seller-primary/20 hover:bg-seller-dark transition-all">
                 View Complete Report
              </button>
           </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default SalesReport;
