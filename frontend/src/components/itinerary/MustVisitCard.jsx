import React, { useState } from 'react';
import { MapPin, Heart } from 'lucide-react';

const MustVisitCard = ({ name, why }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-[#FF5A5F] transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-[#1e599e]">{name}</h4>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded transition-colors ${
              isFavorite ? 'text-[#1e599e]' : 'text-[#767676] hover:text-[#1e599e]'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-[#767676] mt-0.5 flex-shrink-0" />
          <p className="text-[#484848] text-sm leading-relaxed">{why}</p>
        </div>
      </div>
    </div>
  );
};

export default MustVisitCard;