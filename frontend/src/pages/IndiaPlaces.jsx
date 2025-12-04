import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelChatbot from "../components/chat/TravelChatbot";
import {
  MapPin,
  Star,
  ArrowLeft,
  Globe,
  Grid,
  List,
  Heart,
} from "lucide-react";

const IndiaPlaces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const query = location.state?.query || "";
  const places = location.state?.places || [];

  // Enhance places
  const enhancedPlaces = places.map((place) => ({
    ...place,
    rating: place.rating || (4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random() * 900) + 100,
    country: "India",
    category:
      ["beach", "mountain", "city", "historical", "adventure"][
        Math.floor(Math.random() * 5)
      ],
  }));

  const categories = [
    { id: "all", name: "All Categories", icon: Globe },
    {
      id: "beach",
      name: "Beach",
      count: enhancedPlaces.filter((p) => p.category === "beach").length,
    },
    {
      id: "mountain",
      name: "Mountain",
      count: enhancedPlaces.filter((p) => p.category === "mountain").length,
    },
    {
      id: "city",
      name: "City",
      count: enhancedPlaces.filter((p) => p.category === "city").length,
    },
    {
      id: "historical",
      name: "Historical",
      count: enhancedPlaces.filter((p) => p.category === "historical").length,
    },
    {
      id: "adventure",
      name: "Adventure",
      count: enhancedPlaces.filter((p) => p.category === "adventure").length,
    },
  ];

  const handleOpenDetails = (place) => {
    navigate("/india-place-details", {
      state: { place, isIndia: true },
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
              className="flex items-center gap-2 text-[#767676] hover:text-[#222222]"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>

            <img
              src="https://flagcdn.com/w40/in.png"
              className="h-6 rounded shadow"
              alt="India flag"
            />

            <div>
              <h1 className="text-xl font-semibold text-[#222222]">
                India Destinations
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
            <span className="font-medium text-[#222222]">
              {sortedPlaces.length} results
            </span>

            <div className="flex gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}{" "}
                    {category.count ? `(${category.count})` : ""}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5]"
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
        {sortedPlaces.length === 0 ? (
          <div className="text-center py-12 text-[#767676]">No results found.</div>
        ) : viewMode === "grid" ? (
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
                    {place.city}, India
                  </p>

                  {/* Rating Row */}
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
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow hover:border-[#0CA9A5]"
                onClick={() => handleOpenDetails(place)}
              >
                <div className="flex gap-4">
                  <img
                    src={place.image}
                    className="w-40 h-32 object-cover rounded"
                    alt={place.name}
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-[#222222]">
                      {place.name}
                    </h3>

                    <div className="flex items-center text-sm text-[#767676] mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {place.city}, India
                    </div>

                    <p className="text-sm text-[#484848] mt-3 line-clamp-2">
                      {place.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="bg-[#F7F7F7] text-[#484848] px-2 py-1 rounded text-xs capitalize">
                        {place.category}
                      </span>

                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-[#222222]">{place.rating}</span>
                      </div>
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

export default IndiaPlaces;