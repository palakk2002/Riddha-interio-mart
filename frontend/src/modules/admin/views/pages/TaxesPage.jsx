import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuPlus, LuTrash2, LuPen, LuPercent, LuSearch, LuFilter } from 'react-icons/lu';

const initialTaxes = [
  { id: 1, name: 'GST', rate: 18, type: 'Percentage', status: 'Active' },
  { id: 2, name: 'VAT', rate: 12, type: 'Percentage', status: 'Active' },
  { id: 3, name: 'Service Tax', rate: 5, type: 'Percentage', status: 'Inactive' },
];

const TaxesPage = () => {
  const [taxes, setTaxes] = useState(initialTaxes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTaxes = taxes.filter(tax => 
    tax.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Tax Management</h1>
            <p className="text-warm-sand text-sm md:text-base">Configure and manage tax rates for your products.</p>
          </div>
          <button 
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 active:scale-95 text-sm"
          >
            <LuPlus size={18} />
            Add New Tax
          </button>
        </div>

        {/* Toolbar */}
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

        {/* Taxes Table */}
        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Tax Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Rate (%)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-deep-espresso">{tax.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-black text-deep-espresso">
                        <span>{tax.rate}</span>
                        <LuPercent size={14} className="text-warm-sand" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal uppercase tracking-wider">
                        {tax.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        tax.status === 'Active' 
                        ? 'text-green-700 bg-green-50 border-green-700/10' 
                        : 'text-red-700 bg-red-50 border-red-700/10'
                      }`}>
                        {tax.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors">
                          <LuPen size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      </div>
    </PageWrapper>
  );
};

export default TaxesPage;
