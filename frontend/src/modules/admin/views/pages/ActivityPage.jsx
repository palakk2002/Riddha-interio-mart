import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { FiClock, FiUser, FiPackage, FiSettings, FiAlertCircle, FiCheckCircle, FiShield, FiAlertTriangle } from 'react-icons/fi';
import api from '../../../../shared/utils/api';

const ActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'system', 'admin'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (currentPage = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      
      const response = await api.get(`/auth/admin/activity-logs`, {
        params: {
          type: filterType,
          page: currentPage,
          limit: 10
        }
      });

      if (response.data?.success) {
        const fetchedData = response.data.data;
        if (append) {
          setLogs((prev) => [...prev, ...fetchedData]);
        } else {
          setLogs(fetchedData);
        }
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
      setError('Failed to load system activity logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchLogs(1, false);
  }, [filterType]);

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLogs(nextPage, true);
    }
  };

  const getIcon = (action) => {
    const act = action || '';
    if (act.includes('Approved') || act.includes('Confirm')) return <FiCheckCircle className="text-[#189D91]" />;
    if (act.includes('Added') || act.includes('Backup')) return <FiPackage className="text-blue-500" />;
    if (act.includes('Updated')) return <FiSettings className="text-[#EC008C]" />;
    if (act.includes('Delete') || act.includes('Blocked')) return <FiAlertCircle className="text-rose-500" />;
    return <FiShield className="text-slate-600" />;
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Activity Logs</h1>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mt-1.5">
            Historical record of all system-wide updates and user actions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Activity Feed</h3>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200/60 w-fit shrink-0 relative z-10">
              {[
                { label: 'All Activity', value: 'all' },
                { label: 'System Only', value: 'system' },
                { label: 'Admin Logs', value: 'admin' }
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFilterType(t.value)}
                  className={`px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    filterType === t.value 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading && logs.length === 0 ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 flex gap-6 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <FiAlertTriangle className="text-rose-500 text-3xl animate-bounce" />
              <p className="text-sm font-bold text-slate-600">{error}</p>
              <button 
                onClick={() => fetchLogs(page, false)}
                className="mt-2 bg-[#189D91] hover:bg-[#189D91]/90 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-sm"
              >
                Retry Request
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">
              No activity logs recorded under this filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((activity, idx) => (
                <div key={activity._id || idx} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getIcon(activity.action)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <h4 className="font-bold text-slate-800 text-base">
                          {activity.action} <span className="text-slate-400 font-semibold">on</span> {activity.target}
                        </h4>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full w-fit">
                          <FiClock size={10} /> {new Date(activity.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <FiUser size={12} className="text-slate-300" />
                          <span>User:</span> <span className="text-slate-600 font-semibold">{activity.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiShield size={12} className="text-slate-300" />
                          <span>Role:</span> <span className="text-slate-600 font-semibold">{activity.role}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg flex items-center gap-1">
                        Action ID: <span className="font-mono text-slate-600">LOG-{(activity._id || '').slice(-6).toUpperCase()}</span>
                        <span className="text-slate-200">|</span>
                        IP Address: <span className="font-mono text-slate-600">{activity.ipAddress}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {page < totalPages && !loading && (
            <div className="p-6 text-center border-t border-slate-100 bg-slate-50/20">
              <button 
                onClick={loadMore}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#189D91] transition-colors"
              >
                Load More History
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ActivityPage;
