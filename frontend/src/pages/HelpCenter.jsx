import React, { useState } from "react";
import { askHelpAI } from "../services/helpAPI";

const trendingQuestions = [
  "How does the AI Trip Planner work?",
  "Why is my itinerary not generating?",
  "How to plan a multi-day trip?",
  
  "How to search for hotels in GoTrip?",
  "Why am I not getting flight results?",
  "How accurate are AI-generated flight prices?",
  "How to filter flights by airline or timing?",
  "Why is train availability not loading?",
  "How to check seat availability for trains?",
  "Does GoTrip show real IRCTC data?",
  "Is GoTrip completely free?",
  "Is my data safe with GoTrip?"
];

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const askAI = async (text) => {
    const finalQuery = text || query;

    if (!finalQuery.trim()) return;

    setLoading(true);
    setAnswer("");
    setQuery(finalQuery);

    const res = await askHelpAI(finalQuery);
    setAnswer(res.answer);
    setLoading(false);
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen py-10 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#222] mb-2">
          Help Center
        </h1>
        <p className="text-[#555] mb-6 sm:mb-8 text-base sm:text-lg">
          Get answers instantly with GoTrip AI Assistant.
        </p>

        {/* Search Box */}
        <div
          className={`bg-white p-4 sm:p-5 rounded-2xl shadow transition-all duration-300 ${
            active ? "shadow-xl scale-[1.01]" : "shadow"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Type your question... e.g. 'Trip not generating'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              className="flex-1 border border-gray-300 px-4 py-3 rounded-xl outline-none text-[15px]"
            />

            <button
              onClick={() => askAI()}
              className="bg-[#1e599e] text-white px-5 py-3 rounded-xl shadow hover:bg-[#184a82] transition sm:w-auto w-full"
            >
              Ask
            </button>
          </div>

          {/* Trending Questions */}
          <div className="mt-4">
            <p className="text-xs sm:text-sm text-[#777] mb-2">
              Popular Questions:
            </p>

            <div className="flex flex-wrap gap-2">
              {trendingQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => askAI(q)}
                  className="px-3 py-2 bg-[#EFEFEF] text-xs sm:text-sm rounded-lg hover:bg-[#E5E5E5] transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Loading */}
        {loading && (
          <div className="mt-6 text-[#555] animate-pulse text-base sm:text-lg">
            Thinking… (powered by GoTrip)
          </div>
        )}

        {/* AI Response */}
        {answer && (
          <div className="mt-6 sm:mt-8 bg-white border rounded-xl shadow p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-2 sm:mb-3 text-[#222]">
              AI Answer
            </h3>
            <p className="text-[#333] leading-relaxed text-sm sm:text-base">
              {answer}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 sm:my-10 border-t border-gray-300"></div>

        {/* Static Cards (responsive spacing) */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#222] mb-4">
          Quick Help Topics
        </h2>

        <div className="space-y-4 sm:space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-[#222]">
              How does AI Trip Planner work?
            </h3>
            <p className="text-[#767676] text-xs sm:text-sm">
              Enter your preferences and AI generates a complete itinerary.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-[#222]">
              Is GoTrip free?
            </h3>
            <p className="text-[#767676] text-xs sm:text-sm">
              Yes. All features are currently free during beta.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;
