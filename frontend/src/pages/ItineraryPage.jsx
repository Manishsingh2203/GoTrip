import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TripMap from "../components/maps/TripMap";
import TripHeader from "../components/itinerary/TripHeader";
import MustVisitCard from "../components/itinerary/MustVisitCard";
import DayPlanCard from "../components/itinerary/DayPlanCard";
import BudgetCard from "../components/itinerary/BudgetCard";
import TipsCard from "../components/itinerary/TipsCard";
import PackingCard from "../components/itinerary/PackingCard";
import { nearbyAPI } from "../services/nearbyAPI";
import TravelChatbot from '../components/chat/TravelChatbot';
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Star, 
  Heart, 
  Navigation,
  IndianRupee,
  Clock,
  Shield,
  Zap,
  Camera,
  Utensils,
  Hotel,
  Car,
  Train,
  Plane,
  MessageCircle,
  Bookmark,
  ExternalLink
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ItineraryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plan = state?.plan;

  const pdfRef = useRef();
  const [weather, setWeather] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  // Enhanced state
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [nearbyTransport, setNearbyTransport] = useState([]);

  // Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!plan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center overflow-x-hidden">
        <div className="text-center bg-white rounded-lg border border-gray-200 p-8 max-w-md">
          <div className="w-16 h-16 bg-[#0CA9A5] rounded-lg flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            No Itinerary Found
          </h2>
          <p className="text-gray-600 mb-6">
            Let's create your perfect travel plan!
          </p>
          <button
            onClick={() => navigate("/plan-trip")}
            className="w-full bg-[#0CA9A5] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#0CA9A5]/90 transition-colors"
          >
            Plan Your Trip
          </button>
        </div>
      </div>
    );
  }

  const { mustVisit = [] } = plan;

  // Enhanced trip stats
  const tripStats = [
    { icon: Calendar, label: "Duration", value: plan.duration },
    { icon: Clock, label: "Best Time", value: plan.bestTime },
    { icon: MapPin, label: "Places", value: mustVisit.length },
    { icon: IndianRupee, label: "Budget", value: plan.budget?.total || "Custom" }
  ];

  // Enhanced speech functionality
  const speakText = () => {
    if (!window.speechSynthesis) {
      alert("Your browser doesn't support text-to-speech. Try using Chrome, Firefox, or Edge.");
      return;
    }

    if (typeof SpeechSynthesisUtterance === 'undefined') {
      alert("Speech synthesis is not available in your browser.");
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(convertPlanToReadableText(plan));
      utter.lang = "en-US";
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 1;

      utter.onstart = () => {
        console.log("Speech started");
        setIsSpeaking(true);
      };

      utter.onend = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
      };

      utter.onerror = (event) => {
        console.error("Speech error:", event);
        setIsSpeaking(false);
        alert("Error playing speech: " + event.error);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en') && voice.localService === true
        );
        if (englishVoice) {
          utter.voice = englishVoice;
        }
      }

      window.speechSynthesis.speak(utter);

    } catch (error) {
      console.error("Speech synthesis error:", error);
      alert("Failed to start speech: " + error.message);
      setIsSpeaking(false);
    }
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const convertPlanToReadableText = (plan) => {
    let text = "";

    text += `Here is your AI travel plan for ${plan.destination || 'your destination'}.\n\n`;
    text += `Trip summary: ${plan.tripOverview}.\n\n`;
    text += `Best time to visit: ${plan.bestTime}.\n\n`;
    text += `Trip duration: ${plan.duration}.\n\n`;

    text += `Must visit places:\n`;
    plan.mustVisit.forEach((p) => {
      text += `${p.name}: ${p.why}.\n`;
    });

    text += `\nDay by day schedule:\n`;
    plan.dayWisePlan.forEach((d) => {
      text += `Day ${d.day}: ${d.title}.\n`;
      text += `Morning: ${d.morning}.\n`;
      text += `Afternoon: ${d.afternoon}.\n`;
      text += `Evening: ${d.evening}.\n`;
      text += `Food suggestion: ${d.food}.\n\n`;
    });

    text += `Estimated total budget: ${plan.budget.total}.\n\n`;

    text += `Tips:\n`;
    plan.travelTips?.forEach((t) => (text += `- ${t}.\n`));

    text += `Safety:\n`;
    plan.safetyNotes?.forEach((s) => (text += `- ${s}.\n`));

    text += `Packing list:\n`;
    plan.packingList?.forEach((p) => (text += `- ${p}.\n`));

    return text;
  };

  // Enhanced weather fetch
  useEffect(() => {
    if (!plan.tripOverview) return;

    const city = plan.destination || "Ayodhya";

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&units=metric`
    )
      .then((r) => r.json())
      .then((data) => {
        const daily = data.list.slice(0, 5).map((day) => ({
          date: day.dt_txt.split(" ")[0],
          temp: Math.round(day.main.temp),
          desc: day.weather[0].description,
          icon: day.weather[0].icon
        }));
        setWeather(daily);
      })
      .catch(() => console.log("Weather fetch failed"));
  }, []);

  // Enhanced nearby places fetch
  useEffect(() => {
    if (!mustVisit.length) return;

    const { lat, lng } = mustVisit[0];

    (async () => {
      try {
        const restaurantsRes = await nearbyAPI.getNearby({
          lat,
          lng,
          type: "restaurant",
        });

        const cafesRes = await nearbyAPI.getNearby({
          lat,
          lng,
          type: "cafe",
        });

        setNearbyRestaurants([...restaurantsRes.data.data, ...cafesRes.data.data]);
      } catch (err) {
        console.log("Nearby fetch failed:", err);
      }
    })();
  }, [mustVisit]);

  // Share link
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied! Share it anywhere.");
  };

  // Enhanced PDF download
  const downloadPDF = async () => {
    const input = pdfRef.current;

    const canvas = await html2canvas(input, {
      useCORS: true,
      scale: 2,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("GoTrip-Itinerary.pdf");
  };

  // Enhanced transport options
  const transportOptions = [
    { icon: Plane, name: "Flights", description: "Book flights to destination", link: "/flights-search" },
    { icon: Train, name: "Trains", description: "Railway bookings", link: "/trains-search" },
    { icon: Hotel, name: "Hotels", description: "Accommodation stays", link: "/hotels-search" }
  ];

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-6xl mx-auto px-4" ref={pdfRef}>
        
        {/* SIMPLIFIED HEADER SECTION */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#1e599e] transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Planning
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded transition-colors ${
                      isFavorite 
                        ? 'text-[#1e599e]' 
                        : 'text-gray-400 hover:text-[#1e599e]'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded transition-colors ${
                      isBookmarked 
                        ? 'text-[#1e599e]' 
                        : 'text-gray-400 hover:text-[#1e599e]'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your AI-Powered Itinerary
              </h1>
              <p className="text-gray-600">
                {plan.destination ? `Exploring ${plan.destination}` : "Your personalized travel plan"}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 lg:mt-0">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                <Sparkles className="h-4 w-4 text-[#1e599e] mr-2" />
                <span className="text-sm font-medium text-gray-700">AI GENERATED</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={copyShareLink}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Itinerary</span>
            </button>

            {/* SPEECH BUTTONS */}
            {!isSpeaking ? (
              <button
                onClick={speakText}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e599e] text-white rounded-lg hover:bg-[#1e599e]/90 transition-colors font-medium"
              >
                <Volume2 className="h-4 w-4" />
                <span>Listen to Trip Plan</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={pauseSpeech}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <VolumeX className="h-4 w-4" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={resumeSpeech}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={stopSpeech}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <VolumeX className="h-4 w-4" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            {/* TRIP HEADER */}
            <TripHeader
              overview={plan.tripOverview}
              bestTime={plan.bestTime}
              duration={plan.duration}
              destination={plan.destination}
            />

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {transportOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                   <Link

                      key={index}
                      to={option.link}
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group border border-gray-200 hover:border-[#1e599e]"
                    >
                      <div className="w-12 h-12 bg-[#1e599e] rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{option.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{option.description}</span>
                      </Link>
                  );
                })}
              </div>
            </div>

            {/* MAP */}
            {mustVisit.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-[#1e599e]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Trip Map</h3>
                      <p className="text-gray-600 text-sm">Explore your destinations visually</p>
                    </div>
                  </div>
                </div>
                <TripMap
                  locations={mustVisit.map((p) => ({
                    lat: p.lat ?? 26.8,
                    lng: p.lng ?? 82.2,
                    name: p.name,
                  }))}
                />
              </div>
            )}

            {/* WEATHER */}
            {weather && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-[#1e599e] text-sm">🌤️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">5-Day Weather Forecast</h3>
                    <p className="text-gray-600 text-sm">Plan your activities accordingly</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {weather.map((w, i) => (
                    <div key={i} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-700 text-sm mb-1">{w.date}</p>
                      <img 
                        src={`https://openweathermap.org/img/wn/${w.icon}.png`} 
                        alt={w.desc}
                        className="w-10 h-10 mx-auto mb-1"
                      />
                      <p className="text-lg font-bold text-[#1e599e]">{w.temp}°C</p>
                      <p className="text-xs text-gray-500 capitalize">{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MUST VISIT */}
            {!!mustVisit.length && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 text-[#1e599e]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Must-Visit Places</h3>
                      <p className="text-gray-600 text-sm">Top AI-curated recommendations</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {mustVisit.map((place, idx) => (
                      <MustVisitCard key={idx} name={place.name} why={place.why} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DAY PLAN */}
            {!!plan.dayWisePlan?.length && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-[#1e599e]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Day-wise Plan</h3>
                      <p className="text-gray-600 text-sm">Your detailed travel schedule</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {plan.dayWisePlan.map((day) => (
                      <DayPlanCard key={day.day} {...day} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BUDGET */}
            {plan.budget && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <BudgetCard budget={plan.budget} />
              </div>
            )}

            {/* TIPS + SAFETY */}
            {(plan.travelTips?.length > 0 || plan.safetyNotes?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.travelTips?.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <TipsCard title="Travel Tips" items={plan.travelTips} />
                  </div>
                )}
                {plan.safetyNotes?.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <TipsCard title="Safety Notes" items={plan.safetyNotes} />
                  </div>
                )}
              </div>
            )}

            {/* PACKING */}
            {plan.packingList?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <PackingCard items={plan.packingList} />
              </div>
            )}
          </div>

          {/* SIMPLIFIED SIDEBAR */}
          <div className="space-y-6">
            {/* TRIP STATS */}
            <div className="bg-[#ffe2ab] rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#1e599e]" />
                Trip Overview
              </h3>
              <div className="space-y-3">
                {tripStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 text-sm">{stat.label}</span>
                      </div>
                      <span className="font-medium text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI BADGE */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-[#1e599e]" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">AI Powered</h4>
              <p className="text-gray-600 text-sm mb-3">
                Intelligently crafted by our advanced travel AI
              </p>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-gray-500">4.9/5 Traveler Rating</span>
            </div>

            {/* QUICK BOOKING */}


            {/* SUPPORT CTA */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <MessageCircle className="h-8 w-8 text-[#1e599e] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
              <p className="text-gray-600 text-sm mb-3">
                Our travel experts are here 24/7
              </p>
             <Link to="/contact" className="w-full">
  <button className="w-full bg-[#1e599e] text-white font-medium py-2 px-4 rounded hover:bg-[#1e599e]/90 transition-colors">
    Contact Support
  </button>
</Link>
            </div>

            {/* TRUST BADGES */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-gray-900">Why Trust Us?</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>10,000+ Trips Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>98% Satisfaction Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Best Price Guarantee</span>
                </div>
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

export default ItineraryPage;