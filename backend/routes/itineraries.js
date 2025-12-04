const express = require('express');
const { createItinerary, getMyItineraries, updateItinerary, deleteItinerary } = require('../controllers/itineraryController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createItinerary);
router.get('/', protect, getMyItineraries);
router.put('/:id', protect, updateItinerary);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;
