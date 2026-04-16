import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  LuUsers,
  LuSearch,
  LuFilter,
  LuUser,
  LuPhone,
  LuTruck,
} from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";

const deliveryBoysData = [
  {
    id: 1,
    name: "Suresh Raina",
    phone: "+91 9876543230",
    vehicleType: "Bike",
    status: "Active",
    rating: 4.8,
    totalDeliveries: 156,
  },
  {
    id: 2,
    name: "Mahendra Singh",
    phone: "+91 9876543231",
    vehicleType: "Scooter",
    status: "Active",
    rating: 4.9,
    totalDeliveries: 342,
  },
  {
    id: 3,
    name: "Virat Kohli",
    phone: "+91 9876543232",
    vehicleType: "Bike",
    status: "Inactive",
    rating: 4.5,
    totalDeliveries: 89,
  },
];

const ManageDeliveryBoyPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleStatusToggle = (id) => {
    setDeliveryBoys(prev => prev.map(boy => 
      boy.id === id 
      ? { ...boy, status: boy.status === 'Active' ? 'Inactive' : 'Active' } 
      : boy
    ));
    setActiveMenu(null);
  };

  useEffect(() => {
    const savedApproved = JSON.parse(localStorage.getItem('admin_approved_delivery_boys') || '[]');
    // Combine static initial data with dynamically approved data
    const combinedData = [...deliveryBoysData, ...savedApproved];
    
    // De-duplicate if necessary (by ID)
    const uniqueData = combinedData.filter((boy, index, self) =>
      index === self.findIndex((b) => b.id === boy.id)
    );
    
    setDeliveryBoys(uniqueData);
  }, []);

  const filteredBoys = deliveryBoys.filter(
    (boy) =>
      boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boy.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              Manage Delivery Boys
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Monitor and manage all your delivery partners.
            </p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
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
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Delivery Partner
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Performance
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
                {filteredBoys.map((boy) => (
                  <tr
                    key={boy.id}
                    className="hover:bg-soft-oatmeal/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-800/10 flex items-center justify-center text-red-800">
                          <LuUser size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-deep-espresso">
                            {boy.name}
                          </p>
                          <p className="text-xs text-warm-sand">ID #{boy.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-deep-espresso/70">
                      <div className="flex items-center gap-2">
                        <LuPhone size={14} />
                        {boy.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-black text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal uppercase tracking-wider">
                        <LuTruck size={14} />
                        {boy.vehicleType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-deep-espresso">
                            ⭐ {boy.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-warm-sand font-bold uppercase tracking-widest">
                          {boy.totalDeliveries} Deliveries
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          boy.status === "Active"
                            ? "text-green-700 bg-green-50 border-green-700/10"
                            : "text-red-700 bg-red-50 border-red-700/10"
                        }`}
                      >
                        {boy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === boy.id ? null : boy.id)}
                        className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                      >
                        <FiMoreVertical size={16} />
                      </button>

                      {activeMenu === boy.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveMenu(null)}
                          ></div>
                          <div className="absolute right-6 top-14 w-48 bg-white rounded-xl shadow-xl border border-soft-oatmeal py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button 
                              onClick={() => handleStatusToggle(boy.id)}
                              className="w-full text-left px-4 py-3 text-xs font-bold text-deep-espresso hover:bg-soft-oatmeal transition-colors flex items-center gap-2"
                            >
                              <div className={`w-2 h-2 rounded-full ${boy.status === 'Active' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              Set {boy.status === 'Active' ? 'as Inactive' : 'as Active'}
                            </button>
                            <button 
                              onClick={() => { alert('Opening performance logs...'); setActiveMenu(null); }}
                              className="w-full text-left px-4 py-3 text-xs font-bold text-deep-espresso hover:bg-soft-oatmeal transition-colors"
                            >
                              View Performance
                            </button>
                            <div className="h-px bg-soft-oatmeal my-1 mx-2"></div>
                            <button 
                              onClick={() => { if(window.confirm('Delete this record?')) { setDeliveryBoys(deliveryBoys.filter(b => b.id !== boy.id)); setActiveMenu(null); } }}
                              className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Remove Partner
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

export default ManageDeliveryBoyPage;
