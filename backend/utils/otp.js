// backend/utils/otp.js
exports.generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

exports.getOTPExpiry = (minutes = 10) =>
  new Date(Date.now() + minutes * 60 * 1000);
