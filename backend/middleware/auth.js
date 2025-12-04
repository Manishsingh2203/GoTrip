const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from HttpOnly cookie first, then from Authorization header as fallback
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is verified (only for local provider)
    if (user.provider === 'local' && !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before accessing this route'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional: Refresh token middleware
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      config.jwt.accessSecret,
      { expiresIn: '7d' }
    );

    // Set new access token in cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Refresh token error:', error.message);
    
    // Clear invalid tokens
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Optional: Check if user is verified middleware
exports.requireVerification = (req, res, next) => {
  if (req.user.provider === 'local' && !req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required to access this route'
    });
  }
  next();
};

// Optional: Social login verification middleware
exports.requireSocialAuth = (provider) => {
  return (req, res, next) => {
    if (req.user.provider !== provider) {
      return res.status(403).json({
        success: false,
        message: `This route requires ${provider} authentication`
      });
    }
    next();
  };
};