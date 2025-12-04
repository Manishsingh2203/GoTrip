import React, { useState } from 'react';
import { Star, MapPin, Heart, Eye, Users, Bed } from 'lucide-react';

const HotelCard = ({ hotel = {}, onViewDetails, onAddToWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    name = "Hotel Grand Plaza",
    rating = 4.2,
    reviews = 128,
    amenities = ["Free WiFi", "Parking", "Restaurant", "Swimming Pool"],
    address = "123 Main Street, City Center",
    originalPrice = 8999,
    discountedPrice = 6999,
    discount = 22,
    bedType = "1 King bed",
    guests = 2,
    freeCancellation = true,
    breakfastIncluded = true,
  } = hotel;

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(hotel, !isWishlisted);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(hotel);
    }
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      {/* Header with Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {/* Image placeholder */}
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <Bed className="h-12 w-12 text-gray-600" />
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded bg-white/90 transition-colors ${
            isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded text-sm font-medium">
          {discount}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{address}</span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
          <span className="text-gray-500 text-sm">({reviews} reviews)</span>
        </div>

        {/* Room Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{guests} Guests</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1 mb-4 text-sm">
          {freeCancellation && (
            <div className="text-green-600">Free cancellation</div>
          )}
          {breakfastIncluded && (
            <div className="text-blue-600">Breakfast included</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">₹{discountedPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
            </div>
            <div className="text-xs text-gray-500">per night</div>
          </div>

          <button
            onClick={handleViewDetails}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;