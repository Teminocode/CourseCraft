
import React from 'react';
// Fix: Use relative path for type imports
import type { Review } from '../types';
import StarRating from './StarRating';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Student Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center mb-1">
                <StarRating rating={review.rating} size="sm" />
                <p className="ml-4 font-semibold">{review.userName}</p>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewList;
