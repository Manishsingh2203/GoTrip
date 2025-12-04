const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');

exports.getRestaurantsByPlace = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ place: req.params.placeId }).populate('place', 'name');
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};