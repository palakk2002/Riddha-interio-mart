import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import OfferBanner from '../components/OfferBanner';
import FavouriteCategories from '../components/FavouriteCategories';
import TopBrands from '../components/TopBrands';
import CategoryQuickAccess from '../components/CategoryQuickAccess';
import ExpressDeliveryBanner from '../components/ExpressDeliveryBanner';
import ProductCard from '../components/ProductCard';
import { products } from '../../models/products';
import Button from '../../../../views/shared/Button';
import { Link } from 'react-router-dom';

const HomePage = () => {
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
        <Banner />
      </section>

      {/* Offer Banner (Just below modern banner) */}
      <OfferBanner />

      {/* Favourite Categories Section */}
      <FavouriteCategories />

      {/* Top Brands Section */}
      <TopBrands />

      {/* Featured Products Section */}
      <section className="bg-soft-oatmeal/10 pt-4 pb-10 md:py-32 border-y border-soft-oatmeal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
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
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10"
          >
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
