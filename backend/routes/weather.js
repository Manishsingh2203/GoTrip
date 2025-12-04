const express = require('express');
const {
  getCurrentWeather,
  getWeatherForecast
} = require('../controllers/WeatherController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/current', protect, getCurrentWeather);
router.get('/forecast', protect, getWeatherForecast);

module.exports = router;