// backend/controllers/aiTravelController.js
const aiTravelService = require('../services/aiTravelService');
const { errorResponse } = require('../utils/errorResponse');

exports.getFlights = async (req, res, next) => {
  try {
    const { from, to, date, passengers = 1, classType = 'Economy' } = req.body;
    if (!from || !to || !date) {
      return res.status(400).json(errorResponse('from, to and date are required'));
    }

    const flights = await aiTravelService.fetchFlights({ from, to, date, passengers, classType, userId: req.user?.id });
    return res.json({ success: true, data: flights });
  } catch (err) {
    next(err);
  }
};

exports.getTrains = async (req, res, next) => {
  try {
    const { from, to, date, classPref = ['SL','3A','2A','CC'] } = req.body;
    if (!from || !to || !date) {
      return res.status(400).json(errorResponse('from, to and date are required'));
    }

    const trains = await aiTravelService.fetchTrains({ from, to, date, classPref, userId: req.user?.id });
    return res.json({ success: true, data: trains });
  } catch (err) {
    next(err);
  }
};

exports.getHotels = async (req, res, next) => {
  try {
    const { city, checkin, checkout, guests = 1 } = req.body;
    if (!city || !checkin || !checkout) {
      return res.status(400).json(errorResponse('city, checkin and checkout are required'));
    }

    const hotels = await aiTravelService.fetchHotels({ city, checkin, checkout, guests, userId: req.user?.id });
    return res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};
