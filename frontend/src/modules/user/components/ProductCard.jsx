import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../data/CartContext';
import Button from '../../../shared/components/Button';

const ProductCard = ({ product, index = 0, variant = 'grid' }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const productId = product.id || product._id;
  const quantity = getItemQuantity(productId);
  const isList = variant === 'list';
  const isMinimal = variant === 'minimal';

  const originalPrice = Number(product.price || 0);

  // Safety: If discount price is invalid, treat as 0
  const parsedDiscount = Number(product.discountPrice || 0);
  let displayPrice = (parsedDiscount > 0 && parsedDiscount < originalPrice)
    ? parsedDiscount
    : originalPrice;

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
      className={`group bg-white ${isMinimal ? 'rounded-xl' : 'rounded-2xl md:rounded-3xl border border-soft-oatmeal/10'} shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${isList ? 'flex flex-row md:flex-col' : 'flex flex-col'
        }`}
    >
      <Link
        to={`/products/${productId}`}
        className={`relative block overflow-hidden shrink-0 ${isList ? 'w-[45%] md:w-full aspect-square md:aspect-auto md:h-40' : 'aspect-[4/3.2] md:aspect-video md:h-40 w-full'
          }`}
      >
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />


        {/* Top Choice Badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <span className="bg-[#F0F9F8]/90 backdrop-blur-md text-[#189D91] text-[9px] md:text-[11px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-lg uppercase tracking-wide shadow-sm">
            Top Choice
          </span>
        </div>
      </Link>

      <div className="flex-1 min-w-0 p-1.5 md:p-3 flex flex-col justify-between space-y-0.5 md:space-y-2">
        <Link to={`/products/${productId}`} className="space-y-0 md:space-y-1 block hover:opacity-80 transition-opacity">
          <h3 className="text-[13px] md:text-lg font-display font-semibold text-black leading-tight line-clamp-1">
            {product.name}
          </h3>
          <h4 className="text-[9px] md:text-xs font-medium text-gray-400">
            {product.category}
          </h4>
        </Link>

        <div className="flex items-center justify-between gap-2 md:gap-3 min-w-0">
          <Link to={`/products/${productId}`} className="min-w-0 flex-1 flex flex-col hover:opacity-80 transition-opacity">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 min-w-0">
              <span className="text-[15px] md:text-xl font-black text-black tracking-tight whitespace-nowrap">
                ₹{displayPriceString}
              </span>
              {originalPrice > displayPrice && (
                <span className="text-[10px] md:text-sm text-gray-300 line-through font-medium whitespace-nowrap">
                  ₹{originalPriceString}
                </span>
              )}
            </div>
            <span className="text-[8px] md:text-[11px] text-gray-400 font-medium">
              Incl. GST {product.unitValue && product.unit && product.unit !== 'piece' && (
                <span className="ml-1 text-[#189D91] font-bold">• {product.unitValue} {product.unit.toUpperCase()}</span>
              )}
            </span>
          </Link>

          {quantity === 0 ? (
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="bg-[#702D8B] text-white px-3 md:px-8 py-1.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-semibold shadow-md hover:bg-[#5d2574] transition-all active:scale-95 whitespace-nowrap"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-soft-oatmeal/5 rounded-xl md:rounded-2xl p-0.5 md:p-1 border border-soft-oatmeal/10 shadow-inner flex-shrink-0 max-w-[100px] md:max-w-[150px]">
              <button
                onClick={(e) => { e.preventDefault(); updateQuantity(productId, quantity - 1); }}
                className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-deep-espresso transition-all active:scale-90 rounded-lg md:rounded-2xl border border-transparent outline-none"
              >
                <FiMinus className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <span className="min-w-[14px] md:min-w-[32px] text-center text-[10px] md:text-lg font-semibold text-deep-espresso">
                {quantity}
              </span>
              <button
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-deep-espresso transition-all active:scale-90 rounded-lg md:rounded-2xl border border-transparent outline-none"
              >
                <FiPlus className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
