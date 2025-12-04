import React, { useEffect, useState } from "react";
import { ArrowRight, MapPin, Star, Loader2, Calendar, Users, Shield, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExploreDeals = () => {
  const navigate = useNavigate();
  
  // 12 BEAUTIFUL STATIC DEMO CARDS WITH INDIA DEALS AT TOP
  const demoCards = [
    // India Deals (at top)
    {
      id: 1,
      title: "Goa Beach Paradise",
      location: "Goa, India",
      discount: "50% OFF",
      price: "₹ 12,999",
      originalPrice: "₹ 25,999",
      rating: "4.8",
      image: "../../public/exploreDeals/explore1.jpg",
      type: "Beach Resort",
      duration: "5D/4N",
      includes: ["Breakfast", "Airport Transfer", "Water Sports"],
      description: "Experience the ultimate beach vacation in Goa with luxury resorts and vibrant nightlife"
    },
    {
      id: 2,
      title: "Kashmir Houseboat Stay",
      location: "Srinagar, India",
      discount: "40% OFF",
      price: "₹ 18,999",
      originalPrice: "₹ 31,599",
      rating: "4.9",
      image: "../../public/exploreDeals/explore2.jpg",
      type: "Houseboat",
      duration: "4D/3N",
      includes: ["All Meals", "Shikara Ride", "Gardens Tour"],
      description: "Stay in traditional houseboats on Dal Lake with stunning mountain views"
    },
    {
      id: 3,
      title: "Rajasthan Royal Heritage",
      location: "Jaipur, India",
      discount: "35% OFF",
      price: "₹ 15,999",
      originalPrice: "₹ 24,599",
      rating: "4.7",
      image: "../../public/exploreDeals/explore3.jpg",
      type: "Heritage Hotel",
      duration: "4D/3N",
      includes: ["Cultural Shows", "Fort Visits", "Traditional Dinner"],
      description: "Live like royalty in heritage palaces and explore the pink city's rich culture"
    },
    {
      id: 4,
      title: "Kerala Backwaters",
      location: "Alleppey, India",
      discount: "45% OFF",
      price: "₹ 14,499",
      originalPrice: "₹ 26,399",
      rating: "4.8",
      image: "../../public/exploreDeals/explore4.jpg",
      type: "Houseboat Cruise",
      duration: "3D/2N",
      includes: ["All Meals", "Village Tour", "Ayurvedic Massage"],
      description: "Cruise through serene backwaters in traditional houseboats surrounded by lush greenery"
    },
    {
      id: 5,
      title: "Himachal Mountain Retreat",
      location: "Manali, India",
      discount: "30% OFF",
      price: "₹ 16,999",
      originalPrice: "₹ 24,299",
      rating: "4.6",
      image: "../../public/exploreDeals/explore5.jpg",
      type: "Mountain Resort",
      duration: "5D/4N",
      includes: ["Trekking", "Local Sightseeing", "Bonfire"],
      description: "Adventure-packed mountain getaway in the heart of Himalayas"
    },
    {
      id: 6,
      title: "Ladakh Road Trip",
      location: "Leh, India",
      discount: "40% OFF",
      price: "₹ 22,999",
      originalPrice: "₹ 38,299",
      rating: "4.9",
      image: "../../public/exploreDeals/explore6.jpg",
      type: "Adventure Tour",
      duration: "7D/6N",
      includes: ["Accommodation", "Meals", "Permits", "Guide"],
      description: "Epic road trip through high-altitude deserts and majestic mountains"
    },
    // International Deals
    {
      id: 7,
      title: "Bali Tropical Paradise",
      location: "Bali, Indonesia",
      discount: "40% OFF",
      price: "₹ 32,999",
      originalPrice: "₹ 54,999",
      rating: "4.8",
      image: "../../public/exploreDeals/explore7.jpg",
      type: "Beach Resort",
      duration: "6D/5N",
      includes: ["Villa Stay", "Spa", "Temple Tours"],
      description: "Luxury beachfront villas with private pools and traditional Balinese hospitality"
    },
    {
      id: 8,
      title: "Swiss Alpine Retreat",
      location: "Interlaken, Switzerland",
      discount: "35% OFF",
      price: "₹ 89,999",
      originalPrice: "₹ 1,38,499",
      rating: "4.9",
      image: "../../public/exploreDeals/explore8.jpg",
      type: "Mountain Cabin",
      duration: "5D/4N",
      includes: ["Cable Car", "Lake Cruise", "Chocolate Tour"],
      description: "Breathtaking alpine views with cozy mountain cabins and Swiss charm"
    },
    {
      id: 9,
      title: "Tokyo City Lights",
      location: "Tokyo, Japan",
      discount: "30% OFF",
      price: "₹ 45,999",
      originalPrice: "₹ 65,699",
      rating: "4.7",
      image: "../../public/exploreDeals/explore9.jpg",
      type: "City Hotel",
      duration: "5D/4N",
      includes: ["City Tour", "Sushi Class", "Temple Visits"],
      description: "Modern city experience blending traditional culture with futuristic technology"
    },
    {
      id: 10,
      title: "Santorini Sunset View",
      location: "Santorini, Greece",
      discount: "45% OFF",
      price: "₹ 67,999",
      originalPrice: "₹ 1,23,599",
      rating: "4.9",
      image: "../../public/exploreDeals/explore10.jpg",
      type: "Luxury Villa",
      duration: "4D/3N",
      includes: ["Wine Tasting", "Boat Tour", "Sunset Dinner"],
      description: "Iconic white-washed villas with stunning caldera views and romantic sunsets"
    },
    {
      id: 11,
      title: "Maldives Overwater Bungalow",
      location: "Maldives",
      discount: "50% OFF",
      price: "₹ 1,25,999",
      originalPrice: "₹ 2,51,999",
      rating: "4.9",
      image: "../../public/exploreDeals/explore11.jpg",
      type: "Beach Resort",
      duration: "5D/4N",
      includes: ["All Inclusive", "Snorkeling", "Spa Sessions"],
      description: "Ultimate luxury in overwater bungalows with crystal clear lagoons"
    },
    {
      id: 12,
      title: "Paris Romantic Getaway",
      location: "Paris, France",
      discount: "25% OFF",
      price: "₹ 38,999",
      originalPrice: "₹ 51,999",
      rating: "4.6",
      image: "../../public/exploreDeals/explore12.jpg",
      type: "Boutique Hotel",
      duration: "4D/3N",
      includes: ["Eiffel Tower", "Seine Cruise", "Louvre Museum"],
      description: "Romantic Parisian experience with iconic landmarks and charming streets"
    }
  ];

  const [initialDeals] = useState(demoCards); // permanent 12 demo cards
  const [deals, setDeals] = useState([]);             // AI deals
  const [loading, setLoading] = useState(false);      // loading for show more click
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // AI only once

  // Navigate to upcoming more-deals labs page
  const goToMoreDeals = () => {
    navigate("/more-deals");
  };

  // Navigate to deal details page
  const handleViewDeal = (deal) => {
    navigate(`/deal/${deal.id}`, { state: { deal } });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 py-10 overflow-x-hidden">

      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Explore Exclusive <span className="text-[#FF7A32]">Deals</span>
      </h1>

      {/* 12 DEMO DEALS (ALWAYS VISIBLE) */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
       {initialDeals.map((deal, index) => (
  <div
    key={index}
    
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-[1.03]"
  >
    <img
      src={deal.image}
      alt={deal.title}
      className="rounded-t-2xl w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="font-bold text-gray-800 text-lg">{deal.title}</h2>

      <div className="flex items-center text-gray-600 text-sm mt-1">
        <MapPin className="h-4 w-4 mr-1 text-[#1664FF]" />
        {deal.location}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-[#DC143C] font-bold">{deal.discount}</p>
          <p className="text-gray-800 font-semibold">{deal.price}</p>
        </div>

        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 font-medium">{deal.rating}</span>
        </div>
      </div>
      {/* removed View Deal button so whole card is clickable */}
    </div>
  </div>
))}
      </div>

      {/* AI DEALS → ONLY DISPLAY AFTER CLICK */}
      {deals.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
        {deals.map((deal, index) => (
  <div
    key={index}
    onClick={() => handleViewDeal(deal)}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-[1.03]"
  >
    <img
      src={deal.image}
      alt={deal.title}
      className="rounded-t-2xl w-full h-48 object-cover"
    />

    <div className="p-4">
      <h2 className="font-bold text-gray-800 text-lg">
        {deal.title}
      </h2>

      <div className="flex items-center text-gray-600 text-sm mt-1">
        <MapPin className="h-4 w-4 mr-1 text-[#1664FF]" />
        {deal.location}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-[#DC143C] font-bold">{deal.discount}</p>
          <p className="text-gray-800 font-semibold">{deal.price}</p>
        </div>

        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 font-medium">{deal.rating}</span>
        </div>
      </div>
      {/* removed button */}
    </div>
  </div>
))}
        </div>
      )}

      {/* MORE DEALS CTA */}
      {!hasLoadedOnce && (
        <div className="text-center mt-10">
          <button
            onClick={goToMoreDeals}
            className="bg-[#FF7A32] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            More Deals (Beta)
          </button>
        </div>
      )}

    </div>
  );
};

export default ExploreDeals;