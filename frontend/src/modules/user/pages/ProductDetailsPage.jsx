import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../data/CartContext';
import { FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiRotateCcw, FiPlus, FiMinus, FiShare2, FiCheck, FiChevronDown, FiChevronUp, FiPlay, FiStar, FiSettings, FiPackage, FiInfo, FiBox, FiCpu, FiExternalLink, FiMaximize, FiMapPin, FiChevronRight, FiHeart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import { useWishlist } from '../data/WishlistContext';
import api from '../../../shared/utils/api';
import { getDeliveryEstimate } from '../../../shared/utils/delivery';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [pincode, setPincode] = useState(localStorage.getItem('userPincode') || '452018');
  const [showARModal, setShowARModal] = useState(false);
  const [show360, setShow360] = useState(false);

  useEffect(() => {
    const handlePincodeUpdate = () => {
      const savedPincode = localStorage.getItem('userPincode');
      if (savedPincode) {
        setPincode(savedPincode === 'default' ? '452018' : savedPincode);
      }
    };
    window.addEventListener('pincodeUpdated', handlePincodeUpdate);
    return () => window.removeEventListener('pincodeUpdated', handlePincodeUpdate);
  }, []);

  const allMedia = product ? [
    ...(product.images || []),
    ...(product.videoUrl ? [{ type: 'video', url: product.videoUrl }] : [])
  ] : [];

  const currentQuantity = getItemQuantity(product?._id || product?.id);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const found = res.data.data;

        // Normalize fields if they are missing
        if (!found.colors) found.colors = ["#FFFFFF"];
        if (!found.sizes) found.sizes = ["Standard"];
        if (!found.features) found.features = ["Premium Quality", "Authentic Sourcing", "Designer Approved"];
        if (!found.originalPrice) found.originalPrice = found.price * 1.2; // Fallback estimate
        if (!found.specifications) {
          found.specifications = {
            "Brand": found.brand || "Riddha Mart",
            "Category": found.category,
            "Material": found.material || "Premium",
            "Dimensions": found.dimensions || "N/A",
            "Thickness": found.thickness || "N/A"
          };
        }

        setProduct(found);
        setSelectedColor(found.colors[0]);
        setSelectedSize(found.sizes[0]);

        // Fetch related products (optional: could also filter all products)
        const allRes = await api.get('/products');
        setRelatedProducts(allRes.data.data.filter(p => p.category === found.category && (p._id || p.id) !== id).slice(0, 4));

      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="py-32 text-center text-warm-sand font-display font-medium text-2xl flex flex-col items-center gap-4">
    <div className="h-12 w-12 border-4 border-warm-sand/20 border-t-warm-sand rounded-full animate-spin"></div>
    Crafting details...
  </div>;
  if (!product) return <div className="py-32 text-center text-warm-sand font-display font-medium text-2xl">Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="max-w-[1200px] mx-auto px-0 md:px-4 lg:px-6 py-0 md:py-6 pb-24 md:pb-6 bg-white md:bg-transparent"
    >
      {/* Breadcrumbs (Desktop) */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 hidden md:flex font-medium">
        <Link to="/" className="hover:text-[#004D40] transition-colors">Home</Link>
        <FiChevronRight size={14} className="text-gray-400" />
        <Link to="/products" className="hover:text-[#004D40] transition-colors">Wall Solutions</Link>
        <FiChevronRight size={14} className="text-gray-400" />
        <Link to="/products" className="hover:text-[#004D40] transition-colors">{product.category || 'Wall Panels'}</Link>
        <FiChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[250px]">{product.name}</span>
      </nav>

      <div className="flex flex-col bg-white p-0 md:p-6 rounded-none md:rounded-2xl shadow-none md:shadow-sm border-none md:border border-gray-100/80">
        
        {/* Gallery and Details columns */}
        <div className="flex flex-col lg:flex-row gap-0 md:gap-6 lg:gap-10 w-full">
          {/* Left Column: Gallery & Action Buttons */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 self-start flex flex-col gap-0 md:gap-4 w-full">
            {/* Main Image View */}
            <div className="relative border-none md:border border-gray-100 rounded-none md:rounded-2xl bg-gray-50 h-[400px] w-full md:h-auto md:aspect-square group cursor-crosshair overflow-hidden mx-auto shadow-none md:shadow-sm">
              
              {/* Mobile Back Button */}
              <div className="absolute top-4 left-4 z-10 md:hidden">
                <button 
                  onClick={() => window.history.back()}
                  className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <FiArrowLeft size={18} className="text-gray-800" />
                </button>
              </div>

              {/* Wishlist Button (Circle at top-right) */}
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="p-3 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-100"
                >
                  <FiHeart 
                    size={20} 
                    className={`transition-colors duration-300 ${isInWishlist(product?._id || product?.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                  />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full flex items-center justify-center p-0"
                >
                  {allMedia[activeMediaIndex]?.type === 'video' ? (
                    <iframe
                      src={allMedia[activeMediaIndex].url.includes('youtube.com')
                        ? allMedia[activeMediaIndex].url.replace('watch?v=', 'embed/').split('&')[0]
                        : allMedia[activeMediaIndex].url.replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={allMedia[activeMediaIndex] || (product.images && product.images[0])}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Dots Indicator (Mobile) */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                {allMedia.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeMediaIndex === i ? 'w-4 bg-[#004D40]' : 'w-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="hidden md:flex flex-row justify-start items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full">
              {allMedia.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMediaIndex(i)}
                  onMouseEnter={() => setActiveMediaIndex(i)}
                  className={`h-[60px] w-[60px] shrink-0 border-2 rounded-xl overflow-hidden p-0.5 transition-all duration-300 ${
                    activeMediaIndex === i 
                      ? 'border-[#004D40] scale-95 shadow-sm' 
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {media?.type === 'video' ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                      <FiPlay className="text-[#004D40]" size={20} />
                    </div>
                  ) : (
                    <img src={media} className="h-full w-full object-cover rounded-xl" alt="" />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden justify-start items-center gap-3 py-4 px-5 overflow-x-auto no-scrollbar border-b border-gray-100">
              {allMedia.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMediaIndex(i)}
                  className={`h-[56px] w-[56px] rounded-[14px] transition-all shrink-0 overflow-hidden ${
                    activeMediaIndex === i ? 'ring-2 ring-offset-1 ring-gray-800' : 'border border-gray-200'
                  }`}
                >
                  {media?.type === 'video' ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                      <FiPlay className="text-gray-800" size={14} />
                    </div>
                  ) : (
                    <img src={media} className="h-full w-full object-cover" alt="" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Purchase options */}
          <div className="lg:w-[60%] flex flex-col self-start px-5 md:px-0 pt-4 md:pt-0 pb-6 md:pb-0">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-[22px] md:text-[26px] font-bold md:font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-gray-400 mt-1 hidden md:block">
                {product.subtitle || 'Natural Teak Veneer'}
              </p>
            </div>

            {/* Mobile Pricing & Rating */}
            <div className="flex md:hidden items-center gap-3 mt-1.5 text-[15px]">
              <span className="font-semibold text-gray-500">Price- <span className="font-bold text-gray-900">₹{product.price?.toLocaleString('en-IN') || '134,999'}</span></span>
              <span className="text-amber-400 text-sm">⭐</span>
              <span className="font-semibold text-gray-600 text-sm">{product.averageRating || '4.7'} (reviews)</span>
            </div>

            {/* Desktop Rating, Reviews, Bestseller Badge */}
            <div className="hidden md:flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-400">
                  <FaStar className="w-3.5 h-3.5 fill-current" />
                  <FaStar className="w-3.5 h-3.5 fill-current" />
                  <FaStar className="w-3.5 h-3.5 fill-current" />
                  <FaStar className="w-3.5 h-3.5 fill-current text-gray-200" />
                  <FaStar className="w-3.5 h-3.5 fill-current text-gray-200" />
                </div>
                <span className="text-sm font-semibold text-gray-500 ml-1">
                  ({product.totalReviews || 120} Reviews)
                </span>
              </div>
              <span className="bg-[#D81B60] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Bestseller
              </span>
            </div>

            {/* Desktop Pricing Row */}
            <div className="hidden md:flex items-center gap-3 mt-4">
              <div className="flex items-baseline">
                <span className="text-xl md:text-2xl font-extrabold text-gray-900">₹{product.price?.toLocaleString('en-IN') || '2,890'}</span>
                <span className="text-xs font-medium text-gray-400 ml-1">/{product.unit || 'sq.ft.'}</span>
              </div>
              <span className="text-sm text-gray-300 line-through font-semibold">
                ₹{product.originalPrice?.toLocaleString('en-IN') || '3,999'}
              </span>
              <span className="bg-pink-50 border border-pink-100 text-[#D81B60] text-[10px] md:text-[11px] font-extrabold px-2 py-0.5 rounded-md">
                {Math.round((1 - (product.price || 2890) / (product.originalPrice || 3999)) * 100)}% OFF
              </span>
            </div>

            {/* Description */}
            <div className="mt-5 md:mt-3">
              <h3 className="md:hidden font-bold text-gray-900 text-[15px] mb-1.5">Description</h3>
              <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed font-medium md:font-normal">
                {product.description || 'Premium natural teak veneer wall panel with high-quality finish. Perfect for luxury interiors.'}
              </p>
            </div>

            {/* Desktop Clean Specifications Table */}
            <div className="hidden md:grid grid-cols-1 gap-2 mt-4 border-t border-b border-gray-100 py-4 max-w-lg">
              {[
                { label: 'Material', value: product.material || 'Natural Teak Veneer' },
                { label: 'Finish', value: product.finish || 'Matte' },
                { label: 'Thickness', value: product.thickness || '12 mm' },
                { label: 'Size', value: selectedSize || '8ft x 4ft' },
                { label: 'SKU', value: product.sku || 'VWP-TEAK-001' },
                { label: 'Availability', value: product.stock > 0 ? `In Stock (${product.stock} sq.ft.)` : 'In Stock (200+ sq.ft.)', isAvailability: true }
              ].map((spec, i) => (
                <div key={i} className="flex items-center text-[14px]">
                  <div className="w-36 text-gray-400 font-medium shrink-0">{spec.label}</div>
                  {spec.isAvailability ? (
                    <div className="flex-1">
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-2.5 py-0.5 rounded-md">
                        {spec.value}
                      </span>
                    </div>
                  ) : (
                    <div className="flex-1 text-gray-800 font-semibold">{spec.value}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Select Size Options Removed as per request */}

            {/* Quantity Counter (Desktop Only) */}
            <div className="hidden md:block mt-4">
              <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Quantity</h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-9 w-24 shadow-sm bg-white">
                  <button 
                    onClick={() => updateQuantity(product._id || product.id, Math.max(0, currentQuantity - 1))}
                    className="w-8 h-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-800 text-xs">
                    {currentQuantity || 1}
                  </div>
                  <button 
                    onClick={() => updateQuantity(product._id || product.id, (currentQuantity || 1) + 1)}
                    className="w-8 h-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 font-medium ml-1">
                  (Min. 10 sq.ft.)
                </span>
              </div>
            </div>

            {/* Mobile Specifications */}
            <div className="mt-6 md:hidden">
              <h3 className="font-bold text-gray-900 text-[15px] mb-3">Specifications</h3>
              <div className="grid grid-cols-[1fr_2fr] gap-y-2.5 text-[13px]">
                 <div className="text-gray-500 font-medium">Size</div><div className="font-bold text-gray-800">Beds</div>
                 <div className="text-gray-500 font-medium">Color</div><div className="font-bold text-gray-800">Premium</div>
                 <div className="text-gray-500 font-medium">Specification</div><div className="font-bold text-gray-800">Relax</div>
              </div>
            </div>

            {/* Mobile Customer Photos */}
            <div className="mt-6 md:hidden mb-4">
              <h3 className="font-bold text-gray-900 text-[15px] mb-3">Customer Photos</h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {[...allMedia, ...allMedia].slice(0, 3).map((media, idx) => (
                  <img key={idx} src={media?.type === 'video' ? (product?.images?.[0] || '') : media} className="w-[88px] h-[88px] rounded-[14px] object-cover bg-gray-100 flex-shrink-0 border border-gray-100" alt="Customer Photo" />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex gap-3 mt-6 max-w-lg">
              {currentQuantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-10 bg-[#004D40] text-white font-bold rounded-xl shadow-sm hover:bg-[#003d33] transition-colors flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider"
                >
                  <FiShoppingCart size={14} />
                  Add to Cart
                </button>
              ) : (
                <div className="flex-1 h-10 flex items-center border-2 border-[#004D40] rounded-xl overflow-hidden bg-white">
                  <button 
                    onClick={() => updateQuantity(product._id || product.id, Math.max(0, currentQuantity - 1))}
                    className="w-10 h-full flex items-center justify-center bg-white text-[#004D40] hover:bg-[#004D40]/5 transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center font-bold text-[#004D40] text-xs border-x border-[#004D40]/10">
                    {currentQuantity} Added
                  </div>
                  <button 
                    onClick={() => updateQuantity(product._id || product.id, currentQuantity + 1)}
                    className="w-10 h-full flex items-center justify-center bg-white text-[#004D40] hover:bg-[#004D40]/5 transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              )}
              <Link
                to="/cart"
                onClick={() => {
                  if (currentQuantity === 0) handleAddToCart();
                }}
                className="flex-1 h-10"
              >
                <button className="w-full h-full bg-[#D81B60] hover:bg-[#c2185b] text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider">
                  <FiPlay size={14} />
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Trust Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-gray-100 w-full">
          {[
            { icon: FiTruck, title: 'Free Delivery', desc: 'Pan India' },
            { icon: FiShield, title: 'Secure Payment', desc: '100% Protected' },
            { icon: FiRotateCcw, title: 'Easy Returns', desc: '7 Days Return' },
            { icon: FiStar, title: 'Expert Support', desc: '24/7 Assistance' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100/50 shadow-sm/50">
              <div className="w-9 h-9 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm text-[#004D40] shrink-0">
                <item.icon size={16} className="stroke-[2px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] md:text-xs font-bold text-gray-800 leading-tight">{item.title}</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 font-semibold mt-0.5 leading-none">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Tabs */}
      <motion.section variants={fadeInUp} className="hidden md:block mb-4 md:mb-6 mt-6 md:mt-8">
        <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-bold text-deep-espresso">Key Features</h3>
          <div className="h-px flex-1 bg-soft-oatmeal/20" />
        </div>
        <div className="space-y-1 px-2 md:px-0">
          {product.features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-center space-x-2 md:space-x-3 py-1.5 md:py-2 px-3 md:px-4 bg-soft-oatmeal/5 border-b border-soft-oatmeal/10 last:border-0 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="h-5 w-5 md:h-6 md:w-6 bg-warm-sand/10 rounded-full flex items-center justify-center text-warm-sand flex-shrink-0">
                <FiCheck className="h-3 w-3 md:h-4 md:w-4" />
              </div>
              <span className="text-deep-espresso/80 font-bold text-sm md:text-base leading-snug">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Specification Section */}
      <motion.section variants={fadeInUp} className="hidden md:block mb-6 md:mb-8">
        <SpecificationSection specifications={product.specifications} />
      </motion.section>

      {/* Material & Durability Details (Enhancement) */}
      <motion.section variants={fadeInUp} className="hidden md:block mb-6 md:mb-8">
        <MaterialDetails product={product} />
      </motion.section>

      {/* Vendor Details (Enhancement) */}
      <motion.section variants={fadeInUp} className="hidden md:block mb-6 md:mb-8">
        <VendorInfo product={product} />
      </motion.section>

      {/* Reviews & Ratings Section */}
      <motion.section variants={fadeInUp} className="hidden md:block mb-6 md:mb-8">
        <ReviewSection 
          productId={product._id || product.id} 
          averageRating={product.averageRating || 0} 
          totalReviews={product.totalReviews || 0} 
        />
      </motion.section>

      {/* AR Modal Placeholder */}
      <AnimatePresence>
        {showARModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowARModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-warm-sand/10 rounded-full flex items-center justify-center mx-auto mb-6 text-warm-sand">
                <FiMaximize size={40} />
              </div>
              <h3 className="text-2xl font-display font-semibold text-deep-espresso mb-3">AR Mode Coming Soon</h3>
              <p className="text-deep-espresso/60 mb-8 leading-relaxed">We're building an immersive experience so you can see this piece in your room using augmented reality.</p>
              <Button onClick={() => setShowARModal(false)} className="w-full h-14 rounded-2xl">Got It</Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suggested Products */}
      <AnimatePresence>
        {relatedProducts.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-8 gap-2 md:gap-3">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-deep-espresso">You May Also Like</h2>
              <Link to="/products" className="text-[#189D91] font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-deep-espresso transition-all group">
                See all products <span className="ml-1 group-hover:translate-x-1 inline-block transition-transform">→</span>
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-6 pb-4">
                {relatedProducts.map((p, index) => (
                  <div key={p._id || p.id} className="w-[140px] md:w-auto flex-shrink-0">
                    <ProductCard product={p} index={index} variant="minimal" />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Mobile Action Bar (Fixed at the very bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white px-5 py-3 pb-6 flex items-center justify-between gap-4 border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {/* Left Side: Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="flex-1 h-[52px] bg-[#EE4B76] hover:bg-[#d84067] text-white rounded-full font-bold text-[15px] shadow-sm transition-all active:scale-[0.98]"
        >
          {currentQuantity > 0 ? "Add More" : "Add to Cart"}
        </button>

        {/* Right Side: Buy Now */}
        <Link
          to="/cart"
          className="flex-1 h-[52px]"
          onClick={() => {
            if (currentQuantity === 0) handleAddToCart();
          }}
        >
          <button className="w-full h-full bg-[#8E44AD] hover:bg-[#7d3c98] text-white rounded-full font-bold text-[15px] shadow-sm transition-all active:scale-[0.98]">
            Buy Now
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

const SpecificationSection = ({ specifications }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!specifications) return null;

  return (
    <div className="border border-soft-oatmeal/20 rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 bg-soft-oatmeal/5 hover:bg-soft-oatmeal/10 transition-colors"
      >
        <h3 className="text-lg md:text-xl font-black text-deep-espresso tracking-tight">Specification</h3>
        {isOpen ? (
          <FiChevronUp className="h-5 w-5 text-warm-sand" />
        ) : (
          <FiChevronDown className="h-5 w-5 text-warm-sand" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-soft-oatmeal/10">
              {Object.entries(specifications).map(([key, value], index) => (
                <div
                  key={key}
                  className={`flex flex-row py-2 md:py-3 px-4 md:px-5 text-xs md:text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-soft-oatmeal/5'}`}
                >
                  <div className="w-1/3 md:w-1/4 font-bold text-deep-espresso/40 uppercase tracking-[0.1em] text-[10px] md:text-[11px]">
                    {key}
                  </div>
                  <div className="flex-1 font-bold text-deep-espresso/80">
                    {typeof value === 'object' && value !== null ? (value.name || JSON.stringify(value)) : value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ARViewButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl text-deep-espresso shadow-xl hover:scale-105 active:scale-95 transition-all border border-soft-oatmeal/20"
  >
    <FiMaximize className="h-4 w-4 text-[#189D91]" />
    <span className="text-[10px] font-black uppercase tracking-widest">See in Room</span>
  </button>
);

const MaterialDetails = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!product.material && !product.thickness) return null;

  return (
    <div className="border border-soft-oatmeal/20 rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 bg-soft-oatmeal/5 hover:bg-soft-oatmeal/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FiBox className="h-5 w-5 text-warm-sand" />
          <h3 className="text-lg md:text-xl font-black text-deep-espresso tracking-tight">Material & Build</h3>
        </div>
        {isOpen ? <FiChevronUp className="h-5 w-5 text-warm-sand" /> : <FiChevronDown className="h-5 w-5 text-warm-sand" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-soft-oatmeal/10"
          >
            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.material && (
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-black text-warm-sand uppercase tracking-widest">Primary Material</p>
                  <p className="text-sm md:text-base font-bold text-deep-espresso">{product.material}</p>
                </div>
              )}
              {product.thickness && (
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-black text-warm-sand uppercase tracking-widest">Thickness</p>
                  <p className="text-sm md:text-base font-bold text-deep-espresso">{product.thickness}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] font-black text-warm-sand uppercase tracking-widest">Durability</p>
                <p className="text-sm md:text-base font-bold text-deep-espresso">High Performance</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DeliveryInfo = ({ pincode }) => {
  const estimate = getDeliveryEstimate(pincode);
  return (
    <span className="inline-flex items-center gap-1 text-[#189D91] font-bold">
      <FiTruck size={12} />
      Delivering in {estimate.time}
    </span>
  );
};

const VendorInfo = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const vendorName = product.brand?.name || product.vendorName || "Verified Vendor";

  return (
    <div className="border border-soft-oatmeal/20 rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 bg-soft-oatmeal/5 hover:bg-soft-oatmeal/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FiPackage className="h-5 w-5 text-warm-sand" />
          <h3 className="text-lg md:text-xl font-black text-deep-espresso tracking-tight">Vendor Information</h3>
        </div>
        {isOpen ? <FiChevronUp className="h-5 w-5 text-warm-sand" /> : <FiChevronDown className="h-5 w-5 text-warm-sand" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-soft-oatmeal/10"
          >
            <div className="p-4 md:p-5 flex items-center gap-4">
              <div className="h-12 w-12 bg-soft-oatmeal/20 rounded-xl flex items-center justify-center text-warm-sand">
                <FiPackage size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm md:text-base font-bold text-deep-espresso">{vendorName}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-green-600 uppercase tracking-widest">
                    <FiCheck size={10} />
                    Verified Seller
                  </div>
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    <FiStar size={10} className="fill-current" />
                    4.9 Rating
                  </div>
                </div>
              </div>
              <button className="text-[9px] md:text-[10px] font-black text-[#189D91] uppercase tracking-[0.2em] hover:underline flex items-center gap-1">
                View Shop <FiExternalLink size={10} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsPage;
