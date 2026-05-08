import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../data/CartContext';
import { FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiRotateCcw, FiPlus, FiMinus, FiShare2, FiCheck, FiChevronDown, FiChevronUp, FiPlay, FiStar, FiSettings, FiPackage, FiInfo, FiBox, FiCpu, FiExternalLink, FiMaximize, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import ProductCard from '../components/ProductCard';
import api from '../../../shared/utils/api';
import { getDeliveryEstimate } from '../../../shared/utils/delivery';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
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
      className="max-w-[1440px] mx-auto px-4 lg:px-8 py-2 md:py-8 pb-28 md:pb-8"
    >
      {/* Breadcrumbs (Desktop) */}
      <nav className="flex items-center gap-2 text-[12px] text-gray-500 mb-4 hidden md:flex">
        <Link to="/" className="hover:text-[#2874f0]">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/products" className="hover:text-[#2874f0]">{product.category}</Link>
        <FiChevronRight size={12} />
        <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
      </nav>



      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 bg-white p-2 md:p-4 rounded-sm shadow-sm border border-gray-100">

        {/* Left Column: Gallery & Action Buttons */}
        <div className="lg:w-[42%] lg:sticky lg:top-24 self-start">
          <div className="flex flex-col items-center lg:items-start gap-3">
            {/* Main Image View */}
            <div className="relative border border-gray-100 rounded-sm bg-white h-[380px] w-full md:h-auto md:aspect-square group cursor-crosshair overflow-hidden mx-auto max-w-[400px] md:max-w-none">
              {/* Share Icon (Mobile) */}
              <button className="absolute top-4 right-4 z-10 md:hidden p-2 text-gray-600">
                <FiShare2 size={24} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full p-4 md:p-6 flex items-center justify-center"
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
                      className="h-full w-full object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Dots Indicator (Mobile) */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                {allMedia.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${activeMediaIndex === i ? 'w-4 bg-[#B12704]' : 'w-2 bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails Row (Now below main image) */}
            <div className="hidden lg:flex flex-row justify-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full">
              {allMedia.map((media, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveMediaIndex(i)}
                  className={`h-16 w-16 shrink-0 border-2 rounded-sm overflow-hidden p-0.5 transition-all ${activeMediaIndex === i ? 'border-[#2874f0]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {media?.type === 'video' ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                      <FiPlay className="text-[#2874f0]" size={16} />
                    </div>
                  ) : (
                    <img src={media} className="h-full w-full object-contain" alt="" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex gap-2 mt-4">
            {currentQuantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-[#E91E8B] text-white font-bold rounded-sm shadow-md hover:bg-[#d0197c] transition-colors flex items-center justify-center gap-2 uppercase"
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>
            ) : (
              <div className="flex-1 h-14 flex items-center border-2 border-[#E91E8B] rounded-sm overflow-hidden">
                <button 
                  onClick={() => updateQuantity(product._id || product.id, Math.max(0, currentQuantity - 1))}
                  className="flex-1 h-full flex items-center justify-center bg-white text-[#E91E8B] hover:bg-[#E91E8B]/5 transition-colors"
                >
                  <FiMinus size={18} />
                </button>
                <div className="w-12 h-full flex items-center justify-center font-bold text-[#E91E8B] text-xl border-x border-[#E91E8B]/20">
                  {currentQuantity}
                </div>
                <button 
                  onClick={() => updateQuantity(product._id || product.id, currentQuantity + 1)}
                  className="flex-1 h-full flex items-center justify-center bg-white text-[#E91E8B] hover:bg-[#E91E8B]/5 transition-colors"
                >
                  <FiPlus size={18} />
                </button>
              </div>
            )}
            <Link
              to="/cart"
              onClick={() => {
                if (currentQuantity === 0) handleAddToCart();
              }}
              className="flex-1 h-14 bg-[#702D8B] text-white font-bold rounded-sm shadow-md hover:bg-[#602678] transition-colors flex items-center justify-center gap-2 uppercase"
            >
              <FiPlay size={18} />
              Buy Now
            </Link>
          </div>

          {/* Mobile Thumbnails (Horizontal) */}
          <div className="flex lg:hidden justify-center items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {allMedia.map((media, i) => (
              <button
                key={i}
                onClick={() => setActiveMediaIndex(i)}
                className={`h-12 w-12 border-2 rounded transition-all shrink-0 ${activeMediaIndex === i ? 'border-[#2874f0]' : 'border-gray-200'}`}
              >
                {media?.type === 'video' ? (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50">
                    <FiPlay className="text-[#2874f0]" size={14} />
                  </div>
                ) : (
                  <img src={media} className="h-full w-full object-contain p-0.5" alt="" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Info */}
        <div className="lg:w-[60%] space-y-3">
          <div className="space-y-1.5 px-1">
            <div className="md:hidden text-[#007185] font-medium text-[15px]">
              Brand: {typeof product.brand === 'object' ? product.brand.name : (product.brand || 'Riddha Mart')}
            </div>
            <h1 className="text-lg md:text-xl font-medium text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#388e3c] text-white px-1.5 py-0.5 rounded-sm text-[12px] font-bold">
                4.7 <FaStar className="ml-1 w-2 h-2" />
              </div>
              <span className="text-sm font-medium text-gray-500">212 Ratings & 45 Reviews</span>
            </div>
          </div>

          <div className="md:hidden border-b border-gray-100 pb-2" />

          <div className="space-y-1 px-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-[#B12704] align-top mt-1">₹</span>
              <span className="text-3xl md:text-3xl font-bold text-gray-900 leading-none">{product.price}</span>
              <span className="text-xs text-gray-500 font-medium">incl. GST</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              <span className="text-sm font-bold text-green-700">
                ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
              </span>
            </div>
            <p className="text-[12px] text-gray-500 font-medium md:block hidden">Free delivery</p>
          </div>

          {/* Available Offers (Desktop Only) */}
          <div className="hidden md:block space-y-2 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-bold text-gray-900">Available offers</h4>
            <div className="space-y-2">
              {[
                "Bank Offer 10% off on HDFC Bank Credit Card, up to ₹1,500 on orders of ₹5,000 and above",
                "Bank Offer 5% Cashback on Flipkart Axis Bank Card",
                "Special Price Get extra 15% off (price inclusive of cashback/coupon)"
              ].map((offer, i) => (
                <div key={i} className="flex items-start gap-2 text-xs md:text-sm">
                  <FiCheck className="text-[#388e3c] mt-0.5 shrink-0" />
                  <p><span className="font-bold">{offer.split(' ')[0]} {offer.split(' ')[1]}</span> {offer.split(' ').slice(2).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>



          {/* Highlights & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase">Highlights</h4>
              <ul className="space-y-2 list-disc list-inside text-sm text-gray-800">
                {product.features.slice(0, 5).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase">Services</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                <li className="flex items-center gap-2"><FiRotateCcw className="text-[#2874f0]" /> 10 Days Replacement Policy</li>
                <li className="flex items-center gap-2"><FiTruck className="text-[#2874f0]" /> Cash on Delivery available</li>
              </ul>
            </div>
          </div>

          {/* Seller Info (Desktop Only) */}
          <div className="hidden md:flex items-start gap-12 py-6 border-t border-gray-100 mt-6">
            <div className="text-sm font-bold text-gray-500 uppercase">Seller</div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#2874f0] hover:underline cursor-pointer">Verified Riddha Seller</span>
                <div className="bg-[#2874f0] text-white text-[10px] px-1 rounded-sm">4.8 ★</div>
              </div>
              <ul className="text-[12px] text-gray-500 list-disc list-inside">
                <li>7 Days Replacement Policy</li>
                <li>GST invoice available</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-6">
            {product.description}
          </p>
        </div>
      </div>

      {/* Features Tabs */}
      <motion.section variants={fadeInUp} className="mb-6 md:mb-10">
        <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-deep-espresso">Key Features</h3>
          <div className="h-px flex-1 bg-soft-oatmeal/20" />
        </div>
        <div className="space-y-1.5 px-2 md:px-0">
          {product.features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-center space-x-3 md:space-x-4 py-2.5 md:py-3 px-4 md:px-6 bg-soft-oatmeal/5 border-b border-soft-oatmeal/10 last:border-0 first:rounded-t-xl last:rounded-b-xl md:first:rounded-t-lg md:last:rounded-b-lg"
            >
              <div className="h-6 w-6 md:h-8 md:w-8 bg-warm-sand/10 rounded-full flex items-center justify-center text-warm-sand flex-shrink-0">
                <FiCheck className="h-3 w-3 md:h-4 md:w-4" />
              </div>
              <span className="text-deep-espresso/80 font-bold text-base md:text-lg leading-snug">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Specification Section */}
      <motion.section variants={fadeInUp} className="mb-8 md:mb-10">
        <SpecificationSection specifications={product.specifications} />
      </motion.section>

      {/* Material & Durability Details (Enhancement) */}
      <motion.section variants={fadeInUp} className="mb-8 md:mb-10">
        <MaterialDetails product={product} />
      </motion.section>

      {/* Vendor Details (Enhancement) */}
      <motion.section variants={fadeInUp} className="mb-8 md:mb-10">
        <VendorInfo product={product} />
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
          <motion.section variants={fadeInUp} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-16 gap-2 md:gap-4">
              <h2 className="text-xl md:text-4xl font-bold tracking-tight text-deep-espresso">You May Also Like</h2>
              <Link to="/products" className="text-[#189D91] font-black uppercase tracking-widest text-[9px] md:text-xs hover:text-deep-espresso transition-all group">
                See all products <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-10 pb-4">
                {relatedProducts.map((p, index) => (
                  <div key={p._id || p.id} className="w-[160px] md:w-auto flex-shrink-0">
                    <ProductCard product={p} index={index} variant="minimal" />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Mobile Action Bar (Fixed at the very bottom) - Brand Theme */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 px-4 py-3 pb-6 flex items-center justify-between gap-3 shadow-[0_-12px_30px_rgba(0,0,0,0.1)]">
        {/* Left Side: Add to Cart or Quantity Selector */}
        <div className="flex-1 h-[46px]">
          {currentQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full h-full bg-[#E91E8B] text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#E91E8B]/20 active:bg-[#d0197c]"
            >
              <FiShoppingCart size={16} />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center border-2 border-[#E91E8B] rounded-xl overflow-hidden h-full w-full">
              <button 
                onClick={() => updateQuantity(product._id || product.id, Math.max(0, currentQuantity - 1))}
                className="flex-1 h-full flex items-center justify-center bg-white text-[#E91E8B] active:bg-[#E91E8B]/10"
              >
                <FiMinus size={14} />
              </button>
              <div className="w-8 h-full flex items-center justify-center font-bold text-[#E91E8B] text-base">
                {currentQuantity}
              </div>
              <button 
                onClick={() => updateQuantity(product._id || product.id, currentQuantity + 1)}
                className="flex-1 h-full flex items-center justify-center bg-white text-[#E91E8B] active:bg-[#E91E8B]/10"
              >
                <FiPlus size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Buy Now Button */}
        <Link
          to="/cart"
          className="flex-1 h-[46px]"
          onClick={() => {
            if (currentQuantity === 0) handleAddToCart();
          }}
        >
          <button className="w-full h-full bg-[#702D8B] text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#702D8B]/20 active:bg-[#602678]">
            <FiPlay size={16} />
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
    <div className="border border-soft-oatmeal/20 rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 bg-soft-oatmeal/5 hover:bg-soft-oatmeal/10 transition-colors"
      >
        <h3 className="text-xl md:text-2xl font-black text-deep-espresso tracking-tight">Specification</h3>
        {isOpen ? (
          <FiChevronUp className="h-6 w-6 text-warm-sand" />
        ) : (
          <FiChevronDown className="h-6 w-6 text-warm-sand" />
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
                  className={`flex flex-row py-4 px-6 md:px-8 text-sm md:text-base ${index % 2 === 0 ? 'bg-white' : 'bg-soft-oatmeal/5'}`}
                >
                  <div className="w-1/3 md:w-1/4 font-bold text-deep-espresso/40 uppercase tracking-[0.1em] text-[10px] md:text-xs">
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
    <div className="border border-soft-oatmeal/20 rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 bg-soft-oatmeal/5 hover:bg-soft-oatmeal/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          <FiBox className="h-6 w-6 text-warm-sand" />
          <h3 className="text-xl md:text-2xl font-black text-deep-espresso tracking-tight">Material & Build</h3>
        </div>
        {isOpen ? <FiChevronUp className="h-6 w-6 text-warm-sand" /> : <FiChevronDown className="h-6 w-6 text-warm-sand" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-soft-oatmeal/10"
          >
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.material && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Primary Material</p>
                  <p className="text-base font-bold text-deep-espresso">{product.material}</p>
                </div>
              )}
              {product.thickness && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Thickness</p>
                  <p className="text-base font-bold text-deep-espresso">{product.thickness}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Durability</p>
                <p className="text-base font-bold text-deep-espresso">High Performance</p>
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
    <div className="border border-soft-oatmeal/20 rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 bg-soft-oatmeal/5 hover:bg-soft-oatmeal/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          <FiPackage className="h-6 w-6 text-warm-sand" />
          <h3 className="text-xl md:text-2xl font-black text-deep-espresso tracking-tight">Vendor Information</h3>
        </div>
        {isOpen ? <FiChevronUp className="h-6 w-6 text-warm-sand" /> : <FiChevronDown className="h-6 w-6 text-warm-sand" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-soft-oatmeal/10"
          >
            <div className="p-6 md:p-8 flex items-center gap-6">
              <div className="h-16 w-16 bg-soft-oatmeal/20 rounded-2xl flex items-center justify-center text-warm-sand">
                <FiPackage size={32} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-deep-espresso">{vendorName}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest">
                    <FiCheck size={12} />
                    Verified Seller
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-warm-sand uppercase tracking-widest">
                    <FiStar size={12} className="fill-current" />
                    4.9 Rating
                  </div>
                </div>
              </div>
              <button className="text-[10px] font-black text-[#189D91] uppercase tracking-[0.2em] hover:underline flex items-center gap-1">
                View Shop <FiExternalLink size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsPage;
