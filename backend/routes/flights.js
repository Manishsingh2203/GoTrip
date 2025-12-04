const router = require("express").Router();

// IMPORT FlightService (MISSING IN YOUR CODE)
const FlightService = require("../services/flightsAPI");

// IMPORT Controller (optional)
const FlightController = require("../controllers/FlightController");


// 🔵 SEARCH FLIGHTS — using FlightService
router.get("/search", async (req, res) => {
  try {
    const flights = await FlightService.searchFlights(req.query);
    res.json({
      success: true,
      count: flights.length,
      flights,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
});


// 🔵 PRICE TREND — using Controller
router.get("/price-trend", FlightController.priceTrend);


module.exports = router;
