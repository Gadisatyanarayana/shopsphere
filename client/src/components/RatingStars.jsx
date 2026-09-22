import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, numReviews, size = 16, interactive = false, onRatingChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'button'}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`${
                star <= rating
                  ? 'fill-amber-400 text-amber-400'
                  : star - 0.5 <= rating
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="text-xs text-slate-400 font-medium">({numReviews})</span>
      )}
    </div>
  );
}
