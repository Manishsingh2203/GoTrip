const Trip = require('../models/Trip');
const ErrorResponse = require('../utils/errorResponse');

exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user.id })
      .populate('destination', 'name location')
      .populate('accommodations.hotel', 'name location');

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('destination', 'name location images')
      .populate('accommodations.hotel', 'name location amenities priceRange');

    if (!trip) {
      return next(new ErrorResponse('Trip not found', 404));
    }

    if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this trip', 403));
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

exports.createTrip = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const trip = await Trip.create(req.body);

    res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new ErrorResponse('Trip not found', 404));
    }

    if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this trip', 403));
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new ErrorResponse('Trip not found', 404));
    }

    if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this trip', 403));
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};