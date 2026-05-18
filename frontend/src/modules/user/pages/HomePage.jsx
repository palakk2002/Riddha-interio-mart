import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import Banner from '../components/Banner';
import OfferBanner from '../components/OfferBanner';
import FavouriteCategories from '../components/FavouriteCategories';
import TopBrands from '../components/TopBrands';
import CategoryQuickAccess from '../components/CategoryQuickAccess';
import PromoGrid from '../components/PromoGrid';
import TrustBar from '../components/TrustBar';
import ExpressDeliveryBanner from '../components/ExpressDeliveryBanner';
import DynamicSections from '../components/DynamicSections';
import ProductCard from '../components/ProductCard';
import Button from '../../../shared/components/Button';
import { Link } from 'react-router-dom';
import api from '../../../shared/utils/api';
import ShopByCategory from '../components/ShopByCategory';
import { LuChevronRight } from 'react-icons/lu';
import WhatsAppFloat from '../components/WhatsAppFloat';

const SectionGrid = ({ products, loading, containerVariants }) => {
  const getProductImage = (p) =>
    p?.image ||
    p?.images?.[0] ||
    p?.thumbnail ||
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80';

  const toMoney = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return 'Rs. 0';
    return `Rs. ${number.toLocaleString('en-IN')}`;
  };

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
    >
      {loading ? (
        [1, 2, 3, 4, 5].map(i => (
          <div key={i} className="aspect-[4/5] bg-soft-oatmeal/10 rounded-3xl animate-pulse" />
        ))
      ) : (
        products.map((product, index) => {
          const productId = product._id || product.id;
          const displayPrice = product?.discountPrice != null && product.discountPrice !== ''
            ? product.discountPrice
            : product?.price;
          const originalPrice =
            product?.discountPrice != null && product.discountPrice !== ''
              ? product?.price
              : null;

          return (
            <Motion.div
              key={productId}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Link
                to={`/products/${productId}`}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-soft-oatmeal/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full"
              >
                <div className="relative aspect-[4/3.2] md:aspect-square overflow-hidden bg-soft-oatmeal/10">
                  <img
                    src={getProductImage(product)}
                    alt={product?.name || 'Product'}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-espresso/45 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col justify-between flex-1 p-3 md:p-4 space-y-2">
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-[13px] md:text-sm font-bold text-deep-espresso uppercase">
                      {product?.name}
                    </p>
                    <p className="line-clamp-1 text-[10px] font-black tracking-[0.1em] text-[var(--color-brand-teal)]">
                      {product?.category}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-base md:text-lg font-black text-black">
                        {toMoney(displayPrice)}
                      </p>
                      {originalPrice != null && Number(originalPrice) > Number(displayPrice) && (
                        <p className="text-[11px] text-warm-sand line-through">
                          {toMoney(originalPrice)}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] transition-all group-hover:bg-[var(--color-brand-teal)] group-hover:text-white">
                      <LuChevronRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            </Motion.div>
          );
        })
      )}
    </Motion.div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await api.get('/home-banner');
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setBanners(list);
      } catch (err) {
        console.error('Failed to fetch home banners:', err);
      }
    };

    fetchProducts();
    fetchBanners();
  }, []);

  const newArrivals = products.slice(0, 10);
  const bestSelling = products.slice(10, 20);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-0 py-0">
      {/* Banner Section (Now at Top) */}
      <section className="w-full">
        <Banner banners={banners} />
      </section>

      {/* Quick Access Categories */}
      <CategoryQuickAccess />

      {/* Promo Section (Benefits for Contractors, Designers, etc.) */}
      <PromoGrid />

      {/* New Season Arrivals Section */}
      <section className="bg-white pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-8 md:mb-12 gap-4 md:gap-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-brand-teal)]/5 border border-[var(--color-brand-teal)]/10 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--color-brand-teal)]">
              Curated Collection
            </div>
            <div className="max-w-3xl space-y-2 md:space-y-4">
              <h2 className="text-4xl md:text-7xl font-display font-black tracking-tight text-black uppercase">New Season Arrivals</h2>
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="h-[1.5px] w-12 bg-soft-oatmeal shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full border border-warm-sand/40" />
                <div className="h-[1.5px] w-12 bg-soft-oatmeal shadow-sm" />
              </div>
              <p className="text-gray-500 text-lg md:text-xl font-medium italic leading-relaxed">
                Freshly curated pieces from our latest sustainable collection.
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="rounded-full px-10 border-black/20 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Explore Collection <span className="ml-2">›</span>
              </Button>
            </Link>
          </Motion.div>

          <SectionGrid products={newArrivals} loading={loading} containerVariants={containerVariants} />
        </div>
      </section>

      {/* Best Selling Products Section */}
      <section className="bg-white pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-8 md:mb-12 gap-4 md:gap-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-brand-teal)]/5 border border-[var(--color-brand-teal)]/10 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--color-brand-teal)]">
              Top Picks
            </div>
            <div className="max-w-3xl space-y-2 md:space-y-4">
              <h2 className="text-4xl md:text-7xl font-display font-black tracking-tight text-black uppercase">Best Selling Products</h2>
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="h-[1.5px] w-12 bg-soft-oatmeal shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full border border-warm-sand/40" />
                <div className="h-[1.5px] w-12 bg-soft-oatmeal shadow-sm" />
              </div>
              <p className="text-gray-500 text-lg md:text-xl font-medium italic leading-relaxed">
                Most loved pieces by our community of designers and homeowners.
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="rounded-full px-10 border-black/20 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                View All Products <span className="ml-2">›</span>
              </Button>
            </Link>
          </Motion.div>

          <SectionGrid products={bestSelling} loading={loading} containerVariants={containerVariants} />
        </div>
      </section>

      {/* Visual Shop by Category Row */}
      <ShopByCategory />

      {/* Trust & Help Bar (Now below ShopByCategory) */}
      <TrustBar />

      {/* Offer Banner */}
      <OfferBanner />

      {/* Favourite Categories Section */}
      <FavouriteCategories />

      {/* Admin-Created Custom Sections */}
      <DynamicSections />

      {/* Top Brands Section */}
      <TopBrands />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloat />

    </div>
  );
};

export default HomePage;
