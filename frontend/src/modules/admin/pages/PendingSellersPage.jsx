import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuCheck, LuX, LuEye, LuMail, LuPhone, LuBuilding2, LuFileText } from 'react-icons/lu';

const pendingSellersData = [
  { id: 1, name: 'Alice Wong', shopName: 'Wong Decor', email: 'alice@example.com', phone: '+91 9876543213', applicationDate: '2024-04-10', docType: 'GSTIN' },
  { id: 2, name: 'Bob Smith', shopName: 'Bob\'s Hardware', email: 'bob@example.com', phone: '+91 9876543214', applicationDate: '2024-04-12', docType: 'PAN' },
  { id: 3, name: 'Charlie Davis', shopName: 'Davis Interior', email: 'charlie@example.com', phone: '+91 9876543215', applicationDate: '2024-04-14', docType: 'GSTIN' },
];

const PendingSellersPage = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    const savedPending = localStorage.getItem('admin_pending_sellers');
    if (savedPending) {
      setPendingSellers(JSON.parse(savedPending));
    } else {
      localStorage.setItem('admin_pending_sellers', JSON.stringify(pendingSellersData));
      setPendingSellers(pendingSellersData);
    }
  }, []);

  const handleApprove = (id) => {
    if (window.confirm('Are you sure you want to approve this seller?')) {
      const sellerToApprove = pendingSellers.find(s => s.id === id);
      const updatedPending = pendingSellers.filter(s => s.id !== id);
      
      // Update Pending list
      setPendingSellers(updatedPending);
      localStorage.setItem('admin_pending_sellers', JSON.stringify(updatedPending));

      // Save to Approved list
      const savedApproved = JSON.parse(localStorage.getItem('admin_approved_sellers') || '[]');
      const newApprovedSeller = {
        ...sellerToApprove,
        id: `SELLER-${Date.now()}`,
        status: 'Active',
        location: 'Not Set',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      const updatedApproved = [...savedApproved, newApprovedSeller];
      localStorage.setItem('admin_approved_sellers', JSON.stringify(updatedApproved));

      // NEW: Sync status with registered_sellers for the frontend-only flow
      const registeredSellers = JSON.parse(localStorage.getItem('registered_sellers') || '[]');
      const updatedRegistered = registeredSellers.map(s => 
        s.email === sellerToApprove.email ? { ...s, status: 'Active' } : s
      );
      localStorage.setItem('registered_sellers', JSON.stringify(updatedRegistered));

      // NEW: Also update the current active session if it matches the approved seller
      const currentUser = JSON.parse(localStorage.getItem('riddha_user') || 'null');
      if (currentUser && currentUser.id === sellerToApprove.email) {
        localStorage.setItem('riddha_user', JSON.stringify({ ...currentUser, status: 'Active' }));
      }

      setSelectedSeller(null);
      alert('Seller Approved Successfully!');
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      const updatedPending = pendingSellers.filter(s => s.id !== id);
      setPendingSellers(updatedPending);
      localStorage.setItem('admin_pending_sellers', JSON.stringify(updatedPending));
      setSelectedSeller(null);
      alert('Application Rejected.');
    }
  };

  const handleView = (seller) => {
    setSelectedSeller(seller);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Pending Sellers</h1>
            <p className="text-warm-sand text-sm md:text-base">Review and approve new seller applications.</p>
          </div>
        </div>

        {/* Pending Sellers Table */}
        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Applicant & Shop</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Document</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Date Applied</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {pendingSellers.length > 0 ? (
                  pendingSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-800/10 flex items-center justify-center text-red-800">
                            <LuBuilding2 size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-deep-espresso">{seller.name}</p>
                            <p className="text-xs text-warm-sand">{seller.shopName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-deep-espresso/70">
                            <LuMail size={12} />
                            {seller.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-deep-espresso/70">
                            <LuPhone size={12} />
                            {seller.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-deep-espresso/70 font-medium">
                          <LuFileText size={14} className="text-warm-sand" />
                          {seller.docType} Verified
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-deep-espresso/70 font-medium">
                        {seller.applicationDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-xl">
                          <button 
                            onClick={() => handleView(seller)}
                            className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors" 
                            title="View Details"
                          >
                            <LuEye />
                          </button>
                          <button 
                            onClick={() => handleApprove(seller.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <LuCheck />
                          </button>
                          <button 
                            onClick={() => handleReject(seller.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Reject"
                          >
                            <LuX />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-warm-sand italic">
                      No pending applications at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Review Modal */}
        {selectedSeller && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-espresso/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
              className="absolute inset-0" 
              onClick={() => setSelectedSeller(null)}
            ></div>
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="bg-red-800 p-8 text-white relative">
                 <button 
                   onClick={() => setSelectedSeller(null)}
                   className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                 >
                   <LuX size={20} />
                 </button>
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                     <LuBuilding2 size={32} />
                   </div>
                   <div>
                     <h2 className="text-2xl font-display font-bold">{selectedSeller.shopName}</h2>
                     <p className="text-white/70 text-sm font-medium uppercase tracking-widest">Seller Applicant Review</p>
                   </div>
                 </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuMail size={12} /> Email Address
                    </p>
                    <p className="text-sm font-bold text-deep-espresso">{selectedSeller.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuPhone size={12} /> Contact Number
                    </p>
                    <p className="text-sm font-bold text-deep-espresso">{selectedSeller.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuBuilding2 size={12} /> Owner Name
                    </p>
                    <p className="text-sm font-bold text-deep-espresso">{selectedSeller.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuFileText size={12} /> Document Details
                    </p>
                    <p className="text-sm font-bold text-deep-espresso">{selectedSeller.docType} (Verified)</p>
                  </div>
                </div>

                <div className="bg-soft-oatmeal/20 p-4 rounded-2xl border border-soft-oatmeal flex items-center gap-3">
                   <LuFileText className="text-teal-600" size={20} />
                   <p className="text-xs font-bold text-deep-espresso">
                     The applicant has submitted all required KYC documents for review.
                   </p>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handleReject(selectedSeller.id)}
                    className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                  >
                    Reject Applicant
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedSeller.id)}
                    className="flex-1 bg-red-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-deep-espresso transition-all shadow-lg shadow-red-900/20"
                  >
                    Approve Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default PendingSellersPage;
