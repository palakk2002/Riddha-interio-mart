import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../data/CartContext';
import Button from '../../../shared/components/Button';

const ProductCard = ({ product, index = 0, variant = 'grid' }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const productId = product.id || product._id;
  const quantity = getItemQuantity(productId);
  const isList = variant === 'list';
  const isMinimal = variant === 'minimal';
  
  const displayPrice = product.discountPrice != null && product.discountPrice !== '' ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice != null && product.discountPrice !== '' ? product.price : (product.originalPrice || product.price);
  const displayPriceString = displayPrice != null ? Number(displayPrice).toLocaleString() : '0';
  const originalPriceString = originalPrice != null ? Number(originalPrice).toLocaleString() : '0';
  const rawImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : '');
  // Handle local file paths that won't work in browser
  const productImage = (rawImage && (rawImage.startsWith('C:') || rawImage.startsWith('/'))) 
    ? `https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80` // Placeholder for interior
    : (rawImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80');

  const discountPercent = originalPrice > displayPrice 
    ? Math.round((1 - displayPrice / originalPrice) * 100) 
    : 0;

  return (
    <div 
      className={`group bg-white ${isMinimal ? 'rounded-xl' : 'rounded-3xl border border-soft-oatmeal/10'} shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${
        isList ? 'flex flex-row md:flex-col' : 'flex flex-col'
      }`}
    >
      <Link 
        to={`/products/${productId}`} 
        className={`relative block overflow-hidden shrink-0 ${
          isList ? 'w-[45%] md:w-full aspect-square md:aspect-auto md:h-80' : 'aspect-square md:aspect-auto md:h-80 w-full'
        }`}
      >
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Heart Icon */}
        <div className="absolute top-4 right-4">
          <button className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all active:scale-90 border-none outline-none">
            <FiHeart className="h-5 w-5" />
          </button>
        </div>

        {/* Top Choice Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-pink-100/90 backdrop-blur-md text-[#8B2323] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
            Top Choice
          </span>
        </div>
      </Link>

      <div className="p-5 md:p-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg md:text-2xl font-bold text-[#8B2323] leading-tight">
            {product.name}
          </h3>
          <h4 className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-gray-400">
            {product.category}
          </h4>
        </div>

        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 flex-1 flex flex-col">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xl md:text-3xl font-black text-deep-espresso tracking-tighter whitespace-nowrap">
                ₹{displayPriceString}
              </span>
              {originalPrice > displayPrice && (
                <span className="text-xs md:text-sm text-gray-300 line-through font-medium whitespace-nowrap">
                  ₹{originalPriceString}
                </span>
              )}
            </div>
            <span className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Incl. GST
            </span>
          </div>

          <div className="flex items-center gap-1 bg-soft-oatmeal/5 rounded-2xl p-1 border border-soft-oatmeal/10 shadow-inner flex-shrink-0 max-w-[130px] md:max-w-[150px]">
            <button 
              onClick={(e) => { e.preventDefault(); updateQuantity(productId, quantity - 1); }}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-deep-espresso transition-all active:scale-90 rounded-2xl border border-transparent outline-none"
            >
              <FiMinus size={16} />
            </button>
            <span className="min-w-[24px] md:min-w-[32px] text-center text-xs md:text-lg font-black text-deep-espresso">
              {quantity}
            </span>
            <button 
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-deep-espresso transition-all active:scale-90 rounded-2xl border border-transparent outline-none"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
