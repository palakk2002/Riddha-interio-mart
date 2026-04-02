import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const focusBrands = [
  { 
    name: 'POLYCAB', 
    offer: 'Up to 55% Off', 
    logo: 'https://logo.clearbit.com/polycab.com',
    path: '/brand/polycab'
  },
  { 
    name: 'Finolex', 
    offer: 'Up To 35% Off', 
    logo: 'https://logo.clearbit.com/finolex.com',
    path: '/brand/finolex'
  },
  { 
    name: 'ANCHOR', 
    offer: 'Up To 55% Off', 
    logo: 'https://logo.clearbit.com/panasonic.com',
    path: '/brand/anchor'
  },
  { 
    name: 'HAVELLS', 
    offer: 'Up To 40% Off', 
    logo: 'https://logo.clearbit.com/havells.com',
    path: '/brand/havells'
  },
  { 
    name: 'NIPPON', 
    offer: 'Up To 30% Off', 
    logo: 'https://logo.clearbit.com/nipponpaint.co.in',
    path: '/brand/nippon'
  },
  { 
    name: 'PRINCE', 
    offer: 'Up To 45% Off', 
    logo: 'https://logo.clearbit.com/princepipes.com',
    path: '/brand/prince'
  },
];

const BrandLogo = ({ brand }) => {
  const [error, setError] = React.useState(false);

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
      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
        <span 
          className="text-xs md:text-2xl font-black tracking-tighter"
          style={{ color: brandColors[brand.name] || '#922724' }}
        >
          {brand.name}
        </span>
        <div 
          className="h-1 w-8 mt-1 rounded-full"
          style={{ backgroundColor: brandColors[brand.name] || '#922724' }}
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
  return (
    <section className="bg-white py-1 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <h2 className="text-2xl md:text-3xl font-black text-deep-espresso tracking-tight mb-8 md:mb-12">
          {title || "Brands In Focus"}
        </h2>
        
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 md:gap-10 pb-4">
            {focusBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <Link to={brand.path} className="group flex flex-col items-center gap-2 md:gap-5 w-24 md:w-56">
                  {/* Brand Card */}
                  <div className="relative aspect-square w-full bg-white border-[1px] md:border-2 border-[#922724] rounded-lg md:rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="w-full h-full flex items-center justify-center">
                      <BrandLogo brand={brand} />
                    </div>
                  </div>
                  
                  {/* Brand Offer */}
                  <div className="text-center">
                    <p className="text-[9px] md:text-lg font-bold text-[#922724] tracking-tight group-hover:text-[#b1312d] transition-colors">
                      {brand.offer}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandScroll;
