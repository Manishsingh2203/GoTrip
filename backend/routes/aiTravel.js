// backend/routes/aiTravel.js
const express = require('express');
const router = express.Router();
const aiTravelController = require('../controllers/aiTravelController');

// POST /ai/flights
router.post('/flights', aiTravelController.getFlights);

// POST /ai/trains
router.post('/trains', aiTravelController.getTrains);

// POST /ai/hotels
router.post('/hotels', aiTravelController.getHotels);

module.exports = router;
