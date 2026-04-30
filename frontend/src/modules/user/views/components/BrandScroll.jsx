import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BrandLogo = ({ brand }) => {
  const [error, setError] = useState(false);

  // High-reliability brand colors
  const brandColors = {
    'POLYCAB': '#e21e26',
    'Finolex': '#0054a6',
    'ANCHOR': '#e21e25',
    'HAVELLS': '#e31e24',
    'NIPPON': '#0054a6',
    'PRINCE': '#e21e26'
  };

  if (error || !brand.logo) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-deep-espresso">
        <span 
          className="text-xs md:text-2xl font-black tracking-tighter uppercase italic"
          style={{ color: brandColors[brand.name?.toUpperCase()] || '#189D91' }}
        >
          {brand.name}
        </span>
        <div 
          className="h-1 w-8 mt-1 rounded-full opacity-30"
          style={{ backgroundColor: brandColors[brand.name?.toUpperCase()] || '#189D91' }}
        />
      </div>
    );
  }

  return (
    <img 
      src={brand.logo} 
      alt={brand.name} 
      onError={() => setError(true)}
      className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-110"
    />
  );
};

const BrandScroll = ({ title }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_brands');
    if (saved) {
      setBrands(JSON.parse(saved));
    } else {
      // Static fallback
      setBrands([
        { name: 'POLYCAB', offer: 'Up to 55% Off', logo: 'https://logo.clearbit.com/polycab.com', slug: 'polycab' },
        { name: 'Finolex', offer: 'Up To 35% Off', logo: 'https://logo.clearbit.com/finolex.com', slug: 'finolex' },
        { name: 'ANCHOR', offer: 'Up To 55% Off', logo: 'https://logo.clearbit.com/panasonic.com', slug: 'anchor' },
        { name: 'HAVELLS', offer: 'Up To 40% Off', logo: 'https://logo.clearbit.com/havells.com', slug: 'havells' },
        { name: 'NIPPON', offer: 'Up To 30% Off', logo: 'https://logo.clearbit.com/nipponpaint.co.in', slug: 'nippon' },
        { name: 'PRINCE', offer: 'Up To 45% Off', logo: 'https://logo.clearbit.com/princepipes.com', slug: 'prince' },
      ]);
    }
  }, []);

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
                key={brand.id || index}
                className="flex-shrink-0"
              >
                <Link to={`/brand/${brand.slug || brand.name.toLowerCase()}`} className="group flex flex-col items-center gap-2 md:gap-5 w-24 md:w-56">
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
