import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import iboBanner from '../../../assets/ibo_partner_banner_1774683460337.png';
import brandsGrid from '../../../assets/top_brands_grid_1774683605586.png';

const brands = [
  { name: 'ANCHOR', offer: 'Up to 50% off', path: '/brand/anchor' },
  { name: 'Greenply', offer: 'Extra 2% off', path: '/brand/greenply' },
  { name: 'Hettich', offer: 'Up to 20% off', path: '/brand/hettich' },
  { name: 'Nippon Paint', offer: 'Up to 30% off', path: '/brand/nippon' },
  { name: 'Prince', offer: 'Pipes & Fittings', path: '/brand/prince' },
  { name: 'Cera', offer: 'Up to 30% off', path: '/brand/cera' },
  { name: 'Havells', offer: 'Up to 40% off', path: '/brand/havells' },
  { name: 'Bosch', offer: 'Up to 40% off', path: '/brand/bosch' },
  { name: 'Taparia', offer: 'Up to 15% off', path: '/brand/taparia' },
];

const TopBrands = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-12">
      <div className="bg-[#F2F2F2] py-4 text-center border-x border-t border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Explore our Top Brands</h2>
      </div>
      
      <div className="relative group overflow-hidden border-l border-t border-gray-100 shadow-sm">
        {/* The Grid Image */}
        <img 
          src={brandsGrid} 
          alt="Top Brands Grid" 
          className="w-full h-auto object-cover"
        />

        {/* Interactive Overlay Grid */}
        <div className="absolute inset-0 grid grid-cols-3">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              to={brand.path}
              className="relative flex flex-col items-center justify-end pb-4 md:pb-10 group/brand hover:bg-black/5 transition-colors cursor-pointer"
            >
              {/* Invisible Brand Label for SEO/A11y */}
              <span className="sr-only">{brand.name}</span>
              
              {/* Brand Offer Text Overlayed on the Grid Image's spaces */}
              <p className="text-[#922724] text-[8px] md:text-lg font-bold text-center tracking-tight transition-transform group-hover/brand:scale-110">
                {brand.offer}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100"
      >
        <img 
          src={iboBanner} 
          alt="IBO Partner Program" 
          className="w-full h-auto object-cover"
        />
      </motion.div>
    </section>
  );
};

export default TopBrands;
