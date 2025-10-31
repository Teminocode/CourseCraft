import React, { useState } from 'react';
import StarRating from './StarRating';
import Button from './Button';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
        <StarRating 
          rating={rating} 
          onRatingChange={setRating} 
          interactive 
          size="md"
        />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Your Review
        </label>
        <div className="mt-1">
          <textarea
            rows={4}
            name="comment"
            id="comment"
            className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;