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
    <section className="bg-soft-oatmeal/10 py-1.5 md:py-10 border-y border-soft-oatmeal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-2 md:py-6 space-y-3 md:space-y-6">
        <div className="text-center space-y-1.5 md:space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-oatmeal/40 border border-soft-oatmeal/60 text-[10px] font-black uppercase tracking-[0.35em] text-warm-sand">
            Handpicked Categories
          </div>
          
          <h2 className="text-2xl md:text-6xl font-display font-bold tracking-tight text-[var(--color-header-red)]">
            {section.heading}
          </h2>

          <div className="flex items-center justify-center gap-4 py-0.5 md:py-1">
            <div className="h-[1.5px] w-16 bg-soft-oatmeal shadow-sm" />
            <div className="w-3 h-3 rounded-full border-2 border-warm-sand/30" />
            <div className="h-[1.5px] w-16 bg-soft-oatmeal shadow-sm" />
          </div>

          {section.subheading && (
            <p className="mx-auto max-w-2xl text-sm md:text-xl leading-relaxed text-deep-espresso/50 font-light italic">
              {section.subheading}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 md:gap-5 overflow-x-auto no-scrollbar pb-2">
          {blocks.map((block) => {
            const category = block?.categoryId;
            const categoryId = String(getId(category));

            return (
              <button
                key={categoryId || getId(block)}
                type="button"
                onClick={() => setActiveCategoryId(categoryId)}
                className={`px-3 md:px-6 py-1.5 md:py-2.5 rounded-full border-2 transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-bold ${
                  String(activeCategoryId) === categoryId
                    ? 'border-[var(--color-header-red)] text-[var(--color-header-red)] bg-white'
                    : 'border-soft-oatmeal/20 text-deep-espresso/45 hover:border-soft-oatmeal/40 bg-white/60'
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

                      <div className="py-2 md:py-3 px-2 md:px-3 text-center bg-white border-t border-soft-oatmeal/5">
                        <span className="text-[10px] md:text-sm font-medium text-deep-espresso/80 group-hover:text-warm-sand transition-colors tracking-tight">
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
