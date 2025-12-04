const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReview, getReviewsByPlace, updateReview, deleteReview } = require('../controllers/reviewController');


// POST /api/reviews -> body: { placeId, rating, comment }
router.post('/', protect, createReview);


// GET /api/reviews/place/:placeId
router.get('/place/:placeId', getReviewsByPlace);


// PUT /api/reviews/:id
router.put('/:id', protect, updateReview);


// DELETE /api/reviews/:id
router.delete('/:id', protect, deleteReview);


module.exports = router;