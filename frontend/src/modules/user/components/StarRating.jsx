import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, onChange, size = 16, interactive = false }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (interactive) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          {i <= rating ? (
            <FaStar size={size} className="text-yellow-400" />
          ) : (
            <FaRegStar size={size} className="text-gray-300" />
          )}
        </button>
      );
    } else {
      if (rating >= i) {
        stars.push(<FaStar key={i} size={size} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} size={size} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} size={size} className="text-gray-300" />);
      }
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default StarRating;
