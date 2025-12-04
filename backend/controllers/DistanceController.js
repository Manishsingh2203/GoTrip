const distanceService = require('../services/distanceService');
const ErrorResponse = require('../utils/errorResponse');

exports.calculateDistance = async (req, res, next) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.query;

    if (!startLat || !startLng || !endLat || !endLng) {
      return next(new ErrorResponse('Please provide all coordinates', 400));
    }

    const result = await distanceService.calculateDistance(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(endLat),
      parseFloat(endLng)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};