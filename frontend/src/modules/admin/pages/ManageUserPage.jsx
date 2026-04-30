import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuSearch, LuFilter, LuUser, LuMail, LuPhone, LuBuilding2, LuClipboardCheck, LuShoppingBag, LuShieldCheck, LuShieldAlert } from 'react-icons/lu';
import { FiMoreVertical } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const ManageUserPage = ({ type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/auth/admin/users`, { params: { userType: type } });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [type]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setActiveMenu(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleBlock = async (user) => {
    try {
       // Assuming we have a block endpoint or just update user
       await api.put(`/auth/admin/users/${user._id}`, { isBlocked: !user.isBlocked });
       setUsers(users.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
       setActiveMenu(null);
    } catch (err) {
       console.error('Block toggle failed:', err);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso capitalize">
              {type === 'customer' ? 'Individual Customers' : 'Enterprisers'}
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Manage your registered {type === 'customer' ? 'retail customers' : 'business partners'}.
            </p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm font-medium"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 py-3 md:py-0 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={16} />
            Filters
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-soft-oatmeal shadow-md overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-warm-sand border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black text-warm-sand uppercase tracking-widest">Fetching Accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-soft-oatmeal/30 rounded-3xl flex items-center justify-center text-warm-sand mb-4">
                <LuUser size={32} />
              </div>
              <h3 className="text-xl font-bold text-deep-espresso">No {type === 'customer' ? 'Customers' : 'Enterprisers'} Found</h3>
              <p className="text-warm-sand text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest">Account Details</th>
                    {type === 'enterpriser' && (
                      <th className="px-6 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest">Business Info</th>
                    )}
                    <th className="px-6 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest">Orders</th>
                    <th className="px-6 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${user.isBlocked ? 'bg-red-100 text-red-700' : type === 'enterpriser' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center font-bold text-lg`}>
                            {user.fullName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-deep-espresso leading-tight">{user.fullName}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                               <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${type === 'enterpriser' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                  {type === 'customer' ? 'Individual' : 'Enterpriser'}
                               </span>
                               <span className="text-[9px] text-warm-sand font-medium">#{user._id.slice(-6).toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {type === 'enterpriser' && (
                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm font-bold text-deep-espresso">
                              <LuBuilding2 size={14} className="text-warm-sand" />
                              {user.businessDetails?.shopName || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                              <LuClipboardCheck size={12} />
                              GST: {user.businessDetails?.gstNumber || 'PENDING'}
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-deep-espresso/70">
                            <LuMail size={14} className="text-warm-sand" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-xs font-bold text-deep-espresso/70">
                              <LuPhone size={14} className="text-warm-sand" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-soft-oatmeal/20 rounded-lg flex items-center justify-center text-warm-sand">
                               <LuShoppingBag size={14} />
                            </div>
                            <span className="text-sm font-bold text-deep-espresso">{user.totalOrders || 0}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         {user.isBlocked ? (
                           <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 uppercase tracking-widest">
                              <LuShieldAlert size={12} /> Blocked
                           </span>
                         ) : (
                           <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest">
                              <LuShieldCheck size={12} /> Active
                           </span>
                         )}
                         <p className="text-[9px] text-warm-sand mt-0.5">
                           Since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                         </p>
                      </td>
                      <td className="px-6 py-5 text-right relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                          className="p-2.5 text-warm-sand hover:text-deep-espresso hover:bg-soft-oatmeal rounded-xl transition-all"
                        >
                          <FiMoreVertical size={18} />
                        </button>

                        {activeMenu === user._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-6 top-16 w-48 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                              <button 
                                className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-deep-espresso hover:bg-soft-oatmeal transition-colors flex items-center gap-3"
                              >
                                View Orders
                              </button>
                              <button 
                                onClick={() => toggleBlock(user)}
                                className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest ${user.isBlocked ? 'text-green-600' : 'text-amber-600'} hover:bg-soft-oatmeal transition-colors flex items-center gap-3`}
                              >
                                {user.isBlocked ? 'Unblock User' : 'Block User'}
                              </button>
                              <div className="h-px bg-soft-oatmeal my-1 mx-2"></div>
                              <button 
                                onClick={() => handleDelete(user._id)}
                                className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                              >
                                Delete Account
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageUserPage;
