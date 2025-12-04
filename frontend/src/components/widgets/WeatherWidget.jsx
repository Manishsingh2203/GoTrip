import React, { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Thermometer, Droplets, Wind, Cloud, Sun, CloudRain } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const WeatherWidget = ({ lat, lng, placeName }) => {
  const { weather, forecast, loading, error, fetchCurrentWeather } = useWeather();
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (lat && lng) {
      fetchCurrentWeather(lat, lng);
      setLastUpdated(new Date().toLocaleTimeString());
    }
    // 🚀 FIX: Removed fetchCurrentWeather from dependencies
    // eslint-disable-next-line
  }, [lat, lng]);

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (desc.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-500" />;
    if (desc.includes('clear')) return <Sun className="h-8 w-8 text-yellow-500" />;
    return <Cloud className="h-8 w-8 text-gray-400" />;
  };

  if (loading) return <Loader text="Loading weather..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchCurrentWeather(lat, lng)} />;
  if (!weather) return <div className="text-[#767676]">No weather data available</div>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-[#222222]">Weather</h3>
          {placeName && <p className="text-sm text-[#767676]">{placeName}</p>}
        </div>
        {lastUpdated && (
          <span className="text-xs text-[#767676]">Updated: {lastUpdated}</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {getWeatherIcon(weather.description)}
          <div>
            <div className="text-3xl font-bold text-[#222222]">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-sm text-[#767676] capitalize">
              {weather.description}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <Droplets className="h-5 w-5 text-blue-500 mb-1" />
          <span className="text-sm text-[#767676]">Humidity</span>
          <span className="font-semibold text-[#222222]">{weather.humidity}%</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Wind className="h-5 w-5 text-green-500 mb-1" />
          <span className="text-sm text-[#767676]">Wind</span>
          <span className="font-semibold text-[#222222]">{weather.windSpeed} m/s</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Thermometer className="h-5 w-5 text-red-500 mb-1" />
          <span className="text-sm text-[#767676]">Feels like</span>
          <span className="font-semibold text-[#222222]">
            {Math.round(weather.temperature)}°C
          </span>
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-[#222222] mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-[#767676] mb-1">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="text-lg font-semibold text-[#222222]">
                  {Math.round(day.temperature)}°
                </div>
                <div className="text-xs text-[#767676] capitalize">
                  {day.description.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;