// src/pages/PlaceDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TravelChatbot from '../components/chat/TravelChatbot';
import {
  MapPin,
  Star,
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Clock,
  Users,
  Hotel,
  Utensils,
  Camera,
  Navigation,
  ChevronRight
} from "lucide-react";

import { placesAPI } from "../services/placesAPI";
import { useHotels } from "../hooks/useHotels";
import { useRestaurants } from "../hooks/useRestaurants";
import Loader from "../components/common/Loader";
import MapWidget from "../components/widgets/MapWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(0);

  const { hotels, fetchHotelsByPlace } = useHotels();
  const { restaurants, fetchRestaurantsByPlace } = useRestaurants();

  useEffect(() => {
    placesAPI.getById(id).then((res) => {
      const p = res.data.data;
      const normalized = {
        _id: p._id,
        name: p.name,
        image: p.images?.[0],
        images: p.images || Array(3).fill("https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800"),
        rating: p.rating || 4.2,
        reviews: p.reviews || 128,
        description: p.description || "A beautiful destination offering amazing experiences and breathtaking views.",
        bestTimeToVisit: p.bestTimeToVisit || ["October", "March"],
        city: p.location?.city,
        country: p.location?.country,
        lat: p.location?.coordinates?.coordinates?.[1] || p.location?.lat,
        lng: p.location?.coordinates?.coordinates?.[0] || p.location?.lng,
        activities: p.activities || ["Sightseeing", "Photography", "Walking Tours"]
      };

      setPlace(normalized);
      fetchHotelsByPlace(normalized._id);
      fetchRestaurantsByPlace(normalized._id);
    });
  }, [id]);

  if (!place) return <Loader />;

  const coords = [place.lat, place.lng];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/places" 
              className="flex items-center gap-2 text-[#484848] hover:text-[#1e599e] transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Destinations</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-[#767676] hover:text-[#484848] transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-[#767676] hover:text-[#1e599e] transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Main Image */}
          <div className="relative h-80 rounded-t-lg overflow-hidden">
            <img
              src={place.images[selectedImage]}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            {place.images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {place.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      selectedImage === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Place Info */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#222222] mb-2">{place.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#484848]">
                    <MapPin size={18} />
                    <span>{place.city}, {place.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-[#222222]">{place.rating}</span>
                    <span className="text-[#767676]">({place.reviews})</span>
                  </div>
                </div>
                <p className="text-[#484848] leading-relaxed">{place.description}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={()=> navigate('/plan-trip')}
                className="bg-[#1e599e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e599e] transition-colors flex items-center gap-2">
                  Plan Visit
                  <ChevronRight size={16} />
                </button>
                <button
                
                onClick={()=> navigate('/hotels')}
                className="border border-gray-300 text-[#484848] px-6 py-3 rounded-lg font-semibold hover:bg-[#F7F7F7] transition-colors">
                  Book Hotels
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200">
                {["Overview", "Hotels", "Restaurants", "Activities"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                      activeTab === tab.toLowerCase()
                        ? "border-[#1e599e] text-[#1e599e]"
                        : "border-transparent text-[#484848] hover:text-[#222222]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-[#222222]">Location</h3>
                      <MapWidget
                        center={coords}
                        markers={[{ position: coords, title: place.name }]}
                        className="h-64 w-full rounded-lg"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-[#222222]">Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        {place.activities.map((activity, index) => (
                          <span
                            key={index}
                            className="bg-[#F7F7F7] text-[#484848] px-3 py-2 rounded-lg text-sm"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "hotels" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[#222222]">Nearby Hotels</h3>
                    {!hotels.length ? (
                      <div className="text-center py-8 text-[#767676]">
                        <Hotel className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p>No hotels found nearby</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {hotels.slice(0, 3).map((hotel, index) => (
                          <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="w-16 h-16 bg-[#F7F7F7] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Hotel className="h-6 w-6 text-[#767676]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-[#222222]">{hotel.name}</h4>
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm font-medium text-[#222222]">{hotel.rating || 4.2}</span>
                                </div>
                              </div>
                              <p className="text-[#767676] text-sm mb-2">{hotel.address}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#1e599e]">₹{hotel.price || "1,999"}</span>
                                <button className="text-[#1e599e] text-sm font-medium hover:text-[#1e599e]">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "restaurants" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[#222222]">Nearby Restaurants</h3>
                    {!restaurants.length ? (
                      <div className="text-center py-8 text-[#767676]">
                        <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p>No restaurants found nearby</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {restaurants.slice(0, 3).map((restaurant, index) => (
                          <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="w-16 h-16 bg-[#F7F7F7] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Utensils className="h-6 w-6 text-[#767676]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-[#222222]">{restaurant.name}</h4>
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm font-medium text-[#222222]">{restaurant.rating || 4.2}</span>
                                </div>
                              </div>
                              <p className="text-[#767676] text-sm mb-2">{restaurant.address}</p>
                              <div className="flex gap-2">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vegetarian</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Fine Dining</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#222222]">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-[#767676]">Rating</p>
                    <p className="font-semibold text-[#222222]">{place.rating}/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#767676]" />
                  <div>
                    <p className="text-sm text-[#767676]">Best Time</p>
                    <p className="font-semibold text-[#222222]">{place.bestTimeToVisit.join(" - ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#767676]" />
                  <div>
                    <p className="text-sm text-[#767676]">Duration</p>
                    <p className="font-semibold text-[#222222]">2-3 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#767676]" />
                  <div>
                    <p className="text-sm text-[#767676]">Best For</p>
                    <p className="font-semibold text-[#222222]">Family, Couples</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <WeatherWidget
                lat={coords[0]}
                lng={coords[1]}
                placeName={place.name}
              />
            </div>

            {/* Travel Tips */}
            <div className="bg-[#F7F7F7] rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-3 text-[#222222]">Travel Tips</h3>
              <ul className="space-y-2 text-sm text-[#484848]">
                <li>• Best visited during {place.bestTimeToVisit.join(" - ")}</li>
                <li>• Arrive early to avoid crowds</li>
                <li>• Wear comfortable walking shoes</li>
                <li>• Carry water and sunscreen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* AI Chatbot */}
      <TravelChatbot />
    </div>
  );
};

export default PlaceDetails;