import React from 'react';

const TrainAnimation = () => {
  return (
    <div className="relative w-full h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
      
      {/* Train */}
      <div className="absolute top-1/2 transform -translate-y-1/2 animate-train">
        <div className="flex items-center space-x-1">
          {/* Engine */}
          <div className="w-12 h-8 bg-blue-600 rounded-lg relative">
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          {/* Cars */}
          {[1, 2, 3].map((car) => (
            <div key={car} className="w-10 h-6 bg-blue-500 rounded relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-sm"></div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="absolute bottom-4 left-0 right-0 flex space-x-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-4 h-1 bg-gray-600 rounded"></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes train {
          0% { left: -100px; }
          100% { left: 100%; }
        }
        .animate-train {
          animation: train 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TrainAnimation;