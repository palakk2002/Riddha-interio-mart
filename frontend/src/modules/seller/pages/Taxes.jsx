import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuPlus, LuPercent, LuTrash2, LuPen, LuSearch, LuFilter } from 'react-icons/lu';

const initialTaxes = [
  { id: 1, name: 'GST', rate: 18, type: 'Percentage', status: 'Active' },
  { id: 2, name: 'SGST', rate: 9, type: 'Percentage', status: 'Active' },
  { id: 3, name: 'CGST', rate: 9, type: 'Percentage', status: 'Active' },
];

const Taxes = () => {
  const [taxes, setTaxes] = useState(() => {
    const saved = localStorage.getItem('seller_taxes');
    return saved ? JSON.parse(saved) : initialTaxes;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTax, setCurrentTax] = useState(null);
  const [formData, setFormData] = useState({ name: '', rate: '', status: 'Active' });

  const filteredTaxes = taxes.filter(tax => 
    tax.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    let updatedTaxes;
    if (currentTax) {
      updatedTaxes = taxes.map(t => t.id === currentTax.id ? { ...t, ...formData, rate: parseFloat(formData.rate) } : t);
    } else {
      const newTax = {
        id: Date.now(),
        ...formData,
        rate: parseFloat(formData.rate)
      };
      updatedTaxes = [...taxes, newTax];
    }
    setTaxes(updatedTaxes);
    localStorage.setItem('seller_taxes', JSON.stringify(updatedTaxes));
    setShowModal(false);
    setCurrentTax(null);
    setFormData({ name: '', rate: '', status: 'Active' });
  };

  const handleDelete = (id) => {
    const updatedTaxes = taxes.filter(t => t.id !== id);
    setTaxes(updatedTaxes);
    localStorage.setItem('seller_taxes', JSON.stringify(updatedTaxes));
  };

  const openEditModal = (tax) => {
    setCurrentTax(tax);
    setFormData({ name: tax.name, rate: tax.rate, status: tax.status });
    setShowModal(true);
  };

  const openAddModal = () => {
    setCurrentTax(null);
    setFormData({ name: '', rate: '', status: 'Active' });
    setShowModal(true);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Tax Management</h1>
            <p className="text-warm-sand text-sm md:text-base">Configure tax rates for your product listings.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 active:scale-95 text-sm"
          >
            <LuPlus size={18} />
            Add New Tax
          </button>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
            <input 
              type="text" 
              placeholder="Search by tax name..." 
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
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Tax Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Rate (%)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                    <td className="px-6 py-4 font-bold text-deep-espresso">{tax.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-black text-deep-espresso text-sm">
                        <span>{tax.rate}</span>
                        <LuPercent size={14} className="text-warm-sand" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border text-green-700 bg-green-50 border-green-700/10">
                        {tax.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(tax)}
                          className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                        >
                          <LuPen size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tax.id)}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-espresso/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-soft-oatmeal animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl md:text-2xl font-display font-bold text-deep-espresso mb-6">
                {currentTax ? 'Edit Tax Rate' : 'Add New Tax'}
              </h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Tax Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. VAT, GST"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Rate (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required 
                      step="0.01"
                      placeholder="0.00"
                      value={formData.rate}
                      onChange={(e) => setFormData({...formData, rate: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all pr-10"
                    />
                    <LuPercent className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-sand" size={16} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-deep-espresso bg-soft-oatmeal/30 hover:bg-soft-oatmeal/50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-800 hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 text-sm"
                  >
                    {currentTax ? 'Update Tax' : 'Save Tax'}
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

export default Taxes;
