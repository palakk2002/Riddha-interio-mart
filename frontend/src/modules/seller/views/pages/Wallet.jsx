import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuWallet, LuTrendingUp, LuArrowUpRight, LuArrowDownLeft, LuSearch, LuFilter } from 'react-icons/lu';
import { FiDollarSign } from 'react-icons/fi';

const initialTransactions = [
  { id: 1, type: 'Order Payment', amount: 15499, status: 'Completed', date: '2024-04-14', isPositive: true },
  { id: 2, type: 'Withdrawal', amount: 10000, status: 'Pending', date: '2024-04-12', isPositive: false },
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">My Wallet</h1>
            <p className="text-warm-sand text-sm md:text-base">Track your earnings and payout history.</p>
          </div>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 active:scale-95 text-sm"
          >
            Withdraw Funds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-warm-sand font-bold uppercase tracking-wider">Total Earnings</p>
              <h4 className="text-xl font-black text-deep-espresso">₹85,000</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <LuWallet size={24} />
            </div>
            <div>
              <p className="text-xs text-warm-sand font-bold uppercase tracking-wider">Wallet Balance</p>
              <h4 className="text-xl font-black text-deep-espresso">₹{balance.toLocaleString()}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-soft-oatmeal shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <LuTrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-warm-sand font-bold uppercase tracking-wider">Pending Payout</p>
              <h4 className="text-xl font-black text-deep-espresso">₹5,000</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="p-6 border-b border-soft-oatmeal">
            <h3 className="text-lg font-bold text-deep-espresso">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${transaction.isPositive ? 'text-green-600' : 'text-red-600'} font-bold text-sm`}>
                        {transaction.isPositive ? <LuArrowDownLeft size={16} /> : <LuArrowUpRight size={16} />}
                        {transaction.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        transaction.status === 'Completed' 
                          ? 'text-green-700 bg-green-50 border-green-700/10' 
                          : 'text-amber-700 bg-amber-50 border-amber-700/10'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-deep-espresso/70 font-medium">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-espresso/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-soft-oatmeal animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-deep-espresso">Withdraw Funds</h3>
                <LuWallet size={24} className="text-warm-sand" />
              </div>

              <div className="bg-soft-oatmeal/10 p-4 rounded-2xl mb-6 flex items-center justify-between border border-soft-oatmeal/50">
                <p className="text-xs font-bold text-warm-sand uppercase tracking-widest">Available Balance</p>
                <p className="text-lg font-black text-deep-espresso">₹{balance.toLocaleString()}</p>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Amount to Withdraw (₹)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all font-bold text-deep-espresso"
                  />
                  {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setError('');
                      setWithdrawAmount('');
                    }}
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-deep-espresso bg-soft-oatmeal/30 hover:bg-soft-oatmeal/50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-800 hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Wallet;
