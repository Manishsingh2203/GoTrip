const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true
  },
  description: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelers: {
    adults: {
      type: Number,
      default: 1
    },
    children: {
      type: Number,
      default: 0
    }
  },
  budget: {
    total: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  itinerary: [{
    day: Number,
    date: Date,
    activities: [{
      time: String,
      activity: String,
      location: String,
      notes: String
    }]
  }],
  accommodations: [{
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel'
    },
    checkIn: Date,
    checkOut: Date
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'cancelled'],
    default: 'planning'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);