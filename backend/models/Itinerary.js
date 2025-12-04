const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  title: String,
  places: [{ type: Object }] // snapshot of place objects
});

const itinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Trip' },
  startDate: Date,
  endDate: Date,
  days: [daySchema],
  notes: String,
  privacy: { type: String, enum: ['private','public'], default: 'private' }
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
