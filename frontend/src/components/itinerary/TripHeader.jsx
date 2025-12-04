import React from 'react';
import { Calendar, Clock, Compass } from 'lucide-react';

const TripHeader = ({ overview, bestTime, duration }) => {
  if (!overview && !bestTime && !duration) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Compass className="h-6 w-6 text-[#1e599e]" />
          <h2 className="text-xl font-semibold text-[#222222]">Trip Overview</h2>
        </div>

        {/* Overview Section */}
        {overview && (
          <div className="mb-4">
            <p className="text-[#484848] leading-relaxed">
              {overview}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {duration && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#767676]" />
              <div>
                <p className="text-sm text-[#767676]">Trip Duration</p>
                <p className="font-medium text-[#222222]">{duration}</p>
              </div>
            </div>
          )}

          {bestTime && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#767676]" />
              <div>
                <p className="text-sm text-[#767676]">Best Time to Visit</p>
                <p className="font-medium text-[#222222]">{bestTime}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripHeader;