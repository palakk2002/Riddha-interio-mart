import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuSearch, LuFilter, LuUser, LuMail, LuPhone, LuUserPlus } from 'react-icons/lu';
import { FiMoreVertical } from 'react-icons/fi';

const usersData = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543220', joinedDate: '2024-04-10', totalOrders: 5, status: 'Active' },
  { id: 2, name: 'Amit Singh', email: 'amit@example.com', phone: '+91 9876543221', joinedDate: '2024-04-12', totalOrders: 2, status: 'Active' },
  { id: 3, name: 'Anjali Verma', email: 'anjali@example.com', phone: '+91 9876543232', joinedDate: '2024-04-12', totalOrders: 12, status: 'Active' },
];

const ManageUserPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(usersData);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      setActiveMenu(null);
    }
  };

  const handleStatusToggle = (id) => {
    setUsers(users.map(u => 
      u.id === id 
      ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } 
      : u
    ));
    setActiveMenu(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">User Management</h1>
            <p className="text-warm-sand text-sm md:text-base">View and manage all registered customers.</p>
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
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 py-3 md:py-0 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={16} />
            Filters
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Customer Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Orders</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Joined Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-800/10 flex items-center justify-center text-red-800">
                          <LuUser size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-deep-espresso">{user.name}</p>
                          <p className="text-xs text-warm-sand">Customer #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-deep-espresso/70">
                          <LuMail size={12} />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-deep-espresso/70">
                          <LuPhone size={12} />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal uppercase tracking-widest">
                        {user.totalOrders} Orders
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-deep-espresso/70 font-medium">
                      {user.joinedDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border text-green-700 bg-green-50 border-green-700/10">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                      >
                        <FiMoreVertical size={16} />
                      </button>

                      {activeMenu === user.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveMenu(null)}
                          ></div>
                          <div className="absolute right-6 top-14 w-40 bg-white rounded-xl shadow-xl border border-soft-oatmeal py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button 
                              onClick={() => { alert(`Editing ${user.name}`); setActiveMenu(null); }}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-deep-espresso hover:bg-soft-oatmeal transition-colors"
                            >
                              Edit Profile
                            </button>
                            <button 
                              onClick={() => handleStatusToggle(user.id)}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-deep-espresso hover:bg-soft-oatmeal transition-colors"
                            >
                              {user.status === 'Active' ? 'Block User' : 'Unblock User'}
                            </button>
                            <div className="h-px bg-soft-oatmeal my-1 mx-2"></div>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete User
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
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageUserPage;
