'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserRatingProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
}

const RATINGS_KEY = 'userRatings';

function getSavedRating(mediaId: number): number {
  if (typeof window === 'undefined') return 0;
  try {
    const ratings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}');
    return ratings[mediaId] || 0;
  } catch {
    return 0;
  }
}

function saveRating(mediaId: number, rating: number) {
  try {
    const ratings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}');
    if (rating === 0) {
      delete ratings[mediaId];
    } else {
      ratings[mediaId] = rating;
    }
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  } catch {
    // ignore
  }
}

export function UserRating({ mediaId, mediaType, title }: UserRatingProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRating(getSavedRating(mediaId));
  }, [mediaId]);

  const handleRate = (star: number) => {
    const newRating = star === rating ? 0 : star;
    setRating(newRating);
    saveRating(mediaId, newRating);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const display = hovered || rating;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-white/60 font-medium">Your Rating:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleRate(star)}
              className="group transition-transform hover:scale-125 active:scale-110"
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  'w-7 h-7 transition-colors duration-150',
                  star <= display
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-white/20 group-hover:text-yellow-400/50'
                )}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-sm text-yellow-400 font-medium">
            {saved ? '✓ Saved!' : `${rating}/5 stars`}
          </span>
        )}
        {rating === 0 && (
          <span className="text-xs text-white/30">Click a star to rate</span>
        )}
      </div>
    </div>
  );
}
