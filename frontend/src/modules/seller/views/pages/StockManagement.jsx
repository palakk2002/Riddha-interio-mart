import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  LuPackage,
  LuSearch,
  LuFilter,
  LuPen,
  LuTrash2,
  LuPlus,
} from "react-icons/lu";

const initialStock = [
  {
    id: 1,
    name: "Modern Fabric Sofa",
    sku: "SFA-101",
    inStock: 12,
    category: "Furniture",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Glass Coffee Table",
    sku: "TBL-202",
    inStock: 5,
    category: "Furniture",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Ceramic Table Lamp",
    sku: "LMP-303",
    inStock: 25,
    category: "Lighting",
    status: "In Stock",
  },
];

const StockManagement = () => {
  const [stock, setStock] = useState(() => {
    const saved = localStorage.getItem("seller_stocks");
    return saved ? JSON.parse(saved) : initialStock;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", sku: "", inStock: "" });

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    const updatedStock = stock.filter(item => item.id !== id);
    setStock(updatedStock);
    localStorage.setItem("seller_stocks", JSON.stringify(updatedStock));
  };

  const handleEditOpen = (item) => {
    setEditingItem(item);
    setEditFormData({ name: item.name, sku: item.sku, inStock: item.inStock });
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedStock = stock.map(item => 
      item.id === editingItem.id 
      ? { 
          ...item, 
          ...editFormData, 
          inStock: parseInt(editFormData.inStock),
          status: parseInt(editFormData.inStock) <= 5 ? "Low Stock" : "In Stock"
        } 
      : item
    );
    setStock(updatedStock);
    localStorage.setItem("seller_stocks", JSON.stringify(updatedStock));
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">
              Stock Management
            </h1>
            <p className="text-warm-sand text-sm md:text-base">
              Monitor and manage your inventory levels.
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
              placeholder="Search by product or SKU..."
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
                    Product & SKU
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    Current Stock
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
                {filteredStock.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-soft-oatmeal/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-deep-espresso">
                        {item.name}
                      </p>
                      <p className="text-xs text-warm-sand">SKU: {item.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-deep-espresso/70 uppercase tracking-widest">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 font-black text-deep-espresso text-sm">
                      {item.inStock} Units
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          item.status === "Low Stock"
                            ? "text-red-700 bg-red-50 border-red-700/10"
                            : "text-green-700 bg-green-50 border-green-700/10"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditOpen(item)}
                          className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                        >
                          <LuPen size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-espresso/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-soft-oatmeal animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl md:text-2xl font-display font-bold text-deep-espresso mb-6">Update Stock</h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Name</label>
                  <input 
                    type="text" required 
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">SKU Code</label>
                  <input 
                    type="text" required 
                    value={editFormData.sku}
                    onChange={(e) => setEditFormData({...editFormData, sku: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Current Stock Level</label>
                  <input 
                    type="number" required 
                    value={editFormData.inStock}
                    onChange={(e) => setEditFormData({...editFormData, inStock: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-deep-espresso bg-soft-oatmeal/30 hover:bg-soft-oatmeal/50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-800 hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default StockManagement;
