import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAIHotels } from "../services/aiTravelAPI";
import Loader from "../components/common/Loader";
import TravelChatbot from '../components/chat/TravelChatbot';
import {
  Building2,
  Star,
  MapPin,
  IndianRupee,
  Search,
  Calendar,
  Users,
  ChevronDown,
  Heart,
  Shield,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Tv,
  Waves,
  Utensils,
  ArrowLeft
} from "lucide-react";

export default function HotelsSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [city, setCity] = useState(location.state?.city || "");
  const [checkin, setCheckin] = useState(location.state?.checkin || "");
  const [checkout, setCheckout] = useState(location.state?.checkout || "");
  const [guests, setGuests] = useState(location.state?.guests || "2");
  const [rooms, setRooms] = useState(location.state?.rooms || "1");
  
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");

  // Filters & sorting
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [ratingMin, setRatingMin] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [onlyBreakfast, setOnlyBreakfast] = useState(false);
  const [onlyFreeCancel, setOnlyFreeCancel] = useState(false);

  // Amenity icons mapping
  const amenityIcons = {
    WiFi: <Wifi className="h-4 w-4 text-[#1e599e]" />,
    Breakfast: <Coffee className="h-4 w-4 text-[#1e599e]" />,
    Parking: <Car className="h-4 w-4 text-[#1e599e]" />,
    Pool: <Waves className="h-4 w-4 text-[#1e599e]" />,
    Gym: <Dumbbell className="h-4 w-4 text-[#1e599e]" />,
    "TV": <Tv className="h-4 w-4 text-[#1e599e]" />,
    "Restaurant": <Utensils className="h-4 w-4 text-[#1e599e]" />,
  };

  const amenityOptions = useMemo(() => {
    const s = new Set();
    hotels.forEach((h) => {
      (h.amenities || []).forEach((a) => s.add(a));
    });
    return Array.from(s).slice(0, 6);
  }, [hotels]);

  const toggleAmenity = (a) => {
    setSelectedAmenities((prev) => 
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const searchHotels = async (silent = false) => {
    if (!city || !checkin || !checkout) {
      setError("Please fill city, check-in and check-out.");
      return;
    }

    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const payload = { city, checkin, checkout, guests, rooms };
      const data = await getAIHotels(payload);

      if (!data || !Array.isArray(data)) {
        setHotels([]);
        setError("No hotels found. Try different dates or city.");
      } else {
        const normalized = data.map((h) => ({
          id: h.id || Math.random(),
          name: h.name || "Hotel",
          image_url: h.image_url || "/api/placeholder/400/300",
          rating: Number(h.rating) || 0,
          price_per_night: Number(h.price_per_night) || 0,
          original_price: Number(h.original_price) || Number(h.price_per_night) * 1.2,
          location: h.location || "",
          amenities: Array.isArray(h.amenities) ? h.amenities : (h.amenities ? [h.amenities] : []),
          description: h.description || "",
          booking_redirect_url: h.booking_redirect_url || "https://www.booking.com/",
          recommended: !!h.recommended,
          free_cancellation: !!h.free_cancellation,
          deal: h.deal || "20% OFF",
          distance: h.distance || "2.5 km from city center"
        }));
        setHotels(normalized);
        const prices = normalized.map(x => x.price_per_night).filter(n => n > 0);
        if (prices.length) {
          const min = Math.min(...prices), max = Math.max(...prices);
          setPriceRange([min, max]);
        }
      }
    } catch (err) {
      console.error("Hotels fetch error:", err);
      setError("Failed to fetch hotels. Try again.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we arrived here from Home with pre-filled data,
    // auto-run the search once so the user immediately sees results.
    if (location.state && city && checkin && checkout) {
      searchHotels(false);
    }
  }, [location.state, city, checkin, checkout]);

  // Filter and sort logic
  const filteredHotels = useMemo(() => {
    let list = hotels.filter(h => {
      if (ratingMin && Number(h.rating) < Number(ratingMin)) return false;
      if (onlyBreakfast && !(h.amenities || []).some(a => /breakfast/i.test(a))) return false;
      if (onlyFreeCancel && !h.free_cancellation) return false;
      
      const p = Number(h.price_per_night) || 0;
      if (p < priceRange[0] || p > priceRange[1]) return false;
      
      if (selectedAmenities.length) {
        const hasAll = selectedAmenities.every(sa => 
          (h.amenities || []).some(a => a.toLowerCase() === sa.toLowerCase())
        );
        if (!hasAll) return false;
      }
      return true;
    });

    // Sorting
    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => (a.price_per_night || 0) - (b.price_per_night || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (b.price_per_night || 0) - (a.price_per_night || 0));
        break;
      case "rating_desc":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        list.sort((a, b) => 
          (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0) || 
          (a.price_per_night || 0) - (b.price_per_night || 0)
        );
    }
    return list;
  }, [hotels, ratingMin, onlyBreakfast, onlyFreeCancel, priceRange, selectedAmenities, sortBy]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] overflow-x-hidden">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#767676] hover:text-[#222222] transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>

            {/* Hotel Icon */}
            <Building2 className="h-6 w-6 text-[#1e599e]" />

            <div>
              <h1 className="text-xl font-semibold text-[#222222]">Hotels</h1>
              <p className="text-sm text-[#767676]">Find your perfect stay</p>
            </div>
          </div>
        </div>
      </header>

      {/* FULL WIDTH HOTEL SHOWCASE VIDEO */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4 overflow-x-hidden">
        <h2 className="text-xl font-semibold text-[#222222] mb-3">
          Stay at Premium Hotels Around the World
        </h2>

        <div className="relative w-full h-56 sm:h-96 md:h-[420px] lg:h-[480px] bg-black rounded-xl overflow-hidden shadow-lg group">
          <video
            src="/video/hotel.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Title */}
          <div className="absolute bottom-4 left-4 md:left-6 text-[#ff6b4a] text-lg sm:text-xl md:text-2xl font-semibold drop-shadow-2xl">
            Luxury • Comfort • Elegance
          </div>

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or hotel name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#1e599e] focus:ring-2 focus:ring-[#1e599e]/20 transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
              <input
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#1e599e] focus:ring-2 focus:ring-[#1e599e]/20 transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
              <input
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#1e599e] focus:ring-2 focus:ring-[#1e599e]/20 transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#1e599e] focus:ring-2 focus:ring-[#1e599e]/20 transition-all duration-300 appearance-none bg-white"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
            </div>
            
            <button
              onClick={() => searchHotels(false)}
              className="bg-[#0A2F5A] text-white py-3 rounded-xl font-semibold hover:bg-[#0A2F5A] hover:shadow-lg transition-all duration-300 shadow-md"
            >
              {loading ? "Searching..." : "Search Hotels"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[#222222]">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedAmenities([]);
                    setRatingMin(0);
                    setOnlyBreakfast(false);
                    setOnlyFreeCancel(false);
                    setPriceRange([1000, 10000]);
                  }}
                  className="text-[#1e599e] text-sm font-medium hover:text-[#1e599e] transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#222222] mb-3">Price Range</h4>
                <div className="flex justify-between text-sm text-[#767676] mb-3">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[#1e599e]"
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#222222] mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4, 3, 2].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer text-sm group">
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingMin === rating}
                        onChange={() => setRatingMin(rating)}
                        className="text-[#1e599e] focus:ring-[#1e599e]"
                      />
                      <div className="flex items-center gap-2 group-hover:text-[#1e599e] transition-colors">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{rating}+ Stars</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#222222] mb-3">Amenities</h4>
                <div className="space-y-2">
                  {amenityOptions.map((amenity, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer text-sm group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="text-[#1e599e] focus:ring-[#1e599e] rounded"
                      />
                      <span className="group-hover:text-[#1e599e] transition-colors">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer text-sm group">
                  <input
                    type="checkbox"
                    checked={onlyFreeCancel}
                    onChange={(e) => setOnlyFreeCancel(e.target.checked)}
                    className="text-[#1e599e] focus:ring-[#1e599e] rounded"
                  />
                  <span className="group-hover:text-[#1e599e] transition-colors">Free Cancellation</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm group">
                  <input
                    type="checkbox"
                    checked={onlyBreakfast}
                    onChange={(e) => setOnlyBreakfast(e.target.checked)}
                    className="text-[#1e599e] focus:ring-[#1e599e] rounded"
                  />
                  <span className="group-hover:text-[#1e599e] transition-colors">Breakfast Included</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-[#222222] text-lg">
                    {filteredHotels.length} Hotels in {city || "your destination"}
                  </h2>
                  <p className="text-[#767676] text-sm mt-1">
                    {checkin} to {checkout} • {guests} Guest{guests > 1 ? 's' : ''} • {rooms} Room{rooms > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-[#1e599e] focus:ring-2 focus:ring-[#1e599e]/20 transition-all duration-300 bg-white"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Rating: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hotels List */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <Loader />
                  <p className="text-[#767676] mt-3">Searching for the best hotels...</p>
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-[#222222] mb-2">No hotels found</h3>
                  <p className="text-[#767676] text-sm mb-4">Try adjusting your filters or search criteria</p>
                  <button
                    onClick={() => {
                      setSelectedAmenities([]);
                      setRatingMin(0);
                      setOnlyBreakfast(false);
                      setOnlyFreeCancel(false);
                    }}
                    className="text-[#1e599e] font-medium hover:text-[#1e599e] transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                filteredHotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-2xl border border-gray-200 hover:border-[#1e599e] transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Hotel Image */}
                        <div className="relative flex-shrink-0 w-full sm:w-32 h-44 sm:h-32">
                          <img
                            src={'/hotel.png'}
                            alt={hotel.name}
                            className="h-full w-full rounded-xl object-cover  shadow-sm"
                            style={{ filter: "hue-rotate(200deg) saturate(200%)" }}
                          />
                         
                        </div>

                        {/* Hotel Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#222222] text-lg mb-2 line-clamp-1">
                                {hotel.name}
                              </h3>
                              <div className="flex items-center gap-2 text-[#767676] text-sm mb-3">
                                <MapPin className="h-4 w-4 text-[#1e599e]" />
                                <span className="line-clamp-1">{hotel.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-[#1e599e] text-white px-3 py-1 rounded-lg text-sm font-semibold ml-4">
                              <Star className="h-3 w-3 fill-white" />
                              {hotel.rating}
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, index) => (
                              <span
                                key={index}
                                className="bg-[#F7F7F7] border border-gray-200 px-3 py-1 rounded-lg text-xs text-[#484848] flex items-center gap-1"
                              >
                                {amenityIcons[amenity] || <Wifi className="h-3 w-3 text-[#1e599e]" />}
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities.length > 4 && (
                              <span className="text-xs text-[#767676] bg-[#F7F7F7] px-2 py-1 rounded-lg">
                                +{hotel.amenities.length - 4} more
                              </span>
                            )}
                          </div>

                          {/* Features */}
                          {hotel.free_cancellation && (
                            <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                              <Shield className="h-4 w-4" />
                              Free Cancellation Available
                            </div>
                          )}
                        </div>

                        {/* Price & Actions */}
                        <div className="w-full sm:w-40 flex flex-col justify-between items-start sm:items-end mt-4 sm:mt-0">
                          <div className="text-right">
                            <div className="text-[#767676] text-sm line-through mb-1">
                              ₹{hotel.original_price}
                            </div>
                            <div className="flex items-center justify-end gap-1 text-2xl font-bold text-[#222222]">
                              <IndianRupee className="h-5 w-5" />
                              {hotel.price_per_night}
                            </div>
                            <div className="text-[#767676] text-xs">per night</div>
                          </div>

                          <div className="space-y-2 w-full">
                            <button
                              // onClick={() => window.open(hotel.booking_redirect_url, "_blank")}
                              onClick={() => navigate('https://www.agoda.com/en-in/?site_id=1922885&tag=6f147157-60b8-459f-af1a-9935d44970e9&gad_source=1&gad_campaignid=21035020746&gbraid=0AAAAAD-GdVm7JfsYDLYGIMVRQcpsL7Sx7&device=c&network=g&adid=695788229730&rand=1298098043503845043&aud=kwd-2230651387&gclid=Cj0KCQiA0KrJBhCOARIsAGIy9wAEyM1cD06TUlbeECnY-H911VLONTJw8C3_1OPwJJWEyE09BzYiTWUaAm3HEALw_wcB&pslc=1&ds=ncu3FAljFZkVmqF1')}
                              className="w-full bg-[#0A2F5A] text-white py-3 rounded-xl font-semibold hover:bg-[#0A2F5A] hover:shadow-lg transition-all duration-300 shadow-md"
                            >
                              Book Now
                            </button>
                            <button className="w-full border border-[#0A2F5A] text-[#0A2F5A] py-2 rounded-xl font-medium hover:bg-[#0A2F5A] hover:text-white transition-all duration-300">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <TravelChatbot />
    </div>
  );
}