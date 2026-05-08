import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare, FiTrash2, FiSearch, FiFilter, FiDownload, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FeedbackManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const fetchReviews = () => {
    const savedReviews = JSON.parse(localStorage.getItem('riddha_reviews') || '[]');
    setReviews(savedReviews);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      const savedReviews = JSON.parse(localStorage.getItem('riddha_reviews') || '[]');
      const updated = savedReviews.filter(r => r.id !== id);
      localStorage.setItem('riddha_reviews', JSON.stringify(updated));
      setReviews(updated);
      toast.success('Review deleted successfully');
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-gray-900">
            Feedback <span className="text-teal-600">Management</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Platform-wide review oversight</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg active:scale-95">
          <FiDownload /> Export Logs
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-12 pr-4 outline-none text-xs font-bold transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-teal-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-teal-600 transition-all">
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-teal-50/50 border border-teal-100 p-6 rounded-[32px] flex items-center gap-5">
            <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-100">
               <FiCheckCircle size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-gray-900">{reviews.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">Total Approved</p>
            </div>
         </div>
         <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[32px] flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
               <FiStar size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-gray-900">
                 {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
               </p>
               <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Platform Avg</p>
            </div>
         </div>
         <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[32px] flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
               <FiMessageSquare size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-gray-900">{reviews.filter(r => r.images?.length > 0).length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Media Reviews</p>
            </div>
         </div>
      </div>

      {/* Review Cards/Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white py-24 rounded-[40px] border border-dashed border-gray-200 text-center">
            <FiMessageSquare className="mx-auto text-gray-100 mb-6" size={64} />
            <h3 className="text-lg font-black text-gray-900 uppercase italic">No reviews found</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 font-black text-xs">
                      #{review.id.slice(-4)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.productName}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Order: {review.orderId.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} size={12} className={`${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl italic border border-gray-50 group-hover:bg-teal-50/30 group-hover:border-teal-50 transition-all">
                  "{review.comment}"
                </p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img} className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm hover:scale-105 transition-transform cursor-pointer" alt="Review" />
                    ))}
                  </div>
                )}
              </div>
              <div className="md:w-40 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 flex md:flex-col justify-between items-center md:items-end">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Submitted On</p>
                  <p className="text-[11px] font-bold text-gray-700">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                  title="Delete Review"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
