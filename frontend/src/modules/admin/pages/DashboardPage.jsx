import React from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { LuPackage, LuTags, LuUsers, LuClock, LuTrendingUp } from 'react-icons/lu';
import { adminProducts } from '../data/adminProducts';
import { adminCategories } from '../data/adminCategories';
import { recentActivity } from '../data/recentActivity';

const DashboardPage = () => {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-display font-bold text-deep-espresso">Dashboard Overview</h1>
          <p className="text-warm-sand mt-2">Track your store performance and recent activities.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="Total Products" 
            value={adminProducts.length} 
            icon={LuPackage} 
            color="bg-dusty-cocoa" 
          />
          <StatCard 
            label="Total Categories" 
            value={adminCategories.length} 
            icon={LuTags} 
            color="bg-warm-sand" 
          />
          <StatCard 
            label="Total Sellers" 
            value="14" 
            icon={LuUsers} 
            color="bg-deep-espresso" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl shadow-md border border-soft-oatmeal overflow-hidden">
            <div className="p-6 border-b border-soft-oatmeal flex items-center justify-between">
              <h3 className="text-xl font-display font-bold flex items-center gap-2 text-deep-espresso">
                <LuClock className="text-warm-sand" /> Recent Activity
              </h3>
              <button className="text-sm font-medium text-dusty-cocoa hover:underline">View All</button>
            </div>
            <div className="p-6 space-y-6">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex gap-4 items-start group">
                  <div className="w-2 h-2 rounded-full bg-warm-sand mt-2 group-hover:scale-150 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold text-deep-espresso">{item.action}</span> 
                      <span className="text-warm-sand mx-1">on</span> 
                      <span className="text-dusty-cocoa font-medium">{item.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-warm-sand/80">
                      <span>By {item.user}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights Placeholder */}
          <div className="bg-gradient-to-br from-deep-espresso to-dusty-cocoa rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md mb-4 border border-white/20">
                <LuTrendingUp size={14} /> Weekly Insights
              </div>
              <h3 className="text-2xl font-display font-bold leading-tight max-w-[250px]">
                Your store traffic increased by 15% this week.
              </h3>
              <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-[300px]">
                Detailed analytics will be available once the backend is integrated. Currently showing simulated data.
              </p>
            </div>
            
            <button className="relative z-10 bg-warm-sand text-deep-espresso font-bold py-3 px-6 rounded-xl w-fit transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-lg">
              Check Analytics
            </button>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
