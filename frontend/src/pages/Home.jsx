// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import { 
  MapPin, Compass, Star, ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  Plane, Hotel, Train, Bus, Car, Shield, HeadphonesIcon, IndianRupee,
  Users, Calendar, Heart, ChevronDown, Globe, Search, Gift,
  Tag, Zap, ShieldCheck, Clock, Award, ThumbsUp, Smartphone
} from 'lucide-react';
import { placesAPI } from '../services/placesAPI';
import PlaceCard from '../components/cards/PlaceCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import TravelChatbot from '../components/chat/TravelChatbot';
import Signup from './Signup';

// normalizePlace helper - KEEPING YOUR EXACT LOGIC
const normalizePlace = (p) => ({
  ...p,
  images: Array.isArray(p.images) && p.images.length ? p.images : [p.image || "/api/placeholder/400/300"],
  image: (p.image || (Array.isArray(p.images) && p.images[0])) || "/api/placeholder/400/300",
  rating: Number(p.rating) || 4.2,
  bestTimeToVisit: p.bestTime || p.bestTimeToVisit || [],
  activities: p.activities || [],
  location: {
    city: p.city || (p.location && p.location.city) || "Unknown",
    country: p.country || (p.location && p.location.country) || "India",
    coordinates: (p.location && p.location.coordinates) || (p.lat && p.lng ? { type: "Point", coordinates: [p.lng, p.lat] } : null)
  },
  _id: p._id || `${p.name}-${p.city}-${Math.random().toString(36).slice(2,8)}` // unique key fallback
});

const Home = () => {
  const { places, loading, error } = usePlaces();
  const navigate = useNavigate();
  const { user } = useAuth();

  // SEARCH STATES - KEEPING YOUR EXACT LOGIC
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [typewriterText, setTypewriterText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [showSearchCard, setShowSearchCard] = useState(false);

  // Travel booking states for enhanced UI
  const [travelTab, setTravelTab] = useState("flights");
  const [tripType, setTripType] = useState("roundTrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [travelClass, setTravelClass] = useState("economy");
  
  const [hotelCity, setHotelCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [rooms, setRooms] = useState("1");
  const [guests, setGuests] = useState("2");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [authModal, setAuthModal] = useState("none"); 
  const highlightLastWord = (text) => {
    if (!text) return text;
    const words = text.trim().split(" ");
    if (words.length === 1) return text;
  
    const lastWord = words.pop(); 
    return `${words.join(" ")} <span class="text-[#a880ff]">${lastWord}</span>`;
  };
  

  // Simple carousel slides
  const carouselSlides = [
    {
      id: 1,
      title: "Book Flights & Hotels",
      description: "Get best deals on flights, hotels, and holiday packages",
      image: "/home/home1.jpg",
      buttonText: "Explore Deals",
      buttonLink: "/explore-deals",
      badge: "FLAT 20% OFF",
    },
    {
      id: 2,
      title: "AI-Powered Travel Planning",
      description: "Smart recommendations and personalized itineraries by AI",
      buttonText: "Plan Trip",
      buttonLink: "/plan-trip",
      image: "/home/home2.jpg",
      badge: "AI ASSISTANT",
    },
    {
      id: 3,
      title: "Discover Amazing Destinations",
      description: "Explore curated places with detailed guides and reviews",
      image: "/home/home3.jpg",
      buttonText: "View Destinations",
      buttonLink: "/places",
      badge: "TRENDING",
    }
  ];

  // Top deals data
  const topDeals = [
    {
      id: 1,
      title: "Goa Beach Package",
      price: "₹8,499",
      originalPrice: "₹12,999",
      discount: "35% OFF",
      image: "/topDeals/deals1.jpg",
      type: "hotel",
      duration: "3D/2N",
      rating: 4.5
    },
    {
      id: 2,
      title: "Delhi to Bangkok",
      price: "₹12,999",
      originalPrice: "₹18,999",
      discount: "32% OFF",
      image: "/topDeals/deals2.jpg",
      type: "flight",
      duration: "Direct",
      rating: 4.3
    },
    {
      id: 3,
      title: "Manali Resort Stay",
      price: "₹5,999",
      originalPrice: "₹8,999",
      discount: "33% OFF",
      image: "/topDeals/deals3.jpg",
      type: "hotel",
      duration: "2D/1N",
      rating: 4.7
    },
    {
      id: 4,
      title: "Mumbai to Goa Train",
      price: "₹1,299",
      originalPrice: "₹1,899",
      discount: "32% OFF",
      image: "/topDeals/deals4.jpg",
      duration: "12h",
      rating: 4.2
    }
  ];

  // Trending destinations
  const trendingDestinations = [
    { 
      name: "Goa", 
      country: "India", 
      image: "/trendingDestinations/destinations1.jpg", 
      startingPrice: "₹4,999"
    },
    { 
      name: "Bangkok", 
      country: "Thailand", 
      image: "/trendingDestinations/destinations2.jpg", 
      startingPrice: "₹12,999"
    },
    { 
      name: "Dubai", 
      country: "UAE", 
      image: "/trendingDestinations/destinations3.jpg", 
      startingPrice: "₹24,999"
    },
    { 
      name: "Manali", 
      country: "India", 
      image: "/trendingDestinations/destinations4.jpg", 
      startingPrice: "₹5,999"
    }
  ];

  // Popular search suggestions
  const popularSearches = [
    "Goa beaches", "Manali hotels", "Kerala backwaters", "Rajasthan palaces"
  ];

  // Simple features section
  const features = [
    {
      icon: Zap,
      title: 'Fast Booking',
      description: 'Instant confirmation'
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Secure',
      description: 'Your safety first'
    },
    {
      icon: Tag,
      title: 'Best Deals',
      description: 'Exclusive discounts'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Always here to help'
    }
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Typewriter effect
  useEffect(() => {
    const placeholders = [
      "Search Goa — beaches, nightlife & sunsets...",
      "Search Manali — mountains, snow & cafes...",
      "Search Kerala — backwaters & houseboats...",
      "Search Dubai — luxury, deserts & skyline...",
      "Search Bali — beaches, temples & villas...",
      "Search Maldives — crystal water escapes...",
    ];

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = placeholders[index];

      // Typing
      if (!isDeleting) {
        setTypewriterText(current.slice(0, charIndex) + " |");
        charIndex++;

        // When full word typed
        if (charIndex === current.length + 1) {
          setTimeout(() => {
            isDeleting = true;
          }, 1200); // pause before deleting
        }
      }

      // Deleting
      else {
        setTypewriterText(current.slice(0, charIndex) + " |");
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % placeholders.length; // next text
        }
      }
    };

    const interval = setInterval(type, isDeleting ? 50 : 80);

    return () => clearInterval(interval);
  }, []);

  // Start typewriter when user focuses on search
  const handleSearchFocus = () => {
    setIsTyping(true);
  };

  // Stop typewriter when user leaves search
  const handleSearchBlur = () => {
    setIsTyping(false);
    setTypewriterText("");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // 🔍 SEARCH HANDLER - KEEPING YOUR EXACT LOGIC
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setShowSearchCard(false); // Hide dropdown as soon as search starts
    setSearching(true);
    setSearchResults([]);

    // 1) AI detects if Indian or Worldwide
    const detect = await placesAPI.detectCountry(searchText);
    const countryType = detect.data.countryType;

    console.log("🌏 AI detected:", countryType);

    // 2) If worldwide → jump to World Page
    if (countryType === "world") {
      const aiRes = await placesAPI.searchAI(searchText);

      return navigate("/explore-world", {
        state: {
          query: searchText,
          places: aiRes.data.data
        }
      });
    }

    // 3) If India → do normal India DB → fallback AI search
    try {
      const res = await placesAPI.search(searchText);
      const indiaResults = res.data.data || [];

      // If nothing found → AI fallback
      if (indiaResults.length === 0) {
        const aiRes = await placesAPI.searchAI(searchText);

        return navigate("/explore-india", {
          state: {
            query: searchText,
            places: aiRes.data.data
          }
        });
      }

      // Mix India DB + AI
      const aiRes = await placesAPI.searchAI(searchText);
      const finalResults = [
        ...indiaResults,
        ...aiRes.data.data.slice(0, 4)
      ];

      return navigate("/explore-india", {
        state: {
          query: searchText,
          places: finalResults
        }
      });

    } catch (err) {
      console.error("Search failed:", err);
    }

    setSearching(false);
  };

  // Quick search handler
  const handleQuickSearch = (query) => {
    setSearchText(query);
    // Trigger search after a small delay
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      document.querySelector('form')?.dispatchEvent(event);
    }, 100);
  };

  // Travel booking handlers
  const handleFlightSearch = () => {
    navigate("/flights-search", { 
      state: { 
        from, 
        to, 
        date: departDate,
        returnDate: tripType === "roundTrip" ? returnDate : "",
        passengers,
        travelClass
      } 
    });
  };

  const handleHotelSearch = () => {
    navigate("/hotels-search", { 
      state: { 
        city: hotelCity, 
        checkin, 
        checkout,
        guests,
        rooms
      } 
    });
  };

  const handleTrainSearch = () => {
    navigate("/trains-search", { 
      state: { 
        from, 
        to, 
        date: departDate 
      } 
    });
  };

  // Show popup only on first visit AND if user is not logged in
  useEffect(() => {
    // Don't show popup if user is already logged in
    if (user) {
      return;
    }

    const hasVisited = sessionStorage.getItem("hasVisitedHome");

    if (!hasVisited) {
      // First time visitor → show popup
      setAuthModal("login"); 
      sessionStorage.setItem("hasVisitedHome", "true");
    }
  }, [user]);

  return (
    <div className="relative overflow-x-hidden">
      {/* BLUR HOME CONTENT WHEN LOGIN IS OPEN */}
      <div className={authModal !== "none" ? "filter blur-sm" : ""}>
        <div className="min-h-screen bg-[#F7F7F7]">

          {/* ENHANCED HERO SECTION - RESPONSIVE */}
          <section className="relative py-8 sm:py-12 md:py-20 bg-gradient-to-r from-[#0CA9A5] to-[#0DB3AF] overflow-hidden">
            {/* Background Slides */}
            <div className="absolute inset-0">
              {carouselSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`
                    absolute inset-0 bg-cover bg-center
                    transition-all duration-[1500ms] ease-in-out
                    ${index === currentSlide ? "opacity-100" : "opacity-0"}
                  `}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex items-center pt-16 md:pt-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full overflow-x-hidden">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left Content */}
                {/* Left Content */}
{/* We added 'grid grid-cols-1' to the parent to stack children without absolute positioning issues */}
<div className="text-white px-2 text-center lg:text-left relative py-8 sm:py-12 md:py-16 min-h-[250px] sm:min-h-[300px] grid grid-cols-1 items-center">
  {carouselSlides.map((slide, index) => (
    <div
      key={slide.id}
      className={`
        col-start-1 row-start-1 w-full
        flex flex-col items-center lg:items-start
        transition-all duration-[1000ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
        ${index === currentSlide 
          ? "opacity-100 translate-y-0 scale-100 blur-0 z-10" 
          : "opacity-0 translate-y-8 scale-95 blur-sm -z-10 pointer-events-none"
        }
      `}
    >
      <div className="text-center lg:text-left px-2 w-full">
        {/* Badge */}
        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6 font-semibold text-xs md:text-sm border border-white/30">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-yellow-300 mr-2" />
          {slide.badge}
        </div>
        
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
          dangerouslySetInnerHTML={{ __html: highlightLastWord(slide.title) }}
        ></h1>

        {/* Description */}
        <p className="text-white/90 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
          {slide.description}
        </p>
        
        {/* Button */}
        <Link
          to={slide.buttonLink}
          className="inline-flex items-center bg-[#1e599e] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl hover:bg-[#484848] transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
        >
          {slide.buttonText}
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3" />
        </Link>
      </div>
    </div>
  ))}
</div>

                  {/* Booking Widget - Enhanced for Mobile */}
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200 w-full max-w-lg mx-auto mt-8 lg:mt-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 md:mb-8">
                      {[
                        { id: "flights", icon: Plane, label: "Flights" },
                        { id: "hotels", icon: Hotel, label: "Hotels" },
                        { id: "trains", icon: Train, label: "Trains" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTravelTab(item.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-semibold border-b-2 whitespace-nowrap transition-colors ${
                            travelTab === item.id
                              ? "border-[#FF7A32] text-[#FF7A32]"
                              : "border-transparent text-[#767676] hover:text-[#FF7A32]"
                          }`}
                        >
                          <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Flights Form */}
                    {travelTab === "flights" && (
                      <div className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">From</label>
                            <input
                              type="text"
                              placeholder="City or airport"
                              value={from}
                              onChange={(e) => setFrom(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">To</label>
                            <input
                              type="text"
                              placeholder="City or airport"
                              value={to}
                              onChange={(e) => setTo(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Departure</label>
                            <input
                              type="date"
                              value={departDate}
                              onChange={(e) => setDepartDate(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Travelers</label>
                            <input
                              type="number"
                              min="1"
                              value={passengers}
                              onChange={(e) => setPassengers(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleFlightSearch}
                          className="w-full bg-[#0A2F5A] text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:bg-[#0A2F5A] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          SEARCH FLIGHTS
                        </button>
                      </div>
                    )} 

                    {/* Hotels Form */}
                    {travelTab === "hotels" && (
                      <div className="space-y-4 md:space-y-6">
                        <div>
                          <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Destination</label>
                          <input
                            type="text"
                            placeholder="City, hotel, or place"
                            value={hotelCity}
                            onChange={(e) => setHotelCity(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Check-in</label>
                            <input
                              type="date"
                              value={checkin}
                              onChange={(e) => setCheckin(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Check-out</label>
                            <input
                              type="date"
                              value={checkout}
                              onChange={(e) => setCheckout(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                        </div>
           
                        <button
                          onClick={handleHotelSearch}
                          className="w-full bg-[#0A2F5A] text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:bg-[#0A2F5A] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          SEARCH HOTELS
                        </button>
                      </div>
                    )}

                    {/* Trains Form */}
                    {travelTab === "trains" && (
                      <div className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">From</label>
                            <input
                              type="text"
                              placeholder="Source station"
                              value={from}
                              onChange={(e) => setFrom(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">To</label>
                            <input
                              type="text"
                              placeholder="Destination station"
                              value={to}
                              onChange={(e) => setTo(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Journey Date</label>
                            <input
                              type="date"
                              value={departDate}
                              onChange={(e) => setDepartDate(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#484848] mb-1 md:mb-2">Travelers</label>
                            <input
                              type="number"
                              min="1"
                              value={passengers}
                              onChange={(e) => setPassengers(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleTrainSearch}
                          className="w-full bg-[#0A2F5A] text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:bg-[#0A2F5A] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          SEARCH TRAINS
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* ENHANCED SEARCH SECTION */}
          <section className="py-12 md:py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

              {/* Title */}
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-3 md:mb-4">
                  Where do you want to go?
                </h2>
                <p className="text-[#767676] text-sm sm:text-lg">
                  Search destinations, attractions, or let AI recommend perfect spots
                </p>
              </div>

              {/* WRAPPER FOR SEARCH + DROPDOWN */}
              <div
                className="relative mb-6 md:mb-8"
                onMouseEnter={() => { if (!searching) setShowSearchCard(true); }}
                onMouseLeave={() => setShowSearchCard(false)}
              >
           
                {/* SEARCH BOX */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-2 relative z-20 transition-all duration-300 hover:shadow-xl">
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                  >
                    <div className="flex-1 flex items-center px-4 sm:px-6 relative">

                      {/* AI Animated Icon */}
                      <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                         <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-[#0000FF] transition-all duration-500 hover:scale-110 hover:rotate-12 animate-pulse-slow" />
                      </div>

                      {/* ALWAYS ON TYPEWRITER INPUT */}
                      <input
                        type="text"
                        value={searchText} 
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder={typewriterText}
                        className="flex-1 py-3 sm:py-4 pl-10 sm:pl-12 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-base sm:text-lg placeholder-gray-400 focus:placeholder-gray-300 transition-all"
                      />

                      {/* CLEAR BUTTON */}
                      {searchText && (
                        <button
                          type="button"
                          onClick={() => setSearchText("")}
                          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ✖
                        </button>
                      )}
                    </div>

                    {/* SEARCH BUTTON */}
                    <button
                      type="submit"
                      className="bg-[#0A2F5A] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg md:rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 justify-center"
                    >
                      Search
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </form>
                </div>

                {/* DROPDOWN CARD */}
                {showSearchCard && (
  <div className="
    absolute top-[110%] left-0 w-full 
    bg-white rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 
    p-4 md:p-6 z-10 animate-fadeIn backdrop-blur-sm bg-white/95
  ">

    {/* Header */}
    <div className="mb-4 pb-3 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-[#1e599e] flex items-center justify-center text-white font-bold">
          ⚡
        </div>
        <div>
          <h3 className="text-sm md:text-base font-bold text-gray-800">GoTrip AI Suggestions</h3>
          <p className="text-xs text-gray-500">Personalized recommendations just for you</p>
        </div>
      </div>
    </div>

    {/* Popular Destinations */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-700">Popular Destinations</h4>
        <span className="text-xs text-[#1e599e] font-medium">Trending</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Goa beaches", "Manali hotels", "Kerala backwaters", "Dubai luxury", "Bali resorts", "Paris romance"].map((s, i) => (
          <button
            key={i}
            onClick={() => handleQuickSearch(s)}
            // Changed hover color here, removed text-white
            className="px-3 py-2 bg-gray-50 hover:bg-[#faefd9] border border-gray-200 rounded-lg text-xs transition-all flex items-center gap-1"
          >
            {s} →
          </button>
        ))}
      </div>
    </div>

    {/* AI RECOMMENDED */}
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-700">Recommended For You</h4>
        <span className="text-xs text-[#1e599e] font-medium">AI Powered</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Best honeymoon places in budget", icon: "💑" },
          { title: "Top 10 adventure destinations", icon: "🏔️" },
          { title: "Cheapest flights this month", icon: "✈️" },
          { title: "Best family-friendly destinations", icon: "👨‍👩‍👧‍👦" }
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => handleQuickSearch(item.title)}
            // Changed hover color here, removed text-white
            className="cursor-pointer bg-gray-50 hover:bg-[#faefd9] p-3 rounded-lg text-xs transition-all border border-gray-200 flex items-start gap-2"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>

    {/* RECENT */}
    <div className="pt-3 border-t border-gray-100">
      <h4 className="text-sm font-bold text-gray-700 mb-2">Recent Searches</h4>
      <div className="flex flex-wrap gap-2">
        {["Maldives vacation", "Tokyo hotels", "Santorini sunset"].map((item, i) => (
          <button
            key={i}
            onClick={() => handleQuickSearch(item)}
            className="px-2 py-1 bg-white border border-gray-200 text-gray-600 hover:border-[#0A2F5A] rounded-md text-xs transition-all"
          >
            {item}
          </button>
        ))}
      </div>
    </div>

  </div>
)}
              </div>

              {/* BELOW POPULAR SEARCHES */}
              <div className="text-center">
                <p className="text-[#767676] text-sm mb-3 md:mb-4">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="bg-white text-[#484848] px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm hover:bg-[#0A2F5A] hover:text-white transition-all border border-gray-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* SEARCH RESULTS - UNCHANGED */}
          {searching && (
            <div className="text-center py-12 md:py-16">
              <Loader text="Searching places..." />
            </div>
          )}

          {!searching && searchResults.length > 0 && (
            <section className="py-12 md:py-16 bg-[#F7F7F7]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 md:mb-12 text-[#222222]">
                  Results for: <span className="text-[#0A2F5A]">{searchText}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {searchResults.map((p) => (
                    <div key={p._id} onClick={() => navigate("/places/:id", { state: { place: p } })}>
                      <PlaceCard place={p} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ENHANCED AIRLINE PARTNERS SECTION */}
          <section className="py-12 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] mb-8 md:mb-12 text-center">
                GoTrip Airline Network – Fly Anywhere
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                  { name: "AirAsia", image: "/airlines/airasia.png" },
                  { name: "Cathay Pacific", image: "/airlines/cathay.png" },
                  { name: "Malaysia Airlines", image: "/airlines/malaysia.png" }
                ].map((airline, index) => (
                  <Link
                    key={index}
                    to="/flights-search"
                    className="rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
                  >
                    <div className="relative h-32 sm:h-40 md:h-48 w-full">
                      <img 
                        src={airline.image}
                        alt={airline.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/80 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 md:bottom-4 md:left-6 text-white text-lg md:text-xl font-bold">
                        {airline.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ENHANCED TOP DEALS SECTION */}
          <section className="py-12 md:py-20 bg-[#F7F7F7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#222222]">Trending Deals</h2>
                  <p className="text-[#767676] text-sm sm:text-lg">Don't miss these amazing offers</p>
                </div>
                <Link to="/explore-deals" className="text-[#1e599e] font-bold hover:text-[#0a2f5a] flex items-center text-sm sm:text-lg">
                  View All <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                 onClick={() => navigate("/explore-deals")}>
                {topDeals.map((deal) => (
                  <div key={deal.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <div className="relative">
                      <img src={deal.image} alt={deal.title} className="w-full h-32 sm:h-40 md:h-48 object-cover" />
                      <div className="absolute top-3 left-3 bg-[#0A2F5A] text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-bold">
                        {deal.discount}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-[#222222] text-base sm:text-lg">{deal.title}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs sm:text-sm font-semibold">{deal.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-[#767676] mb-3 sm:mb-4">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#0A2F5A]" />
                        <span className="text-xs sm:text-sm">{deal.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg sm:text-xl font-bold text-[#222222]">{deal.price}</span>
                          <span className="text-[#767676] line-through text-xs sm:text-sm ml-2">{deal.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      
          {/* ENHANCED TRENDING DESTINATIONS */}
          <section className="py-12 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-3 md:mb-4">Trending Destinations</h2>
                <p className="text-[#767676] text-sm sm:text-lg">Most popular places to visit right now</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {trendingDestinations.map((destination, index) => (
                  <div
                    key={index}
                    className="text-center group cursor-pointer"
                    onClick={() => navigate("/places")}
                  >
                    <div className="relative overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-4">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-20 sm:h-24 md:h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                    </div>
                    <div className="font-bold text-[#222222] text-sm sm:text-lg">{destination.name}</div>
                    <div className="text-[#767676] text-xs sm:text-base mb-1 sm:mb-2">{destination.country}</div>
                    <div className="text-[#0A2F5A] font-bold text-xs sm:text-base">{destination.startingPrice}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ENHANCED FEATURES SECTION */}
          <section className="py-12 md:py-20 bg-[#f5e9d3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-[#0A2F5A] drop-shadow-sm">
                  Why Choose GoTrip
                </h2>
                <p className="text-[#7C2D12] text-sm sm:text-xl font-medium">
                  Experience the future of travel planning
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="text-center p-4 sm:p-6 md:p-8 bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl border border-orange-100 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#FFE0B8] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#FF7A32]" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-[#0A2F5A]">
                        {feature.title}
                      </h3>
                      <p className="text-[#5C5C5C] text-xs sm:text-sm md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ENHANCED POPULAR DESTINATIONS */}
          <section className="py-12 md:py-20 bg-[#F7F7F7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-3 md:mb-4">Popular Destinations</h2>
                <p className="text-[#767676] text-sm sm:text-lg">Discover our curated selection of amazing places</p>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-12 md:py-16">
                  <Loader />
                </div>
              )}
              
              {error && (
                <div className="flex justify-center">
                  <ErrorMessage message={error} />
                </div>
              )}

              {!loading && !error && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
                    {places.slice(0, 6).map((place, index) => (
                      <PlaceCard key={place._id} place={place} />
                    ))}
                  </div>

                  <div className="text-center">
                    <Link
                      to="/places"
                      className="inline-flex items-center bg-[#0A2F5A] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl hover:bg-[#0A2F5A] transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-lg"
                    >
                      Explore All Destinations
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ENHANCED APP DOWNLOAD SECTION */}
          <section className="py-12 md:py-20 bg-gradient-to-br from-[#222222] to-[#484848] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center bg-white/20 rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 border border-white/30">
                    <Smartphone className="h-4 w-4 md:h-6 md:w-6 text-yellow-300 mr-2 md:mr-3" />
                    <span className="font-semibold text-sm md:text-base">Download Our App</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                    Travel Better with Our Mobile App
                  </h2>
                  
                  <p className="text-white/90 text-base sm:text-xl mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Get exclusive app-only deals, easy booking, and AI travel assistant in your pocket
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                    <button
                      onClick={() => navigate("/download-app")}
                      className="bg-white text-[#222222] font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg text-sm md:text-base"
                    >
                      Download on App Store
                    </button>

                    <button
                      onClick={() => navigate("/download-app")}
                      className="bg-black text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg text-sm md:text-base"
                    >
                      Get it on Google Play
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8 lg:mt-0">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop" 
                      alt="Mobile App" 
                      className="rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ENHANCED POPULAR FLIGHT ROUTES */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 bg-white">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-8 md:mb-12 text-center">
              Popular GoTrip Flight Routes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                { name: "Ahmedabad Flights", via: "Mumbai, Jaipur, Delhi, Hyderabad", image: "../../public/popular/popular1.jpg" },
                { name: "Kochi Flights", via: "Bangalore, Chennai, Pune, Goa", image: "../../public/popular/popular2.jpg" },
                { name: "Lucknow Flights", via: "Mumbai, Bangalore, Kolkata, Jaipur", image: "../../public/popular/popular3.jpg" },
                { name: "Chandigarh Flights", via: "Delhi, Mumbai, Hyderabad, Pune", image: "../../public/popular/popular4.jpg" },
                { name: "Patna Flights", via: "Kolkata, Delhi, Ranchi, Bangalore", image: "../../public/popular/popular5.jpg" }
              ].map((route, index) => (
                <div key={index} className="flex items-center space-x-4 md:space-x-6 p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <img 
                    src={route.image}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover"
                    alt={route.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1e599e] text-sm sm:text-base md:text-xl mb-1 md:mb-2">{route.name}</h3>
                    <p className="text-[#767676] text-xs sm:text-sm md:text-base">Via – {route.via}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ENHANCED CTA SECTION */}
          <section className="py-12 md:py-20 bg-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] mb-4 md:mb-6">
                Ready to Start Your Adventure?
              </h2>
              
              <p className="text-[#767676] text-base sm:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Let our AI travel assistant create the perfect itinerary for your next unforgettable journey
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                <Link
                  to="/plan-trip"
                  className="bg-[#0A2F5A] text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-xl hover:bg-[#0A2F5A] transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  Start Planning Now
                </Link>
                
                <Link
                  to="/places"
                  className="border-2 border-[#0A2F5A] text-[#0A2F5A] font-bold py-3 px-8 md:py-4 md:px-10 rounded-xl hover:bg-[#0A2F5A] hover:text-white transition-all duration-300 text-sm md:text-base"
                >
                  Browse Destinations
                </Link>
              </div>
            </div>
          </section>

          {/* AI Chatbot */}
          <TravelChatbot />

          {/* ENHANCED FAQ SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 bg-[#F7F7F7]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] mb-8 md:mb-16 text-center">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {[
                {
                  question: "How do I book a flight on GoTrip?",
                  answer: "Booking a flight on GoTrip is simple. Choose your departure and arrival cities, select travel dates, and browse through AI-curated flight options. Our smart filters help you sort by fare, airline, timings, and stops. Once you select a flight, proceed to secure checkout and your ticket is confirmed instantly."
                },
                {
                  question: "Can I get domestic flight deals on GoTrip?",
                  answer: "Yes! GoTrip frequently offers domestic flight discounts. When searching, our system automatically highlights the cheapest available fares and active deals. You can also enable 'Price Alerts' to get notified when fares drop for your selected route."
                },
                {
                  question: "How can I find the lowest airfare on GoTrip?",
                  answer: "Use our 'Smart Price Filter' to arrange flights from lowest to highest. GoTrip's AI also compares prices across multiple airlines and suggests the best combination of timing, comfort, and fare. Checking fares a few days before or after your selected dates can also help you save money."
                },
                {
                  question: "Why is the fare sometimes different at checkout?",
                  answer: "Flight prices change dynamically based on availability and demand. If seats in a fare class get sold out, the airline updates prices in real-time. GoTrip always fetches the latest fare directly from the airline, so the price may differ if the availability changed a few seconds earlier."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-[#222222] mb-3 md:mb-4">{faq.question}</h3>
                  <p className="text-[#767676] text-sm sm:text-base leading-6 md:leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ENHANCED FOOTER LINKS SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 bg-white">
            {[
              {
                title: "GoTrip",
                content: "About Us, Investor Relations, Careers, Sustainability, GoTrip Foundation, Legal Notices, GoTrip Corporate Travel, GoTrip Affiliate Program, Advertise With Us, Holiday-Franchise"
              },
              {
                title: "About The Site",
                content: "Customer Support, Payment Security, Privacy Policy, Cookie Policy, User Agreement, Terms of Service, Franchise Offices, Make A Payment, Work From Home, Escalation Channel"
              },
              {
                title: "Product Offering",
                content: "Flights, International Flights, Charter Flights, Hotels, Homestays and Villas, Activities, Holidays In India, International Holidays, Book Hotels From UAE, Book Online Cabs, Book Bus Tickets, Book Train Tickets, Cheap Tickets to India, Book Flights From US, Book Flights From UAE, Trip Planner, Forex Card, Buy Foreign Currency, Travel Insurance, Travel Insurance For Asia, Travel Insurance For Singapore, Travel Insurance For Thailand, Travel Insurance For Sri Lanka, Travel Insurance For Europe, Travel Insurance For USA, Gift Cards, Gift, Travel Blog, PNR Status, GoTrip Advertising Solutions, One Way Cab, Travel Credit Card"
              }
            ].map((section, index) => (
              <div key={index} className="mb-6 md:mb-8">
                <h3 className="text-xs md:text-sm font-bold text-[#484848] uppercase mb-2 md:mb-3">
                  {section.title}
                </h3>
                <p className="text-[#767676] text-xs md:text-sm leading-5 md:leading-6">
                  {section.content}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* AUTH POPUP MODAL */}
      {authModal === "login" && (
        <Login 
          onClose={() => setAuthModal("none")}
          onSwitchSignup={() => setAuthModal("signup")}
        />
      )}

      {authModal === "signup" && (
        <Signup 
          onClose={() => setAuthModal("none")}
          onSwitchLogin={() => setAuthModal("login")}
        />
      )}
    </div>
  );
};

export default Home;