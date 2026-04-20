import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { LuPlus, LuTags, LuArrowLeft } from 'react-icons/lu';

const AddProductFlowPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8 py-8 md:py-12">
         {/* Navigation */}
         <button 
           onClick={() => navigate('/admin/inventory')}
           className="flex items-center gap-2 text-warm-sand font-bold hover:text-deep-espresso transition-colors group text-xs md:text-sm uppercase tracking-widest"
         >
           <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
           Back to Inventory
         </button>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-deep-espresso tracking-tight">Create Listing</h1>
          <p className="text-warm-sand font-black uppercase tracking-[0.3em] text-xs">How would you like to add this product?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto px-4">
          <button 
            onClick={() => navigate('/admin/inventory/add')}
            className="group relative bg-white border border-soft-oatmeal p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-warm-sand/30 transition-all duration-500 flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 bg-soft-oatmeal/10 rounded-3xl flex items-center justify-center text-warm-sand group-hover:bg-warm-sand group-hover:text-white transition-all duration-500">
              <LuPlus size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-deep-espresso uppercase tracking-tight">Create Order</h3>
              <p className="text-warm-sand/60 text-sm font-medium mt-2 leading-relaxed">Manually input details to create a new product identity in the master catalog.</p>
            </div>
            <div className="pt-4">
              <span className="px-8 py-4 bg-soft-oatmeal/20 rounded-full text-[10px] font-black uppercase tracking-widest text-warm-sand group-hover:bg-warm-sand/10 transition-colors">Start Fresh Listing</span>
            </div>
          </button>

          <Link 
            to="/admin/catalog"
            className="group relative bg-white border border-soft-oatmeal p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-warm-sand/30 transition-all duration-500 flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 bg-soft-oatmeal/10 rounded-3xl flex items-center justify-center text-warm-sand group-hover:bg-warm-sand group-hover:text-white transition-all duration-500">
              <LuTags size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-deep-espresso uppercase tracking-tight">Select From Catalog</h3>
              <p className="text-warm-sand/60 text-sm font-medium mt-2 leading-relaxed">Pick an existing item from the master catalog to add to your managed inventory.</p>
            </div>
            <div className="pt-4">
              <span className="px-8 py-4 bg-soft-oatmeal/20 rounded-full text-[10px] font-black uppercase tracking-widest text-warm-sand group-hover:bg-warm-sand/10 transition-colors">Browse Master List</span>
            </div>
          </Link>
        </div>

        {/* Info Card */}
        <div className="max-w-2xl mx-auto bg-soft-oatmeal/10 border border-soft-oatmeal p-6 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 bg-warm-sand/20 rounded-full flex items-center justify-center text-warm-sand shrink-0">
                <LuPlus size={20} />
            </div>
            <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-deep-espresso">Admin Tip: Fast Track</h4>
                <p className="text-[10px] text-warm-sand font-medium leading-relaxed uppercase">Listing from the catalog skip basic setup steps and link categories automatically, improving operational efficiency by 40%.</p>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AddProductFlowPage;
