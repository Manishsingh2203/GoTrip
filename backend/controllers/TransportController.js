const transportService = require('../services/transportService');
const ErrorResponse = require('../utils/errorResponse');

// ✈️ FLIGHT SEARCH
exports.searchFlights = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return next(new ErrorResponse("✈️ Please provide ?from=&to=&date= parameters", 400));
    }

    const flights = await transportService.searchFlights(from, to, date);

    return res.status(200).json({
      success: true,
      type: "flights",
      count: flights.length,
      data: flights
    });

  } catch (error) {
    next(error);
  }
};

// 🚆 TRAIN SEARCH
exports.searchTrains = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return next(new ErrorResponse("🚆 Please provide ?from=&to=&date= parameters", 400));
    }

    const trains = await transportService.searchTrains(from, to, date);

    return res.status(200).json({
      success: true,
      type: "trains",
      count: trains.length,
      data: trains
    });

  } catch (error) {
    next(error);
  }
};

// 🚌 BUS SEARCH
exports.searchBuses = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return next(new ErrorResponse("🚌 Please provide ?from=&to=&date= parameters", 400));
    }

    const buses = await transportService.searchBuses(from, to, date);

    return res.status(200).json({
      success: true,
      type: "buses",
      count: buses.length,
      data: buses
    });

  } catch (error) {
    next(error);
  }
};

