import React from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { LuPackage, LuClock, LuCheck, LuTrendingUp } from 'react-icons/lu';
import { sellerProducts } from '../data/sellerProducts';

const Dashboard = () => {
  const totalProducts = sellerProducts.length;
  const pendingProducts = sellerProducts.filter(p => p.status === 'pending').length;
  const approvedProducts = sellerProducts.filter(p => p.status === 'approved').length;

  const recentActivities = [
    { id: 1, action: "Product Approved", target: "Oak Wood Coffee Table", time: "2 hours ago" },
    { id: 2, action: "New Listing Added", target: "Luxury Silk Curtains", time: "5 hours ago" },
    { id: 3, action: "Price Updated", target: "Classic Marble Tile", time: "Yesterday" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Seller Dashboard</h1>
          <p className="text-warm-sand mt-2">Manage your listings and track your shop performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="Total Products" 
            value={totalProducts} 
            icon={LuPackage} 
            color="bg-warm-sand" 
          />
          <StatCard 
            label="Pending Approval" 
            value={pendingProducts} 
            icon={LuClock} 
            color="bg-soft-oatmeal" 
          />
          <StatCard 
            label="Approved Products" 
            value={approvedProducts} 
            icon={LuCheck} 
            color="bg-dusty-cocoa" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md border border-soft-oatmeal overflow-hidden">
            <div className="p-6 border-b border-soft-oatmeal flex items-center justify-between">
              <h3 className="text-xl font-display font-bold flex items-center gap-2 text-deep-espresso">
                <LuTrendingUp className="text-warm-sand" /> Recent Activity
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {recentActivities.map((item) => (
                <div key={item.id} className="flex gap-4 items-start group">
                  <div className="w-2 h-2 rounded-full bg-warm-sand mt-2 group-hover:scale-150 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold text-deep-espresso">{item.action}</span> 
                      <span className="text-warm-sand mx-1">on</span> 
                      <span className="text-dusty-cocoa font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-warm-sand/80 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-gradient-to-br from-warm-sand/20 to-soft-oatmeal rounded-xl p-8 text-deep-espresso border border-soft-oatmeal relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-deep-espresso text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md mb-4 border border-white/10">
                <LuTrendingUp size={14} /> Seller Insights
              </div>
              <h3 className="text-2xl font-display font-bold leading-tight max-w-[250px]">
                Your products were viewed 124 times this week.
              </h3>
              <p className="mt-4 text-dusty-cocoa text-sm leading-relaxed max-w-[300px]">
                Keep adding premium items from the catalog to increase your visibility and sales.
              </p>
            </div>
            
            <button className="relative z-10 bg-deep-espresso text-white font-bold py-3 px-6 rounded-xl w-fit transition-all hover:bg-dusty-cocoa hover:scale-105 active:scale-95 shadow-lg shadow-deep-espresso/20 text-sm">
              View Analytics
            </button>

            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
