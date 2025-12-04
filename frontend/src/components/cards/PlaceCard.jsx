import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

const PlaceCard = ({ place }) => {
  if (!place) return null;

  const [imgError, setImgError] = useState(false);

  const {
    _id,
    name = "Unknown Place",
    city = "Unknown",
    country = "India",
    images = [],
    rating = 4.3,
    reviews = Math.floor(Math.random() * 800) + 200,
    category = "travel",
  } = place;

  return (
    <Link
      to={`/places/${_id}`}
      className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      {/* IMAGE */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        <img
          src={!imgError ? images?.[0] || "/api/placeholder/400/300" : "/api/placeholder/400/300"}
          onError={() => setImgError(true)}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Category Badge */}
   
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-[15px] font-bold text-[#1e599e] line-clamp-2">
          {name}
        </h3>

        {/* Location */}
        <p className="text-sm text-[#484848] mt-1 flex items-center gap-1">
          <MapPin className="h-4 w-4 text-[#767676]" />
          {city}, {country}
        </p>

        {/* Rating Row */}
        <div className="flex items-center gap-2 mt-2 text-sm text-[#484848]">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-[#222222]">{rating}</span>
          <span className="text-[#767676] text-xs">{reviews} reviews</span>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;