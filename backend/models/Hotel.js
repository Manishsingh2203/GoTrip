const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  description: String,
  place: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: true
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [String],
  roomTypes: [{
    type: String,
    price: Number,
    capacity: Number
  }],
  priceRange: {
    min: Number,
    max: Number
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.0
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [String],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);