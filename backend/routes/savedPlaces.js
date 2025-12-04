const express = require('express');
const { savePlace, getSavedPlaces, deleteSavedPlace } = require('../controllers/savedController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, savePlace);
router.get('/', protect, getSavedPlaces);
router.delete('/:id', protect, deleteSavedPlace);

module.exports = router;
