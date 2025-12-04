// src/pages/Places.jsx
import React, { useState } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import { MapPin, Sparkles } from 'lucide-react';
import PlaceCard from '../components/cards/PlaceCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { CATEGORIES } from '../utils/constants';
import TravelChatbot from '../components/chat/TravelChatbot';

const Places = () => {
  const { places, loading, error, searchPlaces } = usePlaces();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  const filteredPlaces = places
    .filter((p) =>
      selectedCategory === 'all'
        ? true
        : (p.category || 'other') === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return (a.name || '').localeCompare(b.name || '');
    });

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================= */}
        {/*    ANIMATED BANNER      */}
        {/* ======================= */}
        <div className="relative overflow-hidden rounded-3xl shadow-lg mb-12">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[300px] object-cover"
          >
            <source src="/video/gotrip-hero.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide drop-shadow-lg text-center">
              Discover Stunning Places with 
               <h1 className="text-[#FF7A32]">GoTrip</h1>
            </h1>
          </div>
        </div>


        {/* ======================= */}
        {/* Top Heading   */}
        {/* ======================= */}
        <div className="text-center py-8">
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#222222] tracking-tight mb-3 px-4">
            Find places you'll love to visit
          </h1>

          <p className="text-[#767676] text-base sm:text-lg max-w-2xl mx-auto px-4">
            Explore destinations curated with AI — perfect for every traveller.
          </p>
        </div>


    


        {/* ======================= */}
        {/*   LOADING / ERROR UI    */}
        {/* ======================= */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <Loader size="lg" text="Discovering beautiful places..." />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-20">
            <ErrorMessage message={error} />
          </div>
        )}


        {/* ======================= */}
        {/*     POPULAR CARDS       */}
        {/* ======================= */}
        {!loading && !error && (
          <>
            <div className="mb-14">
              <h2 className="text-xl font-semibold text-[#222222] mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1e5992]" /> Popular right now
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPlaces.slice(4, 8).map((p) => (
                  <PlaceCard
                    key={p._id}
                    place={{
                      ...p,
                      images: p.images?.length ? p.images : ["/api/placeholder/400/300"],
                    }}
                  />
                ))}
              </div>
            </div>


            {/* ======================= */}
            {/*   RESULT COUNTER       */}
            {/* ======================= */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-[#1e599e] text-white rounded-full text-sm font-semibold">
                  {filteredPlaces.length}
                </div>

                <p className="text-[#484848] text-sm">
                  Showing <span className="font-semibold">{filteredPlaces.length}</span> of{" "}
                  <span className="font-semibold">{places.length}</span> destinations
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#767676]">
                <Sparkles className="h-4 w-4 text-[#1e599e]" />
                <span>AI Created</span>
              </div>
            </div>


            {/* ======================= */}
            {/* LIST / GRID VIEW       */}
            {/* ======================= */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPlaces.map((p) => (
                  <PlaceCard
                    key={p._id}
                    place={{
                      ...p,
                      images: p.images?.length ? p.images : ["/api/placeholder/400/300"],
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {filteredPlaces.map((p) => (
                  <div key={p._id} className="bg-white rounded-2xl shadow border border-gray-200 p-4">
                    <PlaceCard
                      place={{
                        ...p,
                        images: p.images?.length ? p.images : ["/api/placeholder/400/300"],
                      }}
                    />
                  </div>
                ))}
              </div>
            )}


            {/* EMPTY UI */}
            {filteredPlaces.length === 0 && (
              <div className="text-center py-28 bg-white rounded-3xl shadow-lg border border-gray-200 mt-10">
                <div className="w-20 h-20 bg-[#F7F7F7] rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 text-[#767676]" />
                </div>

                <h3 className="text-2xl font-bold text-[#222222] mb-3">
                  No destinations found
                </h3>

                <p className="text-[#767676] max-w-sm mx-auto mb-8">
                  Try using different filters or search again to discover more amazing places.
                </p>

                <button
                  onClick={() => {
                    setSelectedCategory("all");
                  }}
                  className="bg-[#0CA9A5] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0CA9A5] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </>
        )}
      </div>
      {/* AI Chatbot */}
      <TravelChatbot />
    </div>
  );
};

export default Places;