import React from 'react';
import { FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ExistingReviewCard = ({ review, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const existingReviews = JSON.parse(localStorage.getItem('riddha_reviews') || '[]');
      const updatedReviews = existingReviews.filter(r => r.id !== review.id);
      localStorage.setItem('riddha_reviews', JSON.stringify(updatedReviews));
      toast.success('Review deleted');
      onDelete();
    }
  };

  return (
    <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-5 mt-4 relative group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={14}
              className={`${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="ml-2 text-[10px] font-black text-teal-600 uppercase tracking-widest">Your Review</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onEdit}
            className="p-1.5 bg-white text-gray-400 hover:text-teal-600 rounded-lg shadow-sm transition-all"
          >
            <FiEdit2 size={12} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm transition-all"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-700 font-medium leading-relaxed italic">"{review.comment}"</p>
      
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-4">
          {review.images.map((url, i) => (
            <img key={i} src={url} className="w-10 h-10 rounded-lg object-cover border border-white shadow-sm" alt="Review" />
          ))}
        </div>
      )}
      
      <p className="mt-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
        Updated on {new Date(review.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ExistingReviewCard;
