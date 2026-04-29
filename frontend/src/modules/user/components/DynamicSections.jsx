import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { LuChevronRight, LuLoader } from 'react-icons/lu';
import api from '../../../shared/utils/api';
import Banner from './Banner';

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80';

const getId = (item) => item?._id || item?.id || item;

const toMoney = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return 'Rs. 0';
  return `Rs. ${number.toLocaleString('en-IN')}`;
};

const getProductImage = (product) =>
  product?.image ||
  product?.images?.[0] ||
  product?.thumbnail ||
  DEFAULT_PRODUCT_IMAGE;

const getSectionItems = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);

const getSectionBanners = (section) => {
  if (Array.isArray(section?.bannerItems) && section.bannerItems.length) {
    return section.bannerItems;
  }

  if (Array.isArray(section?.bannerIds) && section.bannerIds.length) {
    return section.bannerIds.filter(Boolean);
  }

  return [];
};

const ProductTile = ({ product }) => {
  const productId = getId(product);
  const displayPrice = product?.discountPrice != null && product.discountPrice !== ''
    ? product.discountPrice
    : product?.price;
  const originalPrice =
    product?.discountPrice != null && product.discountPrice !== ''
      ? product?.price
      : null;

  return (
    <Link
      to={`/products/${productId}`}
      className="group overflow-hidden rounded-[1.75rem] border border-soft-oatmeal/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft-oatmeal/10">
        <img
          src={getProductImage(product)}
          alt={product?.name || 'Product'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-espresso/45 via-transparent to-transparent" />
      </div>
      <div className="space-y-1 p-2 md:p-4">
        <div className="space-y-1">
          <p className="line-clamp-1 text-[13px] font-bold text-deep-espresso">
            {product?.name}
          </p>
          <p className="line-clamp-1 text-[10px] font-black tracking-[0.24em] text-warm-sand">
            {product?.category}
          </p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-black text-deep-espresso">
              {toMoney(displayPrice)}
            </p>
            {originalPrice != null && Number(originalPrice) > Number(displayPrice) && (
              <p className="text-[11px] text-warm-sand line-through">
                {toMoney(originalPrice)}
              </p>
            )}
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-header-red)]/10 text-[var(--color-header-red)] transition-colors group-hover:bg-[var(--color-header-red)] group-hover:text-white">
            <LuChevronRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
};

const SectionShell = ({ section, children, action }) => {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-1 md:py-20"
    >
      <div className="mx-auto mb-1 md:mb-10 max-w-5xl text-center space-y-1 md:space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-oatmeal/40 border border-soft-oatmeal/60 text-[10px] font-black uppercase tracking-[0.35em] text-warm-sand">
          Curated Collection
        </div>

        <h2 className="text-2xl md:text-6xl font-display font-bold tracking-tight text-[var(--color-header-red)]">
          {section.title}
        </h2>

        <div className="flex items-center justify-center gap-3 py-0.5 md:py-1">
          <div className="h-[1.5px] w-12 bg-soft-oatmeal shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full border border-warm-sand/40" />
          <div className="h-[1.5px] w-12 bg-soft-oatmeal shadow-sm" />
        </div>

        {section.subtitle && (
          <p className="mx-auto max-w-3xl text-sm md:text-xl leading-relaxed text-deep-espresso/50 font-light italic">
            {section.subtitle}
          </p>
        )}

        {action && (
          <div className="pt-1 flex justify-center">
            {action}
          </div>
        )}
      </div>

      {children}
    </Motion.section>
  );
};

const DynamicSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    const loadSections = async () => {
      try {
        const { data } = await api.get('/sections');
        if (!alive) return;
        setSections(Array.isArray(data?.data) ? data.data : []);
      } catch (fetchError) {
        if (!alive) return;
        console.error('Failed to load dynamic sections:', fetchError);
        setError(fetchError.response?.data?.error || 'Failed to load custom sections.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadSections();

    return () => {
      alive = false;
    };
  }, []);

  const activeSections = useMemo(
    () => sections.filter((section) => section?.isActive !== false),
    [sections]
  );

  if (loading && !activeSections.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="rounded-[2rem] border border-soft-oatmeal bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-warm-sand">
            <LuLoader className="animate-spin" />
            <span className="text-sm font-medium">Loading custom sections...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!activeSections.length) {
    return error ? (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="rounded-[2rem] border border-dashed border-soft-oatmeal bg-white p-8 text-center text-warm-sand">
          {error}
        </div>
      </section>
    ) : null;
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {activeSections.map((section) => {
        const categories = getSectionItems(section.categoryIds);
        const products = getSectionItems(section.productIds);
        const banners = getSectionBanners(section);

        if (section.displayType === 'category') {
          return null;
        }

        if (section.displayType === 'product') {
          return (
            <SectionShell
              key={getId(section)}
              section={section}
              action={
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-soft-oatmeal bg-white px-3 md:px-4 py-1 md:py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-deep-espresso transition-all hover:border-[var(--color-header-red)] hover:text-[var(--color-header-red)]"
                >
                  View all products
                  <LuChevronRight size={13} />
                </Link>
              }
            >
              <div className="space-y-1 md:space-y-4">
                {categories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                      <span
                        key={getId(category)}
                        className="rounded-full border border-soft-oatmeal bg-white px-2 md:px-3 py-0.5 md:py-1 text-[11px] font-bold text-deep-espresso/70"
                      >
                        {category?.name}
                      </span>
                    ))}
                  </div>
                )}

                {products.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductTile key={getId(product)} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-soft-oatmeal bg-white p-8 text-center text-warm-sand">
                    No products have been selected for this section yet.
                  </div>
                )}
              </div>
            </SectionShell>
          );
        }

        return (
          <SectionShell
            key={getId(section)}
            section={section}
            action={null}
          >
            {banners.length > 0 ? (
              <div className="overflow-hidden rounded-none border-y border-soft-oatmeal bg-white shadow-lg -mx-4 sm:mx-0">
                <Banner banners={banners} />
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-soft-oatmeal bg-white p-8 text-center text-warm-sand">
                No banners have been selected for this section yet.
              </div>
            )}
          </SectionShell>
        );
      })}
    </div>
  );
};

export default DynamicSections;
