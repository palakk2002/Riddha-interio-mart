import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuWallet, LuArrowUpRight, LuArrowDownLeft, LuDownload, LuClock, LuCheck, LuX } from 'react-icons/lu';
import { motion } from 'framer-motion';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('balance');

  const transactions = [
    { id: 1, type: 'credit', amount: 2500, description: 'Order #12345 completed', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'debit', amount: 1000, description: 'Withdrawal to Bank', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'credit', amount: 1800, description: 'Order #12344 completed', date: '2024-01-13', status: 'completed' },
    { id: 4, type: 'credit', amount: 3200, description: 'Order #12343 completed', date: '2024-01-12', status: 'completed' },
    { id: 5, type: 'debit', amount: 500, description: 'Withdrawal to UPI', date: '2024-01-10', status: 'pending' },
  ];

  const walletBalance = 12500;
  const totalEarnings = 28500;
  const pendingAmount = 500;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Wallet</h1>
          <p className="text-warm-sand mt-2">Manage your earnings and withdrawals.</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-deep-espresso to-warm-sand rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm font-medium mb-2">Available Balance</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">₹{walletBalance.toLocaleString()}</h2>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-white/60 text-xs">Total Earnings</p>
                  <p className="text-lg font-bold">₹{totalEarnings.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Pending</p>
                  <p className="text-lg font-bold">₹{pendingAmount}</p>
                </div>
              </div>
            </div>
            <button className="bg-white text-deep-espresso px-8 py-4 rounded-xl font-bold hover:bg-soft-oatmeal transition-colors flex items-center gap-2">
              <LuDownload size={20} />
              Withdraw
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-soft-oatmeal/30 rounded-2xl border border-soft-oatmeal w-fit">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
              activeTab === 'balance' 
                ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/10' 
                : 'text-dusty-cocoa hover:text-deep-espresso'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
              activeTab === 'withdraw' 
                ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/10' 
                : 'text-dusty-cocoa hover:text-deep-espresso'
            }`}
          >
            Withdraw
          </button>
        </div>

        {activeTab === 'balance' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal overflow-hidden">
            <div className="p-6 border-b border-soft-oatmeal">
              <h3 className="text-lg font-bold text-deep-espresso">Transaction History</h3>
            </div>
            <div className="divide-y divide-soft-oatmeal">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-soft-oatmeal/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? <LuArrowDownLeft size={24} /> : <LuArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-deep-espresso">{transaction.description}</p>
                        <p className="text-sm text-dusty-cocoa">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {transaction.status === 'completed' ? (
                          <LuCheck size={14} className="text-green-500" />
                        ) : (
                          <LuClock size={14} className="text-orange-500" />
                        )}
                        <span className="text-xs text-dusty-cocoa capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal p-8">
            <h3 className="text-lg font-bold text-deep-espresso mb-6">Withdraw Funds</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-deep-espresso mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-soft-oatmeal rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-sand"
                />
                <p className="text-xs text-dusty-cocoa mt-2">Available: ₹{walletBalance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-espresso mb-2">Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-warm-sand bg-warm-sand/5 rounded-xl text-center">
                    <LuWallet size={24} className="mx-auto mb-2 text-warm-sand" />
                    <p className="text-sm font-bold text-deep-espresso">Bank Transfer</p>
                  </button>
                  <button className="p-4 border border-soft-oatmeal rounded-xl text-center hover:border-warm-sand transition-colors">
                    <LuWallet size={24} className="mx-auto mb-2 text-dusty-cocoa" />
                    <p className="text-sm font-bold text-deep-espresso">UPI</p>
                  </button>
                </div>
              </div>
              <button className="w-full bg-deep-espresso text-white py-4 rounded-xl font-bold hover:bg-warm-sand transition-colors">
                Request Withdrawal
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Wallet;
