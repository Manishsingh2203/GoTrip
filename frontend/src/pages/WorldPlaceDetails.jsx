import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, Share2, Heart, ArrowLeft, Globe, Calendar, Users, Utensils, Hotel } from "lucide-react";
import axios from "axios";

import { hotelsAPI } from "../services/hotelsAPI";
import { restaurantsAPI } from "../services/restaurantsAPI";
import AdvancedMap from "../components/maps/AdvancedMap";
import TravelChatbot from '../components/chat/TravelChatbot';

const WorldPlaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const place = location.state?.place;

  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [weather, setWeather] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);

  const lat = place?.lat ?? (place?.location?.coordinates?.coordinates?.[1] ?? null);
  const lng = place?.lng ?? (place?.location?.coordinates?.coordinates?.[0] ?? null);
  const heroImg = place?.image || (place?.images && place.images[0]) || "/api/placeholder/600/400";

  useEffect(() => {
    if (!place) return;
    fetchHotels();
    fetchRestaurants();
    if (lat && lng) fetchWeather(lat, lng);
    fetchCountryInfo(place.country || place.city || place.countryName);
  }, [place]);

  const fetchHotels = async () => {
    try {
      const q = place.city || place.name;
      const res = await hotelsAPI.search(q);
      setHotels(res.data?.data || []);
    } catch (err) {
      console.warn("Hotels fetch error", err);
      setHotels([]);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const q = place.city || place.name;
      const res = await restaurantsAPI.search(q);
      setRestaurants(res.data?.data || []);
    } catch (err) {
      console.warn("Restaurants fetch error", err);
      setRestaurants([]);
    }
  };

  const fetchWeather = async (latVal, lngVal) => {
    try {
      const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latVal}&longitude=${lngVal}&current_weather=true`);
      const cw = res.data?.current_weather;
      if (cw) {
        setWeather({
          temp: cw.temperature,
          wind_speed: cw.windspeed
        });
      }
    } catch (err) {
      console.warn("Weather fetch error", err);
    }
  };

  const fetchCountryInfo = async (countryName) => {
    if (!countryName) return;
    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (data) {
        setCountryInfo({
          name: data.name?.common,
          flag: data.flags?.svg || data.flags?.png,
          capital: Array.isArray(data.capital) ? data.capital[0] : data.capital,
          population: data.population,
        });
      }
    } catch (err) {
      console.warn("Country info fetch error", err);
    }
  };

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
      {/* Header - Sticky for better mobile UX */}
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
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e599e] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-semibold text-[#222222] truncate leading-tight">
                {place.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#767676] truncate hidden sm:block">
                Discover details about {place.name}
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
                  {place.city || "Unknown"}, {place.country || "Unknown"}
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

      {/* Main Grid Layout - Single Col Mobile, 3 Cols Desktop */}
      <div className="max-w-6xl mx-auto px-4 mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-12 sm:pb-20">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-6">

          {/* About Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-[#222222] mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-[#1e599e]">📖</span> About
            </h2>
            <p className="text-[#484848] leading-relaxed text-sm sm:text-base text-justify sm:text-left">
              {place.description || "No description available for this destination."}
            </p>
            
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

          {/* Map Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-[#222222] text-sm sm:text-base">📍 Location Map</h2>
            </div>
            <div className="p-2 sm:p-4">
              <div className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-gray-200">
                <AdvancedMap place={place} />
              </div>
            </div>
          </div>

          {/* Travel Options - Better Mobile Buttons */}
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

        {/* RIGHT COLUMN (Sidebar) */}
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

          {/* Country Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-[#222222] mb-4">Country Information</h3>
            {countryInfo ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {countryInfo.flag && (
                    <img src={countryInfo.flag} alt="flag" className="h-8 w-12 object-cover rounded shadow-sm" />
                  )}
                  <div className="font-bold text-[#222222] text-lg">{countryInfo.name}</div>
                </div>
                
                <div className="space-y-3 pt-2">
                  {countryInfo.capital && (
                    <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
                      <span className="text-[#767676] text-sm">Capital</span>
                      <span className="font-semibold text-[#222222] text-sm">{countryInfo.capital}</span>
                    </div>
                  )}
                  {countryInfo.population && (
                    <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
                      <span className="text-[#767676] text-sm">Population</span>
                      <span className="font-semibold text-[#222222] text-sm">
                        {new Intl.NumberFormat().format(countryInfo.population)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-[#767676] py-4 bg-gray-50 rounded-lg text-sm">
                Info loading or unavailable...
              </div>
            )}
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
      
      {/* AI Chatbot */}
      <TravelChatbot />
    </div>
  );
};

export default WorldPlaceDetails;