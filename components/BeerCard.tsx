import React from 'react';
import { BeerItem } from '../types';
import { RatingStars } from './RatingStars';
import { Beer } from 'lucide-react';

interface BeerCardProps {
  beer: BeerItem;
  rating: number;
  onRate: (id: string, rating: number) => void;
}

export const BeerCard: React.FC<BeerCardProps> = ({ beer, rating, onRate }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 flex flex-col items-center text-center hover:border-beer-amber transition-colors">
      <div className="w-12 h-12 bg-beer-amber/20 rounded-full flex items-center justify-center mb-3 text-beer-amber">
        <Beer size={24} />
      </div>
      <h3 className="font-bold text-lg text-white mb-1">{beer.name}</h3>
      {beer.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 min-h-[2.5em]">{beer.description}</p>
      )}
      {!beer.description && (
        <p className="text-xs text-gray-500 mb-3 italic">Cerveza Comercial</p>
      )}
      
      <div className="mt-auto pt-2 w-full flex justify-center border-t border-gray-700">
        <RatingStars 
          value={rating} 
          onChange={(val) => onRate(beer.id, val)} 
        />
      </div>
    </div>
  );
};