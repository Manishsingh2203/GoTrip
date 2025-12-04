const express = require('express');
const {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  getPlacesByCategory,
  searchGlobalPlaces,
  searchAIPlaces
} = require('../controllers/PlaceController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// IMPORTANT: Specific routes FIRST
router.get('/search', searchPlaces);
router.get('/category/:name', getPlacesByCategory);
router.get("/search-global", searchGlobalPlaces);
router.get("/ai-search", searchAIPlaces);


router.route('/')
  .get(getPlaces)
  .post(protect, authorize('admin', 'vendor'), createPlace);

router.route('/:id')
  .get(getPlace)
  .put(protect, authorize('admin', 'vendor'), updatePlace)
  .delete(protect, authorize('admin', 'vendor'), deletePlace);

module.exports = router;
