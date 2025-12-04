const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: function () {
      // Social login users don't need password
      return this.provider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  role: {
    type: String,
    enum: ['user', 'admin', 'vendor'],
    default: 'user'
  },

  avatar: {
    type: String,
    default: null
  },

  preferences: {
    budget: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      default: 'mid-range'
    },
    travelStyle: [String],
    interests: [String]
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: String,
  otpExpires: Date,

  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },

  // ⭐ Added for Clerk Social Login Mapping
  googleId: {
    type: String,
    default: null
  },

  facebookId: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

// Hash password only if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Check password correctness
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
