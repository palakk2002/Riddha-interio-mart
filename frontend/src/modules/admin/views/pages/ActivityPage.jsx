import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { FiClock, FiUser, FiPackage, FiSettings, FiAlertCircle, FiCheckCircle, FiShield } from 'react-icons/fi';
import { recentActivity } from '../../models/recentActivity';

const ActivityPage = () => {
  const getIcon = (action) => {
    const act = action || '';
    if (act.includes('Approved')) return <FiCheckCircle className="text-green-500" />;
    if (act.includes('Added')) return <FiPackage className="text-blue-500" />;
    if (act.includes('Updated')) return <FiSettings className="text-warm-sand" />;
    if (act.includes('Delete')) return <FiAlertCircle className="text-red-500" />;
    return <FiShield className="text-deep-espresso" />;
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-deep-espresso">System Activity Logs</h1>
          <p className="text-warm-sand mt-2">Historical record of all system-wide updates and user actions.</p>
        </div>

        <div className="bg-white rounded-[32px] border border-soft-oatmeal shadow-sm overflow-hidden">
          <div className="p-6 border-b border-soft-oatmeal flex items-center justify-between bg-soft-oatmeal/10">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-deep-espresso">Activity Feed</h3>
            <div className="flex gap-2">
               <button className="px-3 py-1 bg-white border border-soft-oatmeal text-[10px] font-bold rounded-lg uppercase tracking-wider">All Activity</button>
               <button className="px-3 py-1 bg-white border border-soft-oatmeal text-[10px] font-bold rounded-lg uppercase tracking-wider text-warm-sand">System Only</button>
            </div>
          </div>

          <div className="divide-y divide-soft-oatmeal/50">
             {recentActivity.map((activity) => (
               <div key={activity.id} className="p-6 hover:bg-soft-oatmeal/5 transition-colors group">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-soft-oatmeal/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {getIcon(activity.action)}
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                           <h4 className="font-bold text-deep-espresso text-lg">
                              {activity.action} <span className="text-warm-sand font-medium">on</span> {activity.target}
                           </h4>
                           <div className="flex items-center gap-1.5 text-warm-sand font-black text-[10px] uppercase tracking-wider bg-soft-oatmeal/20 px-3 py-1 rounded-full">
                              <FiClock size={12} /> {activity.time}
                           </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-dusty-cocoa">
                           <div className="flex items-center gap-1.5">
                              <FiUser size={14} className="text-warm-sand" />
                              <span className="font-bold">Performed by:</span> {activity.user}
                           </div>
                           <div className="flex items-center gap-1.5">
                              <FiShield size={14} className="text-warm-sand" />
                              <span className="font-bold">Role:</span> {activity.user === 'Admin' ? 'Super Admin' : 'Manager'}
                           </div>
                        </div>
                        <p className="text-xs text-gray-400 bg-soft-oatmeal/10 p-3 rounded-xl border border-soft-oatmeal/30">
                           Action ID: <span className="font-mono">LOG-{activity.id * 8372}</span> | IP: 192.168.1.{activity.id + 20}
                        </p>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="p-6 text-center border-t border-soft-oatmeal">
             <button className="text-xs font-black text-warm-sand uppercase tracking-widest hover:text-deep-espresso transition-colors">Load More History</button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ActivityPage;
