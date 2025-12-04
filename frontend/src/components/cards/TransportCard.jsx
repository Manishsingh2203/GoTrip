import React, { useState } from 'react';
import { Clock, MapPin, Heart, ChevronRight } from 'lucide-react';

const TransportCard = ({ transport, type = 'flight' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeIcon = (type) => {
    const icons = {
      flight: '✈️',
      train: '🚆',
      bus: '🚌',
      ferry: '⛴️',
      taxi: '🚕'
    };
    return icons[type] || '🚗';
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
              {getTypeIcon(type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {transport.airline || transport.trainName || transport.busCompany}
              </h3>
              <p className="text-sm text-gray-600">
                {transport.flightNumber || transport.routeNumber || ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Route Timeline */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="font-medium text-gray-900 mb-1">
              {transport.departure.time}
            </div>
            <div className="text-sm text-gray-600 line-clamp-1">
              {transport.departure.city}
            </div>
          </div>

          <div className="flex flex-col items-center mx-2">
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{transport.duration}</span>
            </div>
            <div className="w-20 h-px bg-gray-300"></div>
          </div>

          <div className="text-center flex-1">
            <div className="font-medium text-gray-900 mb-1">
              {transport.arrival.time}
            </div>
            <div className="text-sm text-gray-600 line-clamp-1">
              {transport.arrival.city}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">
              ${transport.price}
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1">
            View Details
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportCard;