import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAITrains } from "../services/aiTravelAPI";
import Loader from "../components/common/Loader";
import TravelChatbot from '../components/chat/TravelChatbot';
import {
  Train,
  Clock,
  MapPin,
  IndianRupee,
  Users,
  Calendar,
  Search,
  Shield,
  Wifi,
  Utensils,
  ChevronDown,
  ArrowLeft
} from "lucide-react";

export default function TrainsSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [from, setFrom] = useState(location.state?.from || "");
  const [to, setTo] = useState(location.state?.to || "");
  const [date, setDate] = useState(location.state?.date || "");
  const [passengers, setPassengers] = useState(location.state?.passengers || "1");
  const [classType, setClassType] = useState(location.state?.classType || "any");
  
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState("");

  // Filters
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [trainType, setTrainType] = useState("any");
  const [sortBy, setSortBy] = useState("departure");

  // Search function
  const searchTrains = async (silent = false) => {
    if (!from || !to || !date) {
      setError("Please fill all fields");
      return;
    }

    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const payload = { from, to, date, passengers, classType };
      const data = await getAITrains(payload);

      if (!data || !Array.isArray(data)) {
        setTrains([]);
        setError("No trains found. Try different stations or date.");
      } else {
        const normalized = data.map((train, index) => ({
          id: train.id || `train-${index}`,
          train_name: train.train_name || "Unknown Train",
          train_number: train.train_number || "",
          departure_time: train.departure_time || "00:00",
          arrival_time: train.arrival_time || "00:00",
          duration: train.duration || "",
          classes: Array.isArray(train.classes) ? train.classes : [],
          booking_redirect_url: train.booking_redirect_url || "https://www.irctc.co.in/",
          from_station: train.from_station || from,
          to_station: train.to_station || to,
          train_type: train.train_type || "Express",
          amenities: train.amenities || ["WiFi", "Food", "AC"].slice(0, Math.floor(Math.random() * 3) + 1),
          delay: train.delay || "On Time"
        }));
        setTrains(normalized);
        
        const allPrices = normalized.flatMap(t => 
          t.classes.map(c => Number(c.price_in_INR) || 0)
        ).filter(p => p > 0);
        
        if (allPrices.length) {
          const min = Math.min(...allPrices);
          const max = Math.max(...allPrices);
          setPriceRange([min, max]);
        }
      }
    } catch (err) {
      console.log("Train search error:", err);
      setError("Failed to fetch trains. Please try again.");
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we arrived here from Home with pre-filled data,
    // auto-run the search once so the user immediately sees results.
    if (location.state && from && to && date) {
      searchTrains(false);
    }
  }, [location.state, from, to, date]);

  // Filter and sort trains
  const filteredTrains = useMemo(() => {
    let list = trains.filter(train => {
      const minPrice = Math.min(...train.classes.map(c => Number(c.price_in_INR) || 0));
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) return false;
      if (trainType !== "any" && train.train_type !== trainType) return false;
      if (classType !== "any" && !train.classes.some(c => c.className === classType)) return false;
      return true;
    });

    switch (sortBy) {
      case "departure":
        list.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
        break;
      case "arrival":
        list.sort((a, b) => a.arrival_time.localeCompare(b.arrival_time));
        break;
      case "duration":
        list.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
        break;
      case "price":
        list.sort((a, b) => {
          const minA = Math.min(...a.classes.map(c => Number(c.price_in_INR) || 0));
          const minB = Math.min(...b.classes.map(c => Number(c.price_in_INR) || 0));
          return minA - minB;
        });
        break;
      default:
        break;
    }

    return list;
  }, [trains, priceRange, trainType, classType, sortBy]);

  function parseDuration(dur) {
    const match = dur.match(/(\d+)\s*h(?:ours?)?\s*(\d+)?\s*m?/i);
    if (match) {
      const h = Number(match[1] || 0);
      const m = Number(match[2] || 0);
      return h * 60 + m;
    }
    return 9999;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] overflow-x-hidden">
     <header className="bg-white border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex items-center gap-3">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#767676] hover:text-[#222222] transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      {/* Train Icon */}
      <Train className="h-6 w-6 text-[#1e599e]" /> 

      <div>
        <h1 className="text-xl font-semibold text-[#222222]">Trains</h1>
        <p className="text-sm text-[#767676]">Find your perfect journey</p>
      </div>

    </div>
  </div>
</header>


{/* FULL WIDTH TRAIN SHOWCASE VIDEO */}
<div className="w-full max-w-7xl mx-auto px-4 py-4">
  <h2 className="text-xl font-semibold text-[#222222] mb-3">
    Experience India's Best Train Journeys
  </h2>

   <div className="relative w-full h-56 sm:h-96 md:h-[420px] lg:h-[480px] bg-black rounded-xl overflow-hidden shadow-lg group">
    <video
      src="/video/train-journey.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />

    {/* Title */}
    <div className="absolute bottom-4 left-4 md:left-6 text-[#ffffff] text-shadow: 0 2px 4px rgba(0,0,0,0.8);
 text-lg sm:text-xl md:text-2xl font-semibold drop-shadow-2xl">
      Royal • Scenic • Comfortable
    </div>

    {/* Gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
  </div>
</div>

 


      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From Station"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5]"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To Station"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5]"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5]"
              />
            </div>
            
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5] appearance-none"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#767676]" />
            </div>
            
            <button
              onClick={() => searchTrains(false)}
              className="bg-[#0A2F5A] text-white py-2 rounded-lg font-medium hover:bg-[#0A2F5A] transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-[#222222]">Filters</h3>
                <button
                  onClick={() => {
                    setTrainType("any");
                    setClassType("any");
                    setPriceRange([0, 5000]);
                  }}
                  className="text-[#1e599e] text-sm hover:text-[#1e599e]"
                >
                  Reset
                </button>
              </div>

              {/* Train Type */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[#222222] mb-2">Train Type</h4>
                <select
                  value={trainType}
                  onChange={(e) => setTrainType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e] text-[#484848]"
                >
                  <option value="any">Any Type</option>
                  <option value="Vande Bharat">Vande Bharat</option>
                  <option value="Rajdhani">Rajdhani</option>
                  <option value="Shatabdi">Shatabdi</option>
                  <option value="Express">Express</option>
                </select>
              </div>

              {/* Class Type */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[#222222] mb-2">Class</h4>
                <select
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e] text-[#484848]"
                >
                  <option value="any">Any Class</option>
                  <option value="1A">1A - First AC</option>
                  <option value="2A">2A - Second AC</option>
                  <option value="3A">3A - Third AC</option>
                  <option value="SL">SL - Sleeper</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[#222222] mb-2">Price Range</h4>
                <div className="flex justify-between text-sm text-[#767676] mb-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[#1e599e]"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#222222]">
                    {filteredTrains.length} Trains from {from} to {to}
                  </h2>
                  <p className="text-[#767676] text-sm">
                    {date} • {passengers} Passenger{passengers > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e] text-[#484848]"
                  >
                    <option value="departure">Departure Time</option>
                    <option value="arrival">Arrival Time</option>
                    <option value="duration">Duration</option>
                    <option value="price">Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trains List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader />
                </div>
              ) : filteredTrains.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <Train className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-[#222222] mb-1">No trains found</h3>
                  <p className="text-[#767676] text-sm mb-3">Try adjusting your filters</p>
                </div>
              ) : (
                filteredTrains.map((train) => (
                  <div key={train.id} className="bg-white rounded-lg border border-gray-200 hover:border-[#1e599e] transition-colors">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Train Details */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-[#222222]">{train.train_name}</h3>
                              <p className="text-[#767676] text-sm">{train.train_number} • {train.train_type}</p>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded ${
                              train.delay === "On Time" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {train.delay}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#222222]">{train.departure_time}</div>
                              <div className="text-[#767676] text-sm">{train.from_station}</div>
                            </div>
                            
                            <div className="flex-1 px-4 text-center">
                              <div className="flex items-center justify-center gap-2 text-[#767676] mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">{train.duration}</span>
                              </div>
                              <div className="relative">
                                <div className="h-px bg-gray-300"></div>
                                <Train className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#222222]">{train.arrival_time}</div>
                              <div className="text-[#767676] text-sm">{train.to_station}</div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex items-center gap-4 flex-wrap mb-3">
                            {train.amenities?.includes("WiFi") && (
                              <div className="flex items-center gap-1 text-[#767676] text-sm">
                                <Wifi className="h-3 w-3" />
                                WiFi
                              </div>
                            )}
                            {train.amenities?.includes("Food") && (
                              <div className="flex items-center gap-1 text-[#767676] text-sm">
                                <Utensils className="h-3 w-3" />
                                Food
                              </div>
                            )}
                          </div>

                          {/* Available Classes */}
                          <div className="flex gap-2 flex-wrap">
                            {train.classes.slice(0, 3).map((cls, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-2 text-center min-w-20">
                                <div className="font-medium text-sm text-[#222222]">{cls.className}</div>
                                <div className="flex items-center justify-center gap-1 text-green-700 font-semibold text-sm">
                                  <IndianRupee className="h-3 w-3" />
                                  {cls.price_in_INR}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="w-full sm:w-32 flex flex-col justify-between items-start sm:items-end mt-4 sm:mt-0">
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 text-lg font-semibold text-[#222222]">
                              <IndianRupee className="h-4 w-4" />
                              {Math.min(...train.classes.map(c => Number(c.price_in_INR) || 0))}
                            </div>
                            <div className="text-[#767676] text-xs">starting price</div>
                          </div>

                          <button
                            onClick={() => window.open(train.booking_redirect_url, "_blank")}
                            className="bg-[#0A2F5A] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#0A2F5A] transition-colors"
                          >
                            Book Now
                          </button>
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