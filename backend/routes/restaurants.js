const express = require('express');
const {
  getRestaurantsByPlace,
  createRestaurant
} = require('../controllers/RestaurantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/place/:placeId', getRestaurantsByPlace);
router.post('/', protect, authorize('admin', 'vendor'), createRestaurant);

module.exports = router;