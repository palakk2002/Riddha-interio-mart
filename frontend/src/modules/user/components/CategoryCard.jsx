import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link 
        to={`/category/${category.slug}`}
        className="group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] h-full w-full block shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        {/* Background Image */}
        <motion.img
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-espresso/100 via-deep-espresso/50 to-transparent group-hover:from-deep-espresso/100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 p-10 w-full flex justify-between items-end">
            <div className="transform transition-all duration-500 group-hover:-translate-y-2">
              <h3 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
                {category.name}
              </h3>
              <span className="inline-block px-5 py-2 bg-warm-sand/20 backdrop-blur-xl border border-white/20 text-soft-oatmeal rounded-full text-[11px] uppercase tracking-[0.2em] font-black">
                {category.productCount}+ Pieces
              </span>
            </div>
            
            <motion.div 
              whileHover={{ rotate: -45, scale: 1.1 }}
              className="h-14 w-14 bg-warm-sand text-deep-espresso rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 delay-100 shadow-2xl"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={3} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
