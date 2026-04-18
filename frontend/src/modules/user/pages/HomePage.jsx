import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import Banner from '../components/Banner';
import OfferBanner from '../components/OfferBanner';
import FavouriteCategories from '../components/FavouriteCategories';
import TopBrands from '../components/TopBrands';
import CategoryQuickAccess from '../components/CategoryQuickAccess';
import ExpressDeliveryBanner from '../components/ExpressDeliveryBanner';
import DynamicSections from '../components/DynamicSections';
import ProductCard from '../components/ProductCard';
import Button from '../../../shared/components/Button';
import { Link } from 'react-router-dom';
import api from '../../../shared/utils/api';

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

  const featuredProducts = products.slice(0, 4);

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
    <div className="space-y-2 md:space-y-4 py-2 md:py-2">
      {/* Quick Access Categories */}
      <CategoryQuickAccess />

      {/* Express Delivery Banner */}
      <ExpressDeliveryBanner />

      {/* Banner Section */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <Banner banners={banners} />
      </section>

      {/* Offer Banner (Just below modern banner) */}
      <OfferBanner />

      {/* Favourite Categories Section */}
      <FavouriteCategories />

      {/* Admin-Created Custom Sections */}
      <DynamicSections />

      {/* Featured Products Section */}
      <section className="bg-soft-oatmeal/10 pt-4 pb-10 md:py-32 border-y border-soft-oatmeal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-16 gap-6 md:gap-8 text-center md:text-left"
          >
            <div className="max-w-2xl space-y-2 md:space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-header-red)] text-center md:text-left">Featured Highlights</h2>
              <p className="text-deep-espresso/50 text-base md:text-xl font-light leading-relaxed">
                Handpicked designs that bring character and sophistication to your living spaces.
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="rounded-full px-10 border-deep-espresso/20">Browse All Products</Button>
            </Link>
          </Motion.div>

          <Motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10"
          >
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-soft-oatmeal/10 rounded-3xl animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard key={product._id || product.id} product={product} index={index} />
              ))
            )}
          </Motion.div>
        </div>
      </section>

      {/* Top Brands Section */}
      <TopBrands />

    </div>
  );
};

export default HomePage;
