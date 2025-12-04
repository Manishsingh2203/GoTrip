const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
rating: { type: Number, required: true, min: 1, max: 5 },
comment: { type: String, default: '' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Review', ReviewSchema);