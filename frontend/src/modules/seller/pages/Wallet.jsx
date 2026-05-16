import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  DollarSign,
  ChevronRight,
  Download,
  CreditCard,
  Plus,
  History,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialTransactions = [
  { id: 1, type: 'Order Settlement', amount: 15499, status: 'Completed', date: '2024-04-14', isPositive: true },
  { id: 2, type: 'Funds Withdrawal', amount: 10000, status: 'Pending', date: '2024-04-12', isPositive: false },
  { id: 3, type: 'Order Settlement', amount: 8250, status: 'Completed', date: '2024-04-10', isPositive: true },
];

const Wallet = () => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('seller_wallet_balance');
    return saved ? parseFloat(saved) : 12450;
  });
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('seller_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    
    if (amount > balance) {
      setError('Insufficient balance in your wallet.');
      return;
    }

    if (amount < 100) {
      setError('Minimum withdrawal amount is ₹100.');
      return;
    }

    const newBalance = balance - amount;
    const newTransaction = {
      id: Date.now(),
      type: 'Withdrawal',
      amount: amount,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      isPositive: false
    };

    const updatedTransactions = [newTransaction, ...transactions];
    
    setBalance(newBalance);
    setTransactions(updatedTransactions);
    
    localStorage.setItem('seller_wallet_balance', newBalance.toString());
    localStorage.setItem('seller_transactions', JSON.stringify(updatedTransactions));
    
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setError('');
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
            <p className="text-sm font-medium text-slate-500">Manage your earnings, payouts and transaction history</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Download size={20} />
             </button>
             <button 
               onClick={() => setShowWithdrawModal(true)}
               className="flex items-center gap-2 px-6 py-3 bg-seller-primary text-white rounded-xl font-bold text-sm hover:bg-seller-dark transition-all shadow-lg shadow-seller-primary/20"
             >
               <Plus size={18} />
               Withdraw Funds
             </button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Balance Card - Premium Gradient */}
          <div className="md:col-span-1 bg-gradient-to-br from-[#FF9A9E] via-[#F67062] to-[#FF8FA3] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-rose-200/50 group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/30 transition-colors"></div>
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                      <WalletIcon size={24} className="text-white" />
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Wallet Status</span>
                      <span className="text-[11px] font-black text-white flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></div> Active
                      </span>
                   </div>
                </div>
                <div>
                   <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1.5">Available Balance</p>
                   <h2 className="text-4xl font-black tracking-tight text-white">₹{balance.toLocaleString()}</h2>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Next Payout</span>
                      <span className="text-xs font-black text-white/90 mt-0.5">Apr 20, 2024</span>
                   </div>
                   <button className="text-xs font-black text-white bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center gap-1">
                      Details <ChevronRight size={14} />
                   </button>
                </div>
             </div>
          </div>

          {/* Secondary Stats */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                   <TrendingUp size={26} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Gross Revenue</p>
                   <h3 className="text-3xl font-bold text-slate-900 tracking-tight">₹85,000</h3>
                   <div className="flex items-center gap-2 mt-4">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">
                         <ArrowUpRight size={12} /> +14.2%
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs. last month</span>
                   </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                   <History size={26} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Processing Payouts</p>
                   <h3 className="text-3xl font-bold text-slate-900 tracking-tight">₹5,000</h3>
                   <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-slate-500">
                      <Clock size={14} className="text-amber-500" /> Expected in 48 hours
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <History className="text-slate-400" size={20} />
               <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-seller-primary/10 w-40 md:w-64" />
               </div>
               <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                  <Filter size={18} />
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transaction Details</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference ID</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {transaction.isPositive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-seller-primary transition-colors">{transaction.type}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{transaction.isPositive ? 'Credit' : 'Debit'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">TXN-{transaction.id}</span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900">
                      <span className={transaction.isPositive ? 'text-emerald-600' : 'text-slate-900'}>
                         {transaction.isPositive ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                        transaction.status === 'Completed' 
                          ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                          : 'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right text-[11px] text-slate-500 font-bold uppercase tracking-widest">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        <AnimatePresence>
          {showWithdrawModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setShowWithdrawModal(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative z-10 border border-slate-100"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Withdraw Funds</h3>
                    <p className="text-sm font-medium text-slate-500">Secure payout to your linked account</p>
                  </div>
                  <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-[#E36666] via-[#D64F4F] to-[#B93E3E] rounded-[2rem] p-6 mb-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-seller-primary/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                   <div className="relative z-10 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Current Balance</p>
                         <p className="text-2xl font-bold">₹{balance.toLocaleString()}</p>
                      </div>
                      <CreditCard className="text-white/20" size={32} />
                   </div>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Amount to Withdraw (₹)</label>
                    <div className="relative">
                       <div className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</div>
                       <input 
                        type="number" 
                        required 
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-seller-primary/20 transition-all"
                      />
                    </div>
                    {error && (
                       <div className="flex items-center gap-2 mt-2 text-red-600 px-1">
                          <AlertCircle size={14} />
                          <p className="text-xs font-bold">{error}</p>
                       </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-seller-primary hover:bg-seller-dark transition-all shadow-lg shadow-seller-primary/20"
                    >
                      Process Payout
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Wallet;
