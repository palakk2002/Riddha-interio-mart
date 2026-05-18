import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUpload, FiImage } from 'react-icons/fi';
import StarRating from './StarRating';
import Button from '../../../shared/components/Button';
import api from '../../../shared/utils/api';

const ReviewForm = ({ productId, initialData = null, onClose, onSuccess }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [review, setReview] = useState(initialData?.review || '');
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // In a real scenario, use FormData and a proper upload endpoint
      // Mocking base64 for simplicity if backend doesn't have a direct /upload for reviews yet
      // Or use the existing /api/upload endpoint
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        // Assuming upload endpoint returns array of URLs in res.data.data or res.data.urls
        const uploadedUrls = res.data.urls || [res.data.url]; 
        setImages(prev => [...prev, ...uploadedUrls].slice(0, 3));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      // Fallback: mock base64 for demo purposes if backend upload isn't fully configured
      const newImages = await Promise.all(files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }));
      setImages(prev => [...prev, ...newImages].slice(0, 3));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = { rating, title, review, images };
      
      if (initialData?._id) {
        await api.put(`/reviews/${initialData._id}`, payload);
      } else {
        await api.post(`/products/${productId}/reviews`, payload);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-2xl font-bold text-deep-espresso mb-6">
          {initialData ? 'Edit Review' : 'Write a Review'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Overall Rating *</label>
            <StarRating rating={rating} onChange={setRating} size={28} interactive={true} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Add a Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#189D91] focus:ring-1 focus:ring-[#189D91] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Add a Written Review *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#189D91] focus:ring-1 focus:ring-[#189D91] outline-none transition-all resize-none"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Add Photos (Max 3)</label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group">
                  <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ))}
              
              {images.length < 3 && (
                <label className={`w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#189D91] hover:text-[#189D91] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FiImage size={24} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
            {uploading && <p className="text-xs text-[#189D91] mt-2 animate-pulse">Processing images...</p>}
          </div>

          <Button 
            type="submit" 
            isLoading={submitting}
            className="w-full h-12 rounded-xl text-sm uppercase tracking-widest font-black"
          >
            {initialData ? 'Update Review' : 'Submit Review'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReviewForm;
