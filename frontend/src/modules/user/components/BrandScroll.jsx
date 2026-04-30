import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../../shared/utils/api';

const BrandLogo = ({ brand }) => {
  const [error, setError] = useState(false);

  if (error || !brand.logo) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-deep-espresso bg-soft-oatmeal/5">
        <span className="text-xl font-black tracking-tighter uppercase italic text-warm-sand opacity-40">
          {brand.name?.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={brand.logo} 
      alt={brand.name} 
      onError={() => setError(true)}
      className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
    />
  );
};

const BrandScroll = ({ title }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await api.get('/brands');
        setBrands(data.data || []);
      } catch (err) {
        console.error('Failed to fetch brands for scroll:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (!loading && brands.length === 0) return null;

  return (
    <section className="bg-white py-1 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <h2 className="text-2xl md:text-3xl font-black text-deep-espresso tracking-tight mb-8 md:mb-12">
          {title || "Brands In Focus"}
        </h2>
        
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 md:gap-10 pb-4">
            {brands.map((brand, index) => (
              <div
                key={brand._id || index}
                className="flex-shrink-0"
              >
                <Link to={`/brand/${brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}`} className="group flex flex-col items-center gap-2 md:gap-5 w-24 md:w-56">
                  {/* Brand Card */}
                  <div className="relative aspect-square w-full bg-white border-[1px] md:border-2 border-[#189D91] rounded-lg md:rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="w-full h-full flex items-center justify-center">
                      <BrandLogo brand={brand} />
                    </div>
                  </div>
                  
                  {/* Brand Offer */}
                  <div className="text-center">
                    <p className="text-[9px] md:text-lg font-bold text-[#189D91] tracking-tight group-hover:text-[#127F75] transition-colors">
                      {brand.offer}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandScroll;
