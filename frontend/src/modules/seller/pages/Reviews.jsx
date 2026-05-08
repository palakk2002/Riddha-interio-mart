import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare, FiTrendingUp, FiUsers, FiFilter, FiCalendar } from 'react-icons/fi';

const SellerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem('riddha_reviews') || '[]');
    setReviews(savedReviews);

    if (savedReviews.length > 0) {
      const total = savedReviews.length;
      const sum = savedReviews.reduce((acc, r) => acc + r.rating, 0);
      const dist = [0, 0, 0, 0, 0];
      savedReviews.forEach(r => dist[r.rating - 1]++);

      setStats({
        avgRating: (sum / total).toFixed(1),
        totalReviews: total,
        ratingDistribution: dist.reverse() // 5 stars first
      });
    }
  }, []);

  const statCards = [
    { label: 'Average Rating', value: stats.avgRating, icon: <FiStar className="text-amber-400" />, sub: 'Out of 5.0' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: <FiMessageSquare className="text-teal-500" />, sub: 'Customer Feedback' },
    { label: 'Review Growth', value: '+12%', icon: <FiTrendingUp className="text-green-500" />, sub: 'Last 30 days' },
    { label: 'Happy Customers', value: '94%', icon: <FiUsers className="text-blue-500" />, sub: 'Rating 4+' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase italic tracking-tight text-gray-900">
          Reviews & <span className="text-[#189D91]">Ratings</span>
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Monitor your premium brand reputation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gray-50">{card.icon}</div>
            </div>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{card.label}</p>
            <p className="text-[9px] font-bold text-gray-300 mt-2 uppercase">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Distribution */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-fit">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8">Rating Distribution</h3>
          <div className="space-y-4">
            {stats.ratingDistribution.map((count, i) => {
              const starLevel = 5 - i;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-400 w-4">{starLevel}★</span>
                  <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 w-8">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Recent Feedbacks</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
                <FiFilter size={14} />
              </button>
              <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
                <FiCalendar size={14} />
              </button>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white py-20 rounded-[32px] border border-gray-100 text-center">
              <FiMessageSquare className="mx-auto text-gray-100 mb-4" size={48} />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No reviews received yet</p>
            </div>
          ) : (
            reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:border-teal-100 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xs">
                      {review.productName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.productName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <FiStar key={s} size={10} className={`${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img} className="w-12 h-12 rounded-xl object-cover border border-gray-50" alt="Review" />
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerReviews;
