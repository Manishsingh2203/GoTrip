const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const config = require('../config/env');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');
const { seedIndianPlacesIfNeeded } = require('../services/aiPlacesService');


// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Hash OTP
const hashOTP = async (otp) => {
  return bcrypt.hash(otp, 10);
};

// Verify OTP
const verifyOTP = async (enteredOTP, hashedOTP) => {
  return bcrypt.compare(enteredOTP, hashedOTP);
};

// Generate tokens and set cookies
const generateAndSetTokens = (user, res) => {
  const accessToken = jwt.sign(
    { id: user._id },
    config.jwt.accessSecret,
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    config.jwt.refreshSecret,
    { expiresIn: '30d' }
  );

  // Set HttpOnly cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  return { accessToken, refreshToken };
};

// Send OTP Email
const sendOTPEmail = async (email, name, otp, purpose = 'verification') => {
  const subject = purpose === 'login' 
    ? 'Your GoTrip AI Login Verification Code'
    : 'Your GoTrip AI Verification Code';

  const action = purpose === 'login' ? 'login verification' : 'verification';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p style="font-size: 16px; color: #555;">
        Your ${action} OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong>
      </p>
      <p style="font-size: 14px; color: #777;">
        It is valid for 5 minutes.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">
        If you didn't request this code, please ignore this email.
      </p>
    </div>
  `;

  await sendEmail({ to: email, subject, html });
};

exports.register = async (req, res, next) => {
  try {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase();

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists with this email', 400));
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Create user (password will be auto-hashed by mongoose)
    const user = await User.create({
      name,
      email,
      password,     // ⭐ RAW password only
      role: role || 'user',
      otp: hashedOTP,
      otpExpires,
      provider: 'local',
      isVerified: false
    });

    await sendOTPEmail(email, name, otp, 'verification');

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    next(error);
  }
};


exports.verifyOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
email = email.toLowerCase();


    if (!email || !otp) {
      return next(new ErrorResponse('Please provide email and OTP', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpires) {
      return next(new ErrorResponse('No OTP found. Please request a new OTP.', 400));
    }

    if (user.otpExpires < new Date()) {
      return next(new ErrorResponse('OTP has expired', 400));
    }

    // Verify OTP
    const isOtpValid = await verifyOTP(otp, user.otp);
    if (!isOtpValid) {
      return next(new ErrorResponse('Invalid OTP', 400));
    }

    // Update user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate tokens and set cookies
    generateAndSetTokens(user, res);


// 🔥 Trigger AI seeding in background
seedIndianPlacesIfNeeded().catch(err =>
  console.log("AI place seeding failed (signup):", err.message)
);

res.json({
  success: true,
  message: 'Email verified successfully',
  data: {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    isVerified: true
  }
});


  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
email = email.toLowerCase();


    if (!email) {
      return next(new ErrorResponse('Please provide email', 400));
    }

   const user = await User.findOne({ email }).select("+password");


    if (!user) {
      return next(new ErrorResponse('No account found with this email', 404));
    }

    // User must be verified
    if (!user.isVerified) {
      return next(new ErrorResponse('Please verify your email first', 401));
    }

    // 🔥 1) If PASSWORD LOGIN
   if (password) {
  const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return next(new ErrorResponse('Invalid password', 401));
      }

      // DIRECT LOGIN → No OTP
      generateAndSetTokens(user, res);

      return res.json({
        success: true,
        message: 'Password login successful',
        data: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    }

    // 🔥 2) If OTP LOGIN
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOTP;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, user.name, otp, 'login');

    res.json({
      success: true,
      message: 'OTP sent',
      data: { email: user.email }
    });

  } catch (error) {
    next(error);
  }
};

exports.verifyLoginOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
email = email.toLowerCase();


    if (!email || !otp) {
      return next(new ErrorResponse('Please provide email and OTP', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user is verified
    if (!user.isVerified) {
      return next(new ErrorResponse('Please verify your email first', 401));
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpires) {
      return next(new ErrorResponse('No OTP found. Please request a new OTP.', 400));
    }

    if (user.otpExpires < new Date()) {
      return next(new ErrorResponse('OTP has expired', 400));
    }

    // Verify OTP
    const isOtpValid = await verifyOTP(otp, user.otp);
    if (!isOtpValid) {
      return next(new ErrorResponse('Invalid OTP', 400));
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    generateAndSetTokens(user, res);

// 🔥 Trigger AI place generation in background
seedIndianPlacesIfNeeded().catch(err =>
  console.log("AI place seeding failed (login):", err.message)
);

res.json({
  success: true,
  message: 'Login successful',
  data: {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    isVerified: true
  }
});


  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new ErrorResponse('Google token is required', 400));
    }

    const client = new OAuth2Client(config.oauth.google.clientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.oauth.google.clientId
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create account for new social login user
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12),
        provider: 'google',
        isVerified: true, // Social logins are auto-verified
        role: 'user'
      });
    } else if (user.provider !== 'google') {
      return next(new ErrorResponse('Please login using your original method', 400));
    }

    // Generate tokens and set cookies
    generateAndSetTokens(user, res);

    seedIndianPlacesIfNeeded().catch(err =>
  console.log("AI place seeding failed (google):", err.message)
);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: true,
        provider: user.provider
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.facebookLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return next(new ErrorResponse('Facebook access token is required', 400));
    }

    // Verify Facebook token and get user data
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );

    const { email, name } = response.data;

    if (!email) {
      return next(new ErrorResponse('Facebook login failed - email not provided', 400));
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create account for new social login user
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12),
        provider: 'facebook',
        isVerified: true, // Social logins are auto-verified
        role: 'user'
      });
    } else if (user.provider !== 'facebook') {
      return next(new ErrorResponse('Please login using your original method', 400));
    }

    // Generate tokens and set cookies
    generateAndSetTokens(user, res);

    seedIndianPlacesIfNeeded().catch(err =>
  console.log("AI place seeding failed (facebook):", err.message)
);


    res.json({
      success: true,
      message: 'Facebook login successful',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: true,
        provider: user.provider
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    let { email, purpose = 'verification' } = req.body;
email = email.toLowerCase();


    if (!email) {
      return next(new ErrorResponse('Email is required', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // For login OTP resend, check if user is verified
    if (purpose === 'login' && !user.isVerified) {
      return next(new ErrorResponse('Please verify your email first', 401));
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to user
    user.otp = hashedOTP;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, user.name, otp, purpose);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return next(new ErrorResponse('Failed to send OTP. Please try again.', 500));
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};



exports.clerkSocialLogin = async (req, res, next) => {
  try {
    const { clerkUserId, email, name, provider } = req.body;

    if (!clerkUserId || !email || !provider) {
      return next(new ErrorResponse("Missing Clerk social login data", 400));
    }

    // Find existing user
    let user = await User.findOne({ email });

    if (!user) {
      // Create if new social login user
      user = await User.create({
        name: name || "GoTrip User",
        email,
        provider,
        isVerified: true,
        password: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 12),

        // Clerk mapping
        googleId: provider === "google" ? clerkUserId : null,
        facebookId: provider === "facebook" ? clerkUserId : null
      });
    } else {
      // Existing user check rule
      if (user.provider !== provider) {
        return next(
          new ErrorResponse(
            `This email is registered via ${user.provider}. Please continue using ${user.provider} login.`,
            400
          )
        );
      }

      // Update Clerk IDs if missing
      if (provider === "google") user.googleId = clerkUserId;
      if (provider === "facebook") user.facebookId = clerkUserId;

      user.isVerified = true;
      await user.save();
    }

    // Generate JWT tokens
    generateAndSetTokens(user, res);

    // AI trigger
    seedIndianPlacesIfNeeded().catch(err =>
      console.log("AI seeding failed (clerk social):", err)
    );

    res.json({
      success: true,
      message: "Clerk social login successful",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        isVerified: true
      }
    });

  } catch (error) {
    next(error);
  }
};
