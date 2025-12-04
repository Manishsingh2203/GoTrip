const axios = require('axios');
const config = require('../config/env');

class WeatherService {
  async getCurrentWeather(lat, lng) {
    try {
      // Using OpenWeatherMap API as example
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${config.weather.apiKey}&units=metric`
      );
      
      return {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        icon: response.data.weather[0].icon
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherForecast(lat, lng) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${config.weather.apiKey}&units=metric`
      );
      
      return response.data.list.slice(0, 5).map(item => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        description: item.weather[0].description,
        humidity: item.main.humidity
      }));
    } catch (error) {
      console.error('Weather Forecast API Error:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }
}

module.exports = new WeatherService();