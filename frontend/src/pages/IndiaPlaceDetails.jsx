import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Star, Share2, Heart, ArrowLeft,
  Calendar, Users, Utensils, Hotel, Globe
} from "lucide-react";

import axios from "axios";
import { hotelsAPI } from "../services/hotelsAPI";
import { restaurantsAPI } from "../services/restaurantsAPI";
import AdvancedMap from "../components/maps/AdvancedMap";
import TravelChatbot from '../components/chat/TravelChatbot';
import { useHotels } from "../hooks/useHotels";
import { useRestaurants } from "../hooks/useRestaurants";

const IndiaPlaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const place = location.state?.place;

  const { hotels, fetchHotelsByPlace } = useHotels();
  const { restaurants, fetchRestaurantsByPlace } = useRestaurants();

  const [weather, setWeather] = useState(null);

  const lat = place?.lat ?? (place?.location?.coordinates?.coordinates?.[1] ?? null);
  const lng = place?.lng ?? (place?.location?.coordinates?.coordinates?.[0] ?? null);
  const heroImg = place?.image || (place?.images && place.images[0]) || "/api/placeholder/600/400";

  useEffect(() => {
    if (!place) return;
    fetchHotelsByPlace(place._id);
    fetchRestaurantsByPlace(place._id);
  }, [place]);

  // ... (Removed redundant fetch functions since you are using hooks, kept if you need them specifically)

  if (!place) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#767676] mb-4">No place data available</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#0CA9A5] text-white px-6 py-3 rounded-lg hover:bg-[#0CA9A5] transition-colors font-medium shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">

      {/* Header - Sticky & Responsive */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-2 text-[#484848] hover:text-[#222222] transition-colors bg-gray-100 sm:bg-transparent p-2 sm:p-0 rounded-full sm:rounded-none"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="h-6 w-px bg-gray-300 hidden sm:block mx-2"></div>
            
            {/* India Flag */}
            <img 
              src="https://flagcdn.com/w40/in.png" 
              className="h-5 sm:h-6 rounded shadow flex-shrink-0" 
              alt="India flag" 
            />

            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-semibold text-[#222222] truncate leading-tight">
                {place.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#767676] truncate hidden sm:block">
                Explore {place.name}, India
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Responsive Height */}
      <div className="max-w-6xl mx-auto px-4 mt-4 sm:mt-6">
        <div className="relative h-56 sm:h-80 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200 shadow-md">
          <img src={heroImg} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-md">
              {place.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {place.city || "Unknown"}, India
                </span>
              </div>
              {place.rating && (
                <div className="flex items-center gap-1 bg-yellow-400/20 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-yellow-400/30">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-yellow-200">{place.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Stack on Mobile, Grid on Desktop */}
      <div className="max-w-6xl mx-auto px-4 mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-12 sm:pb-20">

        {/* Content Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-[#222222] mb-3 sm:mb-4 flex items-center gap-2">
               About
            </h2>
            <p className="text-[#484848] leading-relaxed text-sm sm:text-base text-justify sm:text-left">
              {place.description || "No description available."}
            </p>

            {/* Activities */}
            {place.activities?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-[#222222] mb-3 text-sm sm:text-base">Popular Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {place.activities.map((activity, i) => (
                    <span key={i} className="bg-[#F0F5FA] text-[#1e599e] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-[#E1EAF5]">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-[#222222] text-sm sm:text-base">📍 Location</h2>
            </div>
            <div className="p-2 sm:p-4">
              <div className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-gray-200 relative z-0">
                <AdvancedMap place={place} />
              </div>
            </div>
          </div>

          {/* Travel Options - Responsive Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-[#222222] text-sm sm:text-base">✈️ Ready to Book?</h2>
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/hotels-search", { state: { placeName: place.name } })}
                className="flex-1 bg-[#1e599e] text-white py-3.5 px-4 rounded-xl font-semibold text-sm sm:text-base text-center hover:bg-[#164a85] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <Hotel className="w-5 h-5 group-hover:animate-bounce" />
                Find Hotels
              </button>

              <button
                onClick={() => navigate("/flights-search", { state: { destination: place.name } })}
                className="flex-1 bg-[#222222] text-white py-3.5 px-4 rounded-xl font-semibold text-sm sm:text-base text-center hover:bg-[#000000] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform">✈️</span> 
                Find Flights
              </button>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

          {/* Things To Do */}
          <div className="bg-[#faefd9] rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-[#222222] mb-4 flex items-center gap-2">
              🌟 Top Things To Do
            </h3>

            <div className="space-y-4">
              {[
                { icon: "📸", text: `Explore photo spots in ${place.name}` },
                { icon: "🚶‍♂️", text: "Take a walking tour" },
                { icon: "🛍️", text: "Visit local street markets" },
                { icon: "🌅", text: "Sunset viewpoints" },
                { icon: "🍽️", text: "Try famous local dishes" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="text-sm text-[#484848] font-medium leading-tight pt-1">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Facts */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-[#222222] mb-4">Quick Facts</h3>

            <div className="space-y-5">
              {/* Best Time */}
              {(place.bestTime || place.bestTimeToVisit) && (
                <div className="relative pl-4 border-l-2 border-[#0CA9A5]">
                  <p className="text-xs text-[#767676] font-semibold uppercase tracking-wider mb-1">Best Time To Visit</p>
                  <p className="font-bold text-[#222222] text-sm">
                    {place.bestTime || place.bestTimeToVisit?.join(" - ")}
                  </p>
                </div>
              )}

              {/* Must Visit */}
              <div>
                 <p className="text-xs text-[#767676] font-semibold uppercase tracking-wider mb-3">⭐ Must-Visit Nearby</p>
                 <ul className="space-y-2.5">
                  {["Viewpoints / Sunset Points", "Local Street Markets", "Heritage Sites"].map((spot, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#484848]">
                      <span className="text-[#1e599e] mt-1">•</span>
                      <span>{spot}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div>
                <p className="text-xs text-[#767676] font-semibold uppercase tracking-wider mb-3">💡 Travel Tips</p>
                <ul className="space-y-2.5">
                  {["Carry water & cash", "Early morning is best", "Wear comfy shoes"].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#484848]">
                      <span className="text-[#0CA9A5] mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      <TravelChatbot />
    </div>
  );
};

export default IndiaPlaceDetails;