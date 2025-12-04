import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAIFlights } from "../services/aiTravelAPI";
import Loader from "../components/common/Loader";
import TravelChatbot from '../components/chat/TravelChatbot';

import {
  Plane,
  Clock,
  IndianRupee,
  MapPin,
  Users,
  Calendar,
  Shield,
  Wifi,
  Utensils,
  ChevronDown,
  ArrowLeft
} from "lucide-react";

export default function FlightsSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [from, setFrom] = useState(location.state?.from || "");
  const [to, setTo] = useState(location.state?.to || "");
  const [date, setDate] = useState(location.state?.date || "");
  const [travelClass, setTravelClass] = useState(location.state?.travelClass || "economy");
  const [passengers, setPassengers] = useState(location.state?.passengers || "1");

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");

  // Filters
  const [stopsFilter, setStopsFilter] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("recommended");

  const searchFlights = async (silent = false) => {
    if (!from || !to || !date) {
      setError("Please fill From, To and Date.");
      return;
    }

    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const payload = { from, to, date, travelClass, passengers };
      const data = await getAIFlights(payload);

      if (!data || !Array.isArray(data)) {
        setFlights([]);
        setError("No flights found. Try different dates.");
      } else {
        const normalized = data.map((f) => ({
          id: f.id || Math.random(),
          airline: f.airline || "Unknown",
          flight_code: f.flight_code || "",
          departure_time: f.departure_time || "00:00",
          arrival_time: f.arrival_time || "00:00",
          duration: f.duration || "",
          stops:
            typeof f.stops === "number"
              ? f.stops
              : f.stops === "Non-stop"
                ? 0
                : Number(f.stops) || 1,
          price_in_INR: Number(f.price_in_INR) || 0,
          original_price: Number(f.original_price) || Number(f.price_in_INR) * 1.2,
          baggage_limit: f.baggage_limit || "15 kg",
          refundable: !!f.refundable,
          booking_redirect_url:
            f.booking_redirect_url || "https://www.makemytrip.com/flights",
          aircraft: f.aircraft || "A320",
          amenities:
            f.amenities ||
            ["Entertainment", "Meals", "WiFi"].slice(
              0,
              Math.floor(Math.random() * 3) + 1
            ),
        }));

        setFlights(normalized);

        const prices = normalized
          .map((f) => f.price_in_INR)
          .filter((p) => p > 0);

        if (prices.length) {
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      }
    } catch (err) {
      console.error("Flights fetch error:", err);
      setError("Failed to fetch flights. Please try again.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.from && location.state?.to && location.state?.date) {
      searchFlights(false);
    }
  }, []); // ⭐ Empty dependency array


  // Filter + Sort
  const filteredFlights = useMemo(() => {
    let list = flights.filter((f) => {
      const price = f.price_in_INR || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      if (stopsFilter === "non-stop" && f.stops !== 0) return false;
      if (stopsFilter === "1-stop" && f.stops !== 1) return false;
      if (stopsFilter === "2-plus" && f.stops < 2) return false;

      return true;
    });

    switch (sortBy) {
      case "cheapest":
        list.sort((a, b) => a.price_in_INR - b.price_in_INR);
        break;
      case "fastest":
        list.sort(
          (a, b) => parseDuration(a.duration) - parseDuration(b.duration)
        );
        break;
      case "earliest":
        list.sort(
          (a, b) =>
            parseTimeToMinutes(a.departure_time) -
            parseTimeToMinutes(b.departure_time)
        );
        break;
      default:
        list.sort(
          (a, b) =>
            a.price_in_INR * 0.7 + parseDuration(a.duration) * 30 -
            (b.price_in_INR * 0.7 + parseDuration(b.duration) * 30)
        );
    }

    return list;
  }, [flights, stopsFilter, priceRange, sortBy]);

  function parseDuration(dur = "") {
    const match = dur.match(/(\d+)\s*h(?:ours?)?\s*(\d+)?\s*m?/i);
    if (match) {
      const h = Number(match[1] || 0);
      const m = Number(match[2] || 0);
      return h * 60 + m;
    }
    return 9999;
  }

  function parseTimeToMinutes(timeStr = "00:00") {
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#767676] hover:text-[#222222] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>

            <Plane className="h-6 w-6 text-[#1e599e]" />

            <div>
              <h1 className="text-xl font-semibold text-[#222222]">Flights</h1>
              <p className="text-sm text-[#767676]">Find your perfect flight</p>
            </div>
          </div>
        </div>
      </header>

      {/* Airline Video Section */}
      <div className="max-w-7xl mx-auto px-4 py-2 overflow-x-hidden">
        <div className="w-full mx-auto px-4 py-2">
          <h2 className="text-xl font-semibold text-[#222222] mb-3">
            Our Airline Partners
          </h2>

          <div className="relative w-full h-56 sm:h-96 md:h-[420px] lg:h-[480px] bg-black rounded-xl overflow-hidden shadow-lg group">
            <video
              src="/video/flight-travel.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute bottom-4 left-4 md:left-6 text-[#8bb357] text-lg sm:text-xl md:text-2xl font-semibold drop-shadow-2xl">
              Fly With World-Class Airlines
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* From */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1"
              />
            </div>

            {/* To */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1"
              />
            </div>

            {/* Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0CA9A5] focus:ring-1"
              />
            </div>

            {/* Passengers */}
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-[#767676]" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-1 focus:ring-[#0CA9A5]"
              >
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#767676]" />
            </div>

            {/* Search Button */}
            <button
              onClick={() => searchFlights(false)}
              className="bg-[#0A2F5A] text-white py-2 rounded-lg font-medium hover:bg-[#0A2F5A]"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* FILTER SIDEBAR — FIXED VERSION */}
          <div className="w-full lg:w-72">
            <div className="bg-white rounded-lg border border-gray-200 p-4">

              {/* Stops Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[#222222] mb-2">Stops</h4>
                <select
                  value={stopsFilter}
                  onChange={(e) => setStopsFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="any">Any</option>
                  <option value="non-stop">Non-stop</option>
                  <option value="1-stop">1 Stop</option>
                  <option value="2-plus">2+ Stops</option>
                </select>
              </div>

              {/* Sort by */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[#222222] mb-2">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="cheapest">Price: Low to High</option>
                  <option value="fastest">Fastest</option>
                  <option value="earliest">Earliest</option>
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
                  max="50000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-[#1e599e]"
                />
              </div>
            </div>
          </div>

          {/* RESULTS LIST */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#222222]">
                    {filteredFlights.length} Flights from {from} to {to}
                  </h2>
                  <p className="text-[#767676] text-sm">
                    {date} • {passengers} Traveler{passengers > 1 ? "s" : ""}
                  </p>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="cheapest">Price: Low to High</option>
                  <option value="fastest">Fastest</option>
                  <option value="earliest">Earliest</option>
                </select>
              </div>
            </div>

            {/* FLIGHT CARDS */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader />
                </div>
              ) : filteredFlights.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-[#222222] mb-1">
                    No flights found
                  </h3>
                  <p className="text-[#767676] text-sm mb-3">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                filteredFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="bg-white rounded-lg border hover:border-[#1e599e] transition p-4 break-words"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 w-full overflow-hidden">

                      {/* LEFT = DETAILS */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-[#222222]">{flight.airline}</h3>
                            <p className="text-[#767676] text-sm">
                              {flight.flight_code} • {flight.aircraft}
                            </p>
                          </div>

                          {flight.refundable && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <Shield className="h-3 w-3" />
                              Refundable
                            </div>
                          )}
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-center">
                            <div className="text-lg font-bold">{flight.departure_time}</div>
                            <div className="text-[#767676] text-sm">{from}</div>
                          </div>

                          <div className="flex-1 px-2 sm:px-4 text-center min-w-0">
                            <div className="flex items-center justify-center gap-2 text-[#767676] mb-1">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{flight.duration}</span>
                            </div>
                            <div className="relative">
                              <div className="h-px bg-gray-300"></div>
                              <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-[#1e599e]" />
                            </div>
                            <div className="text-[#767676] text-xs mt-1">
                              {flight.stops === 0
                                ? "Non-stop"
                                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-bold">{flight.arrival_time}</div>
                            <div className="text-[#767676] text-sm">{to}</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex items-center gap-4 flex-wrap text-sm text-[#767676]">
                          <span>{flight.baggage_limit}</span>

                          {flight.amenities?.includes("WiFi") && (
                            <div className="flex items-center gap-1">
                              <Wifi className="h-3 w-3" />
                              WiFi
                            </div>
                          )}

                          {flight.amenities?.includes("Meals") && (
                            <div className="flex items-center gap-1">
                              <Utensils className="h-3 w-3" />
                              Meals
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT = PRICE */}
                      <div className="w-full sm:w-32 flex flex-col justify-between items-end sm:items-end mt-4 sm:mt-0 shrink-0">
                        <div className="text-right">
                          <div className="text-[#767676] text-sm line-through">
                            ₹{flight.original_price}
                          </div>
                          <div className="flex items-center justify-end gap-1 text-lg font-semibold">
                            <IndianRupee className="h-4 w-4" />
                            {flight.price_in_INR}
                          </div>
                          <div className="text-[#767676] text-xs">per person</div>
                        </div>

                        <button
                          onClick={() =>
                            window.open(flight.booking_redirect_url, "_blank")
                          }
                          className="bg-[#0A2F5A] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#0A2F5A]"
                        >
                          Book Now
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Chatbot */}
      <TravelChatbot />
    </div>
  );
}
