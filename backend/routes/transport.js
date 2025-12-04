const express = require("express");
const router = express.Router();

const {
  searchFlights,
  searchTrains,
  searchBuses,
} = require("../controllers/transportController");

const { protect } = require("../middleware/auth");

// Transport Routes
router.get("/flights", protect, searchFlights);
router.get("/trains", protect, searchTrains);
router.get("/buses", protect, searchBuses);

module.exports = router;
