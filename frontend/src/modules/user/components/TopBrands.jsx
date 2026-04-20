import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../shared/utils/api';

const TopBrands = ({ title }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await api.get('/brands');
        if (data.data && data.data.length > 0) {
          setBrands(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch brands for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (!loading && brands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-header-red)] tracking-tight">
          {title || "Explore Top Brands"}
        </h2>
        <Link to="/brands" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-deep-espresso transition-colors">
          View All
        </Link>
      </div>
      
      <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-4 pb-4">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            to={`/brand/${brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex-shrink-0 w-[140px] md:w-[220px] bg-white border border-gray-100 rounded-[24px] p-4 md:p-8 flex flex-col items-center justify-center gap-3 group/brand hover:shadow-xl hover:border-soft-oatmeal transition-all text-center"
          >
            <div className="w-full h-12 md:h-20 flex items-center justify-center overflow-hidden">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover/brand:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                Partner
              </p>
              <p className="text-[#922724] text-[9px] md:text-sm font-bold tracking-tight line-clamp-1">
                {brand.offer}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopBrands;
