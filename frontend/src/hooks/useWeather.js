import { useState } from 'react';
import api from '../services/api';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentWeather = async (lat, lng) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/weather/current?lat=${lat}&lng=${lng}`);
      setWeather(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (lat, lng) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/weather/forecast?lat=${lat}&lng=${lng}`);
      setForecast(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch forecast');
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    forecast,
    loading,
    error,
    fetchCurrentWeather,
    fetchForecast,
  };
};