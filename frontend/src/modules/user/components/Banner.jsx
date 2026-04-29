import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const isExternalUrl = (value = '') => /^https?:\/\//i.test(value);

const BannerAction = ({ to, className, children }) => {
  if (!to) return null;

  if (isExternalUrl(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

const normalizeApiBanner = (item, index) => {
  const imageSrc = item?.bgImage?.src || item?.image || item?.bannerImage || '';
  if (!imageSrc) return null;

  return {
    id: item._id || item.id || `api-banner-${index}`,
    image: imageSrc,
    alt: item?.bgImage?.alt || item?.alt || item.title || 'Hero banner',
    caption: item?.bgImage?.caption || item?.caption || '',
    title: item.title || '',
    subtitle: item.subtitle || '',
    primaryBtnText: item.primaryBtnText || item.ctaText || '',
    primaryBtnLink: item.primaryBtnLink || item.ctaLink || '',
    secondaryBtnText: item.secondaryBtnText || '',
    secondaryBtnLink: item.secondaryBtnLink || '',
  };
};

const Banner = ({ banners = [] }) => {
  const apiBanners = Array.isArray(banners)
    ? banners
      .map((item, index) => normalizeApiBanner(item, index))
      .filter(Boolean)
    : [];

  const sliderBanners = apiBanners;
  const [current, setCurrent] = useState(0);
  const bannerCount = sliderBanners.length;
  const hasMultipleBanners = bannerCount > 1;
  const currentIndex = bannerCount ? current % bannerCount : 0;
  const currentBanner = sliderBanners[currentIndex];

  useEffect(() => {
    if (!hasMultipleBanners) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderBanners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [bannerCount, hasMultipleBanners, sliderBanners.length]);

  if (!currentBanner) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % sliderBanners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + sliderBanners.length) % sliderBanners.length);

  return (
    <div className="relative h-[200px] md:h-[480px] w-full overflow-hidden rounded-none group shadow-2xl bg-gray-100">
      <AnimatePresence mode="wait">
        <Motion.div
          key={currentBanner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={currentBanner.image}
            alt={currentBanner.alt || currentBanner.title}
            className="h-full w-full object-cover"
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#189D91]/40 via-[#189D91]/10 to-transparent flex items-center px-4 md:px-20">
            <div className="max-w-xl space-y-1.5 md:space-y-6">
              <Motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tighter drop-shadow-md"
              >
                {currentBanner.title}
              </Motion.h2>
              <Motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/90 text-[10px] md:text-xl font-light italic drop-shadow-sm"
              >
                {currentBanner.subtitle}
              </Motion.p>
              {!!currentBanner.caption && (
                <Motion.p
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="text-white/80 text-xs md:text-sm font-medium drop-shadow-sm"
                >
                  {currentBanner.caption}
                </Motion.p>
              )}

              {(currentBanner.primaryBtnText || currentBanner.secondaryBtnText) && (
                <Motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-1 md:pt-2 flex flex-wrap gap-2 md:gap-4"
                >
                  {currentBanner.primaryBtnText && (
                    <BannerAction
                      to={currentBanner.primaryBtnLink}
                      className="px-5 md:px-7 py-2.5 md:py-3 rounded-full bg-[#189D91] text-white text-[11px] md:text-sm font-bold tracking-wide hover:bg-[#15897e] transition-colors shadow-lg shadow-[#189D91]/20"
                    >
                      {currentBanner.primaryBtnText}
                    </BannerAction>
                  )}
                  {currentBanner.secondaryBtnText && (
                    <BannerAction
                      to={currentBanner.secondaryBtnLink}
                      className="px-5 md:px-7 py-2.5 md:py-3 rounded-full border border-white/70 text-white text-[11px] md:text-sm font-bold tracking-wide hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                      {currentBanner.secondaryBtnText}
                    </BannerAction>
                  )}
                </Motion.div>
              )}
            </div>
          </div>
        </Motion.div>
      </AnimatePresence>

      {/* Manual Controls */}
      {hasMultipleBanners && (
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button onClick={prevSlide} className="p-2 md:p-5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 border border-white/20 transition-all active:scale-90 shadow-2xl">
            <LuChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
          </button>
          <button onClick={nextSlide} className="p-2 md:p-5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 border border-white/20 transition-all active:scale-90 shadow-2xl">
            <LuChevronRight className="w-6 h-6 md:w-10 md:h-10" />
          </button>
        </div>
      )}

      {/* Pagination Dots */}
      {hasMultipleBanners && (
        <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {sliderBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1 rounded-full transition-all duration-700 ${currentIndex === idx ? 'w-12 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
