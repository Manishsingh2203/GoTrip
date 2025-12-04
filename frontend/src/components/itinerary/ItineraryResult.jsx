import React from "react";
import {
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Lightbulb,
  Shield,
  Luggage,
} from "lucide-react";

import TripHeader from "./TripHeader";
import MustVisitCard from "./MustVisitCard";
import DayPlanCard from "./DayPlanCard";
import BudgetCard from "./BudgetCard";
import TipsCard from "./TipsCard";
import PackingCard from "./PackingCard";

const ItineraryResult = ({ plan }) => {
  if (!plan) return null;

  const {
    tripOverview,
    bestTime,
    duration,
    mustVisit = [],
    dayWisePlan = [],
    budget,
    travelTips = [],
    safetyNotes = [],
    packingList = [],
  } = plan;

  const totalActivities = dayWisePlan.reduce((acc, day) => {
    return (
      acc +
      [day.morning, day.afternoon, day.evening].filter(Boolean).length
    );
  }, 0);

  const sections = [
    {
      condition: !!mustVisit.length,
      icon: MapPin,
      title: "Must-Visit Places",
      count: mustVisit.length,
      gradient: "from-[#0CA9A5] to-[#FF5A5F]",
    },
    {
      condition: !!dayWisePlan.length,
      icon: Calendar,
      title: "Daily Itinerary",
      count: dayWisePlan.length,
      gradient: "from-[#0CA9A5] to-[#FF5A5F]",
    },
    {
      condition: !!budget,
      icon: Wallet,
      title: "Budget Breakdown",
      count: Object.keys(budget || {}).length,
      gradient: "from-[#0CA9A5] to-[#FF5A5F]",
    },
    {
      condition: travelTips.length > 0,
      icon: Lightbulb,
      title: "Travel Tips",
      count: travelTips.length,
      gradient: "from-[#0CA9A5] to-[#FF5A5F]",
    },
    {
      condition: safetyNotes.length > 0,
      icon: Shield,
      title: "Safety Notes",
      count: safetyNotes.length,
      gradient: "from-[#0CA9A5] to-[#FF5A5F]",
    },
    {
      condition: packingList.length > 0,
      icon: Luggage,
      title: "Packing List",
      count: packingList.length,
      gradient: "from-[#0CA9A5] to-[#FF5A5F]",
    },
  ].filter((s) => s.condition);

  return (
    <div className="space-y-10">

      {/* =========================== */}
      {/* AI BADGE HEADER             */}
      {/* =========================== */}

      <div className="bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] rounded-3xl p-8 text-white shadow-2xl">

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
            <Sparkles className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">Your AI-Generated Itinerary</h2>
            <p className="text-white/80">
              Crafted with precision for a perfect travel experience
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Days Planned", value: dayWisePlan.length },
            { label: "Must-Visit", value: mustVisit.length },
            { label: "Activities", value: totalActivities },
            { label: "Sections", value: sections.length },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/15 p-5 rounded-2xl border border-white/20 backdrop-blur-sm text-center"
            >
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Header */}
      <TripHeader overview={tripOverview} bestTime={bestTime} duration={duration} />

      {/* =========================== */}
      {/* QUICK NAVIGATION            */}
      {/* =========================== */}

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">

        <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#1e599e]" /> Quick Navigation
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <a
                key={index}
                href={`#${section.title.toLowerCase().replace(" ", "-")}`}
                className={`bg-gradient-to-br ${section.gradient} text-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl hover:scale-105 transition-all`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-semibold">{section.title}</div>
                <div className="text-xs opacity-90">{section.count} items</div>
              </a>
            );
          })}
        </div>
      </div>

      {/* =========================== */}
      {/* MUST VISIT                  */}
      {/* =========================== */}

      {!!mustVisit.length && (
        <section id="must-visit-places" className="scroll-mt-28">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#222222]">Must-Visit Places</h3>
              <p className="text-[#767676]">Hand-picked by our AI engine</p>
            </div>

            <div className="ml-auto px-4 py-1 rounded-full bg-[#F7F7F7] text-[#1e599e] text-sm font-semibold">
              {mustVisit.length} places
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mustVisit.map((place, i) => (
              <MustVisitCard key={i} name={place.name} why={place.why} />
            ))}
          </div>
        </section>
      )}

      {/* =========================== */}
      {/* DAYWISE                     */}
      {/* =========================== */}

      {!!dayWisePlan.length && (
        <section id="daily-itinerary" className="scroll-mt-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#222222]">Daily Itinerary</h3>
              <p className="text-[#767676]">Structured day-by-day travel plan</p>
            </div>

            <div className="ml-auto bg-[#F7F7F7] text-[#1e599e] px-4 py-1 rounded-full text-sm font-semibold">
              {dayWisePlan.length} days
            </div>
          </div>

          <div className="space-y-6">
            {dayWisePlan.map((day) => (
              <DayPlanCard key={day.day} {...day} />
            ))}
          </div>
        </section>
      )}

      {/* =========================== */}
      {/* BUDGET                      */}
      {/* =========================== */}

      {budget && (
        <section id="budget-breakdown" className="scroll-mt-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] rounded-2xl flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#222222]">Budget Breakdown</h3>
              <p className="text-[#767676]">AI-optimized trip cost</p>
            </div>
          </div>

          <BudgetCard budget={budget} />
        </section>
      )}

      {/* =========================== */}
      {/* TIPS + SAFETY               */}
      {/* =========================== */}

      {(travelTips.length > 0 || safetyNotes.length > 0) && (
        <section id="tips-safety" className="scroll-mt-28">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] rounded-2xl flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#222222]">Travel Guidance</h3>
              <p className="text-[#767676]">Helpful travel & safety insights</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {travelTips.length > 0 && <TipsCard title="Travel Tips" items={travelTips} />}
            {safetyNotes.length > 0 && (
              <TipsCard title="Safety Notes" items={safetyNotes} />
            )}
          </div>
        </section>
      )}

      {/* =========================== */}
      {/* PACKING LIST                */}
      {/* =========================== */}

      {packingList.length > 0 && (
        <section id="packing-list" className="scroll-mt-28">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] flex items-center justify-center">
              <Luggage className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#222222]">Packing Checklist</h3>
              <p className="text-[#767676]">Smart packing suggestions</p>
            </div>

            <div className="ml-auto bg-[#F7F7F7] text-[#1e599e] px-4 py-1 rounded-full text-sm font-semibold">
              {packingList.length} items
            </div>
          </div>

          <PackingCard items={packingList} />
        </section>
      )}

      {/* =========================== */}
      {/* FINAL CTA                   */}
      {/* =========================== */}

      <div className="bg-gradient-to-r from-[#0CA9A5] to-[#FF5A5F] rounded-3xl p-10 text-white text-center shadow-2xl mt-10">
        <h3 className="text-3xl font-bold mb-3">
          Ready to Start Your Journey?
        </h3>

        <p className="text-white/80 mb-6 max-w-xl mx-auto">
          Your AI-crafted itinerary is ready. Prepare for an unforgettable travel experience!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-[#1e599e] font-bold py-3 px-8 rounded-2xl shadow-md hover:bg-gray-100 hover:scale-105 transition">
            Download Itinerary
          </button>

          <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-2xl hover:bg-white hover:text-[#1e599e] shadow-md hover:scale-105 transition">
            Share with Friends
          </button>
        </div>
      </div>

    </div>
  );
};

export default ItineraryResult;