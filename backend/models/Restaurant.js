const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
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
  cuisine: [String],
 priceRange: {
  type: String,
  default: "$$"
},

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.0
  },
  openingHours: {
    open: String,
    close: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [String],
  dietaryOptions: [String],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);