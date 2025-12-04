const express = require('express');
const {
  generatePackingList,
  generateSafetyTips,
  generateItinerary,
  generateBudgetEstimate,
  chatAboutTravel,
  voicePlan,
  detectLanguage        // ⭐ ADD THIS
} = require('../controllers/AIController');

const { searchAI, detectCountry } = require('../controllers/aiPlaceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/packing-list', protect, generatePackingList);
router.post('/safety-tips', protect, generateSafetyTips);
router.post('/itinerary', protect, generateItinerary);
router.post('/budget', protect, generateBudgetEstimate);
router.post('/chat', protect, chatAboutTravel);
router.post("/voice-plan", protect, voicePlan);

router.post('/detect-country', protect, detectCountry);

// ⭐ Search places
router.get('/search-places', protect, searchAI);

// ⭐ FINAL — SINGLE LANGUAGE DETECT API
router.post("/detect-lang", protect, detectLanguage);

module.exports = router;
