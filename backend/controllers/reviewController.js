const Review = require('../models/Review');
const Place = require('../models/Place');


// helper: recompute average rating and count for a place
async function recomputePlaceRating(placeId) {
const agg = await Review.aggregate([
{ $match: { place: placeId } },
{ $group: { _id: '$place', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
]);


if (agg.length) {
const { avg, count } = agg[0];
await Place.findByIdAndUpdate(placeId, { rating: Number(avg.toFixed(2)), reviewCount: count });
} else {
await Place.findByIdAndUpdate(placeId, { rating: 4.2, reviewCount: 0 });
}
}


exports.createReview = async (req, res, next) => {
try {
const { placeId, rating, comment } = req.body;
if (!placeId || !rating) return res.status(400).json({ success: false, message: 'placeId and rating required' });


const existing = await Review.findOne({ place: placeId, user: req.user._id });
if (existing) return res.status(409).json({ success: false, message: 'User already reviewed. Use update.' });


const review = await Review.create({ place: placeId, user: req.user._id, rating, comment });


await recomputePlaceRating(placeId);


res.status(201).json({ success: true, data: review });
} catch (err) { next(err); }
};


exports.getReviewsByPlace = async (req, res, next) => {
try {
const { placeId } = req.params;
const reviews = await Review.find({ place: placeId }).populate('user', 'name email').sort({ createdAt: -1 });
res.json({ success: true, count: reviews.length, data: reviews });
} catch (err) { next(err); }
};


exports.updateReview = async (req, res, next) => {
try {
const { id } = req.params; // review id
const { rating, comment } = req.body;
const review = await Review.findById(id);
if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
if (String(review.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Forbidden' });


review.rating = rating ?? review.rating;
review.comment = comment ?? review.comment;
await review.save();


await recomputePlaceRating(review.place);


res.json({ success: true, data: review });
} catch (err) { next(err); }
};



exports.deleteReview = async (req, res, next) => {
try {
const { id } = req.params; // review id
const review = await Review.findById(id);
if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
if (String(review.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Forbidden' });


const placeId = review.place;
await review.deleteOne();
await recomputePlaceRating(placeId);


res.json({ success: true, message: 'Deleted' });
} catch (err) { next(err); }
};