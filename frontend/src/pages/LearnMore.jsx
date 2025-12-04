import React from "react";
import { Info, Smartphone, Sparkles, Shield } from "lucide-react";

const LearnMore = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-[#222222] mb-6 flex items-center gap-2">
        <Info className="h-7 w-7 text-[#1e599e]" />
        Learn More About GoTrip App
      </h1>

      <p className="text-[#767676] mb-10 max-w-3xl">
        GoTrip App helps you plan trips smarter with real-time AI suggestions, offline access,
        live map navigation, budget insights and more. Here's everything you can do:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Feature 1 */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <Sparkles className="h-8 w-8 text-[#1e599e] mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-[#222222]">AI Travel Assistance</h3>
          <p className="text-[#767676] text-sm">
            Generate day-by-day itineraries, get destination tips, and personalize your trip instantly.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <Smartphone className="h-8 w-8 text-[#1e599e] mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-[#222222]">Works Offline Too</h3>
          <p className="text-[#767676] text-sm">
            Access your itinerary even without network. Perfect for remote locations.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <Shield className="h-8 w-8 text-[#1e599e] mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-[#222222]">Secure & Private</h3>
          <p className="text-[#767676] text-sm">
            Your data stays safe with industry-grade encryption and privacy controls.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <Info className="h-8 w-8 text-[#1e599e] mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-[#222222]">More Features Coming Soon</h3>
          <p className="text-[#767676] text-sm">
            Live travel alerts, AI packing lists, auto-budgeting and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;