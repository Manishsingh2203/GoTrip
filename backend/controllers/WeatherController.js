const weatherService = require('../services/weatherService');
const ErrorResponse = require('../utils/errorResponse');

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return next(new ErrorResponse('Please provide latitude and longitude', 400));
    }

    const weather = await weatherService.getCurrentWeather(
      parseFloat(lat),
      parseFloat(lng)
    );

    res.status(200).json({
      success: true,
      data: weather
    });
  } catch (error) {
    next(error);
  }
};

exports.getWeatherForecast = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return next(new ErrorResponse('Please provide latitude and longitude', 400));
    }

    const forecast = await weatherService.getWeatherForecast(
      parseFloat(lat),
      parseFloat(lng)
    );

    res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    next(error);
  }
};