import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange: (val: number) => void;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ value, onChange, size = 24 }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform active:scale-95"
          type="button"
        >
          <Star
            size={size}
            className={`${
              star <= value 
                ? 'fill-beer-gold text-beer-gold' 
                : 'fill-transparent text-gray-500'
            } transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};