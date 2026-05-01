import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  LuSearch,
  LuFilter,
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuBriefcase,
  LuCheck,
  LuX,
  LuTrash2
} from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";
import api from "../../../shared/utils/api";
import { toast } from "react-hot-toast";

const ManageSellerListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      // Fetch both active and pending sellers to show in a single management list
      const [activeRes, pendingRes] = await Promise.all([
        api.get('/auth/admin/sellers/active'),
        api.get('/auth/admin/sellers/pending')
      ]);

      const allSellers = [
        ...activeRes.data.data.map(s => ({ ...s, status: 'Active' })),
        ...pendingRes.data.data.map(s => ({ ...s, status: 'Pending' }))
      ];

      setSellers(allSellers);
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
      toast.error('Failed to load seller data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleStatusUpdate = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/auth/admin/sellers/${id}/approve`);
        toast.success('Seller approved successfully');
      } else if (action === 'delete') {
        if (!window.confirm('Are you sure you want to delete this seller?')) return;
        await api.delete(`/auth/admin/sellers/${id}`);
        toast.success('Seller record removed');
      }
      fetchSellers(); // Refresh list
    } catch (err) {
      toast.error('Failed to update seller status');
    }
    setActiveMenu(null);
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              Manage Sellers
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              View and manage all registered sellers in the platform.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white rounded-xl border border-soft-oatmeal shadow-sm flex flex-col">
              <span className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Active</span>
              <span className="text-lg font-bold text-deep-espresso">{sellers.filter(s => s.status === 'Active').length}</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-soft-oatmeal shadow-sm flex flex-col">
              <span className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Pending</span>
              <span className="text-lg font-bold text-amber-600">{sellers.filter(s => s.status === 'Pending').length}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, shop, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm font-bold"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 py-3 md:py-0 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={16} />
            Filters
          </button>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-24 gap-4">
               <div className="w-12 h-12 border-4 border-warm-sand border-t-deep-espresso rounded-full animate-spin"></div>
               <p className="text-xs font-black uppercase tracking-[0.2em] text-warm-sand">Fetching Seller Records...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                      Seller & Shop
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                      Location
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {filteredSellers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center text-warm-sand font-bold uppercase tracking-widest italic text-sm">
                        No sellers found.
                      </td>
                    </tr>
                  ) : (
                    filteredSellers.map((seller) => (
                      <tr
                        key={seller._id}
                        className="hover:bg-soft-oatmeal/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-deep-espresso/5 flex items-center justify-center text-deep-espresso border border-soft-oatmeal">
                              <LuUser size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-deep-espresso">
                                {seller.fullName}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] font-black text-warm-sand uppercase tracking-widest mt-0.5">
                                <LuBriefcase size={10} /> {seller.shopName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-deep-espresso/70">
                              <LuMail size={12} className="text-warm-sand" />
                              {seller.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-deep-espresso/70">
                              <LuPhone size={12} className="text-warm-sand" />
                              {seller.phone || 'No phone'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-deep-espresso/70">
                            <LuMapPin size={14} className="text-warm-sand flex-shrink-0" />
                            <span className="line-clamp-1">{seller.shopAddress || 'Online Only'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-deep-espresso/70 font-black uppercase tracking-tighter">
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              seller.status === "Active"
                                ? "text-green-700 bg-green-50 border-green-700/10"
                                : "text-amber-700 bg-amber-50 border-amber-700/10"
                            }`}
                          >
                            {seller.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <button 
                            onClick={() => setActiveMenu(activeMenu === seller._id ? null : seller._id)}
                            className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                          >
                            <FiMoreVertical size={16} />
                          </button>

                          {activeMenu === seller._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                              <div className="absolute right-6 top-14 w-52 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                {seller.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(seller._id, 'approve')}
                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                                  >
                                    <LuCheck size={14} /> Approve Store
                                  </button>
                                )}
                                <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-deep-espresso hover:bg-soft-oatmeal transition-colors flex items-center gap-3">
                                  <LuUser size={14} /> View Details
                                </button>
                                <div className="h-px bg-soft-oatmeal my-1 mx-2"></div>
                                <button 
                                  onClick={() => handleStatusUpdate(seller._id, 'delete')}
                                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-800 hover:bg-red-50 transition-colors flex items-center gap-3"
                                >
                                  <LuTrash2 size={14} /> Remove Account
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageSellerListPage;
