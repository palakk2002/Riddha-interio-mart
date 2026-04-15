import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  LuSearch,
  LuFilter,
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
} from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";

const sellersData = [
  {
    id: 1,
    name: "John Doe",
    shopName: "John's Interiors",
    email: "john@example.com",
    phone: "+91 9876543210",
    location: "Mumbai",
    status: "Active",
    joinedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    shopName: "Modern Decor",
    email: "jane@example.com",
    phone: "+91 9876543211",
    location: "Delhi",
    status: "Active",
    joinedDate: "2024-02-10",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    shopName: "Royal Furniture",
    email: "rajesh@example.com",
    phone: "+91 9876543212",
    location: "Bangalore",
    status: "Inactive",
    joinedDate: "2024-03-05",
  },
];

const ManageSellerListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const savedApproved = JSON.parse(localStorage.getItem('admin_approved_sellers') || '[]');
    // Combine static initial data with dynamically approved data
    const combinedData = [...sellersData, ...savedApproved];
    
    // De-duplicate if necessary (by ID)
    const uniqueData = combinedData.filter((seller, index, self) =>
      index === self.findIndex((s) => s.id === seller.id)
    );
    
    setSellers(uniqueData);
  }, []);

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 py-3 md:py-0 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={16} />
            Filters
          </button>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
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
                {filteredSellers.map((seller) => (
                  <tr
                    key={seller.id}
                    className="hover:bg-soft-oatmeal/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-800/10 flex items-center justify-center text-red-800">
                          <LuUser size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-deep-espresso">
                            {seller.name}
                          </p>
                          <p className="text-xs text-warm-sand">
                            {seller.shopName}
                          </p>
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
                      <div className="flex items-center gap-2 text-xs text-deep-espresso/70">
                        <LuMapPin size={14} className="text-warm-sand" />
                        {seller.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-deep-espresso/70 font-medium">
                      {seller.joinedDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          seller.status === "Active"
                            ? "text-green-700 bg-green-50 border-green-700/10"
                            : "text-red-700 bg-red-50 border-red-700/10"
                        }`}
                      >
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors">
                        <FiMoreVertical size={16} />
                      </button>
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

export default ManageSellerListPage;
