import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import api from '../../../shared/utils/api';

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80';

const getId = (item) => item?._id || item?.id || item;

const getProductImage = (product) =>
  product?.images?.[0] || product?.image || product?.thumbnail || DEFAULT_PRODUCT_IMAGE;

const FavouriteSectionCard = ({ section }) => {
  const blocks = useMemo(
    () => (Array.isArray(section?.items) ? section.items : []),
    [section?.items]
  );
  const firstCategoryId = useMemo(
    () => getId(blocks[0]?.categoryId) || '',
    [blocks]
  );
  const [activeCategoryId, setActiveCategoryId] = useState(firstCategoryId);

  useEffect(() => {
    setActiveCategoryId(firstCategoryId);
  }, [firstCategoryId]);

  const activeBlock =
    blocks.find((block) => String(getId(block?.categoryId)) === String(activeCategoryId)) ||
    blocks[0];

  const products = Array.isArray(activeBlock?.productIds) ? activeBlock.productIds.filter(Boolean) : [];

  return (
    <section className="bg-soft-oatmeal/5 py-4 md:py-12 border-b border-soft-oatmeal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 md:space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-sand/5 border border-warm-sand/10 text-[10px] font-semibold uppercase tracking-[0.1em] text-warm-sand/80">
            Premium Selection
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-black leading-tight">
            {section.heading}
          </h2>

          <div className="h-px w-12 bg-warm-sand/30 mx-auto" />

          {section.subheading && (
            <p className="mx-auto max-w-xl text-sm md:text-base leading-relaxed text-deep-espresso/60 font-normal">
              {section.subheading}
            </p>
          )}
        </div>

        <div className="flex justify-start md:justify-center gap-3 md:gap-5 overflow-x-auto no-scrollbar pb-4 px-4 md:px-0 -mx-4 md:mx-0">
          {blocks.map((block) => {
            const category = block?.categoryId;
            const categoryId = String(getId(category));

            return (
              <button
                key={categoryId || getId(block)}
                type="button"
                onClick={() => setActiveCategoryId(categoryId)}
                className={`px-5 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap text-[11px] md:text-sm font-semibold ${String(activeCategoryId) === categoryId
                  ? 'border-warm-sand text-white bg-warm-sand shadow-lg shadow-warm-sand/20'
                  : 'border-soft-oatmeal/40 text-deep-espresso/50 hover:border-warm-sand/30 bg-white'
                  }`}
              >
                {category?.name || 'Category'}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 md:min-h-[320px]">
          <AnimatePresence mode="popLayout">
            {products.length > 0 ? (
              <Motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8"
              >
                {products.map((product) => (
                  <Motion.div
                    layout
                    key={getId(product)}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35 }}
                    className="group relative flex flex-col bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-soft-oatmeal/10 hover:shadow-xl transition-all duration-500"
                  >
                    <Link to={`/products/${getId(product)}`} className="block h-full">
                      <div className="aspect-square overflow-hidden bg-soft-oatmeal/5">
                        <img
                          src={getProductImage(product)}
                          alt={product?.name || 'Product'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="py-2 px-2 text-center bg-gray-50/50">
                        <span className="text-[11px] md:text-sm font-medium text-deep-espresso/60 group-hover:text-warm-sand transition-colors">
                          {product?.name}
                        </span>
                      </div>
                    </Link>
                  </Motion.div>
                ))}
              </Motion.div>
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-deep-espresso/30"
              >
                <p className="text-lg font-medium italic">No products selected yet.</p>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const FavouriteCategories = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    const fetchFavouriteSections = async () => {
      try {
        const { data } = await api.get('/favourite-section');
        if (!alive) return;
        setSections(Array.isArray(data?.data) ? data.data : []);
      } catch (fetchError) {
        if (!alive) return;
        console.error('Failed to load favourite sections:', fetchError);
        setError(fetchError.response?.data?.error || 'Failed to load favourite sections.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchFavouriteSections();

    return () => {
      alive = false;
    };
  }, []);

  const activeSections = sections.filter((section) => section?.isActive !== false);

  if (loading && !activeSections.length) {
    return (
      <div className="py-16 text-center font-display text-warm-sand animate-pulse uppercase tracking-[0.2em] text-xs">
        Loading Favourite Section...
      </div>
    );
  }

  if (!activeSections.length) {
    return error ? (
      <section className="bg-soft-oatmeal/10 py-8 md:py-12 border-y border-soft-oatmeal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="rounded-[2rem] border border-dashed border-soft-oatmeal bg-white p-8 text-center text-warm-sand">
            {error}
          </div>
        </div>
      </section>
    ) : null;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {activeSections.map((section) => (
        <FavouriteSectionCard key={getId(section)} section={section} />
      ))}
    </div>
  );
};

export default FavouriteCategories;
