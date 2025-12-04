import React from 'react';

const WeatherEffect = ({ type = 'sunny' }) => {
  const renderEffect = () => {
    switch (type) {
      case 'rainy':
        return (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-300 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        );
      
      case 'snowy':
        return (
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full animate-snow"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>
        );
      
      case 'cloudy':
        return (
          <div className="absolute inset-0">
            <div className="absolute top-4 left-8 w-12 h-8 bg-gray-300 rounded-full animate-pulse-slow"></div>
            <div className="absolute top-6 left-16 w-16 h-10 bg-gray-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-8 left-4 w-10 h-6 bg-gray-200 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>
        );
      
      default: // sunny
        return (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full animate-pulse-slow">
              <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping"></div>
            </div>
            {/* Sun rays */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-4 bg-yellow-300 transform origin-bottom"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px)`,
                }}
              ></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-32 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg overflow-hidden">
      {renderEffect()}
      
      <style jsx>{`
        @keyframes rain {
          0% { top: -20px; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes snow {
          0% { top: -10px; opacity: 1; transform: translateX(0); }
          100% { top: 100%; opacity: 0; transform: translateX(20px); }
        }
        .animate-rain {
          animation: rain 1.5s linear infinite;
        }
        .animate-snow {
          animation: snow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WeatherEffect;