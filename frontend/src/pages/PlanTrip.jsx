import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  Smartphone,
} from 'lucide-react';

import { useNavigate } from "react-router-dom";
import VoiceTripAssistant from "../components/widgets/VoiceTripAssistant";
import ErrorMessage from '../components/common/ErrorMessage';
import { aiAPI } from '../services/aiAPI';

const PlanTrip = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: { adults: 1, children: 0, infants: 0 },
    budget: 'mid-range',
    interests: [],
    tripType: 'leisure'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const highlightLastWord = (text) => {
    if (!text) return "";
    const words = text.trim().split(" ");
    if (words.length === 1) return text; // only one word
    const last = words.pop();
    return `${words.join(" ")} <span class="text-[#9d4dff]">${last}</span>`;
  };
  

  // Simple slides
  const slides = [
    {
      id: 1,
      title: "AI Travel Planner",
      description: "Get personalized itineraries in minutes",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "Smart Recommendations",
      description: "Discover hidden gems and local experiences",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    }
  ];

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simple data
  const interestsList = [
    'Adventure', 'Culture', 'Food', 'Nature', 'Beach', 'Shopping', 'History', 'Photography'
  ];

  const tripTypes = [
    { value: 'leisure', label: 'Leisure' },
    { value: 'business', label: 'Business' },
    { value: 'honeymoon', label: 'Honeymoon' },
    { value: 'family', label: 'Family' },
  ];

  const budgetOptions = [
    { level: 'budget', label: 'Budget' },
    { level: 'mid-range', label: 'Mid Range' },
    { level: 'luxury', label: 'Luxury' },
  ];

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravelersChange = (type, value) => {
    setTripData((prev) => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: Math.max(0, parseInt(value, 10) || 0)
      }
    }));
  };

  const toggleInterest = (interest) => {
    setTripData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Duration calc
  const calculateTripDuration = () => {
    if (!tripData.startDate || !tripData.endDate) return 0;
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  // Submit handler
  const safeParseJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      try {
        return JSON.parse(text.replace(/```json/gi, '').replace(/```/g, ''));
      } catch {
        return null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const duration = calculateTripDuration();
      const requestData = {
        destination: tripData.destination,
        duration,
        interests: tripData.interests,
        budget: tripData.budget,
        travelers: tripData.travelers,
        tripType: tripData.tripType
      };

      const response = await aiAPI.generateItinerary(requestData);
      const raw = response?.data?.data;
      const parsed = safeParseJSON(raw);

      if (!parsed) throw new Error("AI returned invalid data");
      navigate("/itinerary", { state: { plan: parsed } });

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] overflow-x-hidden">

      {/* Simple Hero */}
      <div className="relative h-64 bg-[#1e599e]">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={s.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#222222]/60" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
          <h1
  className="text-3xl md:text-4xl text-white font-bold mb-2"
  dangerouslySetInnerHTML={{ __html: highlightLastWord(slides[currentSlide].title) }}
></h1>

            <p className="text-white/90">{slides[currentSlide].description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-[#222222] mb-6">Plan Your Trip</h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-medium text-[#484848] mb-2">Trip Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {tripTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTripData(prev => ({ ...prev, tripType: t.value }))}
                        className={`border rounded-lg p-3 text-sm font-medium ${
                          tripData.tripType === t.value
                            ? "bg-[#1e599e] text-white border-[#1e599e]"
                            : "bg-white border-gray-300 hover:border-[#1e599e]"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-[#484848] mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={tripData.destination}
                    onChange={handleInputChange}
                    placeholder="Where do you want to go?"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#484848] mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      name="startDate"
                      value={tripData.startDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#484848] mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      name="endDate"
                      value={tripData.endDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-sm font-medium text-[#484848] mb-2">
                    Travelers
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-[#767676] mb-1">Adults</div>
                      <input
                        type="number"
                        min="1"
                        value={tripData.travelers.adults}
                        onChange={(e) => handleTravelersChange('adults', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-center focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-[#767676] mb-1">Children</div>
                      <input
                        type="number"
                        min="0"
                        value={tripData.travelers.children}
                        onChange={(e) => handleTravelersChange('children', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-center focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-[#767676] mb-1">Infants</div>
                      <input
                        type="number"
                        min="0"
                        value={tripData.travelers.infants}
                        onChange={(e) => handleTravelersChange('infants', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-center focus:border-[#1e599e] focus:ring-1 focus:ring-[#1e599e]"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-[#484848] mb-2">Budget</label>
                  <div className="grid grid-cols-3 gap-3">
                    {budgetOptions.map((b) => (
                      <button
                        key={b.level}
                        type="button"
                        onClick={() => setTripData(prev => ({ ...prev, budget: b.level }))}
                        className={`border rounded-lg p-3 text-sm font-medium ${
                          tripData.budget === b.level
                            ? "bg-[#1e599e] text-white border-[#1e599e]"
                            : "bg-white border-gray-300 hover:border-[#1e599e]"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-[#484848] mb-2">
                    Interests (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {interestsList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`border rounded-lg p-2 text-xs ${
                          tripData.interests.includes(interest)
                            ? "bg-[#1e599e] text-white border-[#1e599e]"
                            : "bg-white border-gray-300 hover:border-[#1e599e]"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {tripData.startDate && tripData.endDate && (
                  <div className="bg-[#F7F7F7] rounded-lg p-4">
                    <h3 className="font-medium text-[#222222] mb-3">Trip Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-[#767676]">Duration</div>
                        <div className="font-semibold text-[#222222]">{calculateTripDuration()} days</div>
                      </div>
                      <div>
                        <div className="text-[#767676]">Travelers</div>
                        <div className="font-semibold text-[#222222]">
                          {tripData.travelers.adults + tripData.travelers.children}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e599e] text-white py-3 rounded-lg font-medium hover:bg-[#1e599e] disabled:opacity-50"
                >
                  {loading ? "Generating Itinerary..." : "Generate Itinerary"}
                </button>

                {error && (
                  <div className="mt-4">
                    <ErrorMessage message={error} />
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* AI Assistant */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#222222] mb-4">AI Assistant</h3>
              <VoiceTripAssistant />
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#222222] mb-3">Why Use AI Planning?</h3>
              <ul className="space-y-2 text-sm text-[#767676]">
                <li>• Save hours of research time</li>
                <li>• Get personalized recommendations</li>
                <li>• Discover hidden local spots</li>
                <li>• Optimize your budget</li>
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-[#1e599e] text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Trusted by Travelers</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Trips Planned</span>
                  <span className="font-semibold">10,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Traveler Rating</span>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Saved</span>
                  <span className="font-semibold">87%</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default PlanTrip;