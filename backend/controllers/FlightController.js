// backend/controllers/FlightController.js
const FlightsAPI = require("../services/flightsAPI");

exports.searchFlights = async (req, res) => {
  try {
   const origin = req.query.origin || req.query.from;
const destination = req.query.destination || req.query.to;
const date = req.query.date;


    if (!origin || !destination || !date) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const data = await FlightsAPI.searchFlights({ origin, destination, date });

    return res.json({
      success: true,
      count: data.length,
      flights: data
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




exports.priceTrend = async (req, res) => {
  const { origin, destination, date } = req.query;

  const data = await FlightsAPI.getPriceTrend(origin, destination, date);

  res.json({ data });
};
