const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'historical', 'religious', 'adventure', 'park', 'museum'],
    required: true
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    }
  },
  images: [String],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.0
  },



  bestTimeToVisit: [String],
  activities: [String],
  entryFee: {
    type: Number,
    default: 0
  },
  openingHours: {
    open: String,
    close: String
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Make sure this index is properly defined
placeSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Place', placeSchema);