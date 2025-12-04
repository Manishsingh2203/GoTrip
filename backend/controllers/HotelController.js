const Hotel = require('../models/Hotel');
const ErrorResponse = require('../utils/errorResponse');

exports.getHotelsByPlace = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ place: req.params.placeId }).populate('place', 'name');
    
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

exports.createHotel = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};