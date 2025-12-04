import React from "react";
import { MapPin, Star, Clock } from "lucide-react";

const RestaurantCard = ({ restaurant = {} }) => {
  const {
    name = "Restaurant",
    address = "Address not available",
    rating = 4.3,
    cuisine = [],
    priceRange = "$$",
    openingHours = { open: "09:00", close: "22:00" }
  } = restaurant;

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{address}</span>
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{rating}</span>
          </div>
          <span className="text-sm text-gray-600">{priceRange}</span>
        </div>

        {/* Cuisine */}
        <div className="flex flex-wrap gap-1 mb-3">
          {cuisine.slice(0, 2).map((c, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Timing */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
          <Clock className="h-4 w-4" />
          <span>{openingHours.open} - {openingHours.close}</span>
        </div>

        {/* Action Button */}
        <button className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;