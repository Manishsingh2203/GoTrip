const express = require('express');
const {
  getHotelsByPlace,
  createHotel
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/place/:placeId', getHotelsByPlace);
router.post('/', protect, authorize('admin', 'vendor'), createHotel);

module.exports = router;