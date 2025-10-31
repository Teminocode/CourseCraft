import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Star: React.FC<{
  filled: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  sizeClass: string;
}> = ({ filled, onClick, onMouseEnter, onMouseLeave, sizeClass }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={` ${sizeClass} transition-colors duration-150 ${filled ? 'text-yellow-400' : 'text-gray-300'} ${onClick ? 'cursor-pointer' : ''}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  className = '',
  interactive = false,
  onRatingChange,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleRatingClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newHoverRating: number) => {
    if (interactive) {
      setHoverRating(newHoverRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const displayRating = hoverRating || rating;
        return (
          <Star
            key={index}
            filled={starValue <= displayRating}
            onClick={() => handleRatingClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            sizeClass={sizeClasses[size]}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
