import React from 'react';

const FlightAnimation = () => {
  return (
    <div className="relative w-full h-32 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg overflow-hidden">
      {/* Clouds */}
      <div className="absolute top-4 left-1/4 animate-float">
        <div className="w-16 h-8 bg-white rounded-full opacity-80"></div>
      </div>
      <div className="absolute top-8 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-6 bg-white rounded-full opacity-80"></div>
      </div>
      <div className="absolute top-12 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-10 bg-white rounded-full opacity-80"></div>
      </div>

      {/* Airplane */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-fly">
        <div className="flex items-center">
          {/* Body */}
          <div className="w-16 h-6 bg-white rounded-lg relative">
            {/* Windows */}
            <div className="absolute top-1 left-2 w-2 h-2 bg-blue-200 rounded-full"></div>
            <div className="absolute top-1 left-6 w-2 h-2 bg-blue-200 rounded-full"></div>
            <div className="absolute top-1 left-10 w-2 h-2 bg-blue-200 rounded-full"></div>
            
            {/* Wings */}
            <div className="absolute top-2 -right-4 w-8 h-2 bg-white transform -rotate-45 origin-left"></div>
            <div className="absolute top-2 -left-4 w-8 h-2 bg-white transform rotate-45 origin-right"></div>
            
            {/* Tail */}
            <div className="absolute -top-4 right-2 w-2 h-4 bg-white transform -rotate-45"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fly {
          0% { left: -100px; transform: translateY(-50%) rotate(0deg); }
          25% { transform: translateY(-60%) rotate(5deg); }
          50% { transform: translateY(-50%) rotate(0deg); }
          75% { transform: translateY(-40%) rotate(-5deg); }
          100% { left: 100%; transform: translateY(-50%) rotate(0deg); }
        }
        .animate-fly {
          animation: fly 6s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FlightAnimation;