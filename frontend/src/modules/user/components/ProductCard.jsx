import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../data/CartContext';
import Button from '../../../shared/components/Button';

const ProductCard = ({ product, index = 0, variant = 'grid' }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const isList = variant === 'list';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`group bg-white rounded-2xl md:rounded-3xl border border-soft-oatmeal/20 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${
        isList ? 'flex flex-row md:flex-col h-[180px] md:h-auto' : 'flex flex-col'
      }`}
    >
      <Link 
        to={`/products/${product.id}`} 
        className={`relative block overflow-hidden shrink-0 ${
          isList ? 'w-[42%] md:w-full h-full md:h-80 border-r md:border-r-0' : 'h-40 md:h-80 w-full'
        } border-soft-oatmeal/10`}
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        
        {/* Quick Action Icons - Desktop only */}
        <div className="hidden md:flex absolute top-5 right-5 flex flex-col space-y-3 transform translate-x-14 group-hover:translate-x-0 transition-all duration-400">
          <button className="h-11 w-11 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-deep-espresso hover:text-red-500 transition-all">
            <FiHeart className="h-5 w-5" />
          </button>
        </div>

        {/* Badges - Show Top Choice on grid view */}
        {!isList && (
           <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-2">
             <span className="bg-golden-glow/90 backdrop-blur-md text-deep-espresso text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
               Top Choice
             </span>
           </div>
        )}
      </Link>

      <div className={`flex-1 p-3 md:p-7 flex flex-col justify-between overflow-hidden ${!isList ? 'space-y-1.5 md:space-y-5' : ''}`}>
        <div className="space-y-1.5 md:space-y-3">
          <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-warm-sand font-black">
            {product.category}
          </h4>
          
          <Link to={`/products/${product.id}`}>
            <h3 className={`${isList ? 'text-[11px] md:text-xl' : 'text-xs md:text-xl'} font-display font-bold text-deep-espresso line-clamp-2 leading-tight group-hover:text-warm-sand transition-colors duration-300`}>
              {product.name}
            </h3>
          </Link>

          {/* Delivery Badge (Only for list view or as needed) */}
          {isList && (
            <div className="flex items-center gap-2 pt-0.5 md:hidden">
              <div className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded flex items-center">
                <span className="mr-1">⚡</span> 4h Delivery
              </div>
            </div>
          )}
        </div>

        <div className={`flex ${isList ? 'flex-col md:flex-row md:items-end' : 'items-center'} justify-between gap-1 md:gap-2 md:pt-4`}>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 md:gap-2">
              <span className="text-sm md:text-2xl font-black text-deep-espresso tracking-tight">
                ${product.price}
              </span>
              {!isList && product.originalPrice > product.price && (
                <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 md:mt-1">
              <span className="text-[8px] md:text-[10px] text-deep-espresso/30 font-bold uppercase tracking-widest leading-none">
                Incl. GST
              </span>
              {isList && product.originalPrice > product.price && (
                <span className="text-[8px] md:text-xs text-gray-400 line-through font-medium leading-none">
                  MRP: ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className={`flex items-center ${isList ? 'justify-between md:justify-end' : 'justify-end'} gap-3 mt-1 md:mt-0`}>
             {quantity > 0 ? (
               <div className="flex items-center bg-soft-oatmeal/10 border border-soft-oatmeal/20 rounded-lg md:rounded-2xl overflow-hidden h-8 md:h-12 shadow-inner">
                 <button 
                   onClick={(e) => { e.preventDefault(); updateQuantity(product.id, quantity - 1); }}
                   className="px-1.5 min-[360px]:px-2 md:px-4 h-full hover:bg-soft-oatmeal/20 text-deep-espresso transition-colors text-xs md:text-xl font-bold"
                 >
                   −
                 </button>
                 <span className="px-1.5 min-[360px]:px-2 text-[9px] md:text-sm font-black text-deep-espresso w-5 min-[360px]:w-6 md:w-10 text-center">
                   {quantity}
                 </span>
                 <button 
                   onClick={(e) => { e.preventDefault(); updateQuantity(product.id, quantity + 1); }}
                   className="px-1.5 min-[360px]:px-2 md:px-4 h-full hover:bg-soft-oatmeal/20 text-deep-espresso transition-colors text-xs md:text-xl font-bold"
                 >
                   +
                 </button>
               </div>
             ) : (
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={(e) => { e.preventDefault(); addToCart(product); }}
                 className="h-8 md:h-12 px-4 min-[360px]:px-6 md:px-8 bg-deep-espresso text-white rounded-lg md:rounded-2xl font-bold text-[9px] md:text-sm hover:bg-warm-sand transition-colors shadow-lg"
               >
                 Add
               </motion.button>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
