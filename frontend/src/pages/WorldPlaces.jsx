import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelChatbot from '../components/chat/TravelChatbot';
import { 
  MapPin, 
  Star, 
  ArrowLeft, 
  Globe, 
  Grid, 
  List,
  Heart
} from "lucide-react";

const WorldPlaces = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const query = location.state?.query || "";
  const places = location.state?.places || [];

  // Enhance world places same style
  const enhancedPlaces = places.map((place) => ({
    ...place,
    rating: place.rating || (4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random() * 900) + 100,
    category:
      ["beach", "mountain", "city", "historical", "adventure"][
        Math.floor(Math.random() * 5)
      ],
  }));

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "beach", name: "Beach" },
    { id: "mountain", name: "Mountain" },
    { id: "city", name: "City" },
    { id: "historical", name: "Historical" },
    { id: "adventure", name: "Adventure" },
  ];

  const handleOpenDetails = (place) => {
    navigate("/world-place-details", {
      state: {
        place: {
          ...place,
          city: place.city || place.name,
          country:
            place.country ||
            place.countryName ||
            place.location?.country ||
            "Unknown",
          lat: place.lat || place.latitude || place.coordinates?.lat || null,
          lng: place.lng || place.longitude || place.coordinates?.lng || null,
        },
        isWorld: true,
      },
    });
  };

  const filteredPlaces = enhancedPlaces.filter(
    (place) => selectedCategory === "all" || place.category === selectedCategory
  );

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#484848] hover:text-[#222222] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>

            <Globe className="h-6 w-6 text-[#1e599e]" />

            <div>
              <h1 className="text-xl font-semibold text-[#222222]">
                World Destinations
              </h1>
              <p className="text-sm text-[#767676]">Results for "{query}"</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Count */}
            <span className="font-medium text-[#222222]">
              {sortedPlaces.length} results
            </span>

            {/* Filters */}
            <div className="flex gap-3">

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-[#F7F7F7] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white text-[#1e599e]"
                      : "text-[#767676]"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white text-[#1e599e]"
                      : "text-[#767676]"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlaces.map((place, i) => (
              <div
                key={i}
                onClick={() => handleOpenDetails(place)}
                className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-[#0CA9A5]"
              >
                {/* IMAGE */}
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={place.image || "/api/placeholder/400/300"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Category */}
                  <div className="absolute bottom-3 left-3 bg-[#222222]/70 text-white px-2 py-1 rounded text-xs capitalize">
                    {place.category}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Name */}
                  <h3 className="text-[15px] font-bold text-[#222222] line-clamp-2">
                    {place.name}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-[#767676] mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-[#767676]" />
                    {place.city || "Unknown"}, {place.country || "World"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-[#484848]">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{place.rating}</span>
                    <span className="text-[#767676] text-xs">
                      {place.reviews} reviews
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-4">
            {sortedPlaces.map((place, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 hover:shadow transition cursor-pointer p-4 flex gap-4 hover:border-[#0CA9A5]"
                onClick={() => handleOpenDetails(place)}
              >
                {/* IMG */}
                <img
                  src={place.image}
                  className="w-40 h-32 rounded object-cover"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#222222]">{place.name}</h3>

                  <div className="flex items-center text-sm text-[#767676] mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {place.city || "Unknown"}, {place.country || "World"}
                  </div>

                  <p className="text-sm text-[#484848] mt-2 line-clamp-2">
                    {place.description ||
                      "Explore this amazing destination with incredible experiences."}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="bg-[#F7F7F7] text-[#484848] px-2 py-1 rounded text-xs capitalize">
                      {place.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-[#222222]">{place.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TravelChatbot />
    </div>
  );
};

export default WorldPlaces;