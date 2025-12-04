const mongoose = require('mongoose');

const savedPlaceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  placeId: { type: String }, // if place exists in DB
  data: { type: Object, required: true }, // full place snapshot (AI or DB)
  notes: String,
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('SavedPlace', savedPlaceSchema);
